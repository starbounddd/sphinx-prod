import { describe, test, expect } from 'vitest';
import {
  validateAIReport,
  type AIGeneratedReport,
  type AIReportDomain,
  type AIReportFinding,
} from '@/lib/ai/reportSchema';

/* ==========================================================================
   Fixtures
   ========================================================================== */

function validDomain(overrides?: Partial<AIReportDomain>): AIReportDomain {
  return {
    domain: 'depression',
    label: 'Depression',
    screeningScore: 3,
    functionalImpact: 2,
    control: 1,
    duration: '2 weeks',
    frequency: 2,
    confidence: 2,
    summary: 'Persistent low mood affecting daily activities.',
    ...overrides,
  };
}

function validFinding(overrides?: Partial<AIReportFinding>): AIReportFinding {
  return {
    icon: 'zap',
    title: 'Elevated stress',
    description: 'Shows signs of chronic stress impacting daily life.',
    ...overrides,
  };
}

function validReport(overrides?: Partial<AIGeneratedReport>): AIGeneratedReport {
  return {
    chiefComplaint: 'I feel overwhelmed and can\'t concentrate.',
    mainGoal: 'To manage stress and improve focus.',
    analysis: 'The patient shows signs of stress and anxiety affecting concentration.',
    domains: [validDomain()],
    findings: [validFinding()],
    recommendations: ['Consider mindfulness practices.'],
    ...overrides,
  };
}

/* ==========================================================================
   validateAIReport — valid inputs
   ========================================================================== */

describe('validateAIReport', () => {
  test('accepts a valid complete report', () => {
    const result = validateAIReport(validReport());
    expect(result.valid).toBe(true);
    expect(result.report).toBeDefined();
    expect(result.report!.chiefComplaint).toBe(
      'I feel overwhelmed and can\'t concentrate.',
    );
  });

  test('accepts report with multiple domains', () => {
    const report = validReport({
      domains: [
        validDomain({ domain: 'depression', label: 'Depression' }),
        validDomain({ domain: 'anxiety', label: 'Anxiety', functionalImpact: 3 }),
      ],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(true);
    expect(result.report!.domains).toHaveLength(2);
  });

  test('accepts report with multiple findings', () => {
    const report = validReport({
      findings: [
        validFinding({ icon: 'zap', title: 'High intensity' }),
        validFinding({ icon: 'clock', title: 'Long duration' }),
        validFinding({ icon: 'activity', title: 'Behavioral pattern' }),
      ],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(true);
    expect(result.report!.findings).toHaveLength(3);
  });

  test('accepts report with empty recommendations array', () => {
    const result = validateAIReport(validReport({ recommendations: [] }));
    expect(result.valid).toBe(true);
  });

  test('accepts report with culturalBackground field', () => {
    const report = validReport({
      culturalBackground: 'Second generation Asian American with strong familial influence.',
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(true);
    expect(result.report!.culturalBackground).toBe(
      'Second generation Asian American with strong familial influence.',
    );
  });

  test('accepts report with summary field', () => {
    const report = validReport({
      summary: 'Depression and memory appear to be significant domains.',
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(true);
    expect(result.report!.summary).toBe(
      'Depression and memory appear to be significant domains.',
    );
  });

  /* ========================================================================
     validateAIReport — invalid inputs
     ======================================================================== */

  test('rejects null', () => {
    const result = validateAIReport(null);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/not an object/i);
  });

  test('rejects undefined', () => {
    const result = validateAIReport(undefined);
    expect(result.valid).toBe(false);
  });

  test('rejects string', () => {
    const result = validateAIReport('not a report');
    expect(result.valid).toBe(false);
  });

  test('rejects report missing chiefComplaint', () => {
    const { chiefComplaint, ...rest } = validReport();
    const result = validateAIReport(rest);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/chiefComplaint/);
  });

  test('rejects report missing domains', () => {
    const { domains, ...rest } = validReport();
    const result = validateAIReport(rest);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/domains/);
  });

  test('rejects report with non-array domains', () => {
    const result = validateAIReport(validReport({ domains: 'bad' as any }));
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/domains/);
  });

  test('rejects domain with out-of-range functionalImpact', () => {
    const report = validReport({
      domains: [validDomain({ functionalImpact: 5 })],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/functionalImpact/);
  });

  test('rejects domain with out-of-range control', () => {
    const report = validReport({
      domains: [validDomain({ control: -1 })],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/control/);
  });

  test('rejects domain with out-of-range frequency', () => {
    const report = validReport({
      domains: [validDomain({ frequency: 4 })],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/frequency/);
  });

  test('rejects domain with out-of-range confidence', () => {
    const report = validReport({
      domains: [validDomain({ confidence: -2 })],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/confidence/);
  });

  test('rejects domain with invalid icon in finding', () => {
    const report = validReport({
      findings: [validFinding({ icon: 'invalid' as any })],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/icon/);
  });

  test('rejects recommendations with non-string entries', () => {
    const result = validateAIReport(
      validReport({ recommendations: [42 as any] }),
    );
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/recommendations/);
  });

  /* ========================================================================
     validateAIReport — edge cases (healthcare safety)
     ======================================================================== */

  test('accepts domain with zero scores (no symptoms)', () => {
    const report = validReport({
      domains: [
        validDomain({
          functionalImpact: 0,
          control: 0,
          frequency: 0,
          confidence: 0,
          screeningScore: 0,
        }),
      ],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(true);
  });

  test('accepts domain with max valid scores', () => {
    const report = validReport({
      domains: [
        validDomain({
          functionalImpact: 3,
          control: 3,
          frequency: 3,
          confidence: 3,
          screeningScore: 4,
        }),
      ],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(true);
  });

  test('rejects domain with NaN functionalImpact', () => {
    const report = validReport({
      domains: [validDomain({ functionalImpact: NaN })],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(false);
  });

  test('rejects domain with Infinity screeningScore', () => {
    const report = validReport({
      domains: [validDomain({ screeningScore: Infinity })],
    });
    const result = validateAIReport(report);
    expect(result.valid).toBe(false);
  });
});
