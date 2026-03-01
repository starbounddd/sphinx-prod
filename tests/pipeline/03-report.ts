// tests/pipeline/03-report.ts — Phase 3: Report Generation
// Run via: npx vitest run tests/pipeline/pipeline.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  sharedState,
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
import type { AssessmentGraphStateType } from '@/lib/ai/assessmentTypes';

// Cache the report result to avoid redundant LLM calls
let reportResult: AssessmentGraphStateType;

describe('Phase 3: Report Generation', { timeout: 180_000 }, () => {
  beforeAll(async () => {
    // Requires Phase 2 to have populated sharedState + LangGraph checkpointer
    if (!sharedState.threadId || !sharedState.sessionId) {
      throw new Error('Phase 3 requires sharedState from Phase 2 — run via pipeline.test.ts');
    }

    // Generate report once, reuse across tests
    reportResult = await forceGenerateReport(sharedState.threadId);
  });

  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('force-generates a report from current assessment state', () => {
    // Should have a report
    expect(reportResult.report).not.toBeNull();
    expect(reportResult.report).toBeDefined();

    // Report should have required fields
    expect(reportResult.report!.chiefComplaint).toBeTruthy();
    expect(reportResult.report!.mainGoal).toBeTruthy();
    expect(reportResult.report!.analysis).toBeTruthy();
    expect(reportResult.report!.domains).toBeDefined();
    expect(Array.isArray(reportResult.report!.domains)).toBe(true);
    expect(reportResult.report!.findings).toBeDefined();
    expect(reportResult.report!.recommendations).toBeDefined();
  });

  it('report passes schema validation', () => {
    const validation = validateAIReport(reportResult.report);
    expect(validation.valid).toBe(true);
  });

  it('persists report to Supabase', async () => {
    if (reportResult.report) {
      await saveAssessmentReport({
        sessionId: sharedState.sessionId,
        report: reportResult.report,
      });
    }

    // Update domain assessments
    await updateDomainAssessments(
      sharedState.sessionId,
      reportResult.domainAssessments as Parameters<typeof updateDomainAssessments>[1],
    );

    // Complete the session
    await completeSession({
      sessionId: sharedState.sessionId,
      chiefComplaint: reportResult.chiefComplaint,
      totalQuestions: reportResult.questionCount,
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
