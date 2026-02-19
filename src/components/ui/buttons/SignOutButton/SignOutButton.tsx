'use client';

import type { JSX, ReactNode } from 'react';
import { useState } from 'react';
import { GhostButton } from '../GhostButton/GhostButton';
import { createClient } from '@/lib/supabase/client';

interface SignOutButtonProps {
  children?: ReactNode;
  className?: string;
  redirectTo?: string;
  onSignedOut?: () => void;
}

export function SignOutButton({
  children = 'Sign Out',
  className,
  redirectTo = '/login',
  onSignedOut,
}: SignOutButtonProps): JSX.Element {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    try {
      setLoading(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      onSignedOut?.();
      if (typeof window !== 'undefined' && redirectTo) {
        window.location.href = redirectTo;
      }
    } catch (e) {
      // keep simple: log errors for now
      // calling code can pass onSignedOut to handle errors differently
      // eslint-disable-next-line no-console
      console.error('Sign out failed', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GhostButton onClick={handleSignOut} className={className} aria-busy={loading}>
      {loading ? 'Signing out…' : children}
    </GhostButton>
  );
}
