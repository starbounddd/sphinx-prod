'use client';

import type { JSX, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  variant: 'ai' | 'user';
  children: ReactNode;
  className?: string;
  /** Timestamp text to render below the bubble (e.g. "2:35 PM") */
  timestamp?: string;
}

/**
 * Chat message bubble component.
 *
 * AI  messages: white card with border, rounded-2xl with small bottom-left corner
 * User messages: teal primary background, rounded-2xl with small bottom-right corner
 */
export function ChatMessage({
  variant,
  children,
  className,
  timestamp,
}: ChatMessageProps): JSX.Element {
  const isAI = variant === 'ai';

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          'px-4 py-3 text-sm leading-relaxed',
          isAI
            ? 'rounded-2xl rounded-bl-sm border border-gray-200 bg-white text-foreground shadow-[0_2px_8px_rgba(41,37,36,0.03)]'
            : 'rounded-2xl rounded-br-sm bg-[#0D9488] text-white',
          className,
        )}
      >
        {children}
      </div>

      {timestamp && (
        <span
          className={cn(
            'text-[11px] text-muted-foreground',
            !isAI && 'text-right',
          )}
        >
          {timestamp}
        </span>
      )}
    </div>
  );
}
