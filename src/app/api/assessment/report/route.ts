import { NextResponse } from 'next/server';

import { handleGetReport } from '@/features/assessment/handlers/report';
import { createClient } from '@/lib/supabase/server';

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

    const result = await handleGetReport(user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({
      success: true,
      report: result.report,
      screeningSnapshot: result.screeningSnapshot,
    });
  } catch (error) {
    console.error('[assessment/report] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 },
    );
  }
}
