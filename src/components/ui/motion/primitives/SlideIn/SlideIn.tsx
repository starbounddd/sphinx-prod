"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  slideLeftVariants,
  slideRightVariants,
  slideUpVariants,
} from "../../config";

interface SlideInProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate"> {
  children: ReactNode;
  direction?: "left" | "right" | "up";
  delay?: number;
}

const DIRECTION_VARIANTS = {
  left: slideLeftVariants,
  right: slideRightVariants,
  up: slideUpVariants,
};

/**
 * Slide-in animation from specified direction
 * Used for: ChatMessage (left/right), report cards (up)
 */
export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  ...props
}: SlideInProps) {
  return (
    <motion.div
      variants={DIRECTION_VARIANTS[direction]}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
