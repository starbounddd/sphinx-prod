import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { getUserLatestSession } from '@/features/assessment/services/sessions';
import { getSessionReport } from '@/features/assessment/services/reports';

/**
 * GET /api/assessment/report
 *
 * Fetch the latest completed assessment report for the authenticated user.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const session = await getUserLatestSession(user.id);
    if (!session) {
      return NextResponse.json(
        { error: 'No assessment session found.' },
        { status: 404 },
      );
    }

    const report = await getSessionReport(session.id);
    if (!report) {
      return NextResponse.json(
        { error: 'No report found for this session.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('[assessment/report] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 },
    );
  }
}
