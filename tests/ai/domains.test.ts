import { describe, it, expect } from 'vitest';
import {
  calculateDomainScores,
  identifyFlaggedDomains,
  QUESTION_DOMAIN_MAP,
} from '@/lib/ai/domains';
import type { SymptomDomain } from '@/lib/ai/assessmentTypes';

/* ==========================================================================
   QUESTION_DOMAIN_MAP — data correctness
   ========================================================================== */

describe('QUESTION_DOMAIN_MAP', () => {
  it('maps all 17 survey questions to a domain', () => {
    expect(Object.keys(QUESTION_DOMAIN_MAP)).toHaveLength(17);
  });

  it('maps depression question correctly', () => {
    expect(QUESTION_DOMAIN_MAP['depression_low_mood']).toBe('depression');
  });

  it('maps both mania questions to the same domain', () => {
    expect(QUESTION_DOMAIN_MAP['mania_low_sleep_energy']).toBe('mania');
    expect(QUESTION_DOMAIN_MAP['mania_risk_projects']).toBe('mania');
  });

  it('maps both anxiety questions to the same domain', () => {
    expect(QUESTION_DOMAIN_MAP['anxiety_nervous']).toBe('anxiety');
    expect(QUESTION_DOMAIN_MAP['anxiety_avoidance']).toBe('anxiety');
  });

  it('maps both psychosis questions to the same domain', () => {
    expect(QUESTION_DOMAIN_MAP['psychosis_hearing_voices']).toBe('psychosis');
    expect(QUESTION_DOMAIN_MAP['psychosis_thought_broadcast']).toBe('psychosis');
  });

  it('maps both personality questions to the same domain', () => {
    expect(QUESTION_DOMAIN_MAP['personality_identity']).toBe('personality');
    expect(QUESTION_DOMAIN_MAP['personality_relationships']).toBe('personality');
  });

  it('maps suicidal_thoughts to suicidal_tendencies domain', () => {
    expect(QUESTION_DOMAIN_MAP['suicidal_thoughts']).toBe(
      'suicidal_tendencies',
    );
  });

  it('returns undefined for unknown question IDs', () => {
    expect(QUESTION_DOMAIN_MAP['nonexistent_question']).toBeUndefined();
  });
});

/* ==========================================================================
   calculateDomainScores
   ========================================================================== */

describe('calculateDomainScores', () => {
  it('returns empty record when given empty answers', () => {
    const scores = calculateDomainScores({});
    expect(Object.keys(scores)).toHaveLength(0);
  });

  it('calculates single-question domain score (depression)', () => {
    const answers = { depression_low_mood: 3 };
    const scores = calculateDomainScores(answers);
    expect(scores['depression']).toBe(3);
  });

  it('averages multi-question domain scores (mania has 2 questions)', () => {
    const answers = {
      mania_low_sleep_energy: 2,
      mania_risk_projects: 4,
    };
    const scores = calculateDomainScores(answers);
    expect(scores['mania']).toBe(3); // (2 + 4) / 2
  });

  it('averages anxiety domain with two questions', () => {
    const answers = {
      anxiety_nervous: 1,
      anxiety_avoidance: 3,
    };
    const scores = calculateDomainScores(answers);
    expect(scores['anxiety']).toBe(2); // (1 + 3) / 2
  });

  it('handles all zero scores', () => {
    const answers: Record<string, number> = {};
    for (const key of Object.keys(QUESTION_DOMAIN_MAP)) {
      answers[key] = 0;
    }
    const scores = calculateDomainScores(answers);
    for (const score of Object.values(scores)) {
      expect(score).toBe(0);
    }
  });

  it('handles all max scores (4)', () => {
    const answers: Record<string, number> = {};
    for (const key of Object.keys(QUESTION_DOMAIN_MAP)) {
      answers[key] = 4;
    }
    const scores = calculateDomainScores(answers);
    for (const score of Object.values(scores)) {
      expect(score).toBe(4);
    }
  });

  it('ignores unknown question IDs', () => {
    const answers = {
      depression_low_mood: 3,
      unknown_question_id: 4,
    };
    const scores = calculateDomainScores(answers);
    expect(scores['depression']).toBe(3);
    expect(Object.keys(scores)).toHaveLength(1);
  });

  it('produces 13 unique domains when all questions answered', () => {
    const answers: Record<string, number> = {};
    for (const key of Object.keys(QUESTION_DOMAIN_MAP)) {
      answers[key] = 2;
    }
    const scores = calculateDomainScores(answers);
    expect(Object.keys(scores)).toHaveLength(13);
  });
});

/* ==========================================================================
   identifyFlaggedDomains
   ========================================================================== */

describe('identifyFlaggedDomains', () => {
  it('returns empty array when no domains meet threshold', () => {
    const domainScores: Record<string, number> = {
      depression: 1,
      anxiety: 0,
      anger: 1.5,
    };
    const flagged = identifyFlaggedDomains(domainScores);
    expect(flagged).toHaveLength(0);
  });

  it('flags domains at or above default threshold (2.0)', () => {
    const domainScores: Record<string, number> = {
      depression: 2,
      anxiety: 3,
      anger: 1,
    };
    const flagged = identifyFlaggedDomains(domainScores);
    expect(flagged).toContain('depression');
    expect(flagged).toContain('anxiety');
    expect(flagged).not.toContain('anger');
  });

  it('sorts flagged domains by severity (highest first)', () => {
    const domainScores: Record<string, number> = {
      depression: 2,
      anxiety: 4,
      mania: 3,
    };
    const flagged = identifyFlaggedDomains(domainScores);
    expect(flagged).toEqual(['anxiety', 'mania', 'depression']);
  });

  it('uses custom threshold when provided', () => {
    const domainScores: Record<string, number> = {
      depression: 1,
      anxiety: 1.5,
      mania: 2,
    };
    const flagged = identifyFlaggedDomains(domainScores, 1);
    expect(flagged).toHaveLength(3);
  });

  it('handles threshold of 0 (all domains with non-negative scores)', () => {
    const domainScores: Record<string, number> = {
      depression: 0,
      anxiety: 1,
    };
    const flagged = identifyFlaggedDomains(domainScores, 0);
    expect(flagged).toHaveLength(2);
  });

  it('returns empty when all scores are zero with default threshold', () => {
    const domainScores: Record<string, number> = {
      depression: 0,
      anxiety: 0,
      anger: 0,
    };
    const flagged = identifyFlaggedDomains(domainScores);
    expect(flagged).toHaveLength(0);
  });

  it('handles single domain at threshold', () => {
    const domainScores: Record<string, number> = {
      suicidal_tendencies: 2,
    };
    const flagged = identifyFlaggedDomains(domainScores);
    expect(flagged).toEqual(['suicidal_tendencies']);
  });
});
