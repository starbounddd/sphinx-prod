'use client';

import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { ChatMessage } from '@/components/ui/chat';
import type { ChatMessage as ChatMessageType } from '../types';
import { cn } from '@/lib/utils';

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface ChatMessageListProps {
  messages: ChatMessageType[];
  className?: string;
}

function WelcomeSection() {
  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-2xl bg-[#FFB7B208] px-7 py-7 pb-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8EFE815]">
        <Sparkles className="h-7 w-7 text-teal" />
      </div>
      <h2 className="text-center font-[Fraunces] text-[28px] font-medium italic leading-tight tracking-tight text-foreground">
        Let&apos;s explore your assessment further
      </h2>
      <p className="max-w-[520px] text-center text-sm font-body leading-relaxed text-muted-foreground">
        Based on your responses, I&apos;d like to have a friendly conversation
        to better understand your experiences. There&apos;s nothing wrong — this
        is simply about learning how best to support you. Pick a topic below or
        type your own question.
      </p>
    </div>
  );
}

export function ChatMessageList({
  messages,
  className,
}: ChatMessageListProps): JSX.Element {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-5 overflow-y-auto px-14 py-6',
        className,
      )}
      style={{
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #FDFCF8 100%)',
      }}
    >
      <WelcomeSection />

      {/* Divider */}
      <div className="h-px w-full bg-[#E7E5E4]" />

      {messages.map((message) => {
        const isAI = message.role === 'ai';
        const time = formatTime(message.timestamp);

        return isAI ? (
          <div key={message.id} className="flex items-start gap-3">
            <Image
              src="/images/logo/sphinx_wing.png"
              alt="Sphinx"
              width={36}
              height={36}
              className="shrink-0 rounded-full"
            />
            <ChatMessage
              variant="ai"
              timestamp={time}
              className="max-w-[420px]"
            >
              {message.content}
            </ChatMessage>
          </div>
        ) : (
          <div key={message.id} className="flex justify-end">
            <ChatMessage
              variant="user"
              timestamp={time}
              className="max-w-[340px]"
            >
              {message.content}
            </ChatMessage>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
