/**
 * API Route: GET /api/journal/entries - List all entries
 *           POST /api/journal/entries - Create new entry
 */

import { NextRequest, NextResponse } from 'next/server';
import { entriesService, type CreateJournalEntryInput } from '@/features/journal';

/**
 * GET /api/journal/entries
 * Retrieve all journal entries for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get userId from request headers or auth context
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - no user ID' }, { status: 401 });
    }

    const entries = await entriesService.getEntriesByUserId(userId);

    return NextResponse.json({ success: true, data: entries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries', message: String(error) },
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
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - no user ID' }, { status: 401 });
    }

    const body = await request.json();
    const { content, questions } = body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required and must be non-empty' }, { status: 400 });
    }

    const input: CreateJournalEntryInput = {
      userId,
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
