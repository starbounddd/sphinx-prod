'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  label: string;
  active?: boolean;
}

function NavLink({ href, label, active = false }: NavLinkProps) {
  return (
    <Link href={href as any}>
      <Typography
        size="body-sm"
        as="span"
        className={cn(
          'font-medium transition-colors hover:text-dark',
          active ? 'text-dark' : 'text-gray'
        )}
      >
        {label}
      </Typography>
    </Link>
  );
}

interface ProviderNavbarProps {
  activeTab?: 'dashboard' | 'patients';
  providerName?: string;
}

/**
 * Provider Portal navigation bar
 * Shows Sphinx logo with "Provider Portal" badge and provider-specific nav items
 */
export function ProviderNavbar({
  activeTab = 'patients',
  providerName = 'Dr. Chen',
}: ProviderNavbarProps): JSX.Element {
  return (
    <nav className="flex w-full items-center justify-between">
      {/* Left: Logo + Badge */}
      <div className="flex items-center gap-3">
        <Link href="/provider" className="shrink-0">
          <Image
            src="/images/logo/sphinx-logo.svg"
            alt="Sphinx"
            width={72}
            height={23}
            priority
          />
        </Link>
        <span className="rounded-full bg-sage px-3 py-1">
          <Typography size="body-sm" className="text-dark">
            Provider Portal
          </Typography>
        </span>
      </div>

      {/* Right: Nav Links + Profile */}
      <div className="flex items-center gap-6">
        <NavLink
          href="/provider/dashboard"
          label="Dashboard"
          active={activeTab === 'dashboard'}
        />
        <NavLink
          href="/provider/patients"
          label="Patients"
          active={activeTab === 'patients'}
        />

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sage">
            <User className="h-3 w-3 text-dark" />
          </div>
          <Typography size="body-sm" className="font-medium text-gray">
            {providerName}
          </Typography>
        </div>
      </div>
    </nav>
  );
}
