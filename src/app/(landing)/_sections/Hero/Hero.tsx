import type { JSX } from "react";
import { PrimaryButton, SecondaryButton } from "@/shared/ui/buttons";
import { Typography } from "@/shared/ui/typography";

/* ==========================================================================
   Hero Section - Landing page above-the-fold content
   ========================================================================== */

/**
 * Hero Section
 * Full-screen height with headline, subtitle, CTA buttons, and background decorations
 */
export function Hero(): JSX.Element {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-[100px] -top-[200px] h-[600px] w-[600px] rounded-[240px_480px_510px_390px] bg-sage/50 blur-[40px]" />
      <div className="pointer-events-none absolute -bottom-[150px] -right-[50px] h-[500px] w-[500px] rounded-[200px_400px_425px_325px] bg-coral/50 blur-[40px]" />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-[900px] px-4 text-center">
        {/* Headline */}
        <Typography size="h1" className="mb-8 text-dark">
          Find the words
          <br />
          for how you feel
        </Typography>

        {/* Value proposition */}
        <Typography size="body" color="muted" className="mx-auto mb-12 max-w-[640px]">
          Sphinx uses AI to clarify your mental struggles.
          <br />
          Not a diagnosis—just a clear path to the right support.
        </Typography>

        {/* CTA button group */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
          <PrimaryButton showArrow shimmer>
            Start Free Check-in
          </PrimaryButton>
          <SecondaryButton>For Providers</SecondaryButton>
        </div>

        {/* Trust indicators */}
        <Typography size="body-sm" color="muted" className="mt-6">
          No signup required · 3-minute check-in · Completely anonymous
        </Typography>
      </div>
    </section>
  );
}
