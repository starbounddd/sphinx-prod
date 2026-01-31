"use client";

import type { JSX } from "react";
import { BouncingDots } from "@/shared/ui/motion";
import { BorderBeam } from "@/shared/ui/magicui";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/lib/utils";

interface ThinkingIndicatorProps {
  className?: string;
}

/**
 * "Sphinx is thinking..." indicator with bouncing dots and border beam
 */
export function ThinkingIndicator({
  className,
}: ThinkingIndicatorProps): JSX.Element {
  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white/60 px-5 py-3 shadow-md backdrop-blur-sm",
        className
      )}
    >
      {/* Rotating border beam effect */}
      <BorderBeam
        size={60}
        duration={4}
        colorFrom="var(--coral)"
        colorTo="var(--sage)"
      />

      <Typography size="body-sm" className="text-gray">
        Sphinx is thinking
      </Typography>

      <BouncingDots
        count={3}
        dotClassName="h-1.5 w-1.5 rounded-full bg-coral"
      />
    </div>
  );
}
