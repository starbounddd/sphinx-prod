import type { JSX } from "react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type RiskLevel = "low" | "moderate" | "high";

export interface SphinxSummaryProps {
  symptoms: string[];
  riskLevel: RiskLevel;
  riskLabel: string;
  aiInsight: string;
  className?: string;
}

const riskIndicatorColors: Record<RiskLevel, string> = {
  low: "bg-emerald",
  moderate: "bg-orange",
  high: "bg-red",
};

/**
 * Sphinx Summary - AI-generated patient insights card
 * Styled as a yellow sticky note
 */
export function SphinxSummary({
  symptoms,
  riskLevel,
  riskLabel,
  aiInsight,
  className,
}: SphinxSummaryProps): JSX.Element {
  return (
    <div
      className={cn(
        "w-full shrink-0 rounded-3xl border border-amber/20 bg-amber-light/40 p-5 md:w-[380px]",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-amber"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        <Typography size="body" className="font-bold text-dark">
          Sphinx Summary
        </Typography>
      </div>

      <div className="space-y-4">
        {/* Key Symptoms */}
        <div>
          <Typography
            size="caption"
            className="mb-1 block font-bold uppercase tracking-wide text-gray"
          >
            Key Symptoms Identified
          </Typography>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => (
              <span
                key={symptom}
                className="rounded border border-amber/30 bg-white/60 px-2 py-1 text-xs font-semibold text-dark"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div>
          <Typography
            size="caption"
            className="mb-1 block font-bold uppercase tracking-wide text-gray"
          >
            Risk Assessment
          </Typography>
          <div className="flex items-center gap-3 rounded-lg border border-amber/20 bg-white/50 p-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                riskIndicatorColors[riskLevel],
                riskLevel === "high" && "animate-pulse"
              )}
            />
            <Typography size="body-sm" className="font-medium text-dark">
              {riskLabel}
            </Typography>
          </div>
        </div>

        {/* AI Insight */}
        <div className="rounded-xl border border-amber/10 bg-white/40 p-3">
          <Typography size="caption" className="italic text-gray">
            &ldquo;{aiInsight}&rdquo;
          </Typography>
        </div>
      </div>
    </div>
  );
}
