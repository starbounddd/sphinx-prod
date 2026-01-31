export interface PatientMatch {
  id: string;
  patientId: string;
  matchScore: number;
  receivedAt: string;
  tags: PatientTag[];
  aiInsights: string;
  stats: PatientStats;
  keyContext: string[];
}

export interface PatientTag {
  label: string;
  variant: "primary" | "secondary" | "tertiary";
}

export interface PatientStats {
  duration: string;
  intensity: string;
  onset: string;
}
