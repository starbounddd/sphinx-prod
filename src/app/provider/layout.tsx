import type { JSX, ReactNode } from 'react';

interface ProviderLayoutProps {
  children: ReactNode;
}

/**
 * Provider portal layout
 * Full-height flex container for sidebar + main content
 */
export default function ProviderLayout({
  children,
}: ProviderLayoutProps): JSX.Element {
  return (
    <div className="flex h-screen overflow-hidden bg-cream">{children}</div>
  );
}
