import type { JSX } from 'react';
import type { AssessmentReport } from '../types';
import { ReportSidebar } from './ReportSidebar';
import { ReportHeader } from './ReportHeader';
import { PatientInfoBar } from './PatientInfoBar';
import { SummaryStats } from './SummaryStats';
import { ScreeningResultsSection } from './ScreeningResultsSection';
import { ChatTranscriptSection } from './ChatTranscriptSection';
import { DomainResultsTable } from './DomainResultsTable';
import { AIInsightsPanel } from './AIInsightsPanel';
import { ConfidentialityFooter } from './ConfidentialityFooter';
import { cn } from '@/lib/utils';

interface ClarityReportProps {
  report: AssessmentReport;
  className?: string;
}

/**
 * Provider-facing clinical assessment report page.
 *
 * Layout: Flex row — 280px fixed sidebar | scrollable main content area
 */
export function ClarityReport({
  report,
  className,
}: ClarityReportProps): JSX.Element {
  return (
    <div
      className={cn(
        'relative flex h-screen overflow-hidden bg-cream',
        className
      )}
    >
      {/* Sidebar — fixed, no scroll */}
      <ReportSidebar
        patientName={report.patientName}
        patientDOB={report.patientDOB}
        assessmentDate={report.assessmentDate}
      />

      {/* Main Content — scrollable */}
      <main className="flex flex-1 flex-col gap-7 overflow-y-auto px-9 py-8">
        {/* Header */}
        <ReportHeader />

        {/* Title Section */}
        <div className="flex flex-col gap-1.5">
          <h1 className="font-sans text-[28px] font-bold leading-tight text-dark">
            Assessment Report
          </h1>
          <p className="text-[15px] text-gray">
            DSM-5 Cross-Cutting Symptom Measure &mdash; Provider Summary
          </p>
        </div>

        {/* Patient Info Bar */}
        <PatientInfoBar
          patientName={report.patientName}
          patientDOB={report.patientDOB}
          assessmentDate={report.assessmentDate}
          status={report.status}
        />

        {/* Summary Stats */}
        <SummaryStats stats={report.summaryStats} />

        {/* Screening Questionnaire Results */}
        {report.screeningResults && report.screeningResults.length > 0 && (
          <ScreeningResultsSection results={report.screeningResults} />
        )}

        {/* Assessment Chat Transcript */}
        {report.chatTranscript && report.chatTranscript.length > 0 && (
          <ChatTranscriptSection
            messages={report.chatTranscript}
            metadata={report.assessmentMetadata}
          />
        )}

        {/* Body: Domain Table + AI Insights side by side */}
        <div className="flex gap-6">
          <DomainResultsTable domains={report.domains} />
          <AIInsightsPanel insights={report.insights} />
        </div>

        {/* Footer */}
        <ConfidentialityFooter />
      </main>
    </div>
  );
}
