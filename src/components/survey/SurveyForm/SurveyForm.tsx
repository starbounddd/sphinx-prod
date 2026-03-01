'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthModal } from '@/contexts/AuthModalContext';

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
  onProgressChange?: (count: number) => void;
}

function LikertCircle({
  value,
  selected,
  onClick,
}: {
  value: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium font-chat transition-all duration-150',
        selected
          ? 'bg-[#F87171] text-white shadow-[0_0_12px_4px_rgba(248,113,113,0.19)] ring-[3px] ring-[#F8717140]'
          : 'bg-cream text-gray border-2 border-sage hover:border-stone-400'
      )}
    >
      {value}
    </button>
  );
}

function QuestionCard({
  index,
  question,
  selectedValue,
  onAnswer,
}: {
  index: number;
  question: SurveyQuestion;
  selectedValue: number | undefined;
  onAnswer: (value: number) => void;
}) {
  return (
    <div className="bg-white rounded-[14px] border border-sage shadow-[0_2px_8px_rgba(41,37,36,0.03)] p-6 flex flex-col gap-4">
      {/* Card Header */}
      <span className="font-sans text-sm font-bold text-dark">
        Q{index + 1}
      </span>

      {/* Question Text */}
      <p className="text-[15px] text-dark font-chat leading-relaxed">
        {question.text}
      </p>

      {/* Scale Row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray font-chat">
          Not at all / 0 days
        </span>
        <div className="flex items-center gap-3">
          {[0, 1, 2, 3, 4].map((n) => (
            <LikertCircle
              key={n}
              value={n}
              selected={selectedValue === n}
              onClick={() => onAnswer(n)}
            />
          ))}
        </div>
        <span className="text-[11px] text-gray font-chat">7-14 days</span>
      </div>
    </div>
  );
}

export function SurveyForm({
  survey,
  onProgressChange,
}: SurveyFormProps): JSX.Element {
  const router = useRouter();
  const { openAuthModal } = useAuthModal();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = useMemo(() => {
    return [...survey.questions].sort((a, b) => a.order - b.order);
  }, [survey.questions]);

  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    onProgressChange?.(answeredCount);
  }, [answeredCount, onProgressChange]);

  function handleAnswer(qid: string, value: number) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/assessment/screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Open auth modal for unauthenticated users
          openAuthModal();
          return;
        }
        setError(data.error || 'Failed to save screening');
        return;
      }

      // Success - redirect to chat
      router.push('/assessment/chat');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-sans text-[28px] font-bold text-dark">
          {survey.name}
        </h1>
        {survey.instructions && (
          <p className="text-[15px] text-gray font-chat leading-relaxed">
            {survey.instructions}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-sage" />

      {/* Question Cards */}
      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          index={i}
          question={q}
          selectedValue={answers[q.id]}
          onAnswer={(val) => handleAnswer(q.id, val)}
        />
      ))}

      {/* Submit Section */}
      <div className="flex flex-col items-center gap-4 pt-6">
        <div className="h-px bg-sage w-full" />

        <p className="text-sm text-gray font-chat text-center leading-snug max-w-[600px]">
          Thank you for completing this assessment.
          <br />
          Your responses are confidential and help us provide personalized care.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-dark text-white font-chat text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Submit Assessment'}
        </button>

        {error && (
          <p className="text-xs text-red text-center">{error}</p>
        )}

        <p className="text-xs text-red text-center leading-relaxed max-w-[500px]">
          If you are in crisis, please call 988 (Suicide &amp; Crisis Lifeline)
          <br />
          or go to your nearest emergency room.
        </p>
      </div>
    </form>
  );
}
