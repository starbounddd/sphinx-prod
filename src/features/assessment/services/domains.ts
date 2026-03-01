/**
 * Domain assessment persistence operations for AI Assessment.
 */

import { prisma } from '@/lib/db/prisma';
import type {
  DomainAssessment as PrismaDomainAssessment,
  SymptomDomain,
  DomainStatus,
} from '@prisma/client';
import type { UpdateDomainAssessmentInput } from './types';
import type {
  DomainAssessment,
  SymptomDomain as AppSymptomDomain,
} from '../schema/types';

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
