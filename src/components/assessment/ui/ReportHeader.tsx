import type { JSX } from 'react';
import { Download, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportHeaderProps {
  className?: string;
}

/**
 * Report header with Export PDF / Print buttons right-aligned.
 */
export function ReportHeader({ className }: ReportHeaderProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-end',
        className
      )}
    >
      {/* Actions — right aligned */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-[#E7E5E4] bg-cream px-4 py-2 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-white"
        >
          <Download className="h-4 w-4 text-dark" />
          <span className="text-[13px] font-medium text-dark">
            Export PDF
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-[#E7E5E4] bg-cream px-4 py-2 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-white"
        >
          <Printer className="h-4 w-4 text-dark" />
          <span className="text-[13px] font-medium text-dark">Print</span>
        </button>
      </div>
    </div>
  );
}
