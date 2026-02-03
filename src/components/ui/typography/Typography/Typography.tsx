import type { HTMLAttributes, JSX } from "react";
import { cn } from "@/lib/utils";
import { type TypographyFont, fontStyles } from "../font";
import { type TypographySize, type TypographyElement, sizeStyles, defaultElements, handwrittenOverrides } from "../size";

export type TypographyColor = "default" | "muted" | "coral" | "inherit";
export type TypographyAlign = "left" | "center" | "right";

const colorStyles: Record<TypographyColor, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  coral: "text-coral",
  inherit: "text-inherit",
};

const alignStyles: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  font?: TypographyFont;
  size?: TypographySize;
  as?: TypographyElement;
  color?: TypographyColor;
  align?: TypographyAlign;
}

export function Typography({
  font = "text",
  size = "body",
  as,
  color = "default",
  align,
  className,
  children,
  ...props
}: TypographyProps): JSX.Element {
  const Tag = as || defaultElements[size];
  const fontOverride = font === "handwritten" ? handwrittenOverrides[size] : undefined;

  return (
    <Tag
      className={cn(
        fontStyles[font],
        sizeStyles[size],
        fontOverride,
        colorStyles[color],
        align && alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
