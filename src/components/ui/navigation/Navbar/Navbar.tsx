import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthStatus } from '@/components/ui/navigation/AuthStatus/AuthStatus';
import { createClient } from '@/lib/supabase/server';
import { NavbarCTAButton } from './NavbarCTAButton';
import { NavbarLoginButton } from './NavbarLoginButton';
import { NavbarMobileMenu } from './NavbarMobileMenu';

const baseNavLinks = [
  { href: '/about', label: 'About' },
  { href: '/providers', label: 'For Providers' },
  { href: '/journal', label: 'Journal' },
];

export async function Navbar(): Promise<JSX.Element> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isSignedIn = !!session;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-dark/8 bg-cream/90 backdrop-blur-[10px]">
      <nav className="mx-auto flex h-20 max-w-7xl items-center px-6">
        {/* Left: Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo/sphinx_logo.png"
            alt="Sphinx"
            width={100}
            height={100}
            priority
            className="h-[100px] w-[100px] object-contain"
          />
        </Link>

        {/* Center: Nav links + Start Screening */}
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {baseNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium text-dark/70 transition-colors duration-200 hover:text-dark"
            >
              {link.label}
            </a>
          ))}
          <NavbarCTAButton isSignedIn={isSignedIn} />
        </div>

        {/* Right: Login / Sign Out */}
        <div className="hidden items-center gap-3 md:flex">
          {!isSignedIn && <NavbarLoginButton />}
          <AuthStatus />
        </div>

        {/* Mobile menu */}
        <div className="ml-auto md:hidden">
          <NavbarMobileMenu links={baseNavLinks} isSignedIn={isSignedIn} />
        </div>
      </nav>
    </header>
  );
}
