'use client';

import type { JSX } from 'react';
import { Timer, Hash, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentHeaderProps {
  currentDomain?: string | null;
  questionCount?: number;
  maxQuestions?: number;
  totalTime?: string;
  onEndSession?: () => void;
  className?: string;
}

/**
 * Assessment chat header bar.
 *
 * Left:  "Assessment Interview" title + domain badge
 * Right: Timer pill, Question counter pill, End Session button
 */
export function AssessmentHeader({
  currentDomain,
  questionCount = 5,
  maxQuestions = 20,
  totalTime = '14:32',
  onEndSession,
  className,
}: AssessmentHeaderProps): JSX.Element {
  return (
    <header
      className={cn(
        'flex h-16 w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8',
        className,
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <h1 className="font-[Outfit] text-lg font-semibold text-foreground">
          Assessment Interview
        </h1>

        {currentDomain && (
          <div className="flex items-center gap-1 rounded-full bg-[#FFB7B220] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B6B]" />
            <span className="text-[11px] font-semibold text-[#FF6B6B]">
              {currentDomain}
            </span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Timer pill */}
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5">
          <Timer className="h-3.5 w-3.5 text-[#0D9488]" />
          <span className="text-xs font-semibold text-foreground">
            {totalTime}
          </span>
        </div>

        {/* Question counter pill */}
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5">
          <Hash className="h-3.5 w-3.5 text-[#0D9488]" />
          <span className="text-xs font-semibold text-foreground">
            {questionCount} / {maxQuestions}
          </span>
        </div>

        {/* End Session button */}
        <button
          type="button"
          onClick={onEndSession}
          className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Square className="h-3 w-3" />
          End Session
        </button>
      </div>
    </header>
  );
}
