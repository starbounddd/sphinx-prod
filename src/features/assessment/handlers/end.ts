import type { MessageContent } from '@langchain/core/messages';

import { forceGenerateReport } from '../ai/graph';
import type { AIGeneratedReport } from '../schema/report-schema';
import { persistSessionResults } from '../services/persistence';

interface ForceEndResult {
  success: true;
  message: {
    content: MessageContent | '';
    isComplete: true;
    report: AIGeneratedReport | null;
  };
}

export async function handleForceEnd(
  threadId: string,
): Promise<ForceEndResult> {
  const result = await forceGenerateReport(threadId);

  // Fire-and-forget: persist with early termination flag
  persistSessionResults(threadId, {
    report: result.report,
    domainAssessments: result.domainAssessments,
    chiefComplaint: result.chiefComplaint,
    questionCount: result.questionCount,
  }, true).catch((err: unknown) => {
    console.error('[assessment/chat/end] Failed to persist session:', err);
  });

  return {
    success: true,
    message: {
      content: result.messages.at(-1)?.content ?? '',
      isComplete: true,
      report: result.report,
    },
  };
}
