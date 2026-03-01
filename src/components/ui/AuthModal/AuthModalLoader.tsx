'use client';

import dynamic from 'next/dynamic';

const AuthModal = dynamic(
  () => import('./AuthModal').then((m) => m.AuthModal),
  { ssr: false }
);

export function AuthModalLoader() {
  return <AuthModal />;
}
