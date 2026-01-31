import type { JSX } from "react";
import { Container, Section } from "@/shared/ui/layout";
import { Typography } from "@/shared/ui/typography";
import { EmailSignup } from "../EmailSignup";

export function CTASection(): JSX.Element {
  return (
    <Section spacing="sm">
      <Container>
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-linear-to-br from-sage/60 to-lavender/60 p-16 shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <Typography size="h1" align="center">
            Start your journey to clarity
          </Typography>
          <Typography size="body" color="muted" align="center" className="max-w-[672px]">
            Join our early access list. Free for the first 1,000 users.
          </Typography>

          <EmailSignup className="mt-6 w-full max-w-[576px]" />

          <Typography size="body-sm" color="muted" align="center" className="mt-2 max-w-[672px]">
            <strong>Medical Disclaimer:</strong> Sphinx is not a medical diagnosis tool.
            <br />
            Always consult qualified healthcare professionals for clinical decisions.
          </Typography>
        </div>
      </Container>
    </Section>
  );
}
