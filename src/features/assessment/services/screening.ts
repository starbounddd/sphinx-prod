/**
 * User screening result persistence operations.
 */

import { prisma } from '@/lib/db/prisma';
import type { SymptomDomain } from '@prisma/client';
import type { UpsertScreeningInput } from './types';

/**
 * Upsert user's screening result (overwrites previous).
 */
export async function upsertUserScreening(
  input: UpsertScreeningInput
): Promise<{ id: string }> {
  const { userId, answers, domainScores, flaggedDomains } = input;

  const result = await prisma.userScreeningResult.upsert({
    where: { userId },
    update: {
      answers,
      domainScores,
      flaggedDomains: flaggedDomains as SymptomDomain[],
    },
    create: {
      userId,
      answers,
      domainScores,
      flaggedDomains: flaggedDomains as SymptomDomain[],
    },
    select: { id: true },
  });

  return result;
}

/**
 * Get user's latest screening result.
 */
export async function getUserScreening(userId: string) {
  return prisma.userScreeningResult.findUnique({
    where: { userId },
  });
}
