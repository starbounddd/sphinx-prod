'use client';

import type { JSX } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from '@/components/ui/buttons';
import { Typography } from '@/components/ui/typography';
import { SphinxSummary, type SphinxSummaryProps } from './SphinxSummary';
import { cn } from '@/lib/utils';

interface ReferralCardProps {
  patientInitials: string;
  patientName: string;
  referredBy: string;
  age: number;
  paymentType: 'insured' | 'self-pay';
  intakeNote: string;
  sphinxSummary: SphinxSummaryProps;
  status?: 'pending' | 'active';
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
}

const avatarColors = [
  'bg-sage',
  'bg-lavender',
  'bg-coral/30',
  'bg-amber-light',
];

/**
 * Referral card for incoming patient referrals
 * Shows patient info, intake note, and AI-generated Sphinx Summary
 */
export function ReferralCard({
  patientInitials,
  patientName,
  referredBy,
  age,
  paymentType,
  intakeNote,
  sphinxSummary,
  status = 'active',
  onAccept,
  onDecline,
  className,
}: ReferralCardProps): JSX.Element {
  const isPending = status === 'pending';
  const avatarColor =
    avatarColors[patientName.charCodeAt(0) % avatarColors.length];

  return (
    <div
      className={cn(
        'flex w-full flex-col items-start gap-6 rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row md:gap-8',
        isPending && 'opacity-60',
        className
      )}
    >
      {/* Left side - Patient Info */}
      <div className="flex w-full flex-1 flex-col gap-4 md:w-auto">
        {/* Patient Header */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-dark',
              avatarColor
            )}
          >
            {patientInitials}
          </div>
          <div>
            <Typography size="body" className="text-xl font-bold text-dark">
              {patientName}
            </Typography>
            <Typography
              size="body-sm"
              className="font-medium text-muted-foreground"
            >
              Referred by: {referredBy}
            </Typography>
            <div className="mt-2 flex gap-2">
              <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Age {age}
              </span>
              <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {paymentType === 'insured' ? 'Insured' : 'Self-Pay'}
              </span>
            </div>
          </div>
        </div>

        {/* Intake Note */}
        <div className="mt-2">
          <Typography
            size="caption"
            className="mb-2 block font-bold uppercase tracking-wider text-muted-foreground"
          >
            Patient Intake Note
          </Typography>
          <Typography
            size="body-sm"
            className="leading-relaxed text-muted-foreground"
          >
            &ldquo;{intakeNote}&rdquo;
          </Typography>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-4 pt-4 md:pt-0">
          {isPending ? (
            <TertiaryButton
              disabled
              className="flex-1 rounded-xl px-8 py-3 text-sm md:flex-none"
            >
              Pending Review
            </TertiaryButton>
          ) : (
            <>
              <PrimaryButton
                onClick={onAccept}
                className="flex-1 rounded-xl px-8 py-3 text-sm md:flex-none"
              >
                Accept Referral
              </PrimaryButton>
              <SecondaryButton
                onClick={onDecline}
                className="flex-1 rounded-xl border-sage px-8 py-3 text-sm hover:border-primary-btn hover:bg-primary-btn/10 md:flex-none"
              >
                Decline
              </SecondaryButton>
            </>
          )}
        </div>
      </div>

      {/* Right side - Sphinx Summary */}
      <SphinxSummary {...sphinxSummary} />
    </div>
  );
}
