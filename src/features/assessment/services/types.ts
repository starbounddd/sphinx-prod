/**
 * Input types for assessment data persistence operations.
 */

import type { AIGeneratedReport } from '../schema/report-schema';
import type {
  DomainAssessment,
  SymptomDomain as AppSymptomDomain,
} from '../schema/types';

export interface CreateSessionInput {
  threadId: string;
  userId?: string;
  flaggedDomains: AppSymptomDomain[];
  screeningSnapshot: Record<string, number>;  // all 13 domain scores
}

export interface SaveMessageInput {
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sequence: number;
  quickReplies?: string[];
}

export interface UpdateDomainAssessmentInput {
  sessionId: string;
  domain: AppSymptomDomain;
  status?: 'pending' | 'in_progress' | 'completed';
  screeningScore?: number;
  functionalImpact?: number;
  control?: number;
  frequency?: number;
  confidence?: number;
  duration?: string;
  evidenceNotes?: string[];
  questionsAsked?: number;
  dimensionsCovered?: string[];
}

export interface SaveReportInput {
  sessionId: string;
  report: AIGeneratedReport;
}

export interface SaveSafetyEventInput {
  sessionId: string;
  eventType: 'suicidal_ideation' | 'self_harm' | 'violence' | 'crisis';
  severity: number;
  details?: string;
  triggeredBy?: string;
}

export interface CompleteSessionInput {
  sessionId: string;
  chiefComplaint?: string;
  totalQuestions: number;
  isEarlyTermination?: boolean;
}

export interface UpsertScreeningInput {
  userId: string;
  answers: Record<string, number>;
  domainScores: Record<string, number>;
  flaggedDomains: AppSymptomDomain[];
}
