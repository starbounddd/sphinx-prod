import { NextRequest, NextResponse } from 'next/server';

import { runAssessmentTurn } from '@/lib/ai/assessmentGraph';
import {
  type ScreeningResult,
  type SymptomDomain,
} from '@/lib/ai/assessmentTypes';
import {
  calculateDomainScores,
  identifyFlaggedDomains,
  QUESTION_DOMAIN_MAP,
} from '@/lib/ai/domains';

/* ==========================================================================
   Question Text Lookup
   (mirrors resources/survey_schemas/wellbeing_surveyv1.json)
   ========================================================================== */

const QUESTION_TEXTS: Record<string, string> = {
  depression_low_mood:
    'A persistently low or down mood (for example, not taking pleasure in things you normally do)?',
  anger_irritability: 'Increased anger and irritability in general?',
  mania_low_sleep_energy:
    'Feeling energized despite having not slept much?',
  mania_risk_projects:
    'Beginning new projects and an increased propensity to take risks?',
  anxiety_nervous:
    'Feeling consistently nervous, anxious, panicked, or frightened?',
  anxiety_avoidance:
    'Deliberately avoiding situations that trigger anxiety or nervousness?',
  somatic_pain:
    'Experiencing aches or bodily pain that seem not to have a specific cause?',
  suicidal_thoughts:
    'Feeling suicidal or okay with not existing, or thoughts of self-harm?',
  psychosis_hearing_voices:
    'Hearing things that others are not able to hear (e.g., voices when you are alone)?',
  psychosis_thought_broadcast:
    'Thinking that someone else can hear your thoughts or you can hear theirs?',
  sleep_difficulty:
    'Difficulty with sleep that has affected your quality of sleep (for example, consistent inability to fall asleep)?',
  memory_difficulty:
    'Difficulty remembering information such as important locations or internalizing new information?',
  repetitive_compulsive:
    'Feeling a compulsive need to perform the same tasks or mental tasks repeatedly (includes thinking the same thoughts)?',
  dissociation_detached:
    'Feeling detached from yourself and your own experiences, or not feeling like anything is real?',
  personality_identity:
    'Difficulty in understanding yourself and who you truly are?',
  personality_relationships:
    'Inability to form relationships with other people or ever feel close to them or comfortable with them?',
  substance_use_behavior:
    'Engaging in any of the following activities: drinking more than four times a day, smoking, or utilizing any non-prescribed drugs?',
};

/* ==========================================================================
   Helpers
   ========================================================================== */

/**
 * Convert raw `{ questionId: score }` answers into the `ScreeningResult[]`
 * format expected by the assessment graph.
 */
function toScreeningResults(
  answers: Record<string, number>,
): ScreeningResult[] {
  return Object.entries(answers)
    .filter(([questionId]) => QUESTION_DOMAIN_MAP[questionId] !== undefined)
    .map(([questionId, score]) => ({
      questionId,
      domain: QUESTION_DOMAIN_MAP[questionId],
      score,
      questionText: QUESTION_TEXTS[questionId] ?? questionId,
    }));
}

/* ==========================================================================
   POST /api/assessment/chat
   ========================================================================== */

export async function POST(request: NextRequest) {
  try {
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
    // Parse & validate request body
    // ------------------------------------------------------------------
    const body = await request.json();
    const { threadId, message, screeningAnswers } = body as {
      threadId?: string;
      message?: string;
      screeningAnswers?: Record<string, number>;
    };

    if (!threadId) {
      return NextResponse.json(
        { error: 'Missing required field: threadId' },
        { status: 400 },
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

      // Extract the last AI message
      const lastAiMessage = [...result.messages]
        .reverse()
        .find((m) => m._getType() === 'ai');

      const content =
        typeof lastAiMessage?.content === 'string'
          ? lastAiMessage.content
          : '';

      // Build domain status map
      const domainStatuses: Record<string, string> = {};
      for (const [domain, assessment] of Object.entries(
        result.domainAssessments,
      )) {
        domainStatuses[domain] = assessment.status;
      }

      return NextResponse.json(
        {
          success: true,
          message: {
            content,
            quickReplies: result.quickReplies,
            isComplete: result.isComplete,
            report: result.report,
            currentDomain: result.currentDomain,
            questionCount: result.questionCount,
            domainStatuses,
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

      // Extract the last AI message
      const lastAiMessage = [...result.messages]
        .reverse()
        .find((m) => m._getType() === 'ai');

      const content =
        typeof lastAiMessage?.content === 'string'
          ? lastAiMessage.content
          : '';

      // Build domain status map
      const domainStatuses: Record<string, string> = {};
      for (const [domain, assessment] of Object.entries(
        result.domainAssessments,
      )) {
        domainStatuses[domain] = assessment.status;
      }

      return NextResponse.json(
        {
          success: true,
          message: {
            content,
            quickReplies: result.quickReplies,
            isComplete: result.isComplete,
            report: result.report,
            currentDomain: result.currentDomain,
            questionCount: result.questionCount,
            domainStatuses,
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
