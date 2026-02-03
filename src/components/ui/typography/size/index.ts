export type TypographySize = "h1" | "h2" | "h3" | "h4" | "body" | "body-sm" | "caption";

export type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export const sizeStyles: Record<TypographySize, string> = {
  h1: "text-[96px] font-bold leading-[1] tracking-[-2.4px]",
  h2: "text-[60px] font-bold leading-[1]",
  h3: "text-[36px] font-bold leading-[1.2]",
  h4: "text-[24px] font-bold leading-[1.33]",
  body: "text-[18px] font-normal leading-[1.56]",
  "body-sm": "text-[14px] font-normal leading-[1.43]",
  caption: "text-[12px] font-normal leading-[1.33]",
};

export const defaultElements: Record<TypographySize, TypographyElement> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "span",
};

export const handwrittenOverrides: Partial<Record<TypographySize, string>> = {
  h1: "leading-[1.2]",
  h2: "leading-[1.2]",
  h3: "leading-[1.3]",
  h4: "leading-[1.4]",
  body: "leading-[1.6]",
};
