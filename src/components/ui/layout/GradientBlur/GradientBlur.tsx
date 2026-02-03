import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GradientBlurProps extends HTMLAttributes<HTMLDivElement> {
  color?: "coral" | "lavender";
  size?: "sm" | "md" | "lg";
}

const colorStyles = {
  coral: "bg-coral-30",
  lavender: "bg-lavender",
};

const sizeStyles = {
  sm: "h-[300px] w-[300px]",
  md: "h-[500px] w-[500px]",
  lg: "h-[600px] w-[600px]",
};

const GradientBlur = forwardRef<HTMLDivElement, GradientBlurProps>(
  ({ color = "coral", size = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-none absolute rounded-full blur-[120px]",
          colorStyles[color],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

GradientBlur.displayName = "GradientBlur";

export { GradientBlur, type GradientBlurProps };
