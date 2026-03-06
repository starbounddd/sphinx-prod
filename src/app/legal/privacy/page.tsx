export default function PrivacyPolicyPage() {
    return (
        <main className="bg-secondary py-16 px-6 max-w-3xl mx-auto">
          <div className="border-l-4 border-border pl-4 mt-2">
            <h1 className="font-sans text-[50px] mb-6">Sphinx Privacy Policy</h1>
            <p className="m-0 p-0 text-muted-foreground text-[14px]"><strong>Effective Date:</strong> February 2026</p>
            <p className="m-0 p-0 text-muted-foreground text-[14px]"><strong>Version:</strong> 1.0</p>
          </div>

          <div className="rounded-[var(--radius-xl)] ">
            <h2 className="text-xl font-semibold mt-8 mb-2">1. Introduction</h2>
            <p className="mb-4">
            Welcome to <strong>Sphinx</strong>.
            </p>
            <p>
              Sphinx is in the <strong>initial stages of product development</strong>. 
              We provide structured mental health intake tools and AI-assisted educational summaries 
              designed to help users better understand their mental health patterns.
            </p>
            <p>
              Sphinx is <strong>not a medical provider, not a diagnostic service, and not an emergency service.</strong>
            </p>
            <p>
              This Privacy Policy explains: 
              (1) What information we collect; 
              (2) How we use it; 
              (3) How we store it; 
              (4) How AI systems are involved;
              (5) Your rights regarding your data.
              By using Sphinx, you agree to this Privacy Policy.
            </p>
          </div>
    
          <h2 className="text-xl font-semibold mt-8 mb-2">2. Important Notice About AI Use</h2>
          <p>
            Sphinx currently uses third-party AI systems to generate:
            (1) Plain-language explanations of survey results;
            (2) Educational summaries;
            (3) General coping suggestions.
            We do <strong>not</strong> develop our own AI models at this stage.
          </p>
          <p>
          Your structured survey results may be processed through external AI APIs in accordance with 
          the privacy policies and data handling practices of those AI providers.
          </p>
          <p>
            We:
            (1) Do not use AI to diagnose;
            (2) Do not allow AI to independently score surveys;
            (3) Do not allow AI to override structured backend logic;
            (4) Log AI outputs for auditability.
          </p>
          <p>
            AI providers may process inputs temporarily to generate outputs.
            We do not control how third-party AI providers train or improve their systems 
            unless otherwise stated in their policies.
          </p>
    
          <h2 className="text-xl font-semibold mt-8 mb-2">3. Information We Collect</h2>
          <p>
          We separate identity data from mental health data by design.
          </p>
          <p>
            <strong>Account Information:</strong>Email (if provided).
          </p>
          <p>
            <strong>Survey Information:</strong>
            When you complete a screening survey, we collect your answers to survey questions.
          </p>
          <p>
            <strong>Optional Information</strong>
            You may provide chief complaint, personal goals,cultural background, medication history, or provider information.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-2">4. How We Use Your Information</h2>
          <p>
            We use your information to:
            (1) Deliver screening tools;
            (2) Compute structured mental health scores;
            (3) Generate educational explanations;
            (4) Provide general coping suggestions;
            (5) Improve platform functionality; 
            (6) Ensure system safety and auditability.
          </p>
          <p>
            We do not sell your data or share identifiable information with advertisers.
          </p>
          <p>
          In the event that you create an account, 
          your data will be stored and used to connect you with a mental health provider that best
          suits your needs.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-2">5. How AI Processes Your Information</h2>
          <p>
            When AI is used, only structured and permitted data is sent. 
            AI outputs are informational and not medical advice.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-2">6. Your rights regarding your data</h2>
          <p>
            We retain your data while your account is active.
            If you delete your account, we aim to make deletion permanent and irreversible.
          </p>
          <p>
            All sharing is limited to operational necessity. 
            We do not share data with employers, insurance companies, advertisers, or external providers without your action.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-2">7. Security and Safeguards
          </h2>
          <p>
          We use administrative, technical, and physical safeguards designed to protect 
          personal information and mental health-related data from unauthorized access, use, 
          alteration, or disclosure.
          </p>
          <p>
          Where required by applicable law or contract, 
          including when acting as a business associate under HIPAA, 
          we implement additional safeguards for protected health information, 
          including role-based access controls, audit logging, vendor oversight, 
          incident response procedures, and other reasonable and appropriate protections.
          </p>
          <p>
          No system is completely secure, and we cannot guarantee absolute security.
          </p>
          <p>
          If Sphinx becomes aware of a breach involving unsecured personal information or health-related information, 
          we will provide notice as required by applicable law.
          </p>
          <p>
          Where Sphinx acts as a business associate under HIPAA, 
          breach handling and notification will be governed by applicable law and our agreement with the relevant covered entity.
          </p>
        </main>
    );
  }