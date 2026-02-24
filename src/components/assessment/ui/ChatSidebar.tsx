'use client';

import type { JSX } from 'react';
import {
  Brain,
  Timer,
  MessageSquare,
  CircleCheck,
  Loader,
  Circle,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface ChatSidebarProps {
  domainStatuses: Record<string, string>;
  currentDomain: string | null;
  questionCount: number;
  maxQuestions?: number;
  totalTime?: string;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function BrandSection() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0D9488]">
        <Brain className="h-4 w-4 text-white" />
      </div>
      <span className="font-[Outfit] text-base font-semibold text-white">
        Sphinx
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-white/10" />;
}

function SessionInfoCard({
  questionCount,
  maxQuestions,
  totalTime,
}: {
  questionCount: number;
  maxQuestions: number;
  totalTime: string;
}) {
  const progress = maxQuestions > 0 ? (questionCount / maxQuestions) * 100 : 0;

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
      <span className="text-[10px] font-semibold tracking-[1px] text-gray-400">
        ACTIVE SESSION
      </span>

      {/* Timer row */}
      <div className="flex w-full items-center gap-2">
        <Timer className="h-4 w-4 text-[#0D9488]" />
        <span className="text-[13px] font-medium text-white">
          {totalTime} remaining
        </span>
      </div>

      {/* Question row */}
      <div className="flex w-full items-center gap-2">
        <MessageSquare className="h-4 w-4 text-[#0D9488]" />
        <span className="text-[13px] font-medium text-white">
          Question {questionCount} of {maxQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-sm bg-white/10">
        <div
          className="h-full rounded-sm bg-[#0D9488] transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

function DomainProgressList({
  domainStatuses,
  currentDomain,
}: {
  domainStatuses: Record<string, string>;
  currentDomain: string | null;
}) {
  const entries = Object.entries(domainStatuses);
  if (entries.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-2.5">
      <span className="text-[10px] font-semibold tracking-[1px] text-gray-400">
        DOMAINS TO EXPLORE
      </span>

      {entries.map(([domain, status]) => {
        const isCurrent =
          status === 'in_progress' || domain === currentDomain;
        const isDone = status === 'completed';
        const isPending = !isCurrent && !isDone;

        return (
          <div
            key={domain}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5',
              isDone && 'bg-[#0D948810]',
              isCurrent && 'bg-[#FFB7B220]',
            )}
          >
            {isDone && (
              <CircleCheck className="h-3.5 w-3.5 text-[#0D9488]" />
            )}
            {isCurrent && (
              <Loader className="h-3.5 w-3.5 text-[#FF6B6B]" />
            )}
            {isPending && (
              <Circle className="h-3.5 w-3.5 text-gray-400" />
            )}

            <span
              className={cn(
                'text-xs',
                isDone && 'font-medium text-white',
                isCurrent && 'font-semibold text-white',
                isPending && 'font-normal text-gray-400',
              )}
            >
              {domain}
            </span>

            {isDone && (
              <span className="ml-auto text-[10px] font-semibold text-[#0D9488]">
                Done
              </span>
            )}
            {isCurrent && (
              <span className="ml-auto text-[10px] font-semibold text-[#FF6B6B]">
                Current
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChatHistorySection() {
  return (
    <>
      <span className="text-[10px] font-semibold tracking-[1px] text-gray-400">
        CHAT HISTORY
      </span>
      <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5">
        <MessageCircle className="h-[18px] w-[18px] shrink-0 text-gray-400" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium leading-tight text-white">
            Current Session
          </span>
          <span className="text-[11px] text-gray-400">
            Today, {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function ChatSidebar({
  domainStatuses,
  currentDomain,
  questionCount,
  maxQuestions = 20,
  totalTime = '14:32',
  className,
}: ChatSidebarProps): JSX.Element {
  return (
    <aside
      className={cn(
        'flex h-full w-[280px] shrink-0 flex-col gap-5 border-r border-white/10 bg-slate-900 px-4 py-6',
        className,
      )}
    >
      <BrandSection />
      <Divider />

      <SessionInfoCard
        questionCount={questionCount}
        maxQuestions={maxQuestions}
        totalTime={totalTime}
      />

      <Divider />

      <DomainProgressList
        domainStatuses={domainStatuses}
        currentDomain={currentDomain}
      />

      <Divider />

      <ChatHistorySection />
    </aside>
  );
}
