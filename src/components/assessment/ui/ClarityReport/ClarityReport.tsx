"use client";

import type { JSX } from "react";
import { Download, Sparkles } from "lucide-react";
import { SlideIn } from "@/components/ui/motion";
import { SecondaryButton } from "@/components/ui/buttons";
import { Typography } from "@/components/ui/typography";
import { SummaryCard } from "../SummaryCard";
import { FindingsGrid } from "../FindingsGrid";
import { ReportFooter } from "../ReportFooter";
import type { ClarityReport as ClarityReportType } from "../../types";
import { cn } from "@/lib/utils";

interface ClarityReportProps {
  report: ClarityReportType;
  className?: string;
}

/**
 * Main clarity report container
 * Desktop: Two-column editorial layout
 * Mobile: Single column stack
 */
export function ClarityReport({
  report,
  className,
}: ClarityReportProps): JSX.Element {
  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log("Download report");
  };

  const handleFindProvider = () => {
    // TODO: Navigate to provider matching
    console.log("Find provider");
  };

  const handleSaveToJournal = () => {
    // TODO: Save to user's journal
    console.log("Save to journal");
  };

  return (
    <div className={cn("relative min-h-screen bg-cream", className)}>
      {/* Decorative background shapes (static, no animation) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-linear-to-br from-sage/20 to-transparent blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-linear-to-br from-lavender/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-linear-to-br from-coral/10 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header
        className={cn(
          "relative z-10 border-b border-dark/5",
          "bg-cream/80 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
          {/* Left: Badge */}
          <div className="flex items-center gap-2 rounded-full bg-sage/50 px-4 py-2">
            <Sparkles className="h-4 w-4 text-dark" />
            <Typography size="caption" as="span" className="font-medium text-dark">
              Assessment Complete
            </Typography>
          </div>

          {/* Center: Title */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Typography size="h3" className="text-dark">
              Your Clarity Report
            </Typography>
          </div>

          {/* Right: Download */}
          <SecondaryButton
            onClick={handleDownload}
            className="gap-2 border-dark/10 bg-white/50 px-4 py-2 text-sm hover:bg-white"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Download PDF</span>
          </SecondaryButton>
        </div>
      </header>

      {/* Main content - two column on desktop */}
      <main className="relative z-10 px-6 py-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-7xl">
          {/* Desktop: Side by side | Mobile: Stacked */}
          <div className="grid gap-8 lg:grid-cols-[minmax(380px,2fr)_3fr] lg:gap-12 xl:gap-16">
            {/* Left column - Summary (sticky on desktop) */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <SlideIn direction="up">
                <SummaryCard
                  userQuote={report.userQuote}
                  analysis={report.analysis}
                  analysisHighlight={report.analysisHighlight}
                />
              </SlideIn>

              {/* Desktop CTA - below summary */}
              <div className="mt-8 hidden lg:block">
                <ReportFooter
                  onFindProvider={handleFindProvider}
                  onSaveToJournal={handleSaveToJournal}
                  variant="inline"
                />
              </div>
            </div>

            {/* Right column - Findings */}
            <div>
              {/* Section header */}
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <Typography size="caption" as="span" className="mb-2 block font-medium uppercase tracking-wider text-coral">
                    Insights
                  </Typography>
                  <Typography size="h2" className="text-dark">
                    Key Findings
                  </Typography>
                  <Typography size="body" className="mt-2 text-gray">
                    Patterns identified from your conversation
                  </Typography>
                </div>
                <Typography size="caption" className="hidden text-gray sm:block">
                  {report.findings.length} findings
                </Typography>
              </div>

              {/* Findings grid - 2 columns on desktop */}
              <FindingsGrid findings={report.findings} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky footer */}
      <div className="lg:hidden">
        <ReportFooter
          onFindProvider={handleFindProvider}
          onSaveToJournal={handleSaveToJournal}
          variant="sticky"
        />
      </div>
    </div>
  );
}
