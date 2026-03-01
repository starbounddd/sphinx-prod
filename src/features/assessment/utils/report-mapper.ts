/**
 * Maps the AI-generated report (from the LangGraph assessment) to the
 * frontend AssessmentReport type consumed by ClarityReport and its sub-components.
 *
 * Pure functions — no side effects, no I/O.
 */

import type {
  AIGeneratedReport,
  AIReportDomain,
  AIReportFinding,
  ReportFindingIcon,
} from '../schema/report-schema';
import type { DomainAssessment } from '../schema/types';
import type {
  AssessmentReport,
  DomainResult,
  AIInsight,
  SummaryStat,
} from '@/components/assessment/types';

/* ==========================================================================
   Scalar Mappers
   ========================================================================== */

const IMPACT_LABELS: Record<number, 'None' | 'Mild' | 'Moderate' | 'High'> = {
  0: 'None',
  1: 'Mild',
  2: 'Moderate',
  3: 'High',
};

/**
 * Map a 0-3 functionalImpact score to a human-readable label.
 */
export function impactLabel(score: number): 'None' | 'Mild' | 'Moderate' | 'High' {
  return IMPACT_LABELS[score] ?? 'None';
}

/**
 * Map a 0-3 confidence score to a specificity tier.
 *  0-1 → Low, 2 → Medium, 3 → High
 */
export function specificityFromConfidence(confidence: number): 'High' | 'Medium' | 'Low' {
  if (confidence >= 3) return 'High';
  if (confidence >= 2) return 'Medium';
  return 'Low';
}

/* ==========================================================================
   Icon Color Map
   ========================================================================== */

const ICON_COLORS: Record<ReportFindingIcon, string> = {
  zap: '#D97706',      // amber — severity/intensity
  clock: '#0D9488',    // teal — duration
  activity: '#0D9488', // teal — behavioral
  calendar: '#FFB7B2', // coral — frequency
};

/* ==========================================================================
   Domain → DomainResult
   ========================================================================== */

/**
 * Convert an AI report domain entry into the frontend DomainResult shape.
 */
export function mapDomainToResult(d: AIReportDomain): DomainResult {
  return {
    domain: d.domain,
    label: d.label,
    specificity: specificityFromConfidence(d.confidence),
    impact: impactLabel(d.functionalImpact),
    control: d.control,
    frequency: d.frequency,
    duration: d.duration,
    clinicalNotes: d.summary,
  };
}

/* ==========================================================================
   Finding → AIInsight
   ========================================================================== */

/**
 * Convert an AI finding into the frontend AIInsight shape.
 */
export function mapFindingToInsight(f: AIReportFinding): AIInsight {
  return {
    icon: f.icon,
    title: f.title,
    body: f.description,
    source: 'AI assessment analysis',
    iconColor: ICON_COLORS[f.icon] ?? '#0D9488',
  };
}

/* ==========================================================================
   Summary Stats
   ========================================================================== */

function riskLevel(domains: AIReportDomain[]): string {
  if (domains.length === 0) return 'N/A';
  const maxImpact = Math.max(...domains.map((d) => d.functionalImpact));
  if (maxImpact >= 3) return 'High';
  if (maxImpact >= 2) return 'Low-Mod';
  if (maxImpact >= 1) return 'Low';
  return 'Minimal';
}

function avgConfidence(domains: AIReportDomain[]): string {
  if (domains.length === 0) return 'N/A';
  const avg = domains.reduce((s, d) => s + d.confidence, 0) / domains.length;
  return `${Math.round((avg / 3) * 100)}%`;
}

/**
 * Derive the 4 summary stat cards from the AI report.
 */
export function computeSummaryStats(report: AIGeneratedReport): SummaryStat[] {
  const domains = report.domains;

  // Highest severity = domain with highest functionalImpact
  const highestSeverity =
    domains.length > 0
      ? [...domains].sort((a, b) => b.functionalImpact - a.functionalImpact)[0].label
      : 'N/A';

  return [
    {
      icon: 'alert-triangle',
      value: String(domains.length),
      label: 'Domains Flagged out of 13',
      color: '#D97706',
    },
    {
      icon: 'activity',
      value: highestSeverity,
      label: 'Highest Severity Domain',
      color: '#DC2626',
    },
    {
      icon: 'shield-check',
      value: riskLevel(domains),
      label: 'Overall Risk Level',
      color: '#0D9488',
    },
    {
      icon: 'brain',
      value: avgConfidence(domains),
      label: 'AI Confidence Score',
      color: '#0D9488',
    },
  ];
}

/* ==========================================================================
   Full Mapper
   ========================================================================== */

let _idCounter = 0;

interface MapperInput {
  aiReport: AIGeneratedReport;
  domainAssessments: Record<string, DomainAssessment>;
  patientName?: string;
  patientDOB?: string;
}

/**
 * Map the AI-generated report + graph state into the frontend AssessmentReport
 * consumed by ClarityReport.
 */
export function mapAIReportToAssessmentReport(input: MapperInput): AssessmentReport {
  const { aiReport, patientName, patientDOB } = input;

  const insights: AIInsight[] = aiReport.findings.map(mapFindingToInsight);

  // Append recommendations as a single "Next Steps" insight card
  if (aiReport.recommendations.length > 0) {
    insights.push({
      icon: 'clipboard-list',
      title: 'Recommended Next Steps',
      body: aiReport.recommendations.join(' '),
      source: 'AI recommendation \u00b7 Review required',
      iconColor: '#FFB7B2',
    });
  }

  _idCounter++;

  return {
    id: `report-${Date.now()}-${_idCounter}`,
    patientName: patientName ?? 'Patient',
    patientDOB: patientDOB ?? '',
    assessmentDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: 'completed',
    summaryStats: computeSummaryStats(aiReport),
    domains: aiReport.domains.map(mapDomainToResult),
    insights,
    chiefComplaint: aiReport.chiefComplaint,
    analysis: aiReport.analysis,
  };
}
