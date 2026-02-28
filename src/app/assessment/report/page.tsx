'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ClarityReport } from '@/components/assessment/ui';
import type {
  AssessmentReport,
  ScreeningQuestionResult,
  ChatMessage,
  AssessmentMetadata,
} from '@/components/assessment/types';
import { validateAIReport } from '@/lib/ai/reportSchema';
import { mapAIReportToAssessmentReport } from '@/lib/ai/reportMapper';
import { DOMAIN_LABELS } from '@/lib/ai/domainLabels';
import surveySchema from '@/../resources/survey_schemas/wellbeing_surveyv1.json';

const SCORE_LABELS: Record<number, string> = {
  0: 'Not at all',
  1: 'A little',
  2: 'Several days',
  3: 'More than half the days',
  4: 'Nearly every day',
};

function loadScreeningResults(): ScreeningQuestionResult[] | undefined {
  try {
    const raw = localStorage.getItem('sphinx_screening_answers');
    if (!raw) return undefined;

    const answers: Record<string, number> = JSON.parse(raw);
    const questions = surveySchema.questions;

    return questions.map((q) => {
      const score = answers[q.id] ?? 0;
      return {
        questionId: q.id,
        questionText: q.text,
        domain: q.domain,
        domainLabel:
          DOMAIN_LABELS[q.domain as keyof typeof DOMAIN_LABELS] ?? q.domain,
        score,
        scoreLabel: SCORE_LABELS[score] ?? String(score),
      };
    });
  } catch {
    return undefined;
  }
}

function loadChatTranscript(): ChatMessage[] | undefined {
  try {
    const raw = localStorage.getItem('sphinx_chat_messages');
    if (!raw) return undefined;
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return undefined;
  }
}

function loadMetadata(): AssessmentMetadata | undefined {
  try {
    const raw = localStorage.getItem('sphinx_assessment_metadata');
    if (!raw) return undefined;
    return JSON.parse(raw) as AssessmentMetadata;
  } catch {
    return undefined;
  }
}

/**
 * Load the AI-generated report from localStorage and map it to the
 * frontend AssessmentReport type. Returns null with an error message
 * if no valid report exists.
 */
function loadAIReport(): { report: AssessmentReport; error: null } | { report: null; error: string } {
  try {
    const raw = localStorage.getItem('sphinx_chat_report');
    if (!raw) {
      return { report: null, error: 'No assessment report found. Please complete the assessment chat first.' };
    }

    const parsed: unknown = JSON.parse(raw);
    const validation = validateAIReport(parsed);
    if (!validation.valid) {
      return { report: null, error: `Invalid report data: ${validation.error}` };
    }

    return {
      report: mapAIReportToAssessmentReport({
        aiReport: validation.report,
        domainAssessments: {},
      }),
      error: null,
    };
  } catch {
    return { report: null, error: 'Failed to load report data. The stored data may be corrupted.' };
  }
}

export default function AssessmentReportPage() {
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const result = loadAIReport();

    if (!result.report) {
      setError(result.error);
      return;
    }

    const screeningResults = loadScreeningResults();
    const chatTranscript = loadChatTranscript();
    const assessmentMetadata = loadMetadata();

    const base = result.report;
    if (screeningResults) base.screeningResults = screeningResults;
    if (chatTranscript) base.chatTranscript = chatTranscript;
    if (assessmentMetadata) base.assessmentMetadata = assessmentMetadata;
    setReport(base);
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-sage bg-white p-8 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-lg font-semibold text-dark">Report Unavailable</h1>
          <p className="text-sm text-gray">{error}</p>
          <a
            href="/assessment/chat"
            className="mt-2 rounded-lg bg-teal px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start Assessment
          </a>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <p className="text-sm text-gray">Loading report...</p>
      </div>
    );
  }

  return <ClarityReport report={report} />;
}
