import { StateGraph, START, END, MemorySaver } from '@langchain/langgraph';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';

import {
  AssessmentGraphState,
  type AssessmentGraphStateType,
  type SymptomDomain,
  type DomainAssessment,
  type DomainScoring,
  type ScreeningResult,
  type AssessmentDimension,
} from './assessmentTypes';
import { promptTemplates } from './promptTemplates';

/* ==========================================================================
   LLM Instance
   ========================================================================== */

function getModel() {
  return new ChatOpenAI({
    modelName: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}

/* ==========================================================================
   Helpers
   ========================================================================== */

const MAX_QUESTIONS = 20;
const MAX_DURATION_MINUTES = 20;
const QUESTIONS_PER_DOMAIN = 4;
const MIN_DIMENSIONS_TO_TRANSITION = 3;

function defaultScoring(): DomainScoring {
  return {
    functionalImpact: 0,
    control: 0,
    duration: '',
    frequency: 0,
    confidence: 0,
  };
}

function elapsedMinutes(startTime: string): number {
  return (Date.now() - new Date(startTime).getTime()) / 60_000;
}

/**
 * Safely parse JSON from an LLM response, stripping markdown fences if present.
 */
function parseJsonResponse(text: string): any {
  let cleaned = text.trim();
  // Strip markdown code fences
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  return JSON.parse(cleaned);
}

/**
 * Get the list of assessment dimensions already touched for a domain,
 * reading from the dimensionsCovered state field.
 */
function getDimensionsCovered(
  dimensionsCoveredState: Record<string, string[]>,
  domain: SymptomDomain,
): AssessmentDimension[] {
  const dims = dimensionsCoveredState[domain];
  if (!dims) return [];
  return dims as AssessmentDimension[];
}

/* ==========================================================================
   Graph Node: initialize
   ========================================================================== */

async function initialize(
  state: AssessmentGraphStateType,
): Promise<Partial<AssessmentGraphStateType>> {
  const model = getModel();

  // Build domain assessments from screening results
  const domainAssessments: Record<string, DomainAssessment> = {};
  const scoresByDomain: Record<string, { sum: number; count: number }> = {};

  for (const result of state.screeningResults) {
    if (!scoresByDomain[result.domain]) {
      scoresByDomain[result.domain] = { sum: 0, count: 0 };
    }
    scoresByDomain[result.domain].sum += result.score;
    scoresByDomain[result.domain].count += 1;
  }

  for (const domain of state.flaggedDomains) {
    const data = scoresByDomain[domain];
    const avgScore = data ? data.sum / data.count : 0;

    domainAssessments[domain] = {
      domain,
      screeningScore: avgScore,
      scoring: defaultScoring(),
      evidenceNotes: [],
      status: 'pending',
      questionsAsked: 0,
    };
  }

  // Mark the first flagged domain as in-progress
  const currentDomain = state.flaggedDomains[0] ?? null;
  if (currentDomain && domainAssessments[currentDomain]) {
    domainAssessments[currentDomain] = {
      ...domainAssessments[currentDomain],
      status: 'in_progress',
    };
  }

  // Generate opening message
  const systemMsg = new SystemMessage(promptTemplates.systemPrompt);
  const initPrompt = new HumanMessage(
    promptTemplates.initAssessment(state.flaggedDomains),
  );

  const response = await model.invoke([systemMsg, initPrompt]);
  const responseText =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

  let content: string;
  let quickReplies: string[] = [];

  try {
    const parsed = parseJsonResponse(responseText);
    content = parsed.content || responseText;
    quickReplies = parsed.quickReplies || [];
  } catch {
    content = responseText;
  }

  return {
    messages: [new AIMessage(content)],
    domainAssessments,
    currentDomain,
    questionCount: 0,
    startTime: new Date().toISOString(),
    quickReplies,
    isComplete: false,
  };
}

/* ==========================================================================
   Graph Node: processResponse
   ========================================================================== */

async function processResponse(
  state: AssessmentGraphStateType,
): Promise<Partial<AssessmentGraphStateType>> {
  const model = getModel();
  const currentDomain = state.currentDomain;

  if (!currentDomain) {
    return {};
  }

  // Build conversation context for evidence extraction
  const systemMsg = new SystemMessage(promptTemplates.systemPrompt);
  const extractPrompt = new HumanMessage(
    promptTemplates.extractEvidence(currentDomain),
  );

  // Include recent conversation for context (last 6 messages max)
  const recentMessages = state.messages.slice(-6);

  const response = await model.invoke([systemMsg, ...recentMessages, extractPrompt]);
  const responseText =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

  const updates: Partial<AssessmentGraphStateType> = {};

  try {
    const evidence = parseJsonResponse(responseText);
    const currentAssessment = state.domainAssessments[currentDomain];

    if (currentAssessment) {
      const updatedScoring: DomainScoring = { ...currentAssessment.scoring };

      if (evidence.scoringUpdates) {
        if (evidence.scoringUpdates.functionalImpact != null) {
          updatedScoring.functionalImpact = evidence.scoringUpdates.functionalImpact;
        }
        if (evidence.scoringUpdates.control != null) {
          updatedScoring.control = evidence.scoringUpdates.control;
        }
        if (evidence.scoringUpdates.duration != null) {
          updatedScoring.duration = evidence.scoringUpdates.duration;
        }
        if (evidence.scoringUpdates.frequency != null) {
          updatedScoring.frequency = evidence.scoringUpdates.frequency;
        }
        if (evidence.scoringUpdates.confidence != null) {
          updatedScoring.confidence = evidence.scoringUpdates.confidence;
        }
      }

      const newNotes = evidence.evidenceNotes || [];
      updates.domainAssessments = {
        [currentDomain]: {
          ...currentAssessment,
          scoring: updatedScoring,
          evidenceNotes: [...currentAssessment.evidenceNotes, ...newNotes],
        },
      };
    }

    // Store dimensions touched into state for tracking
    const dimensionsTouched: string[] = evidence.dimensionsTouched || [];
    if (dimensionsTouched.length > 0) {
      updates.dimensionsCovered = {
        [currentDomain]: dimensionsTouched,
      };
    }

    // Extract chief complaint from early messages
    if (!state.chiefComplaint && evidence.chiefComplaint) {
      updates.chiefComplaint = evidence.chiefComplaint;
    }

    if (evidence.suggestedQuickReplies) {
      updates.quickReplies = evidence.suggestedQuickReplies;
    }
  } catch {
    // If parsing fails, continue without updating evidence
  }

  return updates;
}

/* ==========================================================================
   Graph Node: generateQuestion
   ========================================================================== */

async function generateQuestion(
  state: AssessmentGraphStateType,
): Promise<Partial<AssessmentGraphStateType>> {
  const model = getModel();
  const currentDomain = state.currentDomain;

  if (!currentDomain) {
    return {};
  }

  const currentAssessment = state.domainAssessments[currentDomain];
  if (!currentAssessment) {
    return {};
  }

  const dimensionsCovered = getDimensionsCovered(
    state.dimensionsCovered,
    currentDomain,
  );

  const systemMsg = new SystemMessage(promptTemplates.systemPrompt);
  const assessPrompt = new HumanMessage(
    promptTemplates.assessDomain(currentDomain, currentAssessment, dimensionsCovered),
  );

  // Include recent conversation for context
  const recentMessages = state.messages.slice(-6);

  const response = await model.invoke([
    systemMsg,
    ...recentMessages,
    assessPrompt,
  ]);
  const responseText =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

  let content: string;
  let quickReplies: string[] = [];

  try {
    const parsed = parseJsonResponse(responseText);
    content = parsed.content || responseText;
    quickReplies = parsed.quickReplies || [];
  } catch {
    content = responseText;
  }

  // Update the domain assessment question count
  const updatedAssessment: DomainAssessment = {
    ...currentAssessment,
    questionsAsked: currentAssessment.questionsAsked + 1,
  };

  return {
    messages: [new AIMessage(content)],
    questionCount: state.questionCount + 1,
    quickReplies,
    domainAssessments: {
      [currentDomain]: updatedAssessment,
    },
  };
}

/* ==========================================================================
   Graph Node: transitionDomain
   ========================================================================== */

async function transitionDomainNode(
  state: AssessmentGraphStateType,
): Promise<Partial<AssessmentGraphStateType>> {
  const model = getModel();
  const fromDomain = state.currentDomain;

  if (!fromDomain) {
    return {};
  }

  // Find the next pending domain
  const nextDomain = state.flaggedDomains.find((d) => {
    const assessment = state.domainAssessments[d];
    return assessment && assessment.status === 'pending';
  });

  if (!nextDomain) {
    return {};
  }

  // Mark current domain as completed and next as in-progress
  const updatedAssessments: Record<string, DomainAssessment> = {};

  const fromAssessment = state.domainAssessments[fromDomain];
  if (fromAssessment) {
    updatedAssessments[fromDomain] = {
      ...fromAssessment,
      status: 'completed',
    };
  }

  const nextAssessment = state.domainAssessments[nextDomain];
  if (nextAssessment) {
    updatedAssessments[nextDomain] = {
      ...nextAssessment,
      status: 'in_progress',
    };
  }

  // Generate transition message
  const systemMsg = new SystemMessage(promptTemplates.systemPrompt);
  const transPrompt = new HumanMessage(
    promptTemplates.transitionDomain(fromDomain, nextDomain),
  );

  const recentMessages = state.messages.slice(-4);

  const response = await model.invoke([
    systemMsg,
    ...recentMessages,
    transPrompt,
  ]);
  const responseText =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

  let content: string;
  let quickReplies: string[] = [];

  try {
    const parsed = parseJsonResponse(responseText);
    content = parsed.content || responseText;
    quickReplies = parsed.quickReplies || [];
  } catch {
    content = responseText;
  }

  return {
    messages: [new AIMessage(content)],
    currentDomain: nextDomain,
    quickReplies,
    domainAssessments: updatedAssessments,
  };
}

/* ==========================================================================
   Graph Node: generateReport
   ========================================================================== */

async function generateReportNode(
  state: AssessmentGraphStateType,
): Promise<Partial<AssessmentGraphStateType>> {
  const model = getModel();

  // Mark any in-progress domain as completed
  const updatedAssessments: Record<string, DomainAssessment> = {};
  for (const [domain, assessment] of Object.entries(state.domainAssessments)) {
    if (assessment.status === 'in_progress') {
      updatedAssessments[domain] = { ...assessment, status: 'completed' };
    }
  }

  const systemMsg = new SystemMessage(promptTemplates.systemPrompt);
  const reportPrompt = new HumanMessage(
    promptTemplates.generateReport(
      state.chiefComplaint,
      { ...state.domainAssessments, ...updatedAssessments },
    ),
  );

  const response = await model.invoke([systemMsg, reportPrompt]);
  const responseText =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

  let report: any = null;
  try {
    report = parseJsonResponse(responseText);
  } catch {
    report = { raw: responseText };
  }

  const closingMessage =
    'Thank you so much for sharing all of that with me. I really appreciate your openness and honesty. ' +
    "I've put together a summary of what we discussed, which you can review at your own pace. " +
    'Remember, this is a reflection of your experiences — not a diagnosis. ' +
    'If anything feels off or you want to talk more, please don\'t hesitate to reach out to a professional.';

  return {
    messages: [new AIMessage(closingMessage)],
    isComplete: true,
    report,
    domainAssessments: updatedAssessments,
    quickReplies: [],
  };
}

/* ==========================================================================
   Routing Functions
   ========================================================================== */

function routeEntry(state: AssessmentGraphStateType): string {
  // If there are no human messages yet, this is the initial invocation
  const hasHumanMessage = state.messages.some(
    (m) => m._getType() === 'human',
  );
  return hasHumanMessage ? 'processResponse' : 'initialize';
}

function routeAfterProcessing(state: AssessmentGraphStateType): string {
  // Check time limit
  if (elapsedMinutes(state.startTime) >= MAX_DURATION_MINUTES) {
    return 'generateReport';
  }

  // Check global question limit
  if (state.questionCount >= MAX_QUESTIONS) {
    return 'generateReport';
  }

  const currentDomain = state.currentDomain;
  if (!currentDomain) {
    return 'generateReport';
  }

  const currentAssessment = state.domainAssessments[currentDomain];
  if (!currentAssessment) {
    return 'generateReport';
  }

  // Count pending domains
  const pendingDomains = state.flaggedDomains.filter((d) => {
    const a = state.domainAssessments[d];
    return a && a.status === 'pending';
  });

  const questionsAsked = currentAssessment.questionsAsked;
  const dimensionsCovered = getDimensionsCovered(
    state.dimensionsCovered,
    currentDomain,
  );

  // Transition if the domain has enough questions or dimensions covered
  // AND there are still pending domains
  const shouldTransition =
    (questionsAsked >= QUESTIONS_PER_DOMAIN ||
      dimensionsCovered.length >= MIN_DIMENSIONS_TO_TRANSITION) &&
    pendingDomains.length > 0;

  if (shouldTransition) {
    return 'transitionDomain';
  }

  // If domain is exhausted and no pending domains, generate report
  if (questionsAsked >= QUESTIONS_PER_DOMAIN && pendingDomains.length === 0) {
    return 'generateReport';
  }

  // Otherwise continue probing current domain
  return 'generateQuestion';
}

/* ==========================================================================
   Graph Construction
   ========================================================================== */

export function createAssessmentGraph() {
  const checkpointer = new MemorySaver();

  // Build graph using method chaining so TypeScript can track node names
  const compiled = new StateGraph(AssessmentGraphState)
    .addNode('initialize', initialize)
    .addNode('processResponse', processResponse)
    .addNode('generateQuestion', generateQuestion)
    .addNode('transitionDomain', transitionDomainNode)
    .addNode('generateReport', generateReportNode)
    // Entry: conditional routing based on whether this is first invocation
    .addConditionalEdges(START, routeEntry)
    // After initialize -> END (return opening message to user)
    .addEdge('initialize', END)
    // After processResponse -> conditional routing
    .addConditionalEdges('processResponse', routeAfterProcessing)
    // After generateQuestion -> END (return question to user, wait for response)
    .addEdge('generateQuestion', END)
    // After transitionDomain -> END (return transition message, wait for response)
    .addEdge('transitionDomain', END)
    // After generateReport -> END
    .addEdge('generateReport', END)
    // Compile with checkpointer for thread-based persistence
    .compile({ checkpointer });

  return compiled;
}

/* ==========================================================================
   Module-level Singleton
   ========================================================================== */

/** Cached graph instance so the MemorySaver checkpointer (and its thread
 *  state) persists across calls within the same server process. */
let _graph: ReturnType<typeof createAssessmentGraph> | null = null;

function getAssessmentGraph() {
  if (!_graph) {
    _graph = createAssessmentGraph();
  }
  return _graph;
}

/**
 * Reset the singleton graph instance.
 * Primarily useful in tests to start with a clean MemorySaver.
 */
export function resetAssessmentGraph() {
  _graph = null;
}

/* ==========================================================================
   Convenience Runner
   ========================================================================== */

/**
 * Run a single turn of the assessment conversation.
 *
 * - If no `userMessage` is provided, initializes a fresh assessment session.
 * - If `userMessage` is provided, processes the user's response and continues.
 *
 * The compiled graph (and its MemorySaver checkpointer) is kept as a
 * module-level singleton so that thread state persists across calls.
 *
 * @param threadId          Unique thread identifier for session persistence
 * @param userMessage       The user's message (omit for initialization)
 * @param screeningResults  Screening answers (only needed for initialization)
 * @param flaggedDomains    Flagged domains (only needed for initialization)
 */
export async function runAssessmentTurn(
  threadId: string,
  userMessage?: string,
  screeningResults?: ScreeningResult[],
  flaggedDomains?: SymptomDomain[],
): Promise<AssessmentGraphStateType> {
  const graph = getAssessmentGraph();
  const config = { configurable: { thread_id: threadId } };

  if (!userMessage) {
    // Fresh initialization
    const result = await graph.invoke(
      {
        messages: [],
        screeningResults: screeningResults || [],
        flaggedDomains: flaggedDomains || [],
      },
      config,
    );
    return result as AssessmentGraphStateType;
  }

  // Continuing conversation: update state with the user's message and re-enter
  await graph.updateState(
    config,
    { messages: [new HumanMessage(userMessage)] },
    START,
  );

  const result = await graph.invoke(null, config);
  return result as AssessmentGraphStateType;
}
