import type { JSX } from "react";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/shadcn/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  userQuote: string;
  analysis: string;
  analysisHighlight?: string;
  className?: string;
}

/**
 * Summary card showing user quote and AI analysis
 * Top: "You said:" with handwritten quote
 * Bottom: "What this means:" with analysis heading
 */
export function SummaryCard({
  userQuote,
  analysis,
  analysisHighlight,
  className,
}: SummaryCardProps): JSX.Element {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-3xl border-0 shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]",
        className
      )}
    >
      {/* Top section - User quote */}
      <div className="bg-linear-to-br from-cream to-sage/30 p-8">
        <div className="mb-3">
          <Typography size="caption" as="span" className="inline-block rounded-full bg-sage px-4 py-1 font-medium text-dark">
            You said:
          </Typography>
        </div>
        <Typography font="handwritten" size="h3" className="leading-relaxed text-gray">
          "{userQuote}"
        </Typography>
      </div>

      {/* Heart divider */}
      <div className="relative flex justify-center">
        <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <Heart className="h-6 w-6 text-coral" fill="currentColor" />
        </div>
      </div>

      {/* Bottom section - Analysis */}
      <div className="bg-white p-8 pt-10">
        <div className="mb-3">
          <Typography size="caption" as="span" className="inline-block rounded-full bg-lavender px-4 py-1 font-medium text-dark">
            What this means:
          </Typography>
        </div>
        <Typography size="h3" className="text-dark">
          {analysisHighlight && (
            <span className="relative">
              <span className="relative z-10">{analysisHighlight}</span>
              <span className="absolute inset-x-[-4px] bottom-0 top-1/2 -z-0 rounded bg-coral/30" />
            </span>
          )}{" "}
          {analysis}
        </Typography>
      </div>
    </Card>
  );
}
