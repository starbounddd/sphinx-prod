import type { JSX } from 'react';
import { User, Calendar, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientInfoBarProps {
  patientName: string;
  patientDOB: string;
  assessmentDate: string;
  status: 'completed' | 'in-progress';
  className?: string;
}

/**
 * Horizontal patient information bar showing patient name, DOB, assessment date, and status badge.
 */
export function PatientInfoBar({
  patientName,
  patientDOB,
  assessmentDate,
  status,
  className,
}: PatientInfoBarProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-8 rounded-lg border border-[#D4E4D4] bg-white px-5 py-3',
        className
      )}
    >
      {/* Patient */}
      <div className="flex items-center gap-1.5">
        <User className="h-3.5 w-3.5 text-[#0D9488]" />
        <span className="text-[13px] font-semibold text-[#292524]">
          {patientName}
        </span>
      </div>

      {/* DOB */}
      <div className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 text-[#78716C]" />
        <span className="text-[13px] text-[#78716C]">DOB: {patientDOB}</span>
      </div>

      {/* Assessment Date */}
      <div className="flex items-center gap-1.5">
        <ClipboardCheck className="h-3.5 w-3.5 text-[#78716C]" />
        <span className="text-[13px] text-[#78716C]">
          Assessed: {assessmentDate}
        </span>
      </div>

      {/* Status Badge */}
      <div className="ml-auto flex items-center gap-1.5 rounded-xl bg-[#0D9488]/[0.08] px-2.5 py-[3px]">
        <div className="h-2 w-2 rounded-full bg-[#0D9488]" />
        <span className="text-xs font-medium text-[#0D9488]">
          {status === 'completed' ? 'Completed' : 'In Progress'}
        </span>
      </div>
    </div>
  );
}
