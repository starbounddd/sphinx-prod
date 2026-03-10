'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SurveyForm } from '@/components/survey/SurveyForm/SurveyForm';
import surveyJson from '../../../../resources/survey_schemas/wellbeing_surveyv1.json';
import { Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthModal } from '@/contexts/AuthModalContext';

function Sidebar({
  answeredCount,
  totalQuestions,
}: {
  answeredCount: number;
  totalQuestions: number;
}) {
  const pct = Math.round((answeredCount / Math.max(1, totalQuestions)) * 100);
  const barWidth = `${pct}%`;

  return (
    <aside className="w-[300px] shrink-0 bg-cream border-r border-sage flex flex-col gap-6 px-7 py-8 overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center justify-center">
        <Image
          src="/images/logo/sphinx_logo.png"
          alt="Sphinx"
          width={140}
          height={36}
          className="object-contain"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-sage" />

      {/* Sphinx Pulse */}
      <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#E8EFE8] h-20 w-full">
        <Activity className="w-8 h-8 text-teal/40" />
        <span className="text-[13px] font-medium italic text-teal font-chat">
          Sphinx is listening
        </span>
      </div>

      {/* Greeting */}
      <div className="flex flex-col gap-2">
        <span className="font-sans text-base font-semibold text-dark">
          Hi there
        </span>
        <p className="text-sm text-gray font-chat leading-relaxed">
          You&apos;re doing great. Take your time with each question — there are
          no wrong answers.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-sage" />

      {/* Progress */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm font-semibold text-stone-700">
            Your Progress
          </span>
          <span className="font-sans text-[13px] font-medium text-stone-400">
            {answeredCount} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
          <div
            className="h-2 rounded-full bg-teal transition-all duration-300"
            style={{ width: barWidth }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-teal font-chat">
            {pct}% complete
          </span>
          <span className="text-xs text-stone-400 font-chat">Keep going!</span>
        </div>
      </div>
    </aside>
  );
}

export default function ScreeningPage(): JSX.Element {
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { openAuthModal } = useAuthModal();
  const totalQuestions = surveyJson.questions.length;

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        openAuthModal();
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [openAuthModal]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray font-chat">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
        />

        {/* Main content */}
        <main className="flex-1 bg-cream overflow-y-auto">
          <div className="px-12 py-9">
            <SurveyForm
              survey={surveyJson as any}
              onProgressChange={setAnsweredCount}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
