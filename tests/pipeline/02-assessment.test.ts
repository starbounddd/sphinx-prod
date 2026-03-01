// tests/pipeline/02-assessment.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import {
  sharedState,
  signInTestUser,
  prisma,
} from './helpers';
import {
  runAssessmentTurn,
  resetAssessmentGraph,
} from '@/lib/ai/assessmentGraph';
import {
  createAssessmentSession,
  getSessionByThreadId,
  getSessionDomainAssessments,
  getUserScreening,
} from '@/lib/db/assessmentService';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';
import type { SymptomDomain } from '@/lib/ai/assessmentTypes';

describe('Phase 2: Assessment Chat', { timeout: 180_000 }, () => {
  beforeAll(async () => {
    // If running standalone (sharedState empty), sign in and read from DB
    if (!sharedState.userId) {
      sharedState.userId = await signInTestUser();
      const screening = await getUserScreening(sharedState.userId);
      if (!screening) throw new Error('No screening data — run 01-screening first');
      sharedState.domainScores = screening.domainScores as Record<string, number>;
      sharedState.flaggedDomains = screening.flaggedDomains as string[];
      sharedState.answers = screening.answers as Record<string, number>;
    }

    // Reset graph singleton for clean state
    resetAssessmentGraph();

    // Generate a unique threadId for this test run
    sharedState.threadId = uuidv4();
  });

  it('initializes assessment session with real LLM', async () => {
    const screeningResults = toScreeningResults(sharedState.answers);

    const result = await runAssessmentTurn(
      sharedState.threadId,
      undefined,
      screeningResults,
      sharedState.flaggedDomains as SymptomDomain[],
      sharedState.domainScores,
    );

    // Should return an AI message
    expect(result.messages.length).toBeGreaterThan(0);
    const lastMsg = result.messages[result.messages.length - 1];
    expect(typeof lastMsg.content).toBe('string');
    expect((lastMsg.content as string).length).toBeGreaterThan(10);

    // Should have a current domain
    expect(result.currentDomain).toBeTruthy();

    // Should have domain assessments initialized
    expect(Object.keys(result.domainAssessments).length).toBeGreaterThan(0);

    // Should not be complete yet
    expect(result.isComplete).toBe(false);
  });

  it('creates session in Supabase', async () => {
    const session = await createAssessmentSession({
      threadId: sharedState.threadId,
      userId: sharedState.userId,
      flaggedDomains: sharedState.flaggedDomains as SymptomDomain[],
      screeningSnapshot: sharedState.domainScores,
    });

    sharedState.sessionId = session.id;
    expect(session.threadId).toBe(sharedState.threadId);
    expect(session.status).toBe('in_progress');
  });

  it('[Supabase check] session exists with correct screening snapshot', async () => {
    const session = await getSessionByThreadId(sharedState.threadId);
    expect(session).not.toBeNull();
    expect(session!.status).toBe('in_progress');
    expect(session!.userId).toBe(sharedState.userId);

    const snapshot = session!.screeningSnapshot as Record<string, number>;
    expect(snapshot.depression).toBe(3);
    expect(snapshot.psychosis).toBe(2.5);

    const flagged = session!.flaggedDomains as string[];
    expect(flagged).toContain('psychosis');
    expect(flagged).toContain('depression');
  });

  it('[Supabase check] domain_assessments created for flagged domains', async () => {
    const assessments = await getSessionDomainAssessments(sharedState.sessionId);
    expect(assessments.length).toBeGreaterThan(0);

    // First domain should be in_progress, rest pending
    const inProgress = assessments.filter((a) => a.status === 'in_progress');
    const pending = assessments.filter((a) => a.status === 'pending');
    expect(inProgress.length).toBe(1);
    expect(pending.length).toBe(assessments.length - 1);
  });

  it('sends follow-up messages and gets AI responses', async () => {
    // Send 2 follow-up messages
    const messages = [
      'I have been feeling very anxious recently, especially in social situations.',
      'It happens almost every day, and I find it hard to concentrate at work.',
    ];

    for (const msg of messages) {
      const result = await runAssessmentTurn(sharedState.threadId, msg);

      // Should get an AI response back
      expect(result.messages.length).toBeGreaterThan(0);
      const lastMsg = result.messages[result.messages.length - 1];
      expect(typeof lastMsg.content).toBe('string');
      expect((lastMsg.content as string).length).toBeGreaterThan(0);

      // Question count should increment
      expect(result.questionCount).toBeGreaterThan(0);
    }
  });
});
