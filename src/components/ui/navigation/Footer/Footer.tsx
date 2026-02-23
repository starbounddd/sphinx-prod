import type { JSX } from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Instagram } from 'lucide-react';
import { Container } from '@/components/ui/layout';
import { Separator } from '@/components/ui/shadcn/separator';
import { Typography } from '@/components/ui/typography';

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { href: '#', label: 'How it Works' },
      { href: '#', label: 'Pricing' },
      { href: '#', label: 'FAQ' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { href: '#', label: 'About' },
      { href: '#', label: 'Blog' },
      { href: '#', label: 'Careers' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '/legal/privacy', label: 'Privacy Policy' },
      { href: '/legal/service', label: 'Terms of Service' },
      { href: '/legal/HIPAA', label: 'HIPAA Compliance' },
    ],
  },
};

const socialLinks = [
  { href: '#', label: 'Twitter', icon: Twitter },
  { href: '#', label: 'LinkedIn', icon: Linkedin },
  { href: '#', label: 'Instagram', icon: Instagram },
];

export function Footer(): JSX.Element {
  return (
    <footer className="bg-background py-16">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <Typography size="h3" className="tracking-tight text-foreground">
                Sphinx
              </Typography>
            </Link>
            <Typography size="body" color="muted" className="mt-4">
              AI-powered mental health clarity.
            </Typography>
          </div>

          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <Typography size="h4" className="text-foreground">
                {section.title}
              </Typography>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <Typography
                        size="body-sm"
                        as="span"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Typography>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Typography size="body" color="muted">
            &copy; {new Date().getFullYear()} Sphinx. All rights reserved.
          </Typography>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
