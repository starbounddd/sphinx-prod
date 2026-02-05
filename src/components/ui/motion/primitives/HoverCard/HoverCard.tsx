'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { hoverLiftVariants, tapScaleVariants } from '../../config';

interface HoverCardProps extends Omit<
  HTMLMotionProps<'div'>,
  'whileHover' | 'whileTap'
> {
  children: ReactNode;
  /** Enable tap/press feedback */
  enableTap?: boolean;
}

/**
 * Card wrapper with lift-on-hover effect
 * Used for: FindingCard
 */
export function HoverCard({
  children,
  enableTap = false,
  ...props
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={hoverLiftVariants}
      whileTap={enableTap ? tapScaleVariants : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
