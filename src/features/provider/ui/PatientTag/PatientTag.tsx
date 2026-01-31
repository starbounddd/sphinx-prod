import type { JSX } from "react";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/lib/utils";

interface PatientTagProps {
  label: string;
  variant?: "primary" | "secondary" | "tertiary";
}

const variantStyles = {
  primary: "bg-coral",
  secondary: "bg-sage",
  tertiary: "bg-lavender",
};

/**
 * Tag/badge for patient attributes
 * - Primary (coral): Main concern/diagnosis
 * - Secondary (sage): Positive indicators
 * - Tertiary (lavender): Demographics
 */
export function PatientTag({
  label,
  variant = "secondary",
}: PatientTagProps): JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-4 py-2",
        variantStyles[variant]
      )}
    >
      <Typography size="caption" className="font-semibold text-dark">
        {label}
      </Typography>
    </span>
  );
}
