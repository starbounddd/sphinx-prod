/**
 * Orchestrator for persisting completed/early-terminated session data.
 */

import type { AIGeneratedReport } from '../schema/report-schema';
import type { DomainAssessment } from '../schema/types';
import { getSessionByThreadId, completeSession } from './sessions';
import { saveAssessmentReport } from './reports';
import { updateDomainAssessments } from './domains';

/**
 * Persist completed or early-terminated session data to database.
 * Saves report, updates domain assessments, and marks session complete.
 */
export async function persistSessionResults(
  threadId: string,
  result: {
    report: AIGeneratedReport | null;
    domainAssessments: Record<string, DomainAssessment>;
    chiefComplaint?: string;
    questionCount: number;
  },
  isEarlyTermination: boolean,
): Promise<void> {
  const session = await getSessionByThreadId(threadId);
  if (!session) {
    console.warn('[persistSessionResults] Session not found:', threadId);
    return;
  }

  if (result.report) {
    await saveAssessmentReport({
      sessionId: session.id,
      report: result.report,
    });
  }

  await updateDomainAssessments(session.id, result.domainAssessments);

  await completeSession({
    sessionId: session.id,
    chiefComplaint: result.chiefComplaint,
    totalQuestions: result.questionCount,
    isEarlyTermination,
  });
}
