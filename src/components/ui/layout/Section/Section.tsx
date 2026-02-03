import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: "default" | "dark" | "muted" | "gradient";
  spacing?: "default" | "sm" | "lg";
}

const variantStyles = {
  default: "bg-background text-foreground",
  dark: "bg-dark text-white",
  muted: "bg-muted text-foreground",
  gradient: "bg-linear-to-br from-sage to-lavender text-foreground",
};

const spacingStyles = {
  default: "py-16 md:py-24",
  sm: "py-12 md:py-16",
  lg: "py-24 md:py-32",
};

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    { variant = "default", spacing = "default", className, children, ...props },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          variantStyles[variant],
          spacingStyles[spacing],
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

export { Section, type SectionProps };
