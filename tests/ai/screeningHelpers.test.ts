import { describe, it, expect } from 'vitest';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';
import { QUESTION_DOMAIN_MAP } from '@/lib/ai/domains';

/* ==========================================================================
   toScreeningResults — convert raw answers to ScreeningResult[]
   ========================================================================== */

describe('toScreeningResults', () => {
  it('returns empty array for empty answers', () => {
    const results = toScreeningResults({});
    expect(results).toHaveLength(0);
  });

  it('converts a single answer to a ScreeningResult', () => {
    const results = toScreeningResults({ depression_low_mood: 3 });
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(
      expect.objectContaining({
        questionId: 'depression_low_mood',
        domain: 'depression',
        score: 3,
      }),
    );
  });

  it('sets questionText for known questions', () => {
    const results = toScreeningResults({ depression_low_mood: 2 });
    expect(results[0].questionText).toBeTruthy();
    expect(results[0].questionText).not.toBe('depression_low_mood');
  });

  it('filters out unknown question IDs', () => {
    const results = toScreeningResults({
      depression_low_mood: 3,
      unknown_id: 4,
    });
    expect(results).toHaveLength(1);
    expect(results[0].questionId).toBe('depression_low_mood');
  });

  it('converts all 17 known questions', () => {
    const answers: Record<string, number> = {};
    for (const key of Object.keys(QUESTION_DOMAIN_MAP)) {
      answers[key] = 2;
    }
    const results = toScreeningResults(answers);
    expect(results).toHaveLength(17);
  });

  it('preserves exact scores from input', () => {
    const answers = {
      anxiety_nervous: 1,
      anxiety_avoidance: 4,
    };
    const results = toScreeningResults(answers);
    const nervous = results.find((r) => r.questionId === 'anxiety_nervous');
    const avoidance = results.find((r) => r.questionId === 'anxiety_avoidance');
    expect(nervous?.score).toBe(1);
    expect(avoidance?.score).toBe(4);
  });

  it('assigns correct domain for each result', () => {
    const answers = {
      suicidal_thoughts: 3,
      sleep_difficulty: 2,
    };
    const results = toScreeningResults(answers);
    const suicidal = results.find((r) => r.questionId === 'suicidal_thoughts');
    const sleep = results.find((r) => r.questionId === 'sleep_difficulty');
    expect(suicidal?.domain).toBe('suicidal_tendencies');
    expect(sleep?.domain).toBe('sleep_problems');
  });
});
