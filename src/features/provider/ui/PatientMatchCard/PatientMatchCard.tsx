"use client";

import type { JSX, ReactNode } from "react";
import { Clock, UserCheck, FileText } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/shared/ui/buttons";
import { Typography } from "@/shared/ui/typography";
import { MatchScoreBadge } from "../MatchScoreBadge";
import { PatientTag } from "../PatientTag";
import { AIInsights } from "../AIInsights";
import { PatientStats } from "../PatientStats";
import { KeyContext } from "../KeyContext";
import { cn } from "@/lib/utils";

interface PatientMatchCardProps {
  patientId: string;
  matchScore: number;
  receivedAt: string;
  tags: Array<{
    label: string;
    variant: "primary" | "secondary" | "tertiary";
  }>;
  aiInsights: ReactNode;
  stats: {
    duration: string;
    intensity: string;
    onset: string;
  };
  keyContext: string[];
  onAccept?: () => void;
  onViewReport?: () => void;
  className?: string;
}

/**
 * Patient match card for provider intake review
 * Shows patient details, AI insights, and action buttons
 */
export function PatientMatchCard({
  patientId,
  matchScore,
  receivedAt,
  tags,
  aiInsights,
  stats,
  keyContext,
  onAccept,
  onViewReport,
  className,
}: PatientMatchCardProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white px-10 pb-6 pt-10 shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]",
        className
      )}
    >
      {/* Header: Title + Match Score */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Typography size="h1" className="text-dark">
            New Match: Patient #{patientId}
          </Typography>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray" />
            <Typography size="body-sm" className="text-gray">
              {receivedAt}
            </Typography>
          </div>
        </div>
        <MatchScoreBadge score={matchScore} />
      </div>

      {/* Tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <PatientTag key={index} label={tag.label} variant={tag.variant} />
        ))}
      </div>

      {/* AI Insights */}
      <AIInsights className="mb-6">{aiInsights}</AIInsights>

      {/* Stats Row */}
      <PatientStats
        duration={stats.duration}
        intensity={stats.intensity}
        onset={stats.onset}
        className="mb-6"
      />

      {/* Key Context */}
      <KeyContext items={keyContext} className="mb-6" />

      {/* Action Buttons */}
      <div className="flex gap-4 pt-2">
        <PrimaryButton
          onClick={onAccept}
          className="h-14 flex-1 gap-2 bg-dark text-white hover:bg-dark/90 hover:text-white"
        >
          <UserCheck className="h-5 w-5" />
          Accept Intake
        </PrimaryButton>
        <SecondaryButton
          onClick={onViewReport}
          className="h-14 flex-1 gap-2"
        >
          <FileText className="h-5 w-5" />
          View Full Report
        </SecondaryButton>
      </div>
    </div>
  );
}
