import type { JournalEntry } from '@prisma/client';

export type JournalEntryWithQuestions = Omit<JournalEntry, 'questions'> & {
  questions?: {
    [questionText: string]: string;
  } | null;
};

export interface CreateJournalEntryInput {
  userId: string;
  content: string;
  questions?: {
    [questionText: string]: string;
  };
}

export interface UpdateJournalEntryInput {
  content?: string;
  questions?: {
    [questionText: string]: string;
  };
}
