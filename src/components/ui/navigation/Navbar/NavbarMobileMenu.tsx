'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { NavbarCTAButton } from './NavbarCTAButton';
import { NavbarLoginButton } from './NavbarLoginButton';

interface NavbarMobileMenuProps {
  links: { href: string; label: string }[];
  isSignedIn: boolean;
}

export function NavbarMobileMenu({ links, isSignedIn }: NavbarMobileMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button - visible on mobile only */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-lg p-2 text-dark transition-colors hover:bg-dark/5 md:hidden"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="fixed inset-x-0 top-20 mx-4 rounded-2xl border border-dark/8 bg-cream/95 p-6 shadow-lg backdrop-blur-[10px] md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="group rounded-lg px-3 py-2 transition-colors hover:bg-dark/5"
              >
                <Typography
                  size="body-sm"
                  as="span"
                  className="font-medium text-dark transition-colors duration-200 group-hover:text-primary-btn"
                >
                  {link.label}
                </Typography>
              </a>
            ))}
            <div className="border-t border-dark/8 pt-4 flex flex-col gap-3">
              {!isSignedIn && (
                <div onClick={() => setOpen(false)}>
                  <NavbarLoginButton />
                </div>
              )}
              <div onClick={() => setOpen(false)}>
                <NavbarCTAButton isSignedIn={isSignedIn} />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
