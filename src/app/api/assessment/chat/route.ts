import { NextRequest, NextResponse } from 'next/server';

import { runAssessmentTurn } from '@/lib/ai/assessmentGraph';
import { type SymptomDomain } from '@/lib/ai/assessmentTypes';
import { calculateDomainScores, identifyFlaggedDomains } from '@/lib/ai/domains';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';
import {
  validateThreadId,
  validateScreeningAnswers,
  validateMessage,
} from '@/lib/ai/inputValidation';

/* ==========================================================================
   Helpers
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
  messages: Array<{ _getType(): string; content: unknown }>,
): string {
  const lastAiMessage = [...messages]
    .reverse()
    .find((message) => message._getType() === 'ai');

  return typeof lastAiMessage?.content === 'string'
    ? lastAiMessage.content
    : '';
}

/* ==========================================================================
   POST /api/assessment/chat
   ========================================================================== */

export async function POST(request: NextRequest) {
  try {
    // ------------------------------------------------------------------
    // Parse & validate request body
    // ------------------------------------------------------------------
    const body = await request.json();
    const { threadId, message, screeningAnswers } = body as {
      threadId?: string;
      message?: string;
      screeningAnswers?: Record<string, number>;
    };

    if (!validateThreadId(threadId)) {
      return NextResponse.json(
        { error: 'Missing or invalid required field: threadId' },
        { status: 400 },
      );
    }

    if (message && screeningAnswers) {
      return NextResponse.json(
        {
          error:
            'Invalid request: provide either "screeningAnswers" (to initialize) or "message" (to continue), not both',
        },
        { status: 400 },
      );
    }

    if (screeningAnswers !== undefined) {
      const answersValidation = validateScreeningAnswers(screeningAnswers);
      if (!answersValidation.valid) {
        return NextResponse.json(
          { error: answersValidation.error },
          { status: 400 },
        );
      }
    }

    if (message !== undefined) {
      const msgValidation = validateMessage(message);
      if (!msgValidation.valid) {
        return NextResponse.json(
          { error: msgValidation.error },
          { status: 400 },
        );
      }
    }

    // ------------------------------------------------------------------
    // Validate environment
    // ------------------------------------------------------------------
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: missing AI provider key' },
        { status: 500 },
      );
    }

    // ------------------------------------------------------------------
    // Route: Initialization  (screeningAnswers present, no message)
    // ------------------------------------------------------------------
    if (screeningAnswers && !message) {
      const domainScores = calculateDomainScores(screeningAnswers);
      const flaggedDomains: SymptomDomain[] =
        identifyFlaggedDomains(domainScores);
      const screeningResults = toScreeningResults(screeningAnswers);

      const result = await runAssessmentTurn(
        threadId,
        undefined,
        screeningResults,
        flaggedDomains,
      );

      return NextResponse.json(
        {
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
        },
        { status: 200 },
      );
    }

    // ------------------------------------------------------------------
    // Route: Continuation  (message present)
    // ------------------------------------------------------------------
    if (message) {
      const result = await runAssessmentTurn(threadId, message);

      return NextResponse.json(
        {
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
        },
        { status: 200 },
      );
    }

    // ------------------------------------------------------------------
    // Neither screeningAnswers nor message provided
    // ------------------------------------------------------------------
    return NextResponse.json(
      {
        error:
          'Invalid request: provide either "screeningAnswers" (to initialize) or "message" (to continue)',
      },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error('[assessment/chat] Error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred while processing the assessment' },
      { status: 500 },
    );
  }
}
