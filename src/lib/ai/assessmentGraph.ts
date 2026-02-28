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
  DOMAIN_LABELS,
} from './assessmentTypes';
import { validateAIReport } from './reportSchema';
import { promptTemplates } from './promptTemplates';
import { calculateDomainScores } from './domains';
import {
  routeEntry,
  routeAfterProcessing,
} from './routingLogic';

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

function defaultScoring(): DomainScoring {
  return {
    functionalImpact: 0,
    control: 0,
    duration: '',
    frequency: 0,
    confidence: 0,
  };
}

/**
 * Derive a rough functionalImpact (0-3) from a screening score (0-4).
 * This is a coarse mapping used for domains that were not assessed via chat.
 */
function impactFromScreeningScore(screeningScore: number): number {
  if (screeningScore >= 3.5) return 3;
  if (screeningScore >= 2.5) return 2;
  if (screeningScore >= 2) return 1;
  return 0;
}

/**
 * Build domain scores from screening results stored in graph state.
 * Returns a Record of all domains that scored >= threshold.
 */
function getAllFlaggedDomainsFromScreening(
  screeningResults: ScreeningResult[],
  threshold: number = 2,
): Record<SymptomDomain, number> {
  const answers: Record<string, number> = {};
  for (const r of screeningResults) {
    answers[r.questionId] = r.score;
  }
  const allScores = calculateDomainScores(answers);
  const result = {} as Record<SymptomDomain, number>;
  for (const [domain, score] of Object.entries(allScores)) {
    if (score >= threshold) {
      result[domain as SymptomDomain] = score;
    }
  }
  return result;
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

  // Mark any in-progress domain as completed (only if it has evidence)
  const updatedAssessments: Record<string, DomainAssessment> = {};
  for (const [domain, assessment] of Object.entries(state.domainAssessments)) {
    if (assessment.status === 'in_progress') {
      updatedAssessments[domain] = { ...assessment, status: 'completed' };
    }
  }

  const mergedAssessments = { ...state.domainAssessments, ...updatedAssessments };

  const systemMsg = new SystemMessage(promptTemplates.systemPrompt);
  const reportPrompt = new HumanMessage(
    promptTemplates.generateReport(state.chiefComplaint, mergedAssessments),
  );

  const response = await model.invoke([systemMsg, reportPrompt]);
  const responseText =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

  let report: AssessmentGraphStateType['report'] = null;
  try {
    const parsed = parseJsonResponse(responseText);
    const validation = validateAIReport(parsed);
    if (validation.valid) {
      report = validation.report;
    } else {
      console.warn('[generateReport] AI report failed validation:', validation.error);
      report = parsed; // fall back to raw parsed JSON
    }
  } catch {
    report = null;
  }

  // ---- Append ALL flagged domains (not just top 5) with screening-only data ----
  if (report) {
    const allFlaggedScores = getAllFlaggedDomainsFromScreening(state.screeningResults);
    const assessedDomainKeys = new Set(report.domains.map((d) => d.domain));

    // Also strip clinical notes from assessed domains that had NO actual evidence
    for (const d of report.domains) {
      const assessment = mergedAssessments[d.domain];
      if (!assessment || assessment.evidenceNotes.length === 0) {
        // AI should not have generated notes for this domain — clear them
        d.summary = '';
      }
    }

    // Append screening-only entries for all other flagged domains
    for (const [domain, screeningScore] of Object.entries(allFlaggedScores)) {
      if (!assessedDomainKeys.has(domain)) {
        const label = DOMAIN_LABELS[domain as SymptomDomain] ?? domain;
        report.domains.push({
          domain,
          label,
          screeningScore,
          functionalImpact: impactFromScreeningScore(screeningScore),
          control: 0,
          duration: '',
          frequency: 0,
          confidence: 0,
          summary: '', // No clinical notes — not assessed via chat
        });
      }
    }
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
   Force-End: Generate a partial report from whatever data exists
   ========================================================================== */

/**
 * Force the assessment to generate a report based on whatever conversation
 * data has been gathered so far.  Used when the user ends the session early
 * or the timer expires.
 *
 * Reads the current thread state from the checkpointer, runs the report-
 * generation LLM call, and returns the updated state including the report.
 */
export async function forceGenerateReport(
  threadId: string,
): Promise<AssessmentGraphStateType> {
  const graph = getAssessmentGraph();
  const config = { configurable: { thread_id: threadId } };

  const snapshot = await graph.getState(config);
  const currentState = snapshot.values as AssessmentGraphStateType;

  // Run the report generation node directly with the current state
  const reportUpdates = await generateReportNode(currentState);

  // Merge the updates into the current state so the caller gets a full picture
  return {
    ...currentState,
    ...reportUpdates,
    domainAssessments: {
      ...currentState.domainAssessments,
      ...(reportUpdates.domainAssessments ?? {}),
    },
    messages: [
      ...currentState.messages,
      ...(reportUpdates.messages ?? []),
    ],
  } as AssessmentGraphStateType;
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
