import type { JSX, ReactNode, ComponentProps } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/shadcn/button";
import { ShimmerButton } from "@/shared/ui/magicui";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends Omit<ComponentProps<typeof Button>, "variant"> {
  children: ReactNode;
  showArrow?: boolean;
  fullWidth?: boolean;
  shimmer?: boolean;
}

/**
 * Primary CTA button - Premium style with vibrant coral-red
 * Size controlled via className (default: px-8 py-3 text-lg)
 */
export function PrimaryButton({
  children,
  showArrow = false,
  fullWidth = false,
  shimmer = false,
  className,
  ...props
}: PrimaryButtonProps): JSX.Element {
  const content = (
    <>
      {children}
      {showArrow && <ArrowRight className="ml-2 h-5 w-5" />}
    </>
  );

  if (shimmer) {
    return (
      <ShimmerButton
        className={cn(fullWidth && "w-full", className)}
        {...props}
      >
        {content}
      </ShimmerButton>
    );
  }

  return (
    <Button
      className={cn(
        "h-auto rounded-full",
        "bg-primary-btn text-platinum",
        "px-8 py-3 text-lg font-medium tracking-wide",
        "shadow-[0_4px_10px_rgba(0,0,0,0.2)]",
        "transition-all duration-200 ease-out",
        "hover:bg-primary-btn-dark hover:text-white hover:-translate-y-px",
        "hover:shadow-[0_6px_14px_rgba(0,0,0,0.25)]",
        "active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.2)]",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {content}
    </Button>
  );
}
