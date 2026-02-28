'use client';

import type { JSX } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton';

interface NavbarCTAButtonProps {
  isSignedIn: boolean;
}

export function NavbarCTAButton({ isSignedIn }: NavbarCTAButtonProps): JSX.Element {
  const { openAuthModal } = useAuthModal();

  if (isSignedIn) {
    return (
      <PrimaryButton href="/screening" className="px-6 py-2.5 text-sm shrink-0">
        Start Screening
      </PrimaryButton>
    );
  }

  return (
    <PrimaryButton
      onClick={openAuthModal}
      className="px-6 py-2.5 text-sm shrink-0"
    >
      Start Screening
    </PrimaryButton>
  );
}
