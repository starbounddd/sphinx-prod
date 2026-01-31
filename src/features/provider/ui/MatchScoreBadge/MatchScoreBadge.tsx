import type { JSX } from "react";
import { Star } from "lucide-react";
import { Typography } from "@/shared/ui/typography";

interface MatchScoreBadgeProps {
  score: number;
}

/**
 * Match score badge showing AI compatibility percentage
 * Yellow/cream background with star icon
 */
export function MatchScoreBadge({ score }: MatchScoreBadgeProps): JSX.Element {
  return (
    <div className="flex items-center gap-2 rounded-full bg-amber-light px-4 py-2">
      <Star className="h-4 w-4 fill-coral text-coral" />
      <Typography size="body-sm" className="font-semibold text-dark">
        {score}% Match
      </Typography>
    </div>
  );
}
