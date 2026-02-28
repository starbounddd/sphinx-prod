import type { ScreeningResult } from './assessmentTypes';
import { QUESTION_DOMAIN_MAP } from './domains';

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
   toScreeningResults
   ========================================================================== */

/**
 * Convert raw `{ questionId: score }` answers into the `ScreeningResult[]`
 * format expected by the assessment graph.
 */
export function toScreeningResults(
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
