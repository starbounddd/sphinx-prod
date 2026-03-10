import type { JSX } from 'react';
import { cn } from '@/lib/utils';

interface ChatDisclaimerProps {
  className?: string;
}

/**
 * Disclaimer text shown below the chat input area.
 */
export function ChatDisclaimer({ className }: ChatDisclaimerProps): JSX.Element {
  return (
    <p
      className={cn(
        'w-full text-center text-[11px] text-muted-foreground',
        className,
      )}
    >
      Sphinx is not a diagnostic tool. Your responses help your provider
      understand your experience better.
    </p>
  );
}
