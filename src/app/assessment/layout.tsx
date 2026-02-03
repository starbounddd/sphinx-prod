import type { ReactNode } from "react";

interface AssessmentLayoutProps {
  children: ReactNode;
}

/**
 * Assessment layout - minimal layout without navbar/footer
 * Provides full-screen experience for chat and report
 */
export default function AssessmentLayout({ children }: AssessmentLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      {children}
    </div>
  );
}
