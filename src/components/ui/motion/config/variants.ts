import type { Variants, TargetAndTransition } from 'framer-motion';
import { transitions } from './transitions';

/**
 * Reusable motion variants for common animation patterns
 */

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.spring,
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.spring,
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.spring,
  },
};

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.spring,
  },
};

/** Hover effect: lift card with subtle scale */
export const hoverLiftVariants: TargetAndTransition = {
  y: -4,
  scale: 1.02,
  transition: transitions.float,
};

/** Hover effect: subtle float up */
export const hoverFloatVariants: TargetAndTransition = {
  y: -2,
  transition: transitions.float,
};

/** Hover effect: scale up */
export const hoverScaleVariants: TargetAndTransition = {
  scale: 1.05,
  transition: transitions.quick,
};

/** Tap effect: scale down for press feedback */
export const tapScaleVariants: TargetAndTransition = {
  scale: 0.95,
  transition: transitions.tap,
};
