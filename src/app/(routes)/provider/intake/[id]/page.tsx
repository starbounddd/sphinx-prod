import type { JSX } from "react";
import { Typography } from "@/shared/ui/typography";
import {
  ProviderNavbar,
  PatientMatchCard,
} from "@/features/provider/ui";

// Mock data for the patient match
const mockPatientData = {
  patientId: "4092",
  matchScore: 92,
  receivedAt: "Received today at 2:45 PM",
  tags: [
    { label: "Social Anxiety", variant: "primary" as const },
    { label: "High Motivation", variant: "secondary" as const },
    { label: "Young Adult (24)", variant: "tertiary" as const },
  ],
  aiInsights: (
    <>
      Patient articulates symptoms clearly after AI clarification. Primary
      struggle appears to be <strong>performance-based anxiety</strong> rather
      than generalized anxiety. Shows strong self-awareness and readiness for
      therapeutic intervention. Recommended approach: CBT with exposure therapy
      components.
    </>
  ),
  stats: {
    duration: "6+ months",
    intensity: "High",
    onset: "Gradual",
  },
  keyContext: [
    "Previous therapy experience with mixed results",
    "Prefers evidence-based, structured approaches",
    "Open to teletherapy or in-person sessions",
  ],
};

interface IntakePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Provider intake page for reviewing patient matches
 * Shows AI-generated patient summary and action buttons
 */
export default async function IntakePage({
  params,
}: IntakePageProps): Promise<JSX.Element> {
  const { id } = await params;

  // In production, fetch patient data based on id
  const patientData = { ...mockPatientData, patientId: id || mockPatientData.patientId };

  return (
    <div className="flex flex-col gap-12">
      {/* Navigation */}
      <ProviderNavbar activeTab="patients" providerName="Dr. Chen" />

      {/* Patient Match Card */}
      <PatientMatchCard
        patientId={patientData.patientId}
        matchScore={patientData.matchScore}
        receivedAt={patientData.receivedAt}
        tags={patientData.tags}
        aiInsights={patientData.aiInsights}
        stats={patientData.stats}
        keyContext={patientData.keyContext}
      />

      {/* HIPAA Notice */}
      <div className="text-center">
        <Typography size="body-sm" className="text-gray">
          Protected Health Information (PHI) - Handle with care per HIPAA
          guidelines
        </Typography>
      </div>
    </div>
  );
}
