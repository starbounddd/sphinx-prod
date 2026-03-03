export default function TermsOfServicePage() {
    return (
      <main className="bg-secondary py-16 px-6 max-w-3xl mx-auto">
        <div className="border-l-4 border-border pl-4 mt-2">
          <h1 className="font-sans text-[50px] mb-6">Sphinx Terms of Service</h1>
        </div>
        <p className="m-0 p-0 text-muted-foreground text-[14px]"><strong>Effective Date:</strong> February 2026</p>
        <p className="m-0 p-0 text-muted-foreground text-[14px]"><strong>Version:</strong> 1.0</p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">
        Welcome to <strong>Sphinx</strong>.
        </p>
        <p>
          By creating an account, accessing, or using Sphinx’s platform, 
          you agree to be bound by these Terms of Service.
        </p>
        <p>
          If you do not agree to these Terms, do not use the platform.
        </p>
  
        <h2 className="text-xl font-semibold mt-8 mb-2">2. Description of Service</h2>
        <p>
          Sphinx provides:
          (1) Structured mental health screening surveys;
          (2) Deterministic scoring;
          (3) AI-generated educational explanations;
          (4) General self-care and reflection suggestions.
        </p>
        <p>
        Sphinx is in the <strong>initial stages of product development</strong>.
        </p>
        <p>
        The platform is designed as <strong>intake infrastructure and educational support</strong>, not as a medical provider.
        </p>


        <h2 className="text-xl font-semibold mt-8 mb-2">3. Not Medical Advice / No Provider Relationship</h2>
        <p>
          Sphinx is:
          (1) Not a healthcare provider;
          (2) Not a psychiatrist, psychologist, therapist, or medical professional;
          (3) Not a diagnostic tool;
          (4) Not a treatment service;
          (5) Not an emergency or crisis response service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Account Responsibilities</h2>
        <p>
          You agree to:
          (1) Provide accurate information;
          (2) Maintain confidentiality of login credentials;
          (3) Not share your account;
          (4) Notify us of unauthorized use
        </p>
        <p>
          You are responsible for all activity under your account.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Acceptable Use</h2>
        <p>
        You agree <strong>not</strong> to:
        (1) Use Sphinx for unlawful purposes;
        (2) Attempt to reverse engineer scoring logic;
        (3) Manipulate surveys to test system weaknesses;
        (4) Upload malicious content;
        (5) Attempt to override AI safeguards;
        (6) Use the platform for crisis roleplay or self-harm rehearsal
        </p>
        <p>
          We reserve the right to suspend accounts for misuse.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. AI Usage & Limitations</h2>
        <p>
        Sphinx uses third-party AI systems to generate mental healthexplanations.
        </p>
        <p>
        You understand and agree that AI does <strong>not</strong> diagnose and AI does <strong>not</strong> provide medical advice.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Intellectual Property</h2>
        <p>
        All platform content, including survey design, structured frameworks, UI/UX design, 
        and AI prompt architecture, is owned by Sphinx or licensed to us.
        </p>
        <p>
        You may not copy, reproduce, redistribute, reverse engineer, or commercialize
        any part of the platform without written permission. 
        You retain ownership of the content you submit.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Data & Privacy</h2>
        <p>
        Your use of Sphinx is governed by our Privacy Policy.
        </p>
        <p> 
        We separate identity data, survey responses, computed results, and AI outputs.
        </p>
        <p>
        By using Sphinx, you consent to data processing as described in the Privacy Policy.
        </p>
      </main>
    );
  }