/**
 * Database service for AI Assessment data persistence.
 *
 * All assessment data is stored in sphinx-data (Supabase PostgreSQL).
 * userId references auth.users.id in sphinx-auth (cross-database).
 */

import { prisma } from './prisma';
import type {
  AssessmentSession,
  ScreeningResponse,
  ChatMessage,
  DomainAssessment as PrismaDomainAssessment,
  AssessmentReport,
  SafetyEvent,
  SymptomDomain,
  AssessmentStatus,
  DomainStatus,
  MessageRole,
  SafetyEventType,
} from '@prisma/client';
import type { AIGeneratedReport } from '@/lib/ai/reportSchema';
import type {
  ScreeningResult,
  DomainAssessment,
  SymptomDomain as AppSymptomDomain,
} from '@/lib/ai/assessmentTypes';

/* ==========================================================================
   Types
   ========================================================================== */

export interface CreateSessionInput {
  threadId: string;
  userId?: string;
  flaggedDomains: AppSymptomDomain[];
  screeningResults: ScreeningResult[];
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

/* ==========================================================================
   Session Operations
   ========================================================================== */

/**
 * Create a new assessment session with screening responses.
 */
export async function createAssessmentSession(
  input: CreateSessionInput
): Promise<AssessmentSession> {
  const { threadId, userId, flaggedDomains, screeningResults } = input;

  // Create session with screening responses and initial domain assessments
  const session = await prisma.assessmentSession.create({
    data: {
      threadId,
      userId,
      flaggedDomains: flaggedDomains as SymptomDomain[],
      status: 'in_progress',
      // Create screening responses
      screeningResponses: {
        create: screeningResults.map((r) => ({
          questionId: r.questionId,
          domain: r.domain as SymptomDomain,
          score: r.score,
          questionText: r.questionText,
        })),
      },
      // Create initial domain assessments for flagged domains
      domainAssessments: {
        create: flaggedDomains.map((domain, index) => ({
          domain: domain as SymptomDomain,
          status: index === 0 ? 'in_progress' : 'pending',
          screeningScore: calculateDomainScreeningScore(screeningResults, domain),
        })),
      },
    },
  });

  return session;
}

/**
 * Get assessment session by thread ID.
 */
export async function getSessionByThreadId(
  threadId: string
): Promise<AssessmentSession | null> {
  return prisma.assessmentSession.findUnique({
    where: { threadId },
  });
}

/**
 * Get full session with all related data.
 */
export async function getFullSession(sessionId: string) {
  return prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      screeningResponses: true,
      chatMessages: { orderBy: { sequence: 'asc' } },
      domainAssessments: true,
      report: true,
      safetyEvents: true,
    },
  });
}

/**
 * Complete an assessment session.
 */
export async function completeSession(
  input: CompleteSessionInput
): Promise<AssessmentSession> {
  const { sessionId, chiefComplaint, totalQuestions, isEarlyTermination } = input;

  return prisma.assessmentSession.update({
    where: { id: sessionId },
    data: {
      status: 'completed',
      endedAt: new Date(),
      chiefComplaint,
      totalQuestions,
      isEarlyTermination: isEarlyTermination ?? false,
    },
  });
}

/**
 * Mark session as abandoned (user left without completing).
 */
export async function abandonSession(sessionId: string): Promise<AssessmentSession> {
  return prisma.assessmentSession.update({
    where: { id: sessionId },
    data: {
      status: 'abandoned',
      endedAt: new Date(),
    },
  });
}

/* ==========================================================================
   Chat Message Operations
   ========================================================================== */

/**
 * Save a chat message.
 */
export async function saveMessage(input: SaveMessageInput): Promise<ChatMessage> {
  const { sessionId, role, content, sequence, quickReplies } = input;

  return prisma.chatMessage.create({
    data: {
      sessionId,
      role: role as MessageRole,
      content,
      sequence,
      quickReplies: quickReplies ?? [],
    },
  });
}

/**
 * Save multiple messages in a batch.
 */
export async function saveMessages(
  messages: SaveMessageInput[]
): Promise<{ count: number }> {
  return prisma.chatMessage.createMany({
    data: messages.map((m) => ({
      sessionId: m.sessionId,
      role: m.role as MessageRole,
      content: m.content,
      sequence: m.sequence,
      quickReplies: m.quickReplies ?? [],
    })),
  });
}

/**
 * Get messages for a session.
 */
export async function getSessionMessages(
  sessionId: string
): Promise<ChatMessage[]> {
  return prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { sequence: 'asc' },
  });
}

/**
 * Get the latest message sequence number for a session.
 */
export async function getLatestMessageSequence(sessionId: string): Promise<number> {
  const lastMessage = await prisma.chatMessage.findFirst({
    where: { sessionId },
    orderBy: { sequence: 'desc' },
    select: { sequence: true },
  });
  return lastMessage?.sequence ?? 0;
}

/* ==========================================================================
   Domain Assessment Operations
   ========================================================================== */

/**
 * Update or create a domain assessment.
 */
export async function upsertDomainAssessment(
  input: UpdateDomainAssessmentInput
): Promise<PrismaDomainAssessment> {
  const { sessionId, domain, ...data } = input;

  return prisma.domainAssessment.upsert({
    where: {
      sessionId_domain: { sessionId, domain: domain as SymptomDomain },
    },
    update: {
      ...(data.status && { status: data.status as DomainStatus }),
      ...(data.screeningScore !== undefined && { screeningScore: data.screeningScore }),
      ...(data.functionalImpact !== undefined && { functionalImpact: data.functionalImpact }),
      ...(data.control !== undefined && { control: data.control }),
      ...(data.frequency !== undefined && { frequency: data.frequency }),
      ...(data.confidence !== undefined && { confidence: data.confidence }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.evidenceNotes && { evidenceNotes: data.evidenceNotes }),
      ...(data.questionsAsked !== undefined && { questionsAsked: data.questionsAsked }),
      ...(data.dimensionsCovered && { dimensionsCovered: data.dimensionsCovered }),
    },
    create: {
      sessionId,
      domain: domain as SymptomDomain,
      status: (data.status ?? 'pending') as DomainStatus,
      screeningScore: data.screeningScore ?? 0,
      functionalImpact: data.functionalImpact ?? 0,
      control: data.control ?? 0,
      frequency: data.frequency ?? 0,
      confidence: data.confidence ?? 0,
      duration: data.duration ?? '',
      evidenceNotes: data.evidenceNotes ?? [],
      questionsAsked: data.questionsAsked ?? 0,
      dimensionsCovered: data.dimensionsCovered ?? [],
    },
  });
}

/**
 * Batch update domain assessments.
 */
export async function updateDomainAssessments(
  sessionId: string,
  assessments: Record<string, DomainAssessment>
): Promise<void> {
  const updates = Object.entries(assessments).map(([domain, assessment]) =>
    upsertDomainAssessment({
      sessionId,
      domain: domain as AppSymptomDomain,
      status: assessment.status,
      screeningScore: assessment.screeningScore,
      functionalImpact: assessment.scoring.functionalImpact,
      control: assessment.scoring.control,
      frequency: assessment.scoring.frequency,
      confidence: assessment.scoring.confidence,
      duration: assessment.scoring.duration,
      evidenceNotes: assessment.evidenceNotes,
      questionsAsked: assessment.questionsAsked,
    })
  );

  await Promise.all(updates);
}

/**
 * Get domain assessments for a session.
 */
export async function getSessionDomainAssessments(
  sessionId: string
): Promise<PrismaDomainAssessment[]> {
  return prisma.domainAssessment.findMany({
    where: { sessionId },
  });
}

/* ==========================================================================
   Report Operations
   ========================================================================== */

/**
 * Save the AI-generated assessment report.
 */
export async function saveAssessmentReport(
  input: SaveReportInput
): Promise<AssessmentReport> {
  const { sessionId, report } = input;

  return prisma.assessmentReport.create({
    data: {
      sessionId,
      chiefComplaint: report.chiefComplaint,
      mainGoal: report.mainGoal,
      analysis: report.analysis,
      domains: JSON.parse(JSON.stringify(report.domains)),
      findings: JSON.parse(JSON.stringify(report.findings)),
      recommendations: report.recommendations,
      culturalBackground: report.culturalBackground,
      summary: report.summary,
    },
  });
}

/**
 * Get report for a session.
 */
export async function getSessionReport(
  sessionId: string
): Promise<AssessmentReport | null> {
  return prisma.assessmentReport.findUnique({
    where: { sessionId },
  });
}

/* ==========================================================================
   Safety Event Operations
   ========================================================================== */

/**
 * Record a safety event.
 */
export async function saveSafetyEvent(
  input: SaveSafetyEventInput
): Promise<SafetyEvent> {
  const { sessionId, eventType, severity, details, triggeredBy } = input;

  return prisma.safetyEvent.create({
    data: {
      sessionId,
      eventType: eventType as SafetyEventType,
      severity,
      details,
      triggeredBy,
    },
  });
}

/**
 * Get safety events for a session.
 */
export async function getSessionSafetyEvents(
  sessionId: string
): Promise<SafetyEvent[]> {
  return prisma.safetyEvent.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Mark a safety event as notified.
 */
export async function markSafetyEventNotified(
  eventId: string
): Promise<SafetyEvent> {
  return prisma.safetyEvent.update({
    where: { id: eventId },
    data: { notifiedAt: new Date() },
  });
}

/* ==========================================================================
   User Session Queries
   ========================================================================== */

/**
 * Get all sessions for a user.
 */
export async function getUserSessions(
  userId: string,
  options?: { limit?: number; status?: AssessmentStatus }
): Promise<AssessmentSession[]> {
  return prisma.assessmentSession.findMany({
    where: {
      userId,
      ...(options?.status && { status: options.status }),
    },
    orderBy: { startedAt: 'desc' },
    take: options?.limit,
  });
}

/**
 * Get user's latest session.
 */
export async function getUserLatestSession(
  userId: string
): Promise<AssessmentSession | null> {
  return prisma.assessmentSession.findFirst({
    where: { userId },
    orderBy: { startedAt: 'desc' },
  });
}

/* ==========================================================================
   Helpers
   ========================================================================== */

function calculateDomainScreeningScore(
  screeningResults: ScreeningResult[],
  domain: AppSymptomDomain
): number {
  const domainResults = screeningResults.filter((r) => r.domain === domain);
  if (domainResults.length === 0) return 0;

  const sum = domainResults.reduce((acc, r) => acc + r.score, 0);
  return sum / domainResults.length;
}
