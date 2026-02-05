'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  background?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Button with animated shimmer/shine effect
 * Based on Magic UI shimmer-button pattern
 */
export function ShimmerButton({
  shimmerColor = 'rgba(255, 255, 255, 0.25)',
  shimmerSize = '0.1em',
  shimmerDuration = '2.5s',
  background = 'var(--color-primary-btn)',
  children,
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'group relative overflow-hidden rounded-full px-8 py-3',
        'text-lg font-medium tracking-wide text-platinum',
        'shadow-[0_4px_10px_rgba(0,0,0,0.2)]',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-px hover:shadow-[0_6px_14px_rgba(0,0,0,0.25)]',
        'active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.2)]',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      style={{ background }}
      {...props}
    >
      {/* Shimmer overlay - animated sliding shine */}
      <div
        className="pointer-events-none absolute inset-0 animate-shimmer-slide"
        style={{
          background: `linear-gradient(120deg, transparent 10%, ${shimmerColor} 50%, transparent 90%)`,
          animationDuration: shimmerDuration,
        }}
      />

      {/* Shine edge effect on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 -${shimmerSize} 12px ${shimmerColor}`,
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
