/**
 * Journal Entry CRUD operations
 */

import { prisma } from '@/lib/db/prisma';
import type { JournalEntryWithQuestions, CreateJournalEntryInput, UpdateJournalEntryInput } from '../schema/types';

/**
 * Create a new journal entry
 */
export async function createEntry(input: CreateJournalEntryInput): Promise<JournalEntryWithQuestions> {
  const entry = await prisma.journalEntry.create({
    data: {
      userId: input.userId,
      content: input.content,
      questions: input.questions ?? null,
    },
  });

  return {
    ...entry,
    questions: entry.questions as JournalEntryWithQuestions['questions'],
  };
}

/**
 * Get all entries for a user (ordered by creation date, newest first)
 */
export async function getEntriesByUserId(userId: string): Promise<JournalEntryWithQuestions[]> {
  const entries = await prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return entries.map((entry) => ({
    ...entry,
    questions: entry.questions as JournalEntryWithQuestions['questions'],
  }));
}

/**
 * Get a single entry by ID
 */
export async function getEntryById(id: string): Promise<JournalEntryWithQuestions | null> {
  const entry = await prisma.journalEntry.findUnique({
    where: { id },
  });

  if (!entry) return null;

  return {
    ...entry,
    questions: entry.questions as JournalEntryWithQuestions['questions'],
  };
}

/**
 * Update an existing entry
 */
export async function updateEntry(
  id: string,
  input: UpdateJournalEntryInput
): Promise<JournalEntryWithQuestions> {
  const updateData: Partial<Omit<UpdateJournalEntryInput, 'userId'>> = {};

  if (input.content !== undefined) {
    updateData.content = input.content;
  }
  if (input.questions !== undefined) {
    updateData.questions = input.questions;
  }

  const entry = await prisma.journalEntry.update({
    where: { id },
    data: updateData,
  });

  return {
    ...entry,
    questions: entry.questions as JournalEntryWithQuestions['questions'],
  };
}

/**
 * Delete an entry
 */
export async function deleteEntry(id: string): Promise<void> {
  await prisma.journalEntry.delete({
    where: { id },
  });
}
