'use client';

import type { JSX } from 'react';
import { Stagger, ScaleIn } from '@/components/ui/motion';
import { FindingCard } from './FindingCard';
import type { Finding } from '../types';
import { cn } from '@/lib/utils';

interface FindingsGridProps {
  findings: Finding[];
  className?: string;
}

/**
 * Grid layout for key findings cards
 * Desktop: 2 columns with stagger animation
 * Mobile: Single column stack
 */
export function FindingsGrid({
  findings,
  className,
}: FindingsGridProps): JSX.Element {
  return (
    <Stagger
      staggerDelay={0.1}
      className={cn('grid gap-4 sm:grid-cols-2 sm:gap-6', className)}
    >
      {findings.map((finding) => (
        <ScaleIn key={finding.id}>
          <FindingCard
            icon={finding.icon}
            title={finding.title}
            description={finding.description}
          />
        </ScaleIn>
      ))}
    </Stagger>
  );
}
