'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ClarityReport } from '@/components/assessment/ui';
import type { AssessmentReport } from '@/components/assessment/types';
import { validateAIReport } from '@/features/assessment/schema/report-schema';
import { mapAIReportToAssessmentReport } from '@/features/assessment/utils/report-mapper';

/**
 * Fetch the report from the database API.
 */
async function fetchFromAPI(): Promise<AssessmentReport | null> {
  try {
    const res = await fetch('/api/assessment/report');
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('[report] API error:', res.status, body);
      return null;
    }

    const data = await res.json();
    if (!data.success || !data.report) {
      console.error('[report] API returned no report:', data);
      return null;
    }

    const validation = validateAIReport(data.report);
    if (!validation.valid) {
      console.error('[report] Validation failed:', validation.error);
      return null;
    }

    return mapAIReportToAssessmentReport({
      aiReport: validation.report,
      domainAssessments: {},
    });
  } catch (err) {
    console.error('[report] Fetch error:', err);
    return null;
  }
}

export default function AssessmentReportPage() {
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
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
