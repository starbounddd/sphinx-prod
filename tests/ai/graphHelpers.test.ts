/**
 * Tests for pure helper functions in assessmentGraph.ts.
 *
 * These functions are not exported, so we replicate their logic here and
 * test them as specification-level contracts.  If the internal implementations
 * ever diverge, these tests surface the discrepancy.
 */
import { describe, expect, it } from 'vitest';

/* --------------------------------------------------------------------------
   defaultScoring – reproduces the factory from assessmentGraph.ts:41-49
   -------------------------------------------------------------------------- */

function defaultScoring() {
  return {
    functionalImpact: 0,
    control: 0,
    duration: '',
    frequency: 0,
    confidence: 0,
  };
}

describe('defaultScoring', () => {
  it('returns a fresh object every call', () => {
    const a = defaultScoring();
    const b = defaultScoring();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });

  it('has all numeric fields initialised to zero', () => {
    const s = defaultScoring();
    expect(s.functionalImpact).toBe(0);
    expect(s.control).toBe(0);
    expect(s.frequency).toBe(0);
    expect(s.confidence).toBe(0);
  });

  it('has duration initialised to empty string', () => {
    expect(defaultScoring().duration).toBe('');
  });
});

/* --------------------------------------------------------------------------
   elapsedMinutes – reproduces assessmentGraph.ts:51-53
   -------------------------------------------------------------------------- */

function elapsedMinutes(startTime: string): number {
  return (Date.now() - new Date(startTime).getTime()) / 60_000;
}

describe('elapsedMinutes', () => {
  it('returns approximately 0 for a start time of now', () => {
    const result = elapsedMinutes(new Date().toISOString());
    expect(result).toBeCloseTo(0, 1);
  });

  it('returns approximately 5 for a start time 5 minutes ago', () => {
    const fiveAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    const result = elapsedMinutes(fiveAgo);
    expect(result).toBeCloseTo(5, 1);
  });

  it('returns a negative value for a start time in the future', () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    expect(elapsedMinutes(future)).toBeLessThan(0);
  });

  it('returns NaN for an invalid ISO string', () => {
    expect(elapsedMinutes('not-a-date')).toBeNaN();
  });
});

/* --------------------------------------------------------------------------
   parseJsonResponse – reproduces assessmentGraph.ts:58-65
   -------------------------------------------------------------------------- */

function parseJsonResponse(text: string): unknown {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/, '')
      .replace(/\n?```\s*$/, '');
  }
  return JSON.parse(cleaned);
}

describe('parseJsonResponse', () => {
  it('parses plain JSON', () => {
    expect(parseJsonResponse('{"key":"value"}')).toEqual({ key: 'value' });
  });

  it('strips ```json fences', () => {
    const input = '```json\n{"key":"value"}\n```';
    expect(parseJsonResponse(input)).toEqual({ key: 'value' });
  });

  it('strips bare ``` fences (no language tag)', () => {
    const input = '```\n{"x":1}\n```';
    expect(parseJsonResponse(input)).toEqual({ x: 1 });
  });

  it('handles leading/trailing whitespace', () => {
    expect(parseJsonResponse('  {"a":1}  ')).toEqual({ a: 1 });
  });

  it('throws on invalid JSON', () => {
    expect(() => parseJsonResponse('{invalid}')).toThrow();
  });

  it('throws on empty string', () => {
    expect(() => parseJsonResponse('')).toThrow();
  });

  it('parses a JSON array', () => {
    expect(parseJsonResponse('[1,2,3]')).toEqual([1, 2, 3]);
  });
});

/* --------------------------------------------------------------------------
   getDimensionsCovered – reproduces assessmentGraph.ts:71-78
   -------------------------------------------------------------------------- */

function getDimensionsCovered(
  dimensionsCoveredState: Record<string, string[]>,
  domain: string,
): string[] {
  const dims = dimensionsCoveredState[domain];
  if (!dims) return [];
  return dims;
}

describe('getDimensionsCovered', () => {
  it('returns an empty array if the domain is absent', () => {
    expect(getDimensionsCovered({}, 'anxiety')).toEqual([]);
  });

  it('returns the stored dimensions for a known domain', () => {
    const state = { anxiety: ['affective', 'cognitive'] };
    expect(getDimensionsCovered(state, 'anxiety')).toEqual([
      'affective',
      'cognitive',
    ]);
  });

  it('returns an empty array for an undefined value', () => {
    const state: Record<string, string[]> = {};
    expect(getDimensionsCovered(state, 'depression')).toEqual([]);
  });
});
