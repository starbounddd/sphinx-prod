export default function HIPAACompliancePage() {
    return (
      <main className="bg-secondary py-16 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">HIPAA Compliance</h1>
        <p className="m-0 p-0 text-muted-foreground text-[14px]"><strong>Effective Date:</strong> February 2026</p>
        <p className="m-0 p-0 text-muted-foreground text-[14px]"><strong>Version:</strong> 1.0</p>
        
        {/* <h2 className="text-xl font-semibold mt-8 mb-2">HIPAA and Health Information</h2> */}
        <p className="mb-4">
        Sphinx is not a covered entity under the Health Insurance Portability and Accountability Act of 1996 (“HIPAA”) merely by operating as a consumer-facing mental health application. If you are directed to use our tool by a licensed healthcare provider, clinic, or other HIPAA covered entity, Sphinx will maintain and transmit protected health information (PHI) on behalf of that covered entity, 
        subject to applicable business associate agreements and HIPAA requirements.
        </p>
        <p>
        If you use Sphinx directly as an individual consumer, and not through a healthcare provider or health plan, your information may not be protected by HIPAA. In that case, your information will 
        instead be handled as described in this Privacy Policy and under other applicable laws.
        </p>
        <p>
        Where Sphinx acts as a business associate for a covered entity under HIPAA, Sphinx will handle PHI in accordance with applicable contractual obligations, including business associate agreements, 
        and applicable HIPAA Privacy, Security, and Breach Notification requirements.
        </p>
  
      </main>
    );
  }