import type { JSX, ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/lib/utils";

interface AIInsightsProps {
  children: ReactNode;
  className?: string;
}

/**
 * AI Insights callout box
 * Cream background with coral left border accent
 */
export function AIInsights({ children, className }: AIInsightsProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-2xl border-l-[3px] border-accent bg-amber-light px-6 py-6",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-coral" />
        <Typography size="h3" className="text-dark">
          AI Insights
        </Typography>
      </div>
      <Typography size="body-sm" className="leading-relaxed text-dark">
        {children}
      </Typography>
    </div>
  );
}
