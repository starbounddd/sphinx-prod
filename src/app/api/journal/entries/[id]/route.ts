/**
 * API Route: GET /api/journal/entries/[id] - Get single entry
 *           PUT /api/journal/entries/[id] - Update entry
 *           DELETE /api/journal/entries/[id] - Delete entry
 */

import { NextRequest, NextResponse } from 'next/server';
import { entriesService, type UpdateJournalEntryInput } from '@/features/journal';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/journal/entries/[id]
 * Retrieve a single journal entry
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    const entry = await entriesService.getEntryById(id);

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: entry }, { status: 200 });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entry', message: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/journal/entries/[id]
 * Update an existing journal entry
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');

    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - no user ID' }, { status: 401 });
    }

    // Verify ownership
    const existingEntry = await entriesService.getEntryById(id);
    if (!existingEntry || existingEntry.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized - cannot modify this entry' }, { status: 403 });
    }

    const body = await request.json();
    const { content, questions } = body;

    const input: UpdateJournalEntryInput = {};
    if (content !== undefined) input.content = content;
    if (questions !== undefined) input.questions = questions;

    const updatedEntry = await entriesService.updateEntry(id, input);

    return NextResponse.json({ success: true, data: updatedEntry }, { status: 200 });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to update journal entry', message: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/journal/entries/[id]
 * Delete a journal entry
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');

    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - no user ID' }, { status: 401 });
    }

    // Verify ownership
    const entry = await entriesService.getEntryById(id);
    if (!entry || entry.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized - cannot delete this entry' }, { status: 403 });
    }

    await entriesService.deleteEntry(id);

    return NextResponse.json({ success: true, message: 'Entry deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete journal entry', message: String(error) },
      { status: 500 }
    );
  }
}
