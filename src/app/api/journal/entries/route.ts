/**
 * API Route: GET /api/journal/entries - List all entries
 *           POST /api/journal/entries - Create new entry
 */

import { NextRequest, NextResponse } from 'next/server';
import { entriesService, type CreateJournalEntryInput } from '@/features/journal';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/journal/entries
 * Retrieve all journal entries for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error in GET:', authError);
      return NextResponse.json({ error: 'Unauthorized', details: authError.message }, { status: 401 });
    }

    if (!user) {
      console.error('No user found in GET');
      return NextResponse.json({ error: 'Unauthorized', details: 'No user in session' }, { status: 401 });
    }

    console.log('Fetching entries for user:', user.id);
    const entries = await entriesService.getEntriesByUserId(user.id);
    console.log('Found entries:', entries.length);

    return NextResponse.json({ success: true, data: entries }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching journal entries:', errorMessage, error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries', message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/journal/entries
 * Create a new journal entry
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, questions } = body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required and must be non-empty' }, { status: 400 });
    }

    const input: CreateJournalEntryInput = {
      userId: user.id,
      content: content.trim(),
      questions: questions || undefined,
    };

    const entry = await entriesService.createEntry(input);

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry', message: String(error) },
      { status: 500 }
    );
  }
}
