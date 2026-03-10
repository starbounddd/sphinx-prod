import { NextRequest, NextResponse } from 'next/server';

import { handleForceEnd } from '@/features/assessment/handlers/end';
import { validateThreadId } from '@/features/assessment/validation/input';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId } = body as { threadId?: string };

    if (!validateThreadId(threadId)) {
      return NextResponse.json(
        { error: 'Missing or invalid required field: threadId' },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: missing AI provider key' },
        { status: 500 },
      );
    }

    const result = await handleForceEnd(threadId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error('[assessment/chat/end] Error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred while generating the report' },
      { status: 500 },
    );
  }
}
