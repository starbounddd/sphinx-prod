import type { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import { PrimaryButton } from "@/shared/ui/buttons";
import { Typography } from "@/shared/ui/typography";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#providers", label: "For Providers" },
  { href: "#login", label: "Login" },
];

export function Navbar(): JSX.Element {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-8">
      <nav className="flex items-center gap-12 rounded-full border border-dark/[0.08] bg-cream/90 px-8 py-4 shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)] backdrop-blur-[10px]">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo/sphinx-logo.svg"
            alt="Sphinx"
            width={72}
            height={23}
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Typography size="body-sm" as="span" className="font-medium text-dark transition-colors hover:text-dark/70">
                {link.label}
              </Typography>
            </Link>
          ))}
        </div>

        <PrimaryButton className="px-6 py-2.5 text-sm">
          Start Assessment
        </PrimaryButton>
      </nav>
    </header>
  );
}
