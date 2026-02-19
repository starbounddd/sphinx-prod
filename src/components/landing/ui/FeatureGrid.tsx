import type { JSX } from 'react';
import { Heart, Stethoscope } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import { FeatureCard } from './FeatureCard';

const forYouFeatures = [
  'Anonymous and private conversations',
  'Clear, structured mental health reports',
  'Guidance to the right support resources',
];

const forProvidersFeatures = [
  'Structured symptom data before first session',
  'Reduce intake time by 40%',
  'HIPAA-compliant integration options',
];

export function FeatureGrid(): JSX.Element {
  return (
    <Section spacing="sm">
      <Container>
        <div className="grid gap-8 md:grid-cols-2">
          <FeatureCard
            icon={<Heart className="h-12 w-12 text-coral" strokeWidth={1.5} />}
            title="For You"
            description={
              <>
                Get clarity on what you&apos;re feeling.
                <br />
                No diagnosis, no pressure—just understanding.
              </>
            }
            features={forYouFeatures}
            variant="light"
          />
          <FeatureCard
            icon={
              <Stethoscope className="h-12 w-12 text-coral" strokeWidth={1.5} />
            }
            title="For Providers"
            description={
              <>
                Receive pre-structured patient intake data.
                <br />
                Spend less time on paperwork, more time on care.
              </>
            }
            features={forProvidersFeatures}
            variant="dark"
          />
        </div>
      </Container>
    </Section>
  );
}
