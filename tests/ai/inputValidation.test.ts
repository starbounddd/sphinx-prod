import { describe, it, expect } from 'vitest';
import {
  validateThreadId,
  validateScreeningAnswers,
  validateMessage,
} from '@/lib/ai/inputValidation';

/* ==========================================================================
   validateThreadId
   ========================================================================== */

describe('validateThreadId', () => {
  it('accepts a valid UUID-like string', () => {
    expect(validateThreadId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('accepts any non-empty string (thread IDs are flexible)', () => {
    expect(validateThreadId('my-thread-123')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(validateThreadId('')).toBe(false);
  });

  it('rejects undefined', () => {
    expect(validateThreadId(undefined)).toBe(false);
  });

  it('rejects null', () => {
    expect(validateThreadId(null)).toBe(false);
  });

  it('rejects non-string types', () => {
    expect(validateThreadId(123 as any)).toBe(false);
    expect(validateThreadId({} as any)).toBe(false);
  });

  it('rejects strings exceeding max length (256)', () => {
    expect(validateThreadId('a'.repeat(257))).toBe(false);
  });

  it('accepts strings at max length (256)', () => {
    expect(validateThreadId('a'.repeat(256))).toBe(true);
  });
});

/* ==========================================================================
   validateScreeningAnswers
   ========================================================================== */

describe('validateScreeningAnswers', () => {
  it('accepts valid answers with scores 0-4', () => {
    const result = validateScreeningAnswers({
      depression_low_mood: 3,
      anxiety_nervous: 1,
    });
    expect(result.valid).toBe(true);
  });

  it('rejects null input', () => {
    const result = validateScreeningAnswers(null);
    expect(result.valid).toBe(false);
  });

  it('rejects non-object input', () => {
    const result = validateScreeningAnswers('not-an-object' as any);
    expect(result.valid).toBe(false);
  });

  it('rejects answers with scores below 0', () => {
    const result = validateScreeningAnswers({ depression_low_mood: -1 });
    expect(result.valid).toBe(false);
  });

  it('rejects answers with scores above 4', () => {
    const result = validateScreeningAnswers({ depression_low_mood: 5 });
    expect(result.valid).toBe(false);
  });

  it('rejects answers with non-numeric scores', () => {
    const result = validateScreeningAnswers({
      depression_low_mood: 'high' as any,
    });
    expect(result.valid).toBe(false);
  });

  it('accepts empty answers object', () => {
    const result = validateScreeningAnswers({});
    expect(result.valid).toBe(true);
  });

  it('provides error message on invalid input', () => {
    const result = validateScreeningAnswers({ depression_low_mood: -1 });
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

/* ==========================================================================
   validateMessage
   ========================================================================== */

describe('validateMessage', () => {
  it('accepts a normal message', () => {
    const result = validateMessage('I have been feeling down');
    expect(result.valid).toBe(true);
  });

  it('rejects empty message', () => {
    const result = validateMessage('');
    expect(result.valid).toBe(false);
  });

  it('rejects whitespace-only message', () => {
    const result = validateMessage('   ');
    expect(result.valid).toBe(false);
  });

  it('rejects messages exceeding max length (5000 chars)', () => {
    const result = validateMessage('a'.repeat(5001));
    expect(result.valid).toBe(false);
  });

  it('accepts messages at max length (5000 chars)', () => {
    const result = validateMessage('a'.repeat(5000));
    expect(result.valid).toBe(true);
  });

  it('rejects non-string input', () => {
    const result = validateMessage(123 as any);
    expect(result.valid).toBe(false);
  });

  it('provides error message on invalid input', () => {
    const result = validateMessage('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
