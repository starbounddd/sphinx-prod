'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ClarityReport } from '@/components/assessment/ui';
import type { AssessmentReport } from '@/components/assessment/types';
import { validateAIReport } from '@/lib/ai/reportSchema';
import { mapAIReportToAssessmentReport } from '@/lib/ai/reportMapper';

/**
 * Try to load the AI report from sessionStorage (set by useAssessmentChat
 * right before navigating here).
 */
function loadFromSessionStorage(): AssessmentReport | null {
  try {
    const raw = sessionStorage.getItem('sphinx_chat_report');
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    const validation = validateAIReport(parsed);
    if (!validation.valid) return null;

    return mapAIReportToAssessmentReport({
      aiReport: validation.report,
      domainAssessments: {},
    });
  } catch {
    return null;
  }
}

/**
 * Fetch the report from the database API (fallback for page refreshes).
 */
async function fetchFromAPI(): Promise<AssessmentReport | null> {
  try {
    const res = await fetch('/api/assessment/report');
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.success || !data.report) return null;

    const validation = validateAIReport(data.report);
    if (!validation.valid) return null;

    return mapAIReportToAssessmentReport({
      aiReport: validation.report,
      domainAssessments: {},
    });
  } catch {
    return null;
  }
}

export default function AssessmentReportPage() {
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      // 1. Try sessionStorage first (instant, set by chat hook before navigation)
      const cached = loadFromSessionStorage();
      if (cached) {
        setReport(cached);
        setLoading(false);
        return;
      }

      // 2. Fallback: fetch from database API (handles page refresh)
      const fetched = await fetchFromAPI();
      if (fetched) {
        setReport(fetched);
        setLoading(false);
        return;
      }

      setError('No assessment report found. Please complete the assessment chat first.');
      setLoading(false);
    }

    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <p className="text-sm text-gray">Loading report...</p>
      </div>
    );
  }

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
