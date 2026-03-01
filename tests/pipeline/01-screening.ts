// tests/pipeline/01-screening.ts — Phase 1: Screening
// Run via: npx vitest run tests/pipeline/pipeline.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import {
  signInTestUser,
  sharedState,
  SCREENING_ANSWERS,
  cleanup,
} from './helpers';
import { calculateDomainScores, identifyFlaggedDomains } from '@/lib/ai/domains';
import { upsertUserScreening, getUserScreening } from '@/lib/db/assessmentService';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';

describe('Phase 1: Screening', () => {
  beforeAll(async () => {
    // Clean up any leftover test data first
    const userId = await signInTestUser();
    sharedState.userId = userId;
    await cleanup();
  });

  it('authenticates the test user', () => {
    expect(sharedState.userId).toBeTruthy();
    expect(sharedState.userId.length).toBeGreaterThan(0);
  });

  it('calculates domain scores from screening answers', () => {
    const domainScores = calculateDomainScores(SCREENING_ANSWERS);
    sharedState.domainScores = domainScores;
    sharedState.answers = SCREENING_ANSWERS;

    // Verify expected scores
    expect(domainScores.depression).toBe(3);
    expect(domainScores.anxiety).toBe(3);         // (3+3)/2
    expect(domainScores.psychosis).toBe(2.5);      // (3+2)/2
    expect(domainScores.sleep_problems).toBe(3);
    expect(domainScores.anger).toBe(1);
    expect(domainScores.suicidal_tendencies).toBe(0);
  });

  it('identifies flagged domains with specificity sorting', () => {
    const flagged = identifyFlaggedDomains(sharedState.domainScores);
    sharedState.flaggedDomains = flagged;

    // psychosis is high specificity, should be first even though score=2.5
    expect(flagged[0]).toBe('psychosis');
    // depression=3, anxiety=3, sleep=3 are medium tier
    expect(flagged).toContain('depression');
    expect(flagged).toContain('anxiety');
    expect(flagged).toContain('sleep_problems');
    // Max 5 domains
    expect(flagged.length).toBeLessThanOrEqual(5);
    // Anger=1, suicidal=0 should NOT be flagged
    expect(flagged).not.toContain('anger');
    expect(flagged).not.toContain('suicidal_tendencies');
  });

  it('persists screening to Supabase via upsertUserScreening', async () => {
    await upsertUserScreening({
      userId: sharedState.userId,
      answers: SCREENING_ANSWERS,
      domainScores: sharedState.domainScores,
      flaggedDomains: sharedState.flaggedDomains as any,
    });
  });

  it('[Supabase check] user_screening_results has correct data', async () => {
    const screening = await getUserScreening(sharedState.userId);
    expect(screening).not.toBeNull();

    const answers = screening!.answers as Record<string, number>;
    expect(answers.depression_low_mood).toBe(3);
    expect(answers.anxiety_nervous).toBe(3);

    const domainScores = screening!.domainScores as Record<string, number>;
    expect(domainScores.depression).toBe(3);
    expect(domainScores.psychosis).toBe(2.5);

    const flagged = screening!.flaggedDomains as string[];
    expect(flagged).toContain('psychosis');
    expect(flagged).toContain('depression');
  });

  it('converts answers to ScreeningResult[] format', () => {
    const results = toScreeningResults(SCREENING_ANSWERS);
    expect(results).toHaveLength(17);
    // Every result should have domain, score, questionText
    for (const r of results) {
      expect(r.domain).toBeTruthy();
      expect(typeof r.score).toBe('number');
      expect(r.questionText).toBeTruthy();
    }
  });
});
