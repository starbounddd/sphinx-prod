'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PrimaryButton } from '@/components/ui/buttons';
import { SignOutButton } from '@/components/ui/buttons';

export function AuthCTA(): JSX.Element | null {
   const [signedIn, setSignedIn] = useState<boolean | null>(null);

   useEffect(() => {
     let mounted = true;
     const supabase = createClient();

     supabase.auth.getSession().then(({ data: { session } }) => {
       if (!mounted) return;
       setSignedIn(!!session);
     });

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

   if (signedIn === null) return null;

   if (!signedIn) {
     return (
       <div className="flex justify-center py-8">
         <PrimaryButton href="/login" className="px-6 py-2.5 text-sm">
           Log in
         </PrimaryButton>
       </div>
     );
   }

   return (
     <div className="flex justify-center py-8">
       <SignOutButton />
     </div>
   );
 }
