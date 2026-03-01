/**
 * Safety event persistence operations for AI Assessment.
 */

import { prisma } from '@/lib/db/prisma';
import type { SafetyEvent, SafetyEventType } from '@prisma/client';
import type { SaveSafetyEventInput } from './types';

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
