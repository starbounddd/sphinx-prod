import { ClarityReport } from "@/features/assessment/ui";
import { MOCK_REPORT } from "@/features/assessment/lib";

export default function AssessmentReportPage() {
  return <ClarityReport report={MOCK_REPORT} />;
}
