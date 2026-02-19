'use client';

import { motion } from 'framer-motion';
import { stagger } from '../../config';
import { cn } from '@/lib/utils';

interface BouncingDotsProps {
  /** Number of dots */
  count?: number;
  /** Container className */
  className?: string;
  /** Individual dot className */
  dotClassName?: string;
}

/**
 * Bouncing dots animation for loading states
 * Used for: ThinkingIndicator
 */
export function BouncingDots({
  count = 3,
  className,
  dotClassName = 'h-1.5 w-1.5 rounded-full bg-coral',
}: BouncingDotsProps) {
  return (
    <span className={cn('inline-flex gap-1', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className={dotClassName}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * stagger.dots,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  );
}
