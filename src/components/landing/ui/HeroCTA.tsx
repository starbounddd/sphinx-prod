'use client';

import type { JSX } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton';
import { SecondaryButton } from '@/components/ui/buttons/SecondaryButton/SecondaryButton';

export function HeroCTA(): JSX.Element {
  const { openAuthModal } = useAuthModal();

  return (
    <div className="hero-cta-group">
      <PrimaryButton onClick={openAuthModal} showArrow shimmer>
        Start Free Check-in
      </PrimaryButton>
      <SecondaryButton href="#providers">For Providers</SecondaryButton>
    </div>
  );
}
