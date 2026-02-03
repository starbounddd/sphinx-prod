"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { hoverScaleVariants, tapScaleVariants } from "../../config";

interface HoverScaleProps extends Omit<HTMLMotionProps<"button">, "whileHover" | "whileTap"> {
  children: ReactNode;
  disabled?: boolean;
}

/**
 * Scale-up hover effect with tap feedback
 * Used for: Send button in ChatInput
 */
export function HoverScale({
  children,
  disabled = false,
  ...props
}: HoverScaleProps) {
  return (
    <motion.button
      whileHover={!disabled ? hoverScaleVariants : undefined}
      whileTap={!disabled ? tapScaleVariants : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
