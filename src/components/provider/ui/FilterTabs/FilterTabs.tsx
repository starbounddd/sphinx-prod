'use client';

import type { JSX } from 'react';
import { cn } from '@/lib/utils';

interface FilterTab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

/**
 * Horizontal filter tabs for referral categories
 * First tab is filled (active), others are outlined
 */
export function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: FilterTabsProps): JSX.Element {
  return (
    <div className={cn('flex gap-3 overflow-x-auto pb-2', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all',
              isActive
                ? 'bg-coral text-dark shadow-md shadow-coral/25'
                : 'border border-sage bg-white text-gray hover:border-coral hover:text-dark'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
