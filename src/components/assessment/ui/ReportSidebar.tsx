import type { JSX } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportSidebarProps {
  patientName: string;
  patientDOB: string;
  assessmentDate: string;
  className?: string;
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', active: false },
  { icon: Users, label: 'Patients', active: false },
  { icon: FileText, label: 'Reports', active: true },
  { icon: ClipboardCheck, label: 'Assessments', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Provider sidebar for the assessment report page.
 * Contains brand, patient card, navigation, and doctor profile.
 */
export function ReportSidebar({
  patientName,
  patientDOB,
  assessmentDate,
  className,
}: ReportSidebarProps): JSX.Element {
  return (
    <aside
      aria-label="Report sidebar"
      className={cn(
        'flex h-full w-[280px] shrink-0 flex-col gap-5 border-r border-sage bg-cream px-4 py-6',
        className
      )}
    >
      {/* Brand */}
      <div className="flex items-center">
        <Image
          src="/images/logo/sphinx_logo.png"
          alt="Sphinx"
          width={120}
          height={32}
          className="object-contain"
        />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-sage" />

      {/* Current Patient Card */}
      <div className="flex flex-col gap-3 rounded-lg border border-sage bg-white p-4">
        <span className="text-[10px] font-semibold tracking-[1px] text-gray">
          CURRENT PATIENT
        </span>

        {/* Patient Row */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8EFE8]">
            <span className="text-xs font-semibold text-teal">
              {getInitials(patientName)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-dark">
              {patientName}
            </span>
            <span className="text-[11px] text-gray">
              DOB: {patientDOB}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-sage" />

        {/* Details */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray">Assessment</span>
            <span className="text-[11px] font-medium text-dark">
              DSM-5 CCM
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray">Date</span>
            <span className="text-[11px] font-medium text-dark">
              {assessmentDate}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-sage" />

      {/* Navigation */}
      <nav aria-label="Report navigation" className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.label}
              aria-current={item.active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left',
                item.active
                  ? 'bg-teal/6 font-semibold text-teal'
                  : 'text-gray'
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="text-[13px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="h-px w-full bg-sage" />

      {/* Doctor Profile */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral">
          <span className="text-sm font-semibold text-white">SM</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-dark">
            Dr. Sarah Mitchell
          </span>
          <span className="text-xs text-gray">Psychiatrist</span>
        </div>
      </div>
    </aside>
  );
}
