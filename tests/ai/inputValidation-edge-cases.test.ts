/**
 * Edge-case tests for inputValidation.ts.
 *
 * Covers:
 *   - NaN / Infinity scores
 *   - Float scores within valid range
 *   - Nested objects as screening answers
 *   - Multi-byte / emoji message length
 *   - Boundary thread ID lengths
 */
import { describe, expect, it } from 'vitest';

import {
  validateThreadId,
  validateScreeningAnswers,
  validateMessage,
} from '@/lib/ai/inputValidation';

/* -------------------------------------------------------------------- */
/* validateScreeningAnswers — numeric edge cases                         */
/* -------------------------------------------------------------------- */
describe('validateScreeningAnswers — numeric edge cases', () => {
  it('rejects NaN score values', () => {
    const result = validateScreeningAnswers({ q1: NaN });
    expect(result.valid).toBe(false);
  });

  it('rejects Infinity score values', () => {
    const result = validateScreeningAnswers({ q1: Infinity });
    expect(result.valid).toBe(false);
  });

  it('rejects -Infinity score values', () => {
    const result = validateScreeningAnswers({ q1: -Infinity });
    expect(result.valid).toBe(false);
  });

  it('accepts float scores within valid range', () => {
    const result = validateScreeningAnswers({ q1: 2.5 });
    expect(result.valid).toBe(true);
  });

  it('accepts exactly 0', () => {
    const result = validateScreeningAnswers({ q1: 0 });
    expect(result.valid).toBe(true);
  });

  it('accepts exactly 4', () => {
    const result = validateScreeningAnswers({ q1: 4 });
    expect(result.valid).toBe(true);
  });

  it('rejects 4.01 (just above maximum)', () => {
    const result = validateScreeningAnswers({ q1: 4.01 });
    expect(result.valid).toBe(false);
  });

  it('rejects -0.01 (just below minimum)', () => {
    const result = validateScreeningAnswers({ q1: -0.01 });
    expect(result.valid).toBe(false);
  });
});

/* -------------------------------------------------------------------- */
/* validateScreeningAnswers — structural edge cases                      */
/* -------------------------------------------------------------------- */
describe('validateScreeningAnswers — structural edge cases', () => {
  it('accepts an empty object (no answers)', () => {
    const result = validateScreeningAnswers({});
    expect(result.valid).toBe(true);
  });

  it('rejects null', () => {
    const result = validateScreeningAnswers(null);
    expect(result.valid).toBe(false);
  });

  it('rejects undefined', () => {
    const result = validateScreeningAnswers(undefined);
    expect(result.valid).toBe(false);
  });

  it('rejects a plain number', () => {
    const result = validateScreeningAnswers(42);
    expect(result.valid).toBe(false);
  });

  it('rejects a string', () => {
    const result = validateScreeningAnswers('answers');
    expect(result.valid).toBe(false);
  });
});

/* -------------------------------------------------------------------- */
/* validateMessage — boundary and special character tests                */
/* -------------------------------------------------------------------- */
describe('validateMessage — edge cases', () => {
  it('accepts a message with leading/trailing whitespace and content', () => {
    const result = validateMessage('  hello  ');
    expect(result.valid).toBe(true);
  });

  it('accepts a message at exactly 5000 characters', () => {
    const result = validateMessage('a'.repeat(5000));
    expect(result.valid).toBe(true);
  });

  it('rejects a message at 5001 characters', () => {
    const result = validateMessage('a'.repeat(5001));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('5000');
  });

  it('rejects tab-and-newline-only message as empty', () => {
    const result = validateMessage('\t\n  \t');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('accepts emoji characters', () => {
    const result = validateMessage('I feel 😊 today');
    expect(result.valid).toBe(true);
  });

  it('rejects non-string values', () => {
    expect(validateMessage(123).valid).toBe(false);
    expect(validateMessage(null).valid).toBe(false);
    expect(validateMessage(undefined).valid).toBe(false);
  });
});

/* -------------------------------------------------------------------- */
/* validateThreadId — boundary and type tests                            */
/* -------------------------------------------------------------------- */
describe('validateThreadId — edge cases', () => {
  it('accepts a single-character thread ID', () => {
    expect(validateThreadId('x')).toBe(true);
  });

  it('accepts a 256-character thread ID (max boundary)', () => {
    expect(validateThreadId('a'.repeat(256))).toBe(true);
  });

  it('rejects a 257-character thread ID (over boundary)', () => {
    expect(validateThreadId('a'.repeat(257))).toBe(false);
  });

  it('rejects numeric types', () => {
    expect(validateThreadId(42)).toBe(false);
  });

  it('rejects null', () => {
    expect(validateThreadId(null)).toBe(false);
  });

  it('rejects boolean types', () => {
    expect(validateThreadId(true)).toBe(false);
  });
});
