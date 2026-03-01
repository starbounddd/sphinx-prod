import { NextRequest, NextResponse } from 'next/server';

import { forceGenerateReport } from '@/lib/ai/assessmentGraph';
import { validateThreadId } from '@/lib/ai/inputValidation';
import {
  getSessionByThreadId,
  saveAssessmentReport,
  updateDomainAssessments,
  completeSession,
} from '@/lib/db/assessmentService';

/* ==========================================================================
   Helpers
   ========================================================================== */

/**
 * Persist session data when user ends early.
 */
async function persistEarlyTermination(
  threadId: string,
  result: Awaited<ReturnType<typeof forceGenerateReport>>,
): Promise<void> {
  const session = await getSessionByThreadId(threadId);
  if (!session) {
    console.warn('[persistEarlyTermination] Session not found:', threadId);
    return;
  }

  // Save report if generated
  if (result.report) {
    await saveAssessmentReport({
      sessionId: session.id,
      report: result.report,
    });
  }

  // Update domain assessments
  await updateDomainAssessments(session.id, result.domainAssessments);

  // Mark session as completed (early termination)
  await completeSession({
    sessionId: session.id,
    chiefComplaint: result.chiefComplaint,
    totalQuestions: result.questionCount,
    isEarlyTermination: true,
  });
}

/* ==========================================================================
   POST /api/assessment/chat/end
   Force-end the assessment and generate a partial report from gathered data.
   ========================================================================== */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId } = body as { threadId?: string };

    if (!validateThreadId(threadId)) {
      return NextResponse.json(
        { error: 'Missing or invalid required field: threadId' },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: missing AI provider key' },
        { status: 500 },
      );
    }

    const result = await forceGenerateReport(threadId);

    // Persist to database (early termination)
    persistEarlyTermination(threadId, result).catch((err) => {
      console.error('[assessment/chat/end] Failed to persist session:', err);
    });

    return NextResponse.json(
      {
        success: true,
        message: {
          content: result.messages.at(-1)?.content ?? '',
          isComplete: true,
          report: result.report,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('[assessment/chat/end] Error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred while generating the report' },
      { status: 500 },
    );
  }
}
