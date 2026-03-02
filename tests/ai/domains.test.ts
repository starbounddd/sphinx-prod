// tests/ai/domains.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateDomainScores,
  identifyFlaggedDomains,
  computeOverallSeverity,
  QUESTION_DOMAIN_MAP,
  DOMAIN_FEATURES,
} from '@/features/assessment/schema/domains';

const ALL_DOMAINS = [
  'depression', 'anger', 'mania', 'anxiety', 'somatic_symptoms',
  'suicidal_tendencies', 'psychosis', 'sleep_problems', 'memory',
  'repetitive_thoughts', 'dissociation', 'personality', 'substance_use',
] as const;

const ALL_QUESTIONS = [
  'depression_low_mood', 'anger_irritability', 'mania_low_sleep_energy',
  'mania_risk_projects', 'anxiety_nervous', 'anxiety_avoidance',
  'somatic_pain', 'suicidal_thoughts', 'psychosis_hearing_voices',
  'psychosis_thought_broadcast', 'sleep_difficulty', 'memory_difficulty',
  'repetitive_compulsive', 'dissociation_detached', 'personality_identity',
  'personality_relationships', 'substance_use_behavior',
] as const;

describe('QUESTION_DOMAIN_MAP', () => {
  it('maps all 17 questions to valid domains', () => {
    expect(Object.keys(QUESTION_DOMAIN_MAP)).toHaveLength(17);
    for (const qId of ALL_QUESTIONS) {
      expect(QUESTION_DOMAIN_MAP[qId]).toBeDefined();
      expect(ALL_DOMAINS).toContain(QUESTION_DOMAIN_MAP[qId]);
    }
  });

  it('maps multi-question domains correctly', () => {
    expect(QUESTION_DOMAIN_MAP['mania_low_sleep_energy']).toBe('mania');
    expect(QUESTION_DOMAIN_MAP['mania_risk_projects']).toBe('mania');
    expect(QUESTION_DOMAIN_MAP['anxiety_nervous']).toBe('anxiety');
    expect(QUESTION_DOMAIN_MAP['anxiety_avoidance']).toBe('anxiety');
    expect(QUESTION_DOMAIN_MAP['psychosis_hearing_voices']).toBe('psychosis');
    expect(QUESTION_DOMAIN_MAP['psychosis_thought_broadcast']).toBe('psychosis');
    expect(QUESTION_DOMAIN_MAP['personality_identity']).toBe('personality');
    expect(QUESTION_DOMAIN_MAP['personality_relationships']).toBe('personality');
  });
});

describe('DOMAIN_FEATURES', () => {
  it('defines features for all 13 domains', () => {
    for (const domain of ALL_DOMAINS) {
      expect(DOMAIN_FEATURES[domain]).toBeDefined();
      expect(DOMAIN_FEATURES[domain].description).toBeTruthy();
      expect(DOMAIN_FEATURES[domain].highSalienceMarkers.length).toBeGreaterThan(0);
    }
  });

  it('each domain has all 6 probing dimensions', () => {
    const expectedDimensions = [
      'affective', 'cognitive', 'physiological', 'behavioral', 'functional', 'perceptual',
    ];
    for (const domain of ALL_DOMAINS) {
      const dims = Object.keys(DOMAIN_FEATURES[domain].probingDimensions);
      expect(dims).toEqual(expect.arrayContaining(expectedDimensions));
    }
  });
});

describe('calculateDomainScores', () => {
  it('averages scores for multi-question domains', () => {
    const answers = {
      mania_low_sleep_energy: 2,
      mania_risk_projects: 4,
    };
    const scores = calculateDomainScores(answers);
    expect(scores.mania).toBe(3);
  });

  it('passes through single-question domains directly', () => {
    const answers = { depression_low_mood: 3 };
    const scores = calculateDomainScores(answers);
    expect(scores.depression).toBe(3);
  });

  it('ignores unknown question IDs', () => {
    const answers = {
      depression_low_mood: 2,
      unknown_question: 4,
    };
    const scores = calculateDomainScores(answers);
    expect(scores.depression).toBe(2);
    expect(scores).not.toHaveProperty('unknown');
  });

  it('handles all 17 questions', () => {
    const answers: Record<string, number> = {};
    for (const q of ALL_QUESTIONS) {
      answers[q] = 2;
    }
    const scores = calculateDomainScores(answers);
    for (const domain of Object.keys(scores)) {
      expect(scores[domain as keyof typeof scores]).toBe(2);
    }
  });

  it('returns empty object for empty answers', () => {
    const scores = calculateDomainScores({});
    expect(Object.keys(scores)).toHaveLength(0);
  });
});

describe('identifyFlaggedDomains', () => {
  it('flags domains with score > 0 (default threshold from questionnaire spec)', () => {
    const scores = { depression: 1, anxiety: 0.5, anger: 0 } as Record<
      string,
      number
    >;
    const flagged = identifyFlaggedDomains(scores);
    expect(flagged).toContain('depression');
    expect(flagged).toContain('anxiety');
    expect(flagged).not.toContain('anger'); // 0 should not be flagged
  });

  it('sorts by specificity tier then score', () => {
    const scores = {
      somatic_symptoms: 4,
      depression: 3,
      psychosis: 2,
    } as Record<string, number>;
    const flagged = identifyFlaggedDomains(scores);
    expect(flagged[0]).toBe('psychosis');
    expect(flagged[1]).toBe('depression');
    expect(flagged[2]).toBe('somatic_symptoms');
  });

  it('limits to max 5 domains by default', () => {
    const scores: Record<string, number> = {};
    for (const domain of ALL_DOMAINS) {
      scores[domain] = 3;
    }
    const flagged = identifyFlaggedDomains(scores);
    expect(flagged.length).toBeLessThanOrEqual(5);
  });

  it('respects custom threshold', () => {
    const scores = { depression: 1.5 } as Record<string, number>;
    expect(identifyFlaggedDomains(scores, 1)).toContain('depression');
    expect(identifyFlaggedDomains(scores, 2)).not.toContain('depression');
  });

  it('respects custom maxDomains', () => {
    const scores: Record<string, number> = {};
    for (const domain of ALL_DOMAINS) {
      scores[domain] = 3;
    }
    const flagged = identifyFlaggedDomains(scores, 2, 3);
    expect(flagged).toHaveLength(3);
  });

  it('returns empty array when no domains meet threshold', () => {
    const scores = { depression: 0, anxiety: 0 } as Record<string, number>;
    expect(identifyFlaggedDomains(scores)).toEqual([]);
  });
});

describe('computeOverallSeverity', () => {
  it('returns none when no domain scores are present or all zero', () => {
    expect(computeOverallSeverity({})).toBe('none');
    expect(computeOverallSeverity({ depression: 0, anxiety: 0 })).toBe('none');
  });

  it('treats all domains equally (holistic): single domain drives by max score', () => {
    expect(computeOverallSeverity({ depression: 1 })).toBe('low');
    expect(computeOverallSeverity({ suicidal_tendencies: 1 })).toBe('low');
    expect(computeOverallSeverity({ anxiety: 2 })).toBe('moderate');
    expect(computeOverallSeverity({ somatic_symptoms: 2 })).toBe('moderate');
    expect(computeOverallSeverity({ depression: 3 })).toBe('high');
    expect(computeOverallSeverity({ psychosis: 4 })).toBe('high');
  });

  it('elevates severity when many domains are elevated (amalgamation)', () => {
    // Max 2 but 4+ domains flagged or sum >= 8 → high
    expect(
      computeOverallSeverity({
        depression: 2,
        anxiety: 2,
        anger: 2,
        sleep_problems: 2,
      })
    ).toBe('high');
    expect(
      computeOverallSeverity({
        depression: 2,
        anxiety: 2,
        memory: 2,
        somatic_symptoms: 2,
      })
    ).toBe('high');
    // Several domains with some burden → moderate
    expect(
      computeOverallSeverity({ depression: 1, anxiety: 1, anger: 1 })
    ).toBe('moderate');
    expect(
      computeOverallSeverity({
        depression: 1,
        anxiety: 1,
        memory: 1,
        personality: 1,
      })
    ).toBe('moderate');
  });

  it('low when only one or two domains slightly elevated', () => {
    expect(computeOverallSeverity({ somatic_symptoms: 1 })).toBe('low');
    expect(computeOverallSeverity({ memory: 1, personality: 1 })).toBe('low');
  });
});
