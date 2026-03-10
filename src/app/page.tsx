import { Navbar, Footer } from '@/components/ui/navigation';
import {
  Hero,
  QuoteSection,
  PhoneShowcase,
  FeatureGrid,
  CTASection,
} from '@/components/landing/ui';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Hero />
        <QuoteSection />
        {/*<PhoneShowcase />*/}
        <FeatureGrid />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
