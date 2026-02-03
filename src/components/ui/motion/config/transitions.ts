/**
 * Centralized motion transition presets
 * Aligned with psychological counseling app aesthetic (soft, damping, trustworthy)
 */

export const transitions = {
  /** Soft spring for organic feel - primary entrance animation */
  spring: {
    type: "spring" as const,
    damping: 25,
    stiffness: 120,
    mass: 0.8,
  },

  /** Damped spring for smooth, professional feel */
  damped: {
    type: "spring" as const,
    damping: 30,
    stiffness: 400,
  },

  /** Smooth easing matching original CSS cubic-bezier(0.22, 1, 0.36, 1) */
  smooth: {
    type: "tween" as const,
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1] as const,
  },

  /** Quick interactions (buttons, chips) */
  quick: {
    type: "spring" as const,
    damping: 20,
    stiffness: 300,
  },

  /** Gentle float for hover effects */
  float: {
    type: "spring" as const,
    damping: 15,
    stiffness: 300,
  },

  /** Snappy tap feedback */
  tap: {
    type: "spring" as const,
    damping: 15,
    stiffness: 400,
  },
} as const;

export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
} as const;

export const stagger = {
  /** Stagger delay for finding cards */
  cards: 0.1,
  /** Stagger delay for thinking dots */
  dots: 0.15,
  /** Stagger delay for rapid message lists */
  messages: 0.05,
} as const;
