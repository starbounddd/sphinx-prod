import type { JSX } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { GhostButton } from '@/components/ui/buttons';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface AssessmentHeaderProps {
  title?: string;
  backHref?: string;
  className?: string;
}

/**
 * Assessment page header with title and close button
 */
export function AssessmentHeader({
  title = 'Sphinx Assessment',
  backHref = '/',
  className,
}: AssessmentHeaderProps): JSX.Element {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex items-center justify-between',
        'border-b border-gray/50 bg-cream/95 px-6 py-5 backdrop-blur-sm',
        className
      )}
    >
      {/* Spacer for centering */}
      <div className="w-10" />

      {/* Centered title */}
      <Typography size="h3" className="text-dark">
        {title}
      </Typography>

      {/* Close button */}
      <GhostButton
        asChild
        className="h-10 w-10 rounded-2xl p-0 hover:bg-dark/5"
      >
        <Link href={backHref} aria-label="Close assessment">
          <X className="h-5 w-5" strokeWidth={2} />
        </Link>
      </GhostButton>
    </header>
  );
}
