'use client';

import React, { useMemo, useState } from 'react';
import type { JSX } from 'react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface SurveyQuestion {
  id: string;
  order: number;
  text: string;
  type: string;
  scale_ref?: string;
  domain?: string;
}

interface SurveySchema {
  survey_id: string;
  name: string;
  description?: string;
  instructions?: string;
  scales?: Record<string, any>;
  questions: SurveyQuestion[];
  scoring?: any;
}

interface SurveyFormProps {
  survey: SurveySchema;
}

export function SurveyForm({ survey }: SurveyFormProps): JSX.Element {
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const questions = useMemo(() => {
    return [...survey.questions].sort((a, b) => a.order - b.order);
  }, [survey.questions]);

  // Determine scale options for a question
  function getOptionsForQuestion(q: SurveyQuestion) {
    // prefer explicit scale by type name
    if (survey.scales?.[q.type]) return survey.scales[q.type].options;
    // fallback to yes_no if present
    if (survey.scales?.['yes_no']) return survey.scales['yes_no'].options;
    // fallback numeric 0-4
    return [
      { value: 0, label: '0' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
    ];
  }

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / Math.max(1, totalQuestions)) * 100);

  function handleAnswer(qid: string, value: number | string) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function computeScore() {
    if (!survey.scoring) return 0;
    const included = survey.scoring.included_question_ids ?? questions.map((q) => q.id);
    const total = included.reduce((acc: number, qid: string) => {
      const v = answers[qid];
      // yes/no mapping (yes -> 1), numeric values taken as-is
      if (typeof v === 'string') {
        const lower = v.toLowerCase();
        return acc + (lower === 'yes' || lower === 'true' ? 1 : 0);
      }
      if (typeof v === 'number') return acc + v;
      return acc;
    }, 0);
    return total;
  }

  function getSeverity(total: number) {
    const bands = survey.scoring?.severity_bands;
    if (!bands) return null;
    const match = bands.find((b: any) => total >= b.min && total <= b.max);
    return match ? match.label : null;
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const total = computeScore();
    setScore(total);
    setSubmitted(true);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden">
          {/* Top header with progress bar */}
          <div className="p-6 bg-gradient-to-r from-primary-btn to-primary-btn-dark">
            <div className="flex items-center justify-between">
              <div>
                <Typography size="h2" className="text-white">{survey.name}</Typography>
                {survey.instructions && (
                  <p className="mt-1 text-sm text-white/90">{survey.instructions}</p>
                )}
              </div>
              <div className="text-sm text-white/90">{answeredCount}/{totalQuestions}</div>
            </div>
            <div className="mt-4 h-2 bg-white/30 rounded-full">
              <div
                className="h-2 bg-white rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Body - all questions on one page */}
          <div className="p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((q) => {
                  const options = getOptionsForQuestion(q);
                  return (
                    <fieldset key={q.id} className="border-b pb-4">
                      <legend className="mb-3 font-medium text-base">{q.text}</legend>

                      <div className="flex flex-wrap gap-3">
                        {options.map((opt: any) => {
                          const val = opt.value;
                          const selected = answers[q.id] === val || answers[q.id] === String(val);
                          return (
                            <button
                              key={String(val)}
                              type="button"
                              onClick={() => handleAnswer(q.id, val)}
                              className={cn(
                                'px-4 py-2 rounded-full border transition-colors duration-150',
                                selected
                                  ? 'bg-primary-btn text-white border-primary-btn'
                                  : 'bg-white/70 text-dark border-dark/8 hover:bg-white',
                                'min-w-[88px] text-center'
                              )}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}

                <div className="pt-6 flex items-center justify-between">
                  <div />
                  <div>
                    <PrimaryButton type="submit">Submit</PrimaryButton>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <Typography size="h3">Results</Typography>
                <p className="mt-2">Score: {score}</p>
                <p>Severity: {getSeverity(score ?? 0) ?? 'N/A'}</p>
                <PrimaryButton
                href="/assessment"> Go to Assessment
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
