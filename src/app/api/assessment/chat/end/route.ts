import { NextRequest, NextResponse } from 'next/server';

import { forceGenerateReport } from '@/lib/ai/assessmentGraph';
import { validateThreadId } from '@/lib/ai/inputValidation';
import { persistSessionResults } from '@/lib/db/assessmentService';

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
    persistSessionResults(threadId, {
      report: result.report,
      domainAssessments: result.domainAssessments,
      chiefComplaint: result.chiefComplaint,
      questionCount: result.questionCount,
    }, true).catch((err: unknown) => {
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
