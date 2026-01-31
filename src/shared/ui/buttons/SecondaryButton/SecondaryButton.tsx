import type { JSX, ReactNode, ComponentProps } from "react";
import { Button } from "@/shared/ui/shadcn/button";
import { cn } from "@/lib/utils";

interface SecondaryButtonProps extends Omit<ComponentProps<typeof Button>, "variant"> {
  children: ReactNode;
  fullWidth?: boolean;
}

/**
 * Secondary button - Outline style with dark border
 * Size controlled via className (default: px-10 py-5 text-lg)
 */
export function SecondaryButton({
  children,
  fullWidth = false,
  className,
  ...props
}: SecondaryButtonProps): JSX.Element {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto rounded-full",
        "border-2 border-dark bg-transparent text-dark",
        "px-10 py-5 text-lg font-semibold",
        "transition-all duration-200 ease-out",
        "hover:bg-dark hover:text-white hover:scale-[1.02]",
        "hover:shadow-[0_4px_14px_0_rgba(41,37,36,0.25)]",
        "active:scale-[0.98] active:shadow-[0_2px_8px_0_rgba(41,37,36,0.2)]",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
