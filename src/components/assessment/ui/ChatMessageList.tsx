'use client';

import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/components/ui/chat';
import type { ChatMessage as ChatMessageType } from '../types';
import { cn } from '@/lib/utils';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  className?: string;
}

/**
 * Chat messages with 0.5:1.5:2:1.5:0.5 grid layout
 * - Spacer (0.5fr): Left margin
 * - AI column (1.5fr): AI messages
 * - Middle (2fr): Empty space
 * - User column (1.5fr): User messages
 * - Spacer (0.5fr): Right margin
 */
export function ChatMessageList({
  messages,
  className,
}: ChatMessageListProps): JSX.Element {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={cn('flex flex-col gap-4 overflow-y-auto', className)}>
      {messages.map((message) => (
        <div
          key={message.id}
          className="grid grid-cols-[0.5fr_1.5fr_2fr_1.5fr_0.5fr] gap-4"
        >
          {/* Left spacer */}
          <div />

          {/* AI messages column */}
          <div>
            {message.role === 'ai' && (
              <ChatMessage variant="ai">{message.content}</ChatMessage>
            )}
          </div>

          {/* Middle - empty space */}
          <div />

          {/* User messages column */}
          <div>
            {message.role === 'user' && (
              <ChatMessage variant="user">{message.content}</ChatMessage>
            )}
          </div>

          {/* Right spacer */}
          <div />
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
