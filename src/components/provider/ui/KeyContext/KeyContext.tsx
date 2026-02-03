import type { JSX } from "react";
import { FileText, Check } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface KeyContextProps {
  items: string[];
  className?: string;
}

/**
 * Key context section with bullet list
 * Gray background with checkmark icons
 */
export function KeyContext({ items, className }: KeyContextProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-2xl bg-stone px-5 pb-5 pt-7",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-dark" />
        <Typography size="h4" className="text-dark">
          Key Context
        </Typography>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
            <Typography size="body-sm" className="text-dark">
              {item}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}
