import type { JSX } from 'react';
import { Brain, Download, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportHeaderProps {
  className?: string;
}

/**
 * Report header bar with Sphinx brand left and Export PDF / Print buttons right.
 */
export function ReportHeader({ className }: ReportHeaderProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between',
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

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-[#D4E4D4] bg-[#FDFCF8] px-4 py-2 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-white"
        >
          <Download className="h-4 w-4 text-[#292524]" />
          <span className="text-[13px] font-medium text-[#292524]">
            Export PDF
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-[#D4E4D4] bg-[#FDFCF8] px-4 py-2 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-white"
        >
          <Printer className="h-4 w-4 text-[#292524]" />
          <span className="text-[13px] font-medium text-[#292524]">Print</span>
        </button>
      </div>
    </div>
  );
}
