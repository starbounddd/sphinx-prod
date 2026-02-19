import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PrimaryButton } from '@/components/ui/buttons';
import { AuthStatus } from '@/components/ui/navigation/AuthStatus/AuthStatus';
import { Typography } from '@/components/ui/typography';
import { createClient } from '@/lib/supabase/server';

const baseNavLinks = [
  { href: '/about', label: 'About' },
  { href: '/providers', label: 'For Providers' },
  { href: '/login', label: 'Login' },
];

export async function Navbar(): Promise<JSX.Element> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isSignedIn = !!session;

  const navLinks = baseNavLinks.filter((l) => !(isSignedIn && l.href === '/login'));

  return (
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-center px-4 pt-8 pb-8">
        <nav className="flex w-full max-w-6xl items-center justify-between gap-8 rounded-full border border-dark/8 bg-cream/90 px-8 py-4 shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)] backdrop-blur-[10px]">
          <Link href="/" className="shrink-0">
            <Image
                src="/images/logo/sphinx-logo.svg"
                alt="Sphinx"
                width={72}
                height={23}
                priority
            />
          </Link>

          <div className="flex flex-1 items-center justify-center gap-8">
            {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="group">
                  <Typography
                      size="body-sm"
                      as="span"
                      className="font-medium text-dark transition-colors duration-200 group-hover:text-primary-btn"
                  >
                    {link.label}
                  </Typography>
                </a>
            ))}
          </div>

          <PrimaryButton
              href="/screening"
              className="px-6 py-2.5 text-sm shrink-0"
          >
            Start Screening
          </PrimaryButton>

          {/* Client-side auth-aware render to keep interactivity and correct session state */}
          <AuthStatus />
        </nav>
      </header>
  );
}
