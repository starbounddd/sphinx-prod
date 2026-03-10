// tests/ai/screeningHelpers.test.ts
import { describe, it, expect } from 'vitest';
import { toScreeningResults } from '@/features/assessment/utils/screening-helpers';

describe('toScreeningResults', () => {
  it('converts raw answers to ScreeningResult[]', () => {
    const answers = { depression_low_mood: 3, anxiety_nervous: 2 };
    const results = toScreeningResults(answers);
    expect(results).toHaveLength(2);

    const depression = results.find((r) => r.questionId === 'depression_low_mood');
    expect(depression).toBeDefined();
    expect(depression!.domain).toBe('depression');
    expect(depression!.score).toBe(3);
    expect(depression!.questionText).toBeTruthy();
  });

  it('filters out unknown question IDs', () => {
    const answers = { depression_low_mood: 2, unknown_q: 4 };
    const results = toScreeningResults(answers);
    expect(results).toHaveLength(1);
    expect(results[0].questionId).toBe('depression_low_mood');
  });

  it('handles all 17 known questions', () => {
    const answers: Record<string, number> = {};
    const allQuestions = [
      'depression_low_mood', 'anger_irritability', 'mania_low_sleep_energy',
      'mania_risk_projects', 'anxiety_nervous', 'anxiety_avoidance',
      'somatic_pain', 'suicidal_thoughts', 'psychosis_hearing_voices',
      'psychosis_thought_broadcast', 'sleep_difficulty', 'memory_difficulty',
      'repetitive_compulsive', 'dissociation_detached', 'personality_identity',
      'personality_relationships', 'substance_use_behavior',
    ];
    for (const q of allQuestions) {
      answers[q] = 2;
    }
    const results = toScreeningResults(answers);
    expect(results).toHaveLength(17);
  });

  it('returns empty array for empty input', () => {
    expect(toScreeningResults({})).toEqual([]);
  });

  it('each result has a non-empty questionText', () => {
    const results = toScreeningResults({ depression_low_mood: 1 });
    expect(results[0].questionText).toBeTruthy();
    expect(results[0].questionText.length).toBeGreaterThan(10);
  });
});
