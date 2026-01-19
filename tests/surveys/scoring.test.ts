import { calculateScore } from '@/lib/surveys/scoring';

describe('Survey Scoring', () => {
  it('should calculate score correctly', () => {
    const responses = [];
    const score = calculateScore(responses);
    expect(score).toBe(0);
  });
});
