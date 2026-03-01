/**
 * Typed schema for the AI-generated assessment report.
 *
 * Mirrors the product-spec report template (DSM-5 cross-cutting symptom
 * measure) and the JSON contract defined in promptTemplates.generateReport().
 *
 * The LLM returns unstructured JSON — validateAIReport() validates & narrows
 * that payload into a typed AIGeneratedReport so downstream code never touches
 * `any`.
 */

import type { SymptomDomain } from './assessmentTypes';

/* ==========================================================================
   Finding icon — constrained to the set the prompt allows
   ========================================================================== */

export type ReportFindingIcon = 'zap' | 'clock' | 'activity' | 'calendar';

const VALID_ICONS = new Set<string>(['zap', 'clock', 'activity', 'calendar']);

/* ==========================================================================
   Per-domain report entry (product-spec §Report Template)
   ========================================================================== */

export interface AIReportDomain {
  domain: string;
  label: string;
  /** Average screening score for this domain (0-4) */
  screeningScore: number;
  /** Impact on daily functioning (0 = none, 3 = severe) */
  functionalImpact: number;
  /** Perceived control over symptoms (0 = no control, 3 = good control) */
  control: number;
  /** Qualitative duration description */
  duration: string;
  /** Symptom frequency (0 = rarely, 3 = constant) */
  frequency: number;
  /** Confidence in the data for this domain (0 = low, 3 = high) */
  confidence: number;
  /** Brief narrative summary of findings for this domain */
  summary: string;
}

/* ==========================================================================
   Finding entry (product-spec §Findings)
   ========================================================================== */

export interface AIReportFinding {
  icon: ReportFindingIcon;
  title: string;
  description: string;
}

/* ==========================================================================
   Full AI-generated report (product-spec §Report Template + §Provider Report)
   ========================================================================== */

export interface AIGeneratedReport {
  /** Patient's primary concern in their own words */
  chiefComplaint: string;
  /** What the person is seeking help with */
  mainGoal: string;
  /** Empathetic 2-3 sentence summary — no diagnostic labels */
  analysis: string;
  /** Per-domain structured assessment results */
  domains: AIReportDomain[];
  /** Key findings (strengths + concerns), 3-5 items */
  findings: AIReportFinding[];
  /** Actionable recommendations */
  recommendations: string[];
  /** One-sentence cultural background summary (optional) */
  culturalBackground?: string;
  /** Summary of flagged domains + suicidal ideation note (optional) */
  summary?: string;
}

/* ==========================================================================
   Validation result
   ========================================================================== */

export type AIReportValidation =
  | { valid: true; report: AIGeneratedReport }
  | { valid: false; error: string };

/* ==========================================================================
   Helpers
   ========================================================================== */

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function inRange(v: number, min: number, max: number): boolean {
  return v >= min && v <= max;
}

function validateDomain(d: unknown, idx: number): string | null {
  if (d == null || typeof d !== 'object') {
    return `domains[${idx}] is not an object`;
  }
  const obj = d as Record<string, unknown>;

  if (typeof obj.domain !== 'string') return `domains[${idx}].domain must be a string`;
  if (typeof obj.label !== 'string') return `domains[${idx}].label must be a string`;
  if (typeof obj.summary !== 'string') return `domains[${idx}].summary must be a string`;
  if (typeof obj.duration !== 'string') return `domains[${idx}].duration must be a string`;

  if (!isFiniteNumber(obj.screeningScore) || !inRange(obj.screeningScore, 0, 4)) {
    return `domains[${idx}].screeningScore must be a finite number 0-4`;
  }
  if (!isFiniteNumber(obj.functionalImpact) || !inRange(obj.functionalImpact, 0, 3)) {
    return `domains[${idx}].functionalImpact must be a finite number 0-3`;
  }
  if (!isFiniteNumber(obj.control) || !inRange(obj.control, 0, 3)) {
    return `domains[${idx}].control must be a finite number 0-3`;
  }
  if (!isFiniteNumber(obj.frequency) || !inRange(obj.frequency, 0, 3)) {
    return `domains[${idx}].frequency must be a finite number 0-3`;
  }
  if (!isFiniteNumber(obj.confidence) || !inRange(obj.confidence, 0, 3)) {
    return `domains[${idx}].confidence must be a finite number 0-3`;
  }

  return null;
}

function validateFinding(f: unknown, idx: number): string | null {
  if (f == null || typeof f !== 'object') {
    return `findings[${idx}] is not an object`;
  }
  const obj = f as Record<string, unknown>;

  if (typeof obj.icon !== 'string' || !VALID_ICONS.has(obj.icon)) {
    return `findings[${idx}].icon must be one of: zap, clock, activity, calendar`;
  }
  if (typeof obj.title !== 'string') return `findings[${idx}].title must be a string`;
  if (typeof obj.description !== 'string') return `findings[${idx}].description must be a string`;

  return null;
}

/* ==========================================================================
   validateAIReport
   ========================================================================== */

/**
 * Validate raw LLM output and narrow it to AIGeneratedReport.
 *
 * This is the **only** gateway between untyped AI output and typed report
 * data — nothing downstream should touch `any`.
 */
export function validateAIReport(raw: unknown): AIReportValidation {
  if (raw == null || typeof raw !== 'object') {
    return { valid: false, error: 'Report is not an object' };
  }

  const obj = raw as Record<string, unknown>;

  // Required string fields
  if (typeof obj.chiefComplaint !== 'string') {
    return { valid: false, error: 'chiefComplaint must be a string' };
  }
  if (typeof obj.mainGoal !== 'string') {
    return { valid: false, error: 'mainGoal must be a string' };
  }
  if (typeof obj.analysis !== 'string') {
    return { valid: false, error: 'analysis must be a string' };
  }

  // domains: required array
  if (!Array.isArray(obj.domains)) {
    return { valid: false, error: 'domains must be an array' };
  }
  for (let i = 0; i < obj.domains.length; i++) {
    const err = validateDomain(obj.domains[i], i);
    if (err) return { valid: false, error: err };
  }

  // findings: required array
  if (!Array.isArray(obj.findings)) {
    return { valid: false, error: 'findings must be an array' };
  }
  for (let i = 0; i < obj.findings.length; i++) {
    const err = validateFinding(obj.findings[i], i);
    if (err) return { valid: false, error: err };
  }

  // recommendations: required array of strings
  if (!Array.isArray(obj.recommendations)) {
    return { valid: false, error: 'recommendations must be an array' };
  }
  for (let i = 0; i < obj.recommendations.length; i++) {
    if (typeof obj.recommendations[i] !== 'string') {
      return { valid: false, error: `recommendations[${i}] must be a string` };
    }
  }

  // Optional fields (accept null or undefined as absent)
  if (obj.culturalBackground != null && typeof obj.culturalBackground !== 'string') {
    return { valid: false, error: 'culturalBackground must be a string if present' };
  }
  if (obj.summary != null && typeof obj.summary !== 'string') {
    return { valid: false, error: 'summary must be a string if present' };
  }

  return {
    valid: true,
    report: {
      chiefComplaint: obj.chiefComplaint as string,
      mainGoal: obj.mainGoal as string,
      analysis: obj.analysis as string,
      domains: obj.domains as AIReportDomain[],
      findings: obj.findings as AIReportFinding[],
      recommendations: obj.recommendations as string[],
      ...(obj.culturalBackground != null && {
        culturalBackground: obj.culturalBackground as string,
      }),
      ...(obj.summary != null && {
        summary: obj.summary as string,
      }),
    },
  };
}
