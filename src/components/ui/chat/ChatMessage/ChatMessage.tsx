'use client';

import type { JSX, ReactNode } from 'react';
import { SlideIn } from '@/components/ui/motion';
import { WordFadeIn } from '@/components/ui/magicui';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  variant: 'ai' | 'user';
  children: ReactNode;
  className?: string;
  /** Enable word-by-word fade-in animation for AI messages (requires string children) */
  animateWords?: boolean;
}

/**
 * Chat message bubble component with entrance animations
 * AI messages: sage background with left slide animation
 * User messages: coral background with right slide animation
 *
 * Set animateWords={true} for word-by-word reveal on AI messages
 */
export function ChatMessage({
  variant,
  children,
  className,
  animateWords = false,
}: ChatMessageProps): JSX.Element {
  const isAI = variant === 'ai';

  // Determine if we should use WordFadeIn animation
  const shouldAnimateWords =
    animateWords && isAI && typeof children === 'string';

  return (
    <SlideIn
      direction={isAI ? 'left' : 'right'}
      className={cn(
        'rounded-2xl px-4 py-3 shadow-sm',
        isAI
          ? 'rounded-tl-sm bg-sage backdrop-blur-xs'
          : 'rounded-tr-sm bg-coral/80 backdrop-blur-xs',
        className
      )}
    >
      {shouldAnimateWords ? (
        <WordFadeIn
          words={children}
          delay={0.06}
          className="text-base leading-relaxed text-dark"
        />
      ) : (
        <Typography font="chat" size="body" className="text-dark">
          {children}
        </Typography>
      )}
    </SlideIn>
  );
}
