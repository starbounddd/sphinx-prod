'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { stagger as staggerConfig } from '../../config';

interface StaggerProps extends Omit<
  HTMLMotionProps<'div'>,
  'variants' | 'initial' | 'animate'
> {
  children: ReactNode;
  /** Delay between each child animation (seconds) */
  staggerDelay?: number;
}

/**
 * Container that staggers animation of children
 * Children should use motion components with variants (e.g., ScaleIn)
 * Used for: FindingsGrid, message lists
 */
export function Stagger({
  children,
  staggerDelay = staggerConfig.cards,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
