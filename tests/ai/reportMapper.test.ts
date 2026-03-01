// tests/ai/reportMapper.test.ts
import { describe, it, expect } from 'vitest';
import {
  impactLabel,
  specificityFromConfidence,
  mapDomainToResult,
  mapFindingToInsight,
  computeSummaryStats,
  mapAIReportToAssessmentReport,
} from '@/lib/ai/reportMapper';
import type { AIGeneratedReport, AIReportDomain, AIReportFinding } from '@/lib/ai/reportSchema';

function makeDomain(overrides: Partial<AIReportDomain> = {}): AIReportDomain {
  return {
    domain: 'anxiety',
    label: 'Anxiety',
    screeningScore: 3,
    functionalImpact: 2,
    control: 1,
    duration: '3 months',
    frequency: 2,
    confidence: 2,
    summary: 'Moderate anxiety.',
    ...overrides,
  };
}

function makeReport(overrides: Partial<AIGeneratedReport> = {}): AIGeneratedReport {
  return {
    chiefComplaint: 'Feeling anxious',
    mainGoal: 'Manage anxiety',
    analysis: 'Moderate anxiety impacting daily life.',
    domains: [makeDomain()],
    findings: [{ icon: 'zap', title: 'Elevated anxiety', description: 'Significant anxiety.' }],
    recommendations: ['CBT therapy'],
    ...overrides,
  };
}

describe('impactLabel', () => {
  it('maps 0 -> None', () => expect(impactLabel(0)).toBe('None'));
  it('maps 1 -> Mild', () => expect(impactLabel(1)).toBe('Mild'));
  it('maps 2 -> Moderate', () => expect(impactLabel(2)).toBe('Moderate'));
  it('maps 3 -> High', () => expect(impactLabel(3)).toBe('High'));
  it('defaults unknown to None', () => expect(impactLabel(99)).toBe('None'));
});

describe('specificityFromConfidence', () => {
  it('maps 0 -> Low', () => expect(specificityFromConfidence(0)).toBe('Low'));
  it('maps 1 -> Low', () => expect(specificityFromConfidence(1)).toBe('Low'));
  it('maps 2 -> Medium', () => expect(specificityFromConfidence(2)).toBe('Medium'));
  it('maps 3 -> High', () => expect(specificityFromConfidence(3)).toBe('High'));
});

describe('mapDomainToResult', () => {
  it('converts AIReportDomain to DomainResult', () => {
    const result = mapDomainToResult(makeDomain());
    expect(result.domain).toBe('anxiety');
    expect(result.label).toBe('Anxiety');
    expect(result.specificity).toBe('Medium');
    expect(result.impact).toBe('Moderate');
    expect(result.control).toBe(1);
    expect(result.frequency).toBe(2);
    expect(result.duration).toBe('3 months');
    expect(result.clinicalNotes).toBe('Moderate anxiety.');
  });
});

describe('mapFindingToInsight', () => {
  it('converts AIReportFinding to AIInsight', () => {
    const finding: AIReportFinding = {
      icon: 'zap',
      title: 'Test',
      description: 'Test desc',
    };
    const insight = mapFindingToInsight(finding);
    expect(insight.icon).toBe('zap');
    expect(insight.title).toBe('Test');
    expect(insight.body).toBe('Test desc');
    expect(insight.source).toBe('AI assessment analysis');
    expect(insight.iconColor).toBe('#D97706');
  });

  it('maps all icon colors correctly', () => {
    expect(mapFindingToInsight({ icon: 'zap', title: '', description: '' }).iconColor).toBe('#D97706');
    expect(mapFindingToInsight({ icon: 'clock', title: '', description: '' }).iconColor).toBe('#0D9488');
    expect(mapFindingToInsight({ icon: 'activity', title: '', description: '' }).iconColor).toBe('#0D9488');
    expect(mapFindingToInsight({ icon: 'calendar', title: '', description: '' }).iconColor).toBe('#FFB7B2');
  });
});

describe('computeSummaryStats', () => {
  it('returns 4 summary stat cards', () => {
    const stats = computeSummaryStats(makeReport());
    expect(stats).toHaveLength(4);
  });

  it('first card shows domains count', () => {
    const stats = computeSummaryStats(makeReport({ domains: [makeDomain(), makeDomain({ domain: 'depression', label: 'Depression' })] }));
    expect(stats[0].value).toBe('2');
    expect(stats[0].label).toContain('Domains Flagged');
  });

  it('second card shows highest severity domain', () => {
    const stats = computeSummaryStats(makeReport({
      domains: [
        makeDomain({ label: 'Anxiety', functionalImpact: 1 }),
        makeDomain({ domain: 'depression', label: 'Depression', functionalImpact: 3 }),
      ],
    }));
    expect(stats[1].value).toBe('Depression');
  });

  it('handles empty domains', () => {
    const stats = computeSummaryStats(makeReport({ domains: [] }));
    expect(stats[0].value).toBe('0');
    expect(stats[1].value).toBe('N/A');
  });
});

describe('mapAIReportToAssessmentReport', () => {
  it('maps full report with correct structure', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeReport(),
      domainAssessments: {},
    });
    expect(result.id).toBeTruthy();
    expect(result.status).toBe('completed');
    expect(result.chiefComplaint).toBe('Feeling anxious');
    expect(result.analysis).toBe('Moderate anxiety impacting daily life.');
    expect(result.domains).toHaveLength(1);
    expect(result.summaryStats).toHaveLength(4);
    expect(result.insights).toHaveLength(2);
  });

  it('uses provided patient name', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeReport(),
      domainAssessments: {},
      patientName: 'Jane Doe',
    });
    expect(result.patientName).toBe('Jane Doe');
  });

  it('defaults patientName to Patient', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeReport(),
      domainAssessments: {},
    });
    expect(result.patientName).toBe('Patient');
  });

  it('appends recommendations as insight card', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeReport({ recommendations: ['Rec 1', 'Rec 2'] }),
      domainAssessments: {},
    });
    const recsInsight = result.insights.find((i) => i.title === 'Recommended Next Steps');
    expect(recsInsight).toBeDefined();
    expect(recsInsight!.body).toContain('Rec 1');
    expect(recsInsight!.body).toContain('Rec 2');
  });
});
