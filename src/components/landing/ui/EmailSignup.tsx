'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { PrimaryButton } from '@/components/ui/buttons';
import { Input } from '@/components/ui/shadcn/input';
import { cn } from '@/lib/utils';

interface EmailSignupProps {
  className?: string;
}

export function EmailSignup({ className }: EmailSignupProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alreadyOnList, setAlreadyOnList] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setErrorMessage(null);
    setStatus('loading');

    try {
      const res = await fetch('/api/interest-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        alreadyOnList?: boolean;
      };

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error ?? 'Something went wrong.');
        return;
      }

      if (data.success) {
        setStatus('success');
        setEmail('');
        setAlreadyOnList(Boolean(data.alreadyOnList));
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <form className="flex flex-col gap-3 sm:flex-row sm:gap-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'success' || status === 'error') {
              setStatus('idle');
              setAlreadyOnList(false);
            }
          }}
          disabled={status === 'loading'}
          aria-invalid={status === 'error'}
          aria-describedby={errorMessage ? 'interest-signup-error' : status === 'success' ? 'interest-signup-success' : undefined}
          className="h-[68px] flex-1 rounded-full border-0 bg-white px-6 text-base shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]"
        />
        <PrimaryButton type="submit" disabled={status === 'loading'} className="h-[68px] shrink-0 rounded-full px-8">
          {status === 'loading' ? 'Sending…' : 'Join interest list'}
        </PrimaryButton>
      </form>
      {errorMessage ? (
        <p id="interest-signup-error" className="mt-2 text-center text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {status === 'success' ? (
        <p id="interest-signup-success" className="mt-2 text-center text-sm text-dark/70">
          {alreadyOnList
            ? "You're already on our list—thanks for your interest."
            : 'Thanks! You have been added to our interest list.'}
        </p>
      ) : null}
    </div>
  );
}
