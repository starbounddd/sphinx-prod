'use client';

import type { JSX } from 'react';
import { Zap, Clock, Activity, Calendar } from 'lucide-react';
import { HoverCard } from '@/components/ui/motion';
import { Card } from '@/components/ui/shadcn/card';
import { Typography } from '@/components/ui/typography';
import type { FindingIconName } from '../../types';
import { cn } from '@/lib/utils';

const ICON_MAP = {
  zap: Zap,
  clock: Clock,
  activity: Activity,
  calendar: Calendar,
} as const;

const ICON_COLORS: Record<FindingIconName, string> = {
  zap: 'bg-coral/15 text-coral',
  clock: 'bg-sage text-dark',
  activity: 'bg-lavender text-dark',
  calendar: 'bg-cream text-dark',
};

interface FindingCardProps {
  icon: FindingIconName;
  title: string;
  description: string;
  className?: string;
}

/**
 * Individual finding card with icon, title, and description
 * Enhanced with hover effects using Framer Motion
 */
export function FindingCard({
  icon,
  title,
  description,
  className,
}: FindingCardProps): JSX.Element {
  const Icon = ICON_MAP[icon];

  return (
    <HoverCard className={className}>
      <Card
        className={cn(
          'group relative flex gap-4 rounded-3xl border-0 bg-white p-6',
          'shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]'
        )}
      >
        {/* Subtle gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-sage/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Icon */}
        <div
          className={cn(
            'relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
            'transition-transform duration-300 group-hover:scale-105',
            ICON_COLORS[icon]
          )}
        >
          <Icon className="h-7 w-7" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="relative flex flex-col gap-1">
          <Typography size="h4" className="text-dark">
            {title}
          </Typography>
          <Typography size="body" className="text-gray">
            {description}
          </Typography>
        </div>
      </Card>
    </HoverCard>
  );
}
