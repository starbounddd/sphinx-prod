'use client';

import React, { useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { ERROR_MESSAGES } from '@/utils/constants';
import { Input } from '@/components/ui/shadcn/input';
import { Separator } from '@/components/ui/shadcn/separator';

type Tab = 'signup' | 'login';

const TAB_OPTIONS: { value: Tab; label: string }[] = [
  { value: 'signup', label: 'Sign Up' },
  { value: 'login', label: 'Log In' },
];

const DIALOG_TITLES: Record<Tab, string> = {
  signup: 'Create Account',
  login: 'Welcome Back',
};

const SYNC_DELAY_MS: Record<Tab, number> = {
  signup: 300,
  login: 100,
};

// Module-level singleton for Supabase client
const supabase = createClient();

// Hoisted static SVG for Google logo
const GOOGLE_LOGO = (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

async function syncUserToPostgres(): Promise<void> {
  const res = await fetch('/api/auth/sync-user', { method: 'POST', credentials: 'include' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error(ERROR_MESSAGES.syncFailure, body.error, body.details ?? '');
  }
}

// Prevent paste on password confirmation
function preventPaste(e: React.ClipboardEvent): void {
  e.preventDefault();
}

export function AuthModal(): React.JSX.Element {
  const { isOpen, closeAuthModal } = useAuthModal();
  const [activeTab, setActiveTab] = useState<Tab>('signup');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    // Validate password confirmation for signup
    if (activeTab === 'signup') {
      const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
    }

    const authAction =
      activeTab === 'signup'
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password });

    const { data, error: authError } = await authAction;

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await new Promise((r) => setTimeout(r, SYNC_DELAY_MS[activeTab]));
      await syncUserToPostgres();
      setLoading(false);
      closeAuthModal();
      router.refresh();
      router.push('/screening');
    }
  }

  const handleTabChange = useCallback((tab: Tab): void => {
    setActiveTab(tab);
    setError(null);
  }, []);

  const handleOpenChange = useCallback((open: boolean): void => {
    if (!open) closeAuthModal();
  }, [closeAuthModal]);

  const handleGoogleLogin = useCallback((): void => {
    // TODO: Implement Google OAuth
    alert('Google login coming soon!');
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-dark/10 bg-white p-8 shadow-xl">
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-2 text-dark/40 hover:bg-dark/5 hover:text-dark"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>

          {/* Title */}
          <Dialog.Title className="mb-2 text-center text-2xl font-semibold text-dark">
            {DIALOG_TITLES[activeTab]}
          </Dialog.Title>

          {/* Subtitle */}
          <p className="mb-6 text-center text-sm text-dark/60">
            {activeTab === 'signup'
              ? 'Start your mental health journey'
              : 'Continue your journey'}
          </p>

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-full border border-dark/10 bg-dark/5 p-1">
            {TAB_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleTabChange(value)}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                  activeTab === value
                    ? 'bg-white text-dark shadow-sm'
                    : 'text-dark/60 hover:text-dark'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {/* Email */}
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="h-12 rounded-xl border-dark/10 bg-white px-4 text-base"
              />

              {/* Password */}
              <Input
                name="password"
                type="password"
                placeholder="Password"
                required
                minLength={6}
                onPaste={activeTab === 'signup' ? preventPaste : undefined}
                className="h-12 rounded-xl border-dark/10 bg-white px-4 text-base"
              />

              {/* Confirm Password (signup only) */}
              {activeTab === 'signup' && (
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  required
                  minLength={6}
                  onPaste={preventPaste}
                  className="h-12 rounded-xl border-dark/10 bg-white px-4 text-base"
                />
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-dark py-3 font-medium text-white transition-colors hover:bg-dark/90 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-sm text-dark/40">or</span>
            <Separator className="flex-1" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-dark/10 bg-white py-3 font-medium text-dark transition-colors hover:bg-dark/5"
          >
            {GOOGLE_LOGO}
            Continue with Google
          </button>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-dark/40">
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline hover:text-dark/60">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-dark/60">
              Privacy Policy
            </a>
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
