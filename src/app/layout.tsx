import type { Metadata } from 'next';
import { Outfit, Inter, Reenie_Beanie, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import { AuthModalLoader } from '@/components/ui/AuthModal/AuthModalLoader';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const reenieBeanie = Reenie_Beanie({
  variable: '--font-reenie',
  subsets: ['latin'],
  weight: ['400'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-pjs',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Sphinx - Find the words for how you feel',
  description:
    'Sphinx uses AI to clarify your mental struggles. Not a diagnosis, no pressure—just a clear path to the right support.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} ${reenieBeanie.variable} ${plusJakartaSans.variable} font-sans antialiased`}
      >
        <AuthModalProvider>
          {children}
          <AuthModalLoader />
        </AuthModalProvider>
      </body>
    </html>
  );
}
