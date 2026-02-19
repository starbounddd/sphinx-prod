import { Navbar, Footer } from '@/components/ui/navigation';
import {
  Hero,
  QuoteSection,
  PhoneShowcase,
  FeatureGrid,
  CTASection,
} from '@/components/landing/ui';
import { AuthCTA } from '@/components/ui/navigation/AuthCTA/AuthCTA';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Hero />
        <AuthCTA />
        <QuoteSection />
        <PhoneShowcase />
        <FeatureGrid />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
