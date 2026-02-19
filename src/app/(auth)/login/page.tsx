'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ERROR_MESSAGES} from "@/utils/constants";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  async function syncUserToPostgres() {
    const res = await fetch('/api/auth/sync-user', { method: 'POST', credentials: 'include' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error(ERROR_MESSAGES.syncFailure, body.error, body.details ?? '');
    }
  }

  async function handleSignUp(e: any) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }
    if (data.user) {
      // Have to add to give Supabase time to set the session cookie before the API reads it
      await new Promise((r) => setTimeout(r, 300));
      await syncUserToPostgres();
      alert('Check your email to confirm!');
    }
  }

  async function handleLogin(e: any) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      // give Supabase a moment to set the cookie (same reason as signup)
      await new Promise((r) => setTimeout(r, 100));

      await syncUserToPostgres();

      router.refresh();
      router.push('/');
    }
  }


  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input name="email" type="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button>Sign Up</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input name="email" type="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button>Login</button>
      </form>
    </div>
  );
}
