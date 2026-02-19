'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { scaleUpVariants } from '../../config';

interface ScaleInProps extends Omit<
  HTMLMotionProps<'div'>,
  'variants' | 'initial' | 'animate'
> {
  children: ReactNode;
}

/**
 * Scale up with fade-in animation
 * Used for: FindingCard entrance (inside Stagger container)
 */
export function ScaleIn({ children, ...props }: ScaleInProps) {
  return (
    <motion.div variants={scaleUpVariants} {...props}>
      {children}
    </motion.div>
  );
}
