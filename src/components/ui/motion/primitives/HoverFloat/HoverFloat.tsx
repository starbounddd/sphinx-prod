'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { hoverFloatVariants, tapScaleVariants } from '../../config';

interface HoverFloatProps extends Omit<
  HTMLMotionProps<'button'>,
  'whileHover' | 'whileTap'
> {
  children: ReactNode;
  disabled?: boolean;
}

/**
 * Subtle float-up hover effect with tap feedback
 * Used for: QuickReplyChip, interactive buttons
 */
export function HoverFloat({
  children,
  disabled = false,
  ...props
}: HoverFloatProps) {
  return (
    <motion.button
      whileHover={!disabled ? hoverFloatVariants : undefined}
      whileTap={!disabled ? tapScaleVariants : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
