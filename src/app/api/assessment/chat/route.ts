import { NextRequest, NextResponse } from 'next/server';

import { handleChatInit, handleChatContinue } from '@/features/assessment/handlers/chat';
import { validateThreadId, validateMessage } from '@/features/assessment/validation/input';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, message } = body as {
      threadId?: string;
      message?: string;
    };

    if (!validateThreadId(threadId)) {
      return NextResponse.json(
        { error: 'Missing or invalid required field: threadId' },
        { status: 400 },
      );
    }

    if (message !== undefined) {
      const msgValidation = validateMessage(message);
      if (!msgValidation.valid) {
        return NextResponse.json(
          { error: msgValidation.error },
          { status: 400 },
        );
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: missing AI provider key' },
        { status: 500 },
      );
    }

    // Init flow (no message = new session)
    if (!message) {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 },
        );
      }

      const result = await handleChatInit(user.id, threadId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      return NextResponse.json({ success: true, message: result.message }, { status: 200 });
    }

    // Continue flow (message present)
    const result = await handleChatContinue(threadId, message);
    return NextResponse.json({ success: true, message: result.message }, { status: 200 });
  } catch (error: unknown) {
    console.error('[assessment/chat] Error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred while processing the assessment' },
      { status: 500 },
    );
  }
}
