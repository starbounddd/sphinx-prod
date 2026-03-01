/**
 * Session lifecycle operations for AI Assessment.
 */

import { prisma } from '@/lib/db/prisma';
import type { AssessmentSession, SymptomDomain, AssessmentStatus } from '@prisma/client';
import type { CreateSessionInput, CompleteSessionInput } from './types';

/**
 * Create a new assessment session with screening snapshot.
 */
export async function createAssessmentSession(
  input: CreateSessionInput
): Promise<AssessmentSession> {
  const { threadId, userId, flaggedDomains, screeningSnapshot } = input;

  const session = await prisma.assessmentSession.create({
    data: {
      threadId,
      userId,
      flaggedDomains: flaggedDomains as SymptomDomain[],
      screeningSnapshot,
      status: 'in_progress',
      // Create initial domain assessments for flagged domains
      domainAssessments: {
        create: flaggedDomains.map((domain, index) => ({
          domain: domain as SymptomDomain,
          status: index === 0 ? 'in_progress' : 'pending',
          screeningScore: screeningSnapshot[domain] ?? 0,
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
