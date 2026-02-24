'use client';

import { useState, useMemo } from 'react';
import type { JSX } from 'react';
import type { DomainResult } from '../types';
import { cn } from '@/lib/utils';

interface DomainResultsTableProps {
  domains: DomainResult[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Badge helpers                                                      */
/* ------------------------------------------------------------------ */

function specificityBadge(level: DomainResult['specificity']): JSX.Element {
  const styles: Record<string, string> = {
    High: 'bg-[#DC2626]/[0.07] text-[#DC2626]',
    Medium: 'bg-[#D97706]/[0.07] text-[#D97706]',
    Low: 'bg-[#059669]/[0.07] text-[#059669]',
  };

  return (
    <span
      className={cn(
        'inline-flex w-[85px] items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-semibold',
        styles[level]
      )}
    >
      {level}
    </span>
  );
}

function impactBadge(level: DomainResult['impact']): JSX.Element {
  const dotColor: Record<string, string> = {
    None: 'bg-[#A8A29E]',
    Mild: 'bg-[#0D9488]',
    Moderate: 'bg-[#D97706]',
    High: 'bg-[#FF9B95]',
  };

  const bgColor: Record<string, string> = {
    None: 'bg-[#F5F5F4]',
    Mild: 'bg-[#0D9488]/[0.07]',
    Moderate: 'bg-[#D97706]/[0.07]',
    High: 'bg-[#FFB7B2]/[0.12]',
  };

  const textColor: Record<string, string> = {
    None: 'text-[#78716C]',
    Mild: 'text-[#0D9488]',
    Moderate: 'text-[#D97706]',
    High: 'text-[#FF9B95]',
  };

  return (
    <span
      className={cn(
        'inline-flex w-[100px] items-center justify-center gap-[5px] rounded-xl px-2 py-[3px]',
        bgColor[level]
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotColor[level])} />
      <span className={cn('text-[11px] font-medium', textColor[level])}>
        {level}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SPECIFICITY_ORDER: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

/**
 * Domain results data table with search, sort, and 12+ domain rows.
 */
export function DomainResultsTable({
  domains,
  className,
}: DomainResultsTableProps): JSX.Element {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let result = domains;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.domain.toLowerCase().includes(q) ||
          d.clinicalNotes.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      const diff =
        SPECIFICITY_ORDER[a.specificity] - SPECIFICITY_ORDER[b.specificity];
      return sortDirection === 'desc' ? -diff : diff;
    });

    return result;
  }, [domains, search, sortDirection]);

  return (
    <div
      className={cn(
        'flex-1 overflow-hidden rounded-lg border border-[#D4E4D4] bg-white shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]',
        className
      )}
    >
      {/* Table Title */}
      <div className="flex items-center justify-between px-5 py-3">
        <span className="font-[Outfit] text-lg font-bold text-[#292524]">
          Domain Results
        </span>
        <span className="rounded-xl bg-[#E8EFE8] px-2.5 py-[3px] text-[11px] font-medium text-[#0D9488]">
          {filtered.length} domains
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[#D4E4D4] px-5 py-2">
        <input
          type="text"
          placeholder="Search domains..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px] rounded-md border border-[#D4E4D4]/20 bg-[#F5F5F4] px-3 py-[7px] text-xs text-[#292524] placeholder:text-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/30"
        />
        <button
          type="button"
          onClick={() =>
            setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'))
          }
          className="flex items-center gap-[5px] rounded-xl bg-[#0D9488]/[0.06] px-3 py-[5px]"
        >
          <span className="text-[11px] font-bold text-[#0D9488]">
            {sortDirection === 'desc' ? '\u2193' : '\u2191'}
          </span>
          <span className="text-[11px] font-medium text-[#0D9488]">
            Specificity: {sortDirection === 'desc' ? 'High \u2192 Low' : 'Low \u2192 High'}
          </span>
        </button>
      </div>

      {/* Column Headers */}
      <div className="flex items-center gap-2.5 border-b border-[#D4E4D4] bg-[#F5F5F4] px-5 py-[9px]">
        <span className="w-[85px] text-center text-[11px] font-semibold tracking-[0.3px] text-[#0D9488]">
          Specificity {sortDirection === 'desc' ? '\u2193' : '\u2191'}
        </span>
        <span className="w-[120px] text-center text-[11px] font-semibold tracking-[0.3px] text-[#78716C]">
          Domain
        </span>
        <span className="w-[100px] text-center text-[11px] font-semibold tracking-[0.3px] text-[#78716C]">
          Impact
        </span>
        <span className="w-[55px] text-center text-[11px] font-semibold tracking-[0.3px] text-[#78716C]">
          Control
        </span>
        <span className="w-[45px] text-center text-[11px] font-semibold tracking-[0.3px] text-[#78716C]">
          Freq.
        </span>
        <span className="w-[65px] text-center text-[11px] font-semibold tracking-[0.3px] text-[#78716C]">
          Duration
        </span>
        <span className="min-w-0 flex-1 text-[11px] font-semibold tracking-[0.3px] text-[#78716C]">
          Clinical Notes
        </span>
      </div>

      {/* Domain Rows */}
      {filtered.map((domain, i) => (
        <div
          key={domain.domain}
          className={cn(
            'flex items-center gap-2.5 border-b border-[#D4E4D4] px-5 py-2.5',
            i % 2 === 1 ? 'bg-[#FAFAF9]' : 'bg-white'
          )}
        >
          {specificityBadge(domain.specificity)}
          <span className="w-[120px] text-center text-[13px] font-medium text-[#292524]">
            {domain.domain}
          </span>
          {impactBadge(domain.impact)}
          <span className="w-[55px] text-center text-xs text-[#78716C]">
            {domain.control > 0 ? domain.control : '\u2014'}
          </span>
          <span className="w-[45px] text-center text-xs text-[#78716C]">
            {domain.frequency > 0 ? domain.frequency : '\u2014'}
          </span>
          <span className="w-[65px] text-center text-xs text-[#78716C]">
            {domain.duration}
          </span>
          <span className="min-w-0 flex-1 text-xs leading-[1.4] text-[#78716C]">
            {domain.clinicalNotes}
          </span>
        </div>
      ))}

      {/* Table Footer */}
      <div className="flex items-center justify-between rounded-b-lg bg-[#F5F5F4] px-5 py-2.5">
        <span className="text-[11px] text-[#A8A29E]">
          Showing {filtered.length} of {domains.length} domains
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#A8A29E]">Default sort:</span>
          <span className="text-[11px] font-medium text-[#0D9488]">
            Specificity (High &rarr; Low)
          </span>
        </div>
      </div>
    </div>
  );
}
