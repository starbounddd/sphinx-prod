/**
 * Default journal questions to guide users in their entries.
 */

export const DEFAULT_JOURNAL_QUESTIONS = [
  'What were the highlights of your day today?',
  'What did you struggle with or feel challenged by?',
  'What are you grateful for right now?',
];

export const JOURNAL_QUESTIONS_MAP: { [key: string]: string } = {
  highlights: DEFAULT_JOURNAL_QUESTIONS[0],
  challenges: DEFAULT_JOURNAL_QUESTIONS[1],
  gratitude: DEFAULT_JOURNAL_QUESTIONS[2],
};
