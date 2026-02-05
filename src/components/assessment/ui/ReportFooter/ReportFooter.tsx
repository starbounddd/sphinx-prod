import type { JSX } from 'react';
import { ArrowRight, Bookmark } from 'lucide-react';
import { PrimaryButton, GhostButton } from '@/components/ui/buttons';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface ReportFooterProps {
  onFindProvider?: () => void;
  onSaveToJournal?: () => void;
  className?: string;
  /**
   * 'inline' for desktop sidebar placement
   * 'sticky' for mobile bottom bar
   */
  variant?: 'inline' | 'sticky';
}

/**
 * Report CTAs - adapts to desktop (inline) and mobile (sticky) layouts
 */
export function ReportFooter({
  onFindProvider,
  onSaveToJournal,
  className,
  variant = 'sticky',
}: ReportFooterProps): JSX.Element {
  if (variant === 'inline') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Primary CTA with context */}
        <div className="rounded-2xl bg-white/50 p-6 backdrop-blur-sm">
          <Typography
            size="caption"
            as="span"
            className="mb-3 block font-medium uppercase tracking-wider text-gray"
          >
            Next Step
          </Typography>
          <PrimaryButton fullWidth onClick={onFindProvider}>
            Find a Matched Provider
            <ArrowRight className="ml-2 h-4 w-4" />
          </PrimaryButton>
          <Typography size="caption" className="mt-3 text-center text-gray">
            Connect with therapists who specialize in your needs
          </Typography>
        </div>

        {/* Secondary action */}
        <GhostButton
          fullWidth
          onClick={onSaveToJournal}
          className="justify-start gap-3 rounded-2xl px-6 py-4 text-left hover:bg-white/50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lavender">
            <Bookmark className="h-5 w-5 text-dark" strokeWidth={1.5} />
          </div>
          <div>
            <Typography
              size="body"
              as="span"
              className="block font-medium text-dark"
            >
              Save to Journal
            </Typography>
            <Typography size="caption" as="span" className="text-gray">
              Keep a copy for yourself
            </Typography>
          </div>
        </GhostButton>
      </div>
    );
  }

  // Sticky mobile variant
  return (
    <div
      className={cn(
        'sticky bottom-0 border-t border-dark/5',
        'bg-cream/95 px-6 py-6 backdrop-blur-md',
        className
      )}
    >
      <div className="mx-auto flex max-w-md flex-col gap-3">
        <PrimaryButton fullWidth onClick={onFindProvider}>
          Find a Matched Provider
          <ArrowRight className="ml-2 h-4 w-4" />
        </PrimaryButton>
        <GhostButton
          onClick={onSaveToJournal}
          className="gap-2 px-4 py-2 text-base text-gray hover:text-dark"
        >
          <Bookmark className="h-4 w-4" />
          Save to my Journal
        </GhostButton>
      </div>
    </div>
  );
}
