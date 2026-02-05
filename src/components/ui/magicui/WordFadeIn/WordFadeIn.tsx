'use client';

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ElementType = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div';

interface WordFadeInProps extends Omit<HTMLMotionProps<'p'>, 'children'> {
  words: string;
  delay?: number;
  className?: string;
  as?: ElementType;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: delay,
      delayChildren: 0.1,
    },
  }),
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 120,
    },
  },
};

/**
 * Staggered word-by-word fade in animation
 * Based on Magic UI word-fade-in pattern
 *
 * Uses Framer Motion for smooth spring physics
 */
export function WordFadeIn({
  words,
  delay = 0.08,
  className,
  as = 'p',
  ...props
}: WordFadeInProps) {
  const wordArray = words.split(' ');

  // Map element types to motion components
  const motionComponents = {
    p: motion.p,
    span: motion.span,
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    div: motion.div,
  };

  const MotionComponent = motionComponents[as];

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={cn('flex flex-wrap', className)}
      {...props}
    >
      {wordArray.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  );
}
