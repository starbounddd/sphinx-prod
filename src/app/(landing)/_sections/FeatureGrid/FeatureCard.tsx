import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/shared/ui/shadcn/card";
import { Typography } from "@/shared/ui/typography";
import { Check } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  features: string[];
  variant?: "light" | "dark";
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  features,
  variant = "light",
  className,
}: FeatureCardProps): JSX.Element {
  const isDark = variant === "dark";

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border-0 p-12 shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]",
        isDark
          ? "bg-dark shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
          : "bg-linear-to-br from-sage/60 to-lavender/60",
        className
      )}
    >
      <div className="mb-[30px]">{icon}</div>

      <Typography
        size="h1"
        className={cn("mb-4", isDark ? "text-white" : "text-dark")}
      >
        {title}
      </Typography>

      <Typography
        size="body"
        className={cn("mb-[22px]", isDark ? "text-sage" : "text-gray")}
      >
        {description}
      </Typography>

      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-coral">
              <Check className="h-5 w-5" strokeWidth={2} />
            </div>
            <Typography
              size="body-sm"
              as="span"
              className={isDark ? "text-sage" : "text-gray"}
            >
              {feature}
            </Typography>
          </li>
        ))}
      </ul>
    </Card>
  );
}
