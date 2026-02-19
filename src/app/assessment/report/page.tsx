import { ClarityReport } from '@/components/assessment/ui';
import { MOCK_REPORT } from '@/components/assessment/lib';

export default function AssessmentReportPage() {
  return <ClarityReport report={MOCK_REPORT} />;
}
