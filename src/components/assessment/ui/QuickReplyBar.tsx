import type { JSX } from 'react';
import { QuickReplyChip } from '@/components/ui/chat';
import { cn } from '@/lib/utils';

interface QuickReplyBarProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Horizontal row of quick reply suggestion chips.
 */
export function QuickReplyBar({
  options,
  onSelect,
  disabled = false,
  className,
}: QuickReplyBarProps): JSX.Element | null {
  if (options.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap justify-center gap-2', className)}>
      {options.map((option) => (
        <QuickReplyChip
          key={option}
          onClick={() => onSelect(option)}
          disabled={disabled}
        >
          {option}
        </QuickReplyChip>
      ))}
    </div>
  );
}
