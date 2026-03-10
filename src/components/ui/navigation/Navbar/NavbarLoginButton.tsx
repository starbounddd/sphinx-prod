'use client';

import type { JSX } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';

export function NavbarLoginButton(): JSX.Element {
  const { openAuthModal } = useAuthModal();

  return (
    <button
      onClick={openAuthModal}
      className="text-base font-medium text-dark/70 transition-colors duration-200 hover:text-dark"
    >
      Login
    </button>
  );
}
