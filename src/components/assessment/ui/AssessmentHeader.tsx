import type { JSX } from 'react';
import { Timer, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentHeaderProps {
  remainingMs?: number;
  onEndSession?: () => void;
  className?: string;
}

function formatTime(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function AssessmentHeader({
  remainingMs = 20 * 60 * 1000,
  onEndSession,
  className,
}: AssessmentHeaderProps): JSX.Element {
  const isLow = remainingMs < 2 * 60 * 1000; // under 2 minutes

  return (
    <header
      className={cn(
        'flex h-14 w-full shrink-0 items-center justify-between border-b border-[#E7E5E4] bg-cream px-6',
        className,
      )}
    >
      {/* Left: empty spacer */}
      <div />

      {/* Right: Online + Timer + End Session */}
      <div className="flex items-center gap-3">
        {/* Online status */}
        <div className="flex items-center gap-1.5 rounded-lg bg-[#78716C0A] px-3 py-1.5" role="status" aria-label="Connection status: online">
          <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
          <span className="text-xs font-normal font-body text-emerald">
            Online
          </span>
        </div>

        {/* Timer pill */}
        <div
          role="timer"
          aria-live="polite"
          aria-label={`${formatTime(remainingMs)} remaining`}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5',
            isLow ? 'bg-red-50' : 'bg-[#78716C0A]',
          )}
        >
          <Timer
            className={cn(
              'h-3.5 w-3.5',
              isLow ? 'text-red-500' : 'text-teal',
            )}
          />
          <span
            className={cn(
              'text-xs font-semibold tabular-nums',
              isLow ? 'text-red-500' : 'text-foreground',
            )}
          >
            {formatTime(remainingMs)}
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
