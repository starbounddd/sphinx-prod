"use client";

import type { JSX, ReactNode } from "react";
import { HoverFloat } from "@/shared/ui/motion";
import { cn } from "@/lib/utils";

interface QuickReplyChipProps {
  children: ReactNode;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Quick reply chip/pill button with float hover effect
 * Used for suggested responses in chat
 */
export function QuickReplyChip({
  children,
  onClick,
  selected = false,
  disabled = false,
  className,
}: QuickReplyChipProps): JSX.Element {
  return (
    <HoverFloat
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full px-5 py-2.5 text-base font-medium",
        "border border-sage/50 shadow-sm backdrop-blur-xs",
        "focus:outline-none focus:ring-2 focus:ring-coral/30 focus:ring-offset-2",
        selected
          ? "border-coral/30 bg-coral-20 text-dark shadow-md"
          : "bg-white/80 text-dark hover:border-coral/20 hover:bg-white hover:shadow-md",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {children}
    </HoverFloat>
  );
}
