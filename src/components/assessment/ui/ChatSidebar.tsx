'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Circle,
  CircleCheck,
  MessageCircle,
  SquarePen,
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
    <div className="flex w-full items-center justify-between rounded-lg bg-[#78716C08] px-2 py-2">
      <div className="flex items-center">
        <Image
          src="/images/logo/sphinx_logo.png"
          alt="Sphinx"
          width={120}
          height={32}
          className="object-contain"
        />
      </div>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#78716C08]"
        aria-label="New Chat"
      >
        <SquarePen className="h-4 w-4 text-gray" />
      </button>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-[#E7E5E4]" />;
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
    <div className="flex w-full flex-col gap-1.5">
      <span className="text-[11px] font-semibold tracking-[0.5px] text-gray">
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
              'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5',
              isCurrent &&
                'border border-[#FF9B9540] bg-[#FFB7B218]',
              isDone && 'bg-[#0D948810]',
            )}
          >
            {isDone && (
              <CircleCheck className="h-[18px] w-[18px] shrink-0 text-teal" />
            )}
            {isCurrent && (
              <Sparkles className="h-[18px] w-[18px] shrink-0 text-coral-dark" />
            )}
            {isPending && (
              <Circle className="h-[18px] w-[18px] shrink-0 text-[#A8A29E]" />
            )}

            <span
              className={cn(
                'text-[13px] font-body',
                isCurrent && 'font-semibold text-dark',
                isDone && 'font-medium text-dark',
                isPending && 'font-normal text-gray',
              )}
            >
              {domain}
            </span>

            {isCurrent && (
              <span className="ml-auto text-[11px] font-semibold text-coral-dark">
                Current
              </span>
            )}
            {isDone && (
              <span className="ml-auto text-[11px] font-semibold text-teal">
                Done
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChatHistorySection() {
  const [sessionTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  );

  return (
    <div className="flex w-full flex-1 flex-col gap-1.5 overflow-y-auto">
      <span className="text-[11px] font-semibold tracking-[0.5px] text-gray">
        CHAT HISTORY
      </span>
      <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5">
        <MessageCircle className="h-[18px] w-[18px] shrink-0 text-[#A8A29E]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium leading-tight text-dark">
            Current Session
          </span>
          <span className="text-[11px] text-[#A8A29E]">
            Today, {sessionTime}
          </span>
        </div>
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="flex w-full items-center gap-2.5 px-1 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-semibold text-white">
        U
      </div>
      <span className="text-[13px] font-medium font-body text-dark">
        User
      </span>
    </div>
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
      aria-label="Assessment sidebar"
      className={cn(
        'flex h-full w-[280px] shrink-0 flex-col gap-3 border-r border-[#E7E5E4] bg-cream p-3',
        className,
      )}
    >
      <BrandSection />
      <Divider />

      <DomainProgressList
        domainStatuses={domainStatuses}
        currentDomain={currentDomain}
      />

      <Divider />

      <ChatHistorySection />

      <Divider />
      <SidebarFooter />
    </aside>
  );
}
