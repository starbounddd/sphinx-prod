import type { JSX } from "react";
import { Container, Section } from "@/components/ui/layout";
import { Typography } from "@/components/ui/typography";
import { QuoteCard } from "./QuoteCard";

const quotes = [
  {
    quote: "I just feel overwhelmed and my chest hurts...",
    analysis: "Potential physical symptoms of anxiety triggered by stress",
    variant: "sage" as const,
  },
  {
    quote: "Nothing feels worth it anymore, I'm so tired...",
    analysis: "Signs consistent with low mood and fatigue, common in depression",
    variant: "lavender" as const,
  },
  {
    quote: "I can't stop thinking about that thing I said...",
    analysis: "Repetitive thought patterns suggesting rumination or social anxiety",
    variant: "coral" as const,
  },
];

export function QuoteSection(): JSX.Element {
  return (
    <Section>
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Typography size="h2" className="mb-4">
            From vague to clear
          </Typography>
          <Typography size="body" color="muted">
            See how Sphinx transforms uncertain feelings into structured
            understanding.
          </Typography>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {quotes.map((item, index) => (
            <QuoteCard
              key={index}
              quote={item.quote}
              analysis={item.analysis}
              variant={item.variant}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
