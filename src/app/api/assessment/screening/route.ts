import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateDomainScores, identifyFlaggedDomains } from '@/features/assessment/schema/domains';
import { upsertUserScreening } from '@/features/assessment/services/screening';
import { validateScreeningAnswers } from '@/features/assessment/validation/input';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request
    const body = await request.json();
    const { answers } = body as { answers?: Record<string, number> };

    const validation = validateScreeningAnswers(answers);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 3. Calculate domain scores
    const domainScores = calculateDomainScores(answers!);
    const flaggedDomains = identifyFlaggedDomains(domainScores);

    // 4. Upsert to database
    await upsertUserScreening({
      userId: user.id,
      answers: answers!,
      domainScores,
      flaggedDomains,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[assessment/screening] Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving screening results' },
      { status: 500 }
    );
  }
}
