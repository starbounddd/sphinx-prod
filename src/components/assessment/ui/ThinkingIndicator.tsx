'use client';

import type { JSX } from 'react';
import { Bot } from 'lucide-react';
import { BouncingDots } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

interface ThinkingIndicatorProps {
  className?: string;
}

/**
 * "Sphinx is thinking..." indicator with teal avatar and bouncing dots.
 * Simplified version without BorderBeam — matches Pencil design.
 */
export function ThinkingIndicator({
  className,
}: ThinkingIndicatorProps): JSX.Element {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Teal avatar circle */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0D9488]">
        <Bot className="h-5 w-5 text-white" />
      </div>

      <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(41,37,36,0.03)]">
        <span className="text-sm text-muted-foreground">
          Sphinx is thinking
        </span>
        <BouncingDots
          count={3}
          dotClassName="h-1.5 w-1.5 rounded-full bg-[#0D9488]"
        />
      </div>
    </div>
  );
}
