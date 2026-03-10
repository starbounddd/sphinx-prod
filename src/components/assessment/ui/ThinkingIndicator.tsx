import type { JSX } from 'react';
import { BouncingDots } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

interface ThinkingIndicatorProps {
  className?: string;
}

/**
 * "Sphinx is thinking..." indicator displayed inline in the input area.
 * Styled to match the input field dimensions.
 */
export function ThinkingIndicator({
  className,
}: ThinkingIndicatorProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex h-12 w-full items-center justify-center gap-2 rounded-3xl border border-[#E7E5E4] bg-white px-4',
        className,
      )}
    >
      <span className="text-sm font-body text-muted-foreground">
        Sphinx is thinking
      </span>
      <BouncingDots
        count={3}
        dotClassName="h-1.5 w-1.5 rounded-full bg-teal"
      />
    </div>
  );
}
