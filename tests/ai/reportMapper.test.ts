import { describe, test, expect } from 'vitest';
import {
  mapAIReportToAssessmentReport,
  impactLabel,
  specificityFromConfidence,
  computeSummaryStats,
  mapDomainToResult,
  mapFindingToInsight,
} from '@/lib/ai/reportMapper';
import type { AIGeneratedReport } from '@/lib/ai/reportSchema';
import type { DomainAssessment, SymptomDomain } from '@/lib/ai/assessmentTypes';

/* ==========================================================================
   Fixtures
   ========================================================================== */

function makeAIReport(overrides?: Partial<AIGeneratedReport>): AIGeneratedReport {
  return {
    chiefComplaint: 'Everything is overwhelming.',
    mainGoal: 'Manage stress and improve focus.',
    analysis: 'The patient shows signs of stress affecting daily life.',
    domains: [
      {
        domain: 'depression',
        label: 'Depression',
        screeningScore: 3,
        functionalImpact: 2,
        control: 1,
        duration: '2 weeks',
        frequency: 2,
        confidence: 2,
        summary: 'Persistent low mood.',
      },
      {
        domain: 'anxiety',
        label: 'Anxiety',
        screeningScore: 2,
        functionalImpact: 1,
        control: 2,
        duration: '4 weeks',
        frequency: 2,
        confidence: 2,
        summary: 'Nervousness in social situations.',
      },
    ],
    findings: [
      {
        icon: 'zap',
        title: 'Elevated stress',
        description: 'Shows chronic stress indicators.',
      },
      {
        icon: 'clock',
        title: 'Duration concern',
        description: 'Symptoms present for weeks.',
      },
    ],
    recommendations: [
      'Consider mindfulness practices.',
      'Follow up in 4 weeks.',
    ],
    ...overrides,
  };
}

function makeDomainAssessments(): Record<string, DomainAssessment> {
  return {
    depression: {
      domain: 'depression' as SymptomDomain,
      screeningScore: 3,
      scoring: {
        functionalImpact: 2,
        control: 1,
        duration: '2 weeks',
        frequency: 2,
        confidence: 2,
      },
      evidenceNotes: ['Low mood', 'Loss of interest'],
      status: 'completed',
      questionsAsked: 3,
    },
    anxiety: {
      domain: 'anxiety' as SymptomDomain,
      screeningScore: 2,
      scoring: {
        functionalImpact: 1,
        control: 2,
        duration: '4 weeks',
        frequency: 2,
        confidence: 2,
      },
      evidenceNotes: ['Social nervousness'],
      status: 'completed',
      questionsAsked: 2,
    },
  };
}

/* ==========================================================================
   impactLabel — maps 0-3 score to human-readable label
   ========================================================================== */

describe('impactLabel', () => {
  test('maps 0 to None', () => {
    expect(impactLabel(0)).toBe('None');
  });

  test('maps 1 to Mild', () => {
    expect(impactLabel(1)).toBe('Mild');
  });

  test('maps 2 to Moderate', () => {
    expect(impactLabel(2)).toBe('Moderate');
  });

  test('maps 3 to High', () => {
    expect(impactLabel(3)).toBe('High');
  });
});

/* ==========================================================================
   specificityFromConfidence — maps 0-3 confidence to specificity label
   ========================================================================== */

describe('specificityFromConfidence', () => {
  test('maps 0 to Low', () => {
    expect(specificityFromConfidence(0)).toBe('Low');
  });

  test('maps 1 to Low', () => {
    expect(specificityFromConfidence(1)).toBe('Low');
  });

  test('maps 2 to Medium', () => {
    expect(specificityFromConfidence(2)).toBe('Medium');
  });

  test('maps 3 to High', () => {
    expect(specificityFromConfidence(3)).toBe('High');
  });
});

/* ==========================================================================
   mapDomainToResult — converts AI domain entry to frontend DomainResult
   ========================================================================== */

describe('mapDomainToResult', () => {
  test('converts a domain with moderate impact', () => {
    const result = mapDomainToResult({
      domain: 'depression',
      label: 'Depression',
      screeningScore: 3,
      functionalImpact: 2,
      control: 1,
      duration: '2 weeks',
      frequency: 2,
      confidence: 2,
      summary: 'Persistent low mood.',
    });

    expect(result).toEqual({
      domain: 'depression',
      label: 'Depression',
      specificity: 'Medium',
      impact: 'Moderate',
      control: 1,
      frequency: 2,
      duration: '2 weeks',
      clinicalNotes: 'Persistent low mood.',
    });
  });

  test('converts a domain with no impact', () => {
    const result = mapDomainToResult({
      domain: 'psychosis',
      label: 'Psychosis',
      screeningScore: 0,
      functionalImpact: 0,
      control: 0,
      duration: '\u2014',
      frequency: 0,
      confidence: 3,
      summary: 'No psychotic symptoms.',
    });

    expect(result.impact).toBe('None');
    expect(result.specificity).toBe('High');
  });
});

/* ==========================================================================
   mapFindingToInsight — converts AI finding to frontend AIInsight
   ========================================================================== */

describe('mapFindingToInsight', () => {
  test('maps zap icon with warning color', () => {
    const result = mapFindingToInsight({
      icon: 'zap',
      title: 'High intensity',
      description: 'Shows high symptom intensity.',
    });

    expect(result.icon).toBe('zap');
    expect(result.title).toBe('High intensity');
    expect(result.body).toBe('Shows high symptom intensity.');
    expect(result.source).toBe('AI assessment analysis');
    expect(result.iconColor).toBe('#D97706');
  });

  test('maps clock icon with teal color', () => {
    const result = mapFindingToInsight({
      icon: 'clock',
      title: 'Duration',
      description: 'Long-standing symptoms.',
    });

    expect(result.iconColor).toBe('#0D9488');
  });

  test('maps activity icon with teal color', () => {
    const result = mapFindingToInsight({
      icon: 'activity',
      title: 'Pattern',
      description: 'Behavioral pattern.',
    });

    expect(result.iconColor).toBe('#0D9488');
  });

  test('maps calendar icon with coral color', () => {
    const result = mapFindingToInsight({
      icon: 'calendar',
      title: 'Recurrence',
      description: 'Recurring pattern.',
    });

    expect(result.iconColor).toBe('#FFB7B2');
  });
});

/* ==========================================================================
   computeSummaryStats — generates summary stat cards
   ========================================================================== */

describe('computeSummaryStats', () => {
  test('produces 4 summary stat cards', () => {
    const stats = computeSummaryStats(makeAIReport());
    expect(stats).toHaveLength(4);
  });

  test('first card is domains flagged count', () => {
    const stats = computeSummaryStats(makeAIReport());
    expect(stats[0].label).toMatch(/domain/i);
    expect(stats[0].value).toBe('2');
  });

  test('second card is highest severity domain', () => {
    const stats = computeSummaryStats(makeAIReport());
    expect(stats[1].label).toMatch(/severity/i);
    expect(stats[1].value).toBe('Depression');
  });

  test('uses domain with highest functionalImpact for severity', () => {
    const report = makeAIReport({
      domains: [
        {
          domain: 'anxiety',
          label: 'Anxiety',
          screeningScore: 4,
          functionalImpact: 3,
          control: 0,
          duration: '6 weeks',
          frequency: 3,
          confidence: 3,
          summary: 'Severe anxiety.',
        },
      ],
    });
    const stats = computeSummaryStats(report);
    expect(stats[1].value).toBe('Anxiety');
  });

  test('handles report with no domains', () => {
    const stats = computeSummaryStats(makeAIReport({ domains: [] }));
    expect(stats[0].value).toBe('0');
    expect(stats[1].value).toBe('N/A');
  });

  test('third card is overall risk level', () => {
    const stats = computeSummaryStats(makeAIReport());
    expect(stats[2].label).toMatch(/risk/i);
  });

  test('fourth card is AI confidence score', () => {
    const stats = computeSummaryStats(makeAIReport());
    expect(stats[3].label).toMatch(/confidence/i);
  });
});

/* ==========================================================================
   mapAIReportToAssessmentReport — full pipeline mapper
   ========================================================================== */

describe('mapAIReportToAssessmentReport', () => {
  test('produces a complete AssessmentReport', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeAIReport(),
      domainAssessments: makeDomainAssessments(),
    });

    expect(result.status).toBe('completed');
    expect(result.chiefComplaint).toBe('Everything is overwhelming.');
    expect(result.analysis).toBe(
      'The patient shows signs of stress affecting daily life.',
    );
    expect(result.domains).toHaveLength(2);
    // 2 findings + 1 recommendations card = 3 insights
    expect(result.insights).toHaveLength(3);
    expect(result.summaryStats).toHaveLength(4);
  });

  test('includes patientName and patientDOB placeholders', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeAIReport(),
      domainAssessments: makeDomainAssessments(),
    });

    // These come from session data, not AI — mapper provides defaults
    expect(result.patientName).toBeDefined();
    expect(result.patientDOB).toBeDefined();
    expect(result.assessmentDate).toBeDefined();
  });

  test('passes patient info when provided', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeAIReport(),
      domainAssessments: makeDomainAssessments(),
      patientName: 'Alex Li',
      patientDOB: '10/17/2001',
    });

    expect(result.patientName).toBe('Alex Li');
    expect(result.patientDOB).toBe('10/17/2001');
  });

  test('generates a unique report id', () => {
    const r1 = mapAIReportToAssessmentReport({
      aiReport: makeAIReport(),
      domainAssessments: makeDomainAssessments(),
    });
    const r2 = mapAIReportToAssessmentReport({
      aiReport: makeAIReport(),
      domainAssessments: makeDomainAssessments(),
    });

    expect(r1.id).toBeDefined();
    expect(r1.id).not.toBe(r2.id);
  });

  test('maps domains in the correct order', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeAIReport(),
      domainAssessments: makeDomainAssessments(),
    });

    expect(result.domains[0].domain).toBe('depression');
    expect(result.domains[1].domain).toBe('anxiety');
  });

  test('maps findings to insights', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeAIReport(),
      domainAssessments: makeDomainAssessments(),
    });

    expect(result.insights[0].title).toBe('Elevated stress');
    expect(result.insights[1].title).toBe('Duration concern');
  });

  test('adds recommendations as a final insight if present', () => {
    const report = makeAIReport({
      recommendations: ['See a therapist.', 'Practice breathing.'],
    });
    const result = mapAIReportToAssessmentReport({
      aiReport: report,
      domainAssessments: makeDomainAssessments(),
    });

    const recsInsight = result.insights.find(
      (i) => i.title === 'Recommended Next Steps',
    );
    expect(recsInsight).toBeDefined();
    expect(recsInsight!.body).toContain('See a therapist.');
    expect(recsInsight!.body).toContain('Practice breathing.');
  });

  test('omits recommendations insight when array is empty', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeAIReport({ recommendations: [] }),
      domainAssessments: makeDomainAssessments(),
    });

    const recsInsight = result.insights.find(
      (i) => i.title === 'Recommended Next Steps',
    );
    expect(recsInsight).toBeUndefined();
  });
});
