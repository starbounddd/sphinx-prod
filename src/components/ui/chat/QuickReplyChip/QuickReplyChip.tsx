'use client';

import type { JSX, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface QuickReplyChipProps {
  children: ReactNode;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  /** Optional lucide icon element to show before the label */
  icon?: ReactNode;
}

/**
 * Quick reply chip — white card style with subtle border & shadow.
 * Matches the Pencil "Suggestion Chip" component.
 */
export function QuickReplyChip({
  children,
  onClick,
  selected = false,
  disabled = false,
  className,
  icon,
}: QuickReplyChipProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-normal',
        'shadow-[0_1px_4px_rgba(41,37,36,0.02)] transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:ring-offset-2',
        selected
          ? 'border-[#0D9488]/30 bg-[#0D9488]/5 text-foreground'
          : 'border-gray-200 bg-white text-foreground hover:border-[#0D9488]/20 hover:bg-gray-50',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {icon && <span className="text-[#0D9488]">{icon}</span>}
      {children}
    </button>
  );
}
