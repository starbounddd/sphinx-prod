import { getUserLatestSession } from '../services/sessions';
import { getSessionReport } from '../services/reports';

type ReportResult =
  | {
      success: true;
      report: {
        chiefComplaint: string;
        mainGoal: string;
        analysis: string;
        domains: unknown;
        findings: unknown;
        recommendations: string[];
        culturalBackground: string | null;
        summary: string | null;
      };
      screeningSnapshot: unknown;
    }
  | { success: false; error: string; status: number };

export async function handleGetReport(
  userId: string,
): Promise<ReportResult> {
  const session = await getUserLatestSession(userId);
  if (!session) {
    return { success: false, error: 'No assessment session found.', status: 404 };
  }

  const report = await getSessionReport(session.id);
  if (!report) {
    return { success: false, error: 'No report found for this session.', status: 404 };
  }

  return {
    success: true,
    report: {
      chiefComplaint: report.chiefComplaint,
      mainGoal: report.mainGoal,
      analysis: report.analysis,
      domains: report.domains,
      findings: report.findings,
      recommendations: report.recommendations,
      culturalBackground: report.culturalBackground,
      summary: report.summary,
    },
    screeningSnapshot: session.screeningSnapshot,
  };
}
