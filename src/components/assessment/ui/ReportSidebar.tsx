import type { JSX } from 'react';
import {
  Brain,
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
      className={cn(
        'flex w-[280px] shrink-0 flex-col gap-5 border-r border-[#D4E4D4] bg-[#FDFCF8] px-4 py-6',
        className
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0D9488]">
          <Brain className="h-[18px] w-[18px] text-white" />
        </div>
        <span className="font-[Outfit] text-base font-semibold text-[#292524]">
          Sphinx
        </span>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#D4E4D4]" />

      {/* Current Patient Card */}
      <div className="flex flex-col gap-3 rounded-lg border border-[#D4E4D4] bg-white p-4">
        <span className="text-[10px] font-semibold tracking-[1px] text-[#78716C]">
          CURRENT PATIENT
        </span>

        {/* Patient Row */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8EFE8]">
            <span className="text-xs font-semibold text-[#0D9488]">
              {getInitials(patientName)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-[#292524]">
              {patientName}
            </span>
            <span className="text-[11px] text-[#78716C]">
              DOB: {patientDOB}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#D4E4D4]" />

        {/* Details */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#78716C]">Assessment</span>
            <span className="text-[11px] font-medium text-[#292524]">
              DSM-5 CCM
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#78716C]">Date</span>
            <span className="text-[11px] font-medium text-[#292524]">
              {assessmentDate}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#D4E4D4]" />

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2.5',
                item.active
                  ? 'bg-[#0D9488]/[0.06] font-semibold text-[#0D9488]'
                  : 'text-[#78716C]'
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="text-[13px]">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="h-px w-full bg-[#D4E4D4]" />

      {/* Doctor Profile */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFB7B2]">
          <span className="text-sm font-semibold text-white">SM</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-[#292524]">
            Dr. Sarah Mitchell
          </span>
          <span className="text-xs text-[#78716C]">Psychiatrist</span>
        </div>
      </div>
    </aside>
  );
}
