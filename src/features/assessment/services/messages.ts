/**
 * Chat message persistence operations for AI Assessment.
 */

import { prisma } from '@/lib/db/prisma';
import type { ChatMessage, MessageRole } from '@prisma/client';
import type { SaveMessageInput } from './types';

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
