'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { fadeVariants } from '../../config';

interface FadeInProps extends Omit<
  HTMLMotionProps<'div'>,
  'variants' | 'initial' | 'animate'
> {
  children: ReactNode;
  delay?: number;
}

/**
 * Simple fade-in animation on mount
 */
export function FadeIn({ children, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
