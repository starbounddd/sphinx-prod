'use client';

import type { JSX } from 'react';
import { PrimaryButton } from '@/components/ui/buttons';
import { Input } from '@/components/ui/shadcn/input';
import { cn } from '@/lib/utils';

interface EmailSignupProps {
  className?: string;
}

export function EmailSignup({ className }: EmailSignupProps): JSX.Element {
  return (
    <form
      className={cn('flex gap-4', className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        type="email"
        placeholder="Enter your email"
        className="h-[68px] flex-1 rounded-full border-0 bg-white px-6 text-base shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]"
      />
      <PrimaryButton type="submit">Get Early Access</PrimaryButton>
    </form>
  );
}
