import type { JournalEntryWithQuestions, CreateJournalEntryInput, UpdateJournalEntryInput } from '../schema/types';

export interface IEntriesService {
  /**
   * Create a new journal entry
   */
  createEntry(input: CreateJournalEntryInput): Promise<JournalEntryWithQuestions>;

  /**
   * Get all entries for a user
   */
  getEntriesByUserId(userId: string): Promise<JournalEntryWithQuestions[]>;

  /**
   * Get a single entry by ID
   */
  getEntryById(id: string): Promise<JournalEntryWithQuestions | null>;

  /**
   * Update an existing entry
   */
  updateEntry(id: string, input: UpdateJournalEntryInput): Promise<JournalEntryWithQuestions>;

  /**
   * Delete an entry
   */
  deleteEntry(id: string): Promise<void>;
}
