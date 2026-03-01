import { NextRequest, NextResponse } from 'next/server';

import { runAssessmentTurn } from '@/features/assessment/ai/graph';
import type { SymptomDomain } from '@/features/assessment/schema/types';
import { toScreeningResults } from '@/features/assessment/utils/screening-helpers';
import {
  validateThreadId,
  validateMessage,
} from '@/features/assessment/validation/input';
import { createAssessmentSession } from '@/features/assessment/services/sessions';
import { persistSessionResults } from '@/features/assessment/services/persistence';
import { getUserScreening } from '@/features/assessment/services/screening';
import { createClient } from '@/lib/supabase/server';

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
    const { threadId, message } = body as {
      threadId?: string;
      message?: string;
    };

    if (!validateThreadId(threadId)) {
      return NextResponse.json(
        { error: 'Missing or invalid required field: threadId' },
        { status: 400 },
      );
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
    // Route: Initialization (no message = new session)
    // ------------------------------------------------------------------
    if (!message) {
      // Authenticate user
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 },
        );
      }

      // Get user's latest screening from database
      const screening = await getUserScreening(user.id);
      if (!screening) {
        return NextResponse.json(
          { error: 'No screening data found. Please complete screening first.' },
          { status: 400 },
        );
      }

      const domainScores = screening.domainScores as Record<string, number>;
      const flaggedDomains = screening.flaggedDomains as SymptomDomain[];
      const screeningResults = toScreeningResults(screening.answers as Record<string, number>);

      const result = await runAssessmentTurn(
        threadId,
        undefined,
        screeningResults,
        flaggedDomains,
        domainScores,
      );

      // Create session in database with screening snapshot
      createAssessmentSession({
        threadId,
        userId: user.id,
        flaggedDomains,
        screeningSnapshot: domainScores,
      }).catch((err) => {
        console.error('[assessment/chat] Failed to create session in DB:', err);
      });

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
            screeningResults,  // Return for frontend state
            flaggedDomains,    // Return for frontend state
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

      // If assessment is complete, persist to database
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

    // This point should be unreachable since we handle both !message and message cases above
    return NextResponse.json(
      { error: 'Invalid request: message is required for conversation' },
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
