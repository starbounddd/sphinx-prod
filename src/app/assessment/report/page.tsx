'use client';

import { useEffect, useState } from 'react';
import { ClarityReport } from '@/components/assessment/ui';
import { MOCK_ASSESSMENT_REPORT } from '@/components/assessment/lib';
import type {
  AssessmentReport,
  ScreeningQuestionResult,
  ChatMessage,
  AssessmentMetadata,
} from '@/components/assessment/types';
import { DOMAIN_LABELS } from '@/lib/ai/assessmentTypes';
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

export default function AssessmentReportPage() {
  const [report, setReport] = useState<AssessmentReport>(MOCK_ASSESSMENT_REPORT);

  useEffect(() => {
    const screeningResults = loadScreeningResults();
    const chatTranscript = loadChatTranscript();
    const assessmentMetadata = loadMetadata();

    setReport((prev) => ({
      ...prev,
      ...(screeningResults && { screeningResults }),
      ...(chatTranscript && { chatTranscript }),
      ...(assessmentMetadata && { assessmentMetadata }),
    }));
  }, []);

  return <ClarityReport report={report} />;
}
