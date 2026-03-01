// tests/pipeline/03-report.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  sharedState,
  signInTestUser,
  cleanup,
  prisma,
} from './helpers';
import {
  forceGenerateReport,
} from '@/lib/ai/assessmentGraph';
import {
  saveAssessmentReport,
  updateDomainAssessments,
  completeSession,
  getSessionReport,
  getSessionByThreadId,
  getFullSession,
  getUserScreening,
} from '@/lib/db/assessmentService';
import { validateAIReport } from '@/lib/ai/reportSchema';

describe('Phase 3: Report Generation', { timeout: 180_000 }, () => {
  beforeAll(async () => {
    // If running standalone, recover state from DB
    if (!sharedState.userId) {
      sharedState.userId = await signInTestUser();
    }
    if (!sharedState.threadId || !sharedState.sessionId) {
      // Find the most recent in-progress session for this user
      const session = await prisma.assessmentSession.findFirst({
        where: { userId: sharedState.userId, status: 'in_progress' },
        orderBy: { startedAt: 'desc' },
      });
      if (!session) throw new Error('No in-progress session — run phases 1+2 first');
      sharedState.threadId = session.threadId;
      sharedState.sessionId = session.id;
    }
  });

  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('force-generates a report from current assessment state', async () => {
    const result = await forceGenerateReport(sharedState.threadId);

    // Should have a report
    expect(result.report).not.toBeNull();
    expect(result.report).toBeDefined();

    // Report should have required fields
    expect(result.report!.chiefComplaint).toBeTruthy();
    expect(result.report!.mainGoal).toBeTruthy();
    expect(result.report!.analysis).toBeTruthy();
    expect(result.report!.domains).toBeDefined();
    expect(Array.isArray(result.report!.domains)).toBe(true);
    expect(result.report!.findings).toBeDefined();
    expect(result.report!.recommendations).toBeDefined();
  });

  it('report passes schema validation', async () => {
    const result = await forceGenerateReport(sharedState.threadId);
    const validation = validateAIReport(result.report);
    expect(validation.valid).toBe(true);
  });

  it('persists report to Supabase', async () => {
    const result = await forceGenerateReport(sharedState.threadId);

    if (result.report) {
      await saveAssessmentReport({
        sessionId: sharedState.sessionId,
        report: result.report,
      });
    }

    // Update domain assessments
    await updateDomainAssessments(
      sharedState.sessionId,
      result.domainAssessments as Parameters<typeof updateDomainAssessments>[1],
    );

    // Complete the session
    await completeSession({
      sessionId: sharedState.sessionId,
      chiefComplaint: result.chiefComplaint,
      totalQuestions: result.questionCount,
      isEarlyTermination: true,
    });
  });

  it('[Supabase check] assessment_reports has the report', async () => {
    const report = await getSessionReport(sharedState.sessionId);
    expect(report).not.toBeNull();
    expect(report!.chiefComplaint).toBeTruthy();
    expect(report!.mainGoal).toBeTruthy();
    expect(report!.analysis).toBeTruthy();

    // domains should be a non-empty array
    const domains = report!.domains as unknown[];
    expect(Array.isArray(domains)).toBe(true);
    expect(domains.length).toBeGreaterThan(0);

    // findings should be a non-empty array
    const findings = report!.findings as unknown[];
    expect(Array.isArray(findings)).toBe(true);

    // recommendations should be an array
    expect(Array.isArray(report!.recommendations)).toBe(true);
  });

  it('[Supabase check] session is marked completed', async () => {
    const session = await getSessionByThreadId(sharedState.threadId);
    expect(session).not.toBeNull();
    expect(session!.status).toBe('completed');
    expect(session!.endedAt).not.toBeNull();
    expect(session!.totalQuestions).toBeGreaterThanOrEqual(0);
  });

  it('[Supabase check] full session has all related data', async () => {
    const full = await getFullSession(sharedState.sessionId);
    expect(full).not.toBeNull();

    // Should have domain assessments
    expect(full!.domainAssessments.length).toBeGreaterThan(0);

    // Should have a report
    expect(full!.report).not.toBeNull();

    // Session should reference correct user
    expect(full!.userId).toBe(sharedState.userId);
  });

  it('cleanup removes all test data', async () => {
    await cleanup();

    // Verify cleanup
    const screening = await getUserScreening(sharedState.userId);
    expect(screening).toBeNull();

    const session = await getSessionByThreadId(sharedState.threadId);
    expect(session).toBeNull();
  });
});
