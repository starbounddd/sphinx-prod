import type { BaseMessage } from '@langchain/core/messages';

import { runAssessmentTurn } from '../ai/graph';
import type { ScreeningResult, SymptomDomain } from '../schema/types';
import type { AIGeneratedReport } from '../schema/report-schema';
import { toScreeningResults } from '../utils/screening-helpers';
import { createAssessmentSession } from '../services/sessions';
import { persistSessionResults } from '../services/persistence';
import { getUserScreening } from '../services/screening';

/* ==========================================================================
   Response types
   ========================================================================== */

interface ChatMessage {
  content: string;
  quickReplies?: string[];
  isComplete: boolean;
  report: AIGeneratedReport | null;
  currentDomain: SymptomDomain | null;
  questionCount: number;
  domainStatuses: Record<string, string>;
  screeningResults?: ScreeningResult[];
  flaggedDomains?: SymptomDomain[];
}

export type ChatInitResult =
  | { success: true; message: ChatMessage }
  | { success: false; error: string; status: number };

export type ChatContinueResult = {
  success: true;
  message: ChatMessage;
};

/* ==========================================================================
   Module-private helpers
   ========================================================================== */

function buildDomainStatuses(
  domainAssessments: Record<string, { status: string }>,
): Record<string, string> {
  const domainStatuses: Record<string, string> = {};

  for (const [domain, assessment] of Object.entries(domainAssessments)) {
    domainStatuses[domain] = assessment.status;
  }

  return domainStatuses;
}

function getLastAiContent(
  messages: BaseMessage[],
): string {
  const lastAiMessage = [...messages]
    .reverse()
    .find((message) => message._getType() === 'ai');

  return typeof lastAiMessage?.content === 'string'
    ? lastAiMessage.content
    : '';
}

/* ==========================================================================
   Init flow (no user message — new session)
   ========================================================================== */

export async function handleChatInit(
  userId: string,
  threadId: string,
): Promise<ChatInitResult> {
  const screening = await getUserScreening(userId);
  if (!screening) {
    return {
      success: false,
      error: 'No screening data found. Please complete screening first.',
      status: 400,
    };
  }

  const domainScores = screening.domainScores as Record<string, number>;
  const flaggedDomains = screening.flaggedDomains as SymptomDomain[];
  const screeningResults = toScreeningResults(
    screening.answers as Record<string, number>,
  );

  const result = await runAssessmentTurn(
    threadId,
    undefined,
    screeningResults,
    flaggedDomains,
    domainScores,
  );

  // Fire-and-forget: create session in database with screening snapshot
  createAssessmentSession({
    threadId,
    userId,
    flaggedDomains,
    screeningSnapshot: domainScores,
  }).catch((err) => {
    console.error('[assessment/chat] Failed to create session in DB:', err);
  });

  return {
    success: true,
    message: {
      content: getLastAiContent(result.messages),
      quickReplies: result.quickReplies,
      isComplete: result.isComplete,
      report: result.report,
      currentDomain: result.currentDomain,
      questionCount: result.questionCount,
      domainStatuses: buildDomainStatuses(result.domainAssessments),
      screeningResults,
      flaggedDomains,
    },
  };
}

/* ==========================================================================
   Continue flow (user message present)
   ========================================================================== */

export async function handleChatContinue(
  threadId: string,
  message: string,
): Promise<ChatContinueResult> {
  const result = await runAssessmentTurn(threadId, message);

  // Fire-and-forget: persist if assessment is complete
  if (result.isComplete && result.report) {
    persistSessionResults(threadId, {
      report: result.report,
      domainAssessments: result.domainAssessments,
      chiefComplaint: result.chiefComplaint,
      questionCount: result.questionCount,
    }, false).catch((err: unknown) => {
      console.error('[assessment/chat] Failed to persist session:', err);
    });
  }

  return {
    success: true,
    message: {
      content: getLastAiContent(result.messages),
      quickReplies: result.quickReplies,
      isComplete: result.isComplete,
      report: result.report,
      currentDomain: result.currentDomain,
      questionCount: result.questionCount,
      domainStatuses: buildDomainStatuses(result.domainAssessments),
    },
  };
}
