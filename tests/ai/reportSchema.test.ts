// tests/ai/reportSchema.test.ts
import { describe, it, expect } from 'vitest';
import { validateAIReport } from '@/features/assessment/schema/report-schema';
import type { AIGeneratedReport } from '@/features/assessment/schema/report-schema';

function makeValidReport(): AIGeneratedReport {
  return {
    chiefComplaint: 'Persistent anxiety and trouble sleeping',
    mainGoal: 'Better manage daily anxiety',
    analysis: 'The individual presents with moderate anxiety impacting daily functioning.',
    domains: [
      {
        domain: 'anxiety',
        label: 'Anxiety',
        screeningScore: 3,
        functionalImpact: 2,
        control: 1,
        duration: '6 months',
        frequency: 2,
        confidence: 2,
        summary: 'Moderate anxiety with avoidance behaviors.',
      },
    ],
    findings: [
      {
        icon: 'zap',
        title: 'Elevated anxiety with avoidance',
        description: 'The individual reports significant anxiety.',
      },
    ],
    recommendations: ['Consider CBT therapy', 'Practice mindfulness'],
  };
}

describe('validateAIReport', () => {
  it('accepts a valid complete report', () => {
    const result = validateAIReport(makeValidReport());
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.report.chiefComplaint).toBe('Persistent anxiety and trouble sleeping');
    }
  });

  it('accepts optional culturalBackground and summary', () => {
    const report = { ...makeValidReport(), culturalBackground: 'East Asian background', summary: 'Anxiety flagged' };
    const result = validateAIReport(report);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.report.culturalBackground).toBe('East Asian background');
      expect(result.report.summary).toBe('Anxiety flagged');
    }
  });

  it('rejects null input', () => {
    expect(validateAIReport(null).valid).toBe(false);
  });

  it('rejects non-object input', () => {
    expect(validateAIReport('string').valid).toBe(false);
  });

  it('rejects missing chiefComplaint', () => {
    const report = makeValidReport();
    delete (report as any).chiefComplaint;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects missing mainGoal', () => {
    const report = makeValidReport();
    delete (report as any).mainGoal;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects missing analysis', () => {
    const report = makeValidReport();
    delete (report as any).analysis;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects non-array domains', () => {
    const report = { ...makeValidReport(), domains: 'not-array' };
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects domain with NaN screeningScore', () => {
    const report = makeValidReport();
    report.domains[0].screeningScore = NaN;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects domain with Infinity functionalImpact', () => {
    const report = makeValidReport();
    report.domains[0].functionalImpact = Infinity;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects domain with out-of-range screeningScore (>4)', () => {
    const report = makeValidReport();
    report.domains[0].screeningScore = 5;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects domain with out-of-range functionalImpact (>3)', () => {
    const report = makeValidReport();
    report.domains[0].functionalImpact = 4;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects invalid finding icon', () => {
    const report = makeValidReport();
    (report.findings[0] as any).icon = 'invalid-icon';
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('accepts all valid icons: zap, clock, activity, calendar', () => {
    for (const icon of ['zap', 'clock', 'activity', 'calendar']) {
      const report = makeValidReport();
      report.findings[0].icon = icon as any;
      expect(validateAIReport(report).valid).toBe(true);
    }
  });

  it('rejects non-string recommendation entries', () => {
    const report = makeValidReport();
    (report as any).recommendations = [123];
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects non-string culturalBackground', () => {
    const report = { ...makeValidReport(), culturalBackground: 123 };
    expect(validateAIReport(report).valid).toBe(false);
  });
});
