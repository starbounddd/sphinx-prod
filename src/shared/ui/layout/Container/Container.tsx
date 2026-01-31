import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide";
}

const containerStyles = {
  default: "max-w-[1280px]",
  narrow: "max-w-[768px]",
  wide: "max-w-[1440px]",
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "default", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-5 md:px-8 lg:px-10",
          containerStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export { Container, type ContainerProps };
