'use client';

import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { ChatMessage } from '@/components/ui/chat';
import type { ChatMessage as ChatMessageType } from '../types';
import { cn } from '@/lib/utils';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  className?: string;
}

/**
 * Vertical chat message list.
 *
 * AI messages:  left-aligned with teal bot avatar + white card bubble + timestamp
 * User messages: right-aligned teal bubble + timestamp
 *
 * The list is flex with justify-end so messages anchor to the bottom.
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

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

  return (
    <div
      className={cn(
        'flex flex-1 flex-col justify-end gap-5 overflow-y-auto px-8 py-6',
        className,
      )}
    >
      {messages.map((message) => {
        const isAI = message.role === 'ai';
        const time = formatTime(message.timestamp);

        return isAI ? (
          /* AI message — left aligned with avatar */
          <div key={message.id} className="flex items-start gap-3">
            {/* Teal avatar circle */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0D9488]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <ChatMessage variant="ai" timestamp={time} className="max-w-[420px]">
              {message.content}
            </ChatMessage>
          </div>
        ) : (
          /* User message — right aligned */
          <div key={message.id} className="flex justify-end">
            <ChatMessage variant="user" timestamp={time} className="max-w-[340px]">
              {message.content}
            </ChatMessage>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
