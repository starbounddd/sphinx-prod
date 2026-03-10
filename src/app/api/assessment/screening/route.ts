import { NextRequest, NextResponse } from 'next/server';

import { handleScreening } from '@/features/assessment/handlers/screening';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const { answers } = await request.json();
    const result = await handleScreening(user.id, answers);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[assessment/screening] Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving screening results' },
      { status: 500 },
    );
  }
}
