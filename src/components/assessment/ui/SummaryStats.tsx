import type { JSX } from 'react';
import {
  AlertTriangle,
  Activity,
  ShieldCheck,
  Brain,
} from 'lucide-react';
import type { SummaryStat } from '../types';
import { cn } from '@/lib/utils';

interface SummaryStatsProps {
  stats: SummaryStat[];
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'alert-triangle': AlertTriangle,
  activity: Activity,
  'shield-check': ShieldCheck,
  brain: Brain,
};

/**
 * 4 horizontal stat cards matching the Provider Stat Card design.
 */
export function SummaryStats({
  stats,
  className,
}: SummaryStatsProps): JSX.Element {
  return (
    <div className={cn('flex w-full gap-4', className)}>
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon];
        return (
          <div
            key={stat.label}
            className="flex flex-1 flex-col gap-2 rounded-lg border border-[#D4E4D4] bg-white p-5 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]"
          >
            {Icon && (
              <span style={{ color: stat.color }}>
                <Icon className="h-5 w-5" />
              </span>
            )}
            <span
              className="font-[Outfit] text-[28px] font-bold leading-tight text-[#292524]"
              style={
                stat.icon === 'activity'
                  ? { color: stat.color }
                  : undefined
              }
            >
              {stat.value}
            </span>
            <span className="text-xs text-[#78716C]">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
