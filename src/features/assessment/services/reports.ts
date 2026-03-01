/**
 * Assessment report persistence operations.
 */

import { prisma } from '@/lib/db/prisma';
import type { AssessmentReport } from '@prisma/client';
import type { SaveReportInput } from './types';

/**
 * Save the AI-generated assessment report.
 */
export async function saveAssessmentReport(
  input: SaveReportInput
): Promise<AssessmentReport> {
  const { sessionId, report } = input;

  return prisma.assessmentReport.create({
    data: {
      sessionId,
      chiefComplaint: report.chiefComplaint,
      mainGoal: report.mainGoal,
      analysis: report.analysis,
      domains: JSON.parse(JSON.stringify(report.domains)),
      findings: JSON.parse(JSON.stringify(report.findings)),
      recommendations: report.recommendations,
      culturalBackground: report.culturalBackground,
      summary: report.summary,
    },
  });
}

/**
 * Get report for a session.
 */
export async function getSessionReport(
  sessionId: string
): Promise<AssessmentReport | null> {
  return prisma.assessmentReport.findUnique({
    where: { sessionId },
  });
}
