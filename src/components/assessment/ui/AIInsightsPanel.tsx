import type { JSX } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Moon,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';
import type { AIInsight } from '../types';
import { cn } from '@/lib/utils';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'alert-triangle': AlertTriangle,
  moon: Moon,
  'shield-check': ShieldCheck,
  'clipboard-list': ClipboardList,
  sparkles: Sparkles,
};

/**
 * Vertical stack of AI insight cards with icon, title, body, and source reference.
 */
export function AIInsightsPanel({
  insights,
  className,
}: AIInsightsPanelProps): JSX.Element {
  return (
    <div className={cn('flex w-[380px] shrink-0 flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-2">
        <Sparkles className="h-5 w-5 text-[#0D9488]" />
        <span className="font-[Outfit] text-lg font-bold text-[#292524]">
          AI Insights
        </span>
      </div>

      {/* Insight Cards */}
      {insights.map((insight) => {
        const Icon = ICON_MAP[insight.icon] || Sparkles;
        return (
          <div
            key={insight.title}
            className="flex flex-col gap-2.5 rounded-lg border border-[#D4E4D4] bg-white p-4 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]"
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <span style={{ color: insight.iconColor }}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-sm font-semibold text-[#292524]">
                {insight.title}
              </span>
            </div>

            {/* Body */}
            <p className="text-[13px] leading-[1.5] text-[#78716C]">
              {insight.body}
            </p>

            {/* Source */}
            <span className="text-[11px] text-[#0D9488]">
              {insight.source}
            </span>
          </div>
        );
      })}
    </div>
  );
}
