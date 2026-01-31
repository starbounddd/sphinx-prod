"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

/**
 * Rotating beam effect that travels along the border
 * Based on Magic UI border-beam pattern
 *
 * Usage: Place inside a relative container with overflow-hidden and rounded corners
 */
export function BorderBeam({
  size = 100,
  duration = 8,
  delay = 0,
  colorFrom = "var(--coral)",
  colorTo = "var(--coral-dark)",
  className,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className
      )}
      style={{
        // Create the beam using a conic gradient mask
        background: `conic-gradient(from 0deg, transparent, ${colorFrom}, ${colorTo}, transparent)`,
        mask: `
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0)
        `,
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
        padding: "1px",
        animation: `border-beam ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {/* Gradient beam head */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, ${colorFrom} 0%, transparent 70%)`,
          top: "50%",
          left: "0",
          transform: "translate(-50%, -50%)",
          filter: "blur(4px)",
        }}
      />
    </div>
  );
}
