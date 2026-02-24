'use client';

import { type JSX, useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquareText, Bot } from 'lucide-react';
import type { ChatMessage, AssessmentMetadata } from '../types';
import { cn } from '@/lib/utils';

interface ChatTranscriptSectionProps {
  messages: ChatMessage[];
  metadata?: AssessmentMetadata;
  className?: string;
}

function formatTime(timestamp: Date | string): string {
  const d = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatTranscriptSection({
  messages,
  metadata,
  className,
}: ChatTranscriptSectionProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate duration if metadata available
  let durationText = '';
  if (metadata?.completedAt && messages.length > 0) {
    const first = new Date(messages[0].timestamp);
    const last = new Date(metadata.completedAt);
    const mins = Math.round((last.getTime() - first.getTime()) / 60000);
    durationText = `${mins} min`;
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200 bg-white shadow-[0_2px_8px_rgba(41,37,36,0.03)]',
        className
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D9488]/10">
            <MessageSquareText className="h-5 w-5 text-[#0D9488]" />
          </div>
          <div className="text-left">
            <h3 className="text-[15px] font-semibold text-[#292524]">
              Assessment Conversation Transcript
            </h3>
            <p className="text-[13px] text-[#78716C]">
              {messages.length} messages
              {durationText && <> &middot; Duration: {durationText}</>}
              {metadata?.totalQuestions != null && (
                <> &middot; {metadata.totalQuestions} follow-up questions</>
              )}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-[#78716C]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#78716C]" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="max-h-[600px] overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar */}
                  {msg.role === 'ai' ? (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D9488]">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#292524]">
                      <span className="text-[11px] font-bold text-white">P</span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed',
                      msg.role === 'ai'
                        ? 'rounded-bl-sm border border-gray-200 bg-white text-[#292524]'
                        : 'rounded-br-sm bg-[#0D9488] text-white'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span
                      className={cn(
                        'mt-1.5 block text-[11px]',
                        msg.role === 'ai' ? 'text-[#78716C]' : 'text-white/70'
                      )}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
