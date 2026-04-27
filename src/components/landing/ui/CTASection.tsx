import type { JSX } from 'react';
import { Container, Section } from '@/components/ui/layout';
import { Typography } from '@/components/ui/typography';
import { createClient } from '@/lib/supabase/server';
import { EmailSignup } from './EmailSignup';

export async function CTASection(): Promise<JSX.Element | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return null;
  }

  return (
    <Section spacing="sm">
      <Container>
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-linear-to-br from-sage/60 to-lavender/60 p-16 shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <Typography size="h1" align="center">
            Start your journey to clarity
          </Typography>
          <Typography
            size="body"
            color="muted"
            align="center"
            className="max-w-[672px]"
          >
            Join our interest list to hear about Sphinx updates and availability.
          </Typography>

          <EmailSignup className="mt-6 w-full max-w-[576px]" />

          <Typography
            size="body-sm"
            color="muted"
            align="center"
            className="mt-2 max-w-[672px]"
          >
            <strong>Medical Disclaimer:</strong> Sphinx is not a medical
            diagnosis tool.
            <br />
            Always consult qualified healthcare professionals for clinical
            decisions.
          </Typography>
        </div>
      </Container>
    </Section>
  );
}
