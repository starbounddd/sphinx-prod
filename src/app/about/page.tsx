export default function AboutPage() {
    return (
      <main className="py-16 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Sphinx</h1>
        <h2 className="text-xl font-semibold mt-8 mb-2">Intelligent Intake Infrastructure for Modern Mental Health Care</h2>
        <p className="mb-4">
          Mental health care is powerful — 
          but the intake process is fragmented, inefficient, and often inconsistent.        
        </p>
        <p>
        Providers spend valuable time gathering background information that could have been structured in advance. 
        Patients struggle to articulate what they’re experiencing. 
        And communication across care settings remains disjointed.
        </p>
        <p>
            <strong>Sphinx exists to modernize intake.</strong>
        </p>
        <p>
        We build structured, adaptive intake systems that help providers receive meaningful symptom data before the first session — 
        so they can spend less time on paperwork and more time on care.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Our Mission</h2>
        <p>
          To transform mental health intake from static paperwork into structured, intelligent infrastructure.
        </p>
        <p>
        We believe intake should be:
        (1) Adaptive, not static;
        (2) Adaptive, not static;
        (3) Clinically useful, not redundant;
        (4) Transparent, not opaque.
        </p>
        <p>
        Sphinx helps bridge the gap between patient self-report and provider-ready insight.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">The Problem We’re Solving</h2>
        <p>
        Mental health intake today often relies on 
        static screening tools, limited symptom checklists, 
        non-standardized progress measures, and manual context gathering.
        </p>
        <p>
        Providers must reconstruct patient narratives from scratch. 
        Valuable time is lost during initial sessions collecting information that could have been structured beforehand.
        </p>
        <p>
        At the same time, patients may struggle to explain overlapping symptoms — especially in cases of comorbidity.
        </p>
        <p>
            <strong>
            Sphinx introduces structured, 
            cross-symptom domain intake built around clinically relevant symptom clusters.
            </strong>
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Privacy & Architecture</h2>
        <p>
            Sphinx was built with separation-of-concerns architecture:
        </p>
        <ul>
            <li>
            Identity data is separate from mental health data.
            </li>
            <li>
            Scoring logic runs independently from AI.
            </li>
            <li>
            AI receives only structured, permissioned inputs.
            </li>
            <li>
            All outputs are logged and traceable
            </li>
        </ul>
        <p>
        We prioritize transparency, auditability, and risk-aware design.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Our Position</h2>
        <p>
        Sphinx is <strong>not</strong> a diagnostic tool.
        </p>
        <p>
        Sphinx is <strong>not</strong> a crisis service.
        </p>
        <p>
        Sphinx is intake infrastructure.
        </p>
        <p>
        We aim to support providers — not replace them.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Who We Serve</h2>
        <p>
        Sphinx is designed for independent therapists, psychiatrists, group practices,
        clinics seeking structured intake workflows, and future EHR-integrated environments.
        </p>
        <p>
        We help providers reduce intake time, receive structured symptom summaries, 
        improve intake consistency, and identify high-risk domains earlier.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Our Vision</h2>
        <p>
        We believe mental health care should be data-informed, human-centered, 
        structured but compassionate, and efficient without losing depth.
        </p>
        <p>
        Sphinx is building the foundation for modern intake intelligence.
        </p>

      </main>
    );
  }