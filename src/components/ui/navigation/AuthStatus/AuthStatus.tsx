'use client';

import {JSX, useEffect, useState} from 'react';
import { SignOutButton } from '@/components/ui/buttons';
import { createClient } from '@/lib/supabase/client';

export function AuthStatus(): JSX.Element | null {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSignedIn(!!session);
    });

    // listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSignedIn(!!session);
    });

    return () => {
      mounted = false;
      try {
        listener?.subscription?.unsubscribe();
      } catch {
        // ignore
      }
    };
  }, []);

  // while loading, render nothing to avoid layout shift
  if (signedIn === null) return null;

  if (!signedIn) return null;

  return <SignOutButton />;
}
