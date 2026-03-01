// tests/ai/inputValidation.test.ts
import { describe, it, expect } from 'vitest';
import {
  validateThreadId,
  validateScreeningAnswers,
  validateMessage,
} from '@/lib/ai/inputValidation';

describe('validateThreadId', () => {
  it('accepts a non-empty string', () => {
    expect(validateThreadId('abc-123')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(validateThreadId('')).toBe(false);
  });

  it('rejects non-string types', () => {
    expect(validateThreadId(123)).toBe(false);
    expect(validateThreadId(null)).toBe(false);
    expect(validateThreadId(undefined)).toBe(false);
    expect(validateThreadId({})).toBe(false);
  });

  it('rejects strings exceeding 256 chars', () => {
    expect(validateThreadId('a'.repeat(256))).toBe(true);
    expect(validateThreadId('a'.repeat(257))).toBe(false);
  });

  it('accepts single character', () => {
    expect(validateThreadId('x')).toBe(true);
  });
});

describe('validateScreeningAnswers', () => {
  it('accepts valid answers (scores 0-4)', () => {
    const result = validateScreeningAnswers({
      depression_low_mood: 0,
      anxiety_nervous: 2,
      psychosis_hearing_voices: 4,
    });
    expect(result.valid).toBe(true);
  });

  it('rejects null', () => {
    expect(validateScreeningAnswers(null).valid).toBe(false);
  });

  it('rejects undefined', () => {
    expect(validateScreeningAnswers(undefined).valid).toBe(false);
  });

  it('rejects arrays', () => {
    expect(validateScreeningAnswers([1, 2, 3]).valid).toBe(false);
  });

  it('rejects non-number scores', () => {
    const result = validateScreeningAnswers({ q1: 'high' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('must be a number');
  });

  it('rejects NaN scores', () => {
    const result = validateScreeningAnswers({ q1: NaN });
    expect(result.valid).toBe(false);
  });

  it('rejects Infinity scores', () => {
    const result = validateScreeningAnswers({ q1: Infinity });
    expect(result.valid).toBe(false);
  });

  it('rejects out-of-range scores (below 0)', () => {
    const result = validateScreeningAnswers({ q1: -1 });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('between 0 and 4');
  });

  it('rejects out-of-range scores (above 4)', () => {
    const result = validateScreeningAnswers({ q1: 5 });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('between 0 and 4');
  });

  it('accepts float scores within 0-4', () => {
    const result = validateScreeningAnswers({ q1: 2.5 });
    expect(result.valid).toBe(true);
  });

  it('accepts empty object', () => {
    const result = validateScreeningAnswers({});
    expect(result.valid).toBe(true);
  });
});

describe('validateMessage', () => {
  it('accepts normal messages', () => {
    const result = validateMessage('Hello, I have been feeling anxious.');
    expect(result.valid).toBe(true);
  });

  it('rejects non-string types', () => {
    expect(validateMessage(123).valid).toBe(false);
    expect(validateMessage(null).valid).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateMessage('').valid).toBe(false);
  });

  it('rejects whitespace-only strings', () => {
    expect(validateMessage('   ').valid).toBe(false);
  });

  it('rejects messages exceeding 5000 chars', () => {
    expect(validateMessage('a'.repeat(5000)).valid).toBe(true);
    expect(validateMessage('a'.repeat(5001)).valid).toBe(false);
  });

  it('accepts messages with emoji', () => {
    expect(validateMessage('I feel okay 😊').valid).toBe(true);
  });
});
