'use client';

import { type JSX, useState } from 'react';
import { ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';
import type { ScreeningQuestionResult } from '../types';
import { cn } from '@/lib/utils';

const SCORE_LABELS: Record<number, string> = {
  0: 'Not at all',
  1: 'A little',
  2: 'Several days',
  3: 'More than half the days',
  4: 'Nearly every day',
};

function scoreColor(score: number): string {
  if (score <= 1) return 'bg-emerald-100 text-emerald-700';
  if (score === 2) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function scoreDots(score: number): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            'h-2 w-2 rounded-full',
            i <= score
              ? score <= 1
                ? 'bg-emerald-500'
                : score === 2
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              : 'bg-gray-200'
          )}
        />
      ))}
    </div>
  );
}

interface ScreeningResultsSectionProps {
  results: ScreeningQuestionResult[];
  className?: string;
}

export function ScreeningResultsSection({
  results,
  className,
}: ScreeningResultsSectionProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group results by domain
  const grouped = results.reduce<
    Record<string, { domainLabel: string; questions: ScreeningQuestionResult[] }>
  >((acc, r) => {
    if (!acc[r.domain]) {
      acc[r.domain] = { domainLabel: r.domainLabel, questions: [] };
    }
    acc[r.domain].questions.push(r);
    return acc;
  }, {});

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxScore = results.length * 4;

  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200 bg-white shadow-[0_2px_8px_rgba(41,37,36,0.03)]',
        className
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D9488]/10">
            <ClipboardList className="h-5 w-5 text-[#0D9488]" />
          </div>
          <div className="text-left">
            <h3 className="text-[15px] font-semibold text-[#292524]">
              Screening Questionnaire Results
            </h3>
            <p className="text-[13px] text-[#78716C]">
              {results.length} questions &middot; Total score: {totalScore}/{maxScore}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-[#78716C]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#78716C]" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-6 pb-5 pt-4">
          {/* Table header */}
          <div className="mb-2 grid grid-cols-[40px_140px_1fr_100px_80px] gap-3 px-3 text-[12px] font-medium uppercase tracking-wider text-[#78716C]">
            <span>#</span>
            <span>Domain</span>
            <span>Question</span>
            <span>Response</span>
            <span>Score</span>
          </div>

          {/* Rows grouped by domain */}
          {Object.entries(grouped).map(([domain, { domainLabel, questions }]) => {
            const domainAvg =
              questions.reduce((s, q) => s + q.score, 0) / questions.length;
            return (
              <div key={domain} className="mb-1">
                {questions.map((q, qi) => (
                  <div
                    key={q.questionId}
                    className={cn(
                      'grid grid-cols-[40px_140px_1fr_100px_80px] gap-3 rounded-lg px-3 py-2.5 text-[13px]',
                      qi % 2 === 0 ? 'bg-gray-50/60' : ''
                    )}
                  >
                    <span className="text-[#78716C]">
                      {results.indexOf(q) + 1}
                    </span>
                    <span className="font-medium text-[#292524]">
                      {qi === 0 ? (
                        <span className="inline-flex items-center gap-1.5">
                          {domainLabel}
                          <span className="text-[11px] text-[#78716C]">
                            (avg {domainAvg.toFixed(1)})
                          </span>
                        </span>
                      ) : (
                        <span className="text-[#78716C]">&ldquo;</span>
                      )}
                    </span>
                    <span className="text-[#292524]">{q.questionText}</span>
                    <span
                      className={cn(
                        'inline-flex h-fit items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
                        scoreColor(q.score)
                      )}
                    >
                      {SCORE_LABELS[q.score] ?? q.scoreLabel}
                    </span>
                    <span className="flex items-center gap-2">
                      {scoreDots(q.score)}
                      <span className="text-[12px] font-medium text-[#292524]">
                        {q.score}/4
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
