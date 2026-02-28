'use client';

import type { JSX } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Typography } from '@/components/ui/typography';

export function NavbarLoginButton(): JSX.Element {
  const { openAuthModal } = useAuthModal();

  return (
    <button onClick={openAuthModal} className="group">
      <Typography
        size="body-sm"
        as="span"
        className="font-medium text-dark transition-colors duration-200 group-hover:text-primary-btn"
      >
        Login
      </Typography>
    </button>
  );
}
