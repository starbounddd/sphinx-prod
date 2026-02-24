import type { JSX } from 'react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { Typography } from '@/components/ui/typography';

/* ==========================================================================
   Hero Section - Landing page above-the-fold content
   ========================================================================== */

/**
 * Hero Section
 * Full-screen height with headline, subtitle, CTA buttons, and background decorations
 */
export function Hero(): JSX.Element {
  return (
    <section className="hero-section">
      {/* Background decorations */}
      <div className="hero-deco-left" />
      <div className="hero-deco-right" />

      {/* Main content */}
      <div className="hero-content">
        {/* Headline */}
        <Typography size="h1" className="mb-8 text-dark">
          Find the words
          <br />
          for how you feel
        </Typography>

        {/* Value proposition */}
        <Typography
          size="body"
          color="muted"
          className="mx-auto mb-12 max-w-[640px]"
        >
          Sphinx uses AI to clarify your mental struggles.
          <br />
          Not a diagnosis—just a clear path to the right support.
        </Typography>

        {/* CTA button group */}
        <div className="hero-cta-group">
          <PrimaryButton href="/screening" showArrow shimmer>
            Start Free Check-in
          </PrimaryButton>
          <SecondaryButton href="#providers">For Providers</SecondaryButton>
        </div>

        {/* Trust indicators */}
        <Typography size="body-sm" color="muted" className="hero-trust">
          No signup required · 3-minute check-in · Completely anonymous
        </Typography>
      </div>
    </section>
  );
}
