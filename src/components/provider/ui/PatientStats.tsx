import type { JSX } from 'react';
import { Clock, Activity, TrendingUp } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-2xl bg-cream p-4">
      <div className="text-coral">{icon}</div>
      <div className="flex flex-col">
        <Typography size="caption" className="font-medium text-gray">
          {label}
        </Typography>
        <Typography size="body-sm" className="font-semibold text-dark">
          {value}
        </Typography>
      </div>
    </div>
  );
}

interface PatientStatsProps {
  duration: string;
  intensity: string;
  onset: string;
  className?: string;
}

/**
 * Row of stat cards showing patient condition metrics
 */
export function PatientStats({
  duration,
  intensity,
  onset,
  className,
}: PatientStatsProps): JSX.Element {
  return (
    <div className={cn('flex gap-4', className)}>
      <StatCard
        icon={<Clock className="h-6 w-6" />}
        label="Duration"
        value={duration}
      />
      <StatCard
        icon={<Activity className="h-6 w-6" />}
        label="Intensity"
        value={intensity}
      />
      <StatCard
        icon={<TrendingUp className="h-6 w-6" />}
        label="Onset"
        value={onset}
      />
    </div>
  );
}
