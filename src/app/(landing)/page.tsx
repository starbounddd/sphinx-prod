import { Navbar, Footer } from "@/shared/ui/navigation";
import {
  Hero,
  QuoteSection,
  PhoneShowcase,
  FeatureGrid,
  CTASection,
} from "./_sections";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <QuoteSection />
      <PhoneShowcase />
      <FeatureGrid />
      <CTASection />
      <Footer />
    </>
  );
}
