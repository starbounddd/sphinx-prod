import type { JSX } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/shadcn/card';
import { Typography } from '@/components/ui/typography';

type QuoteCardVariant = 'sage' | 'lavender' | 'coral';

interface QuoteCardProps {
  quote: string;
  analysis: string;
  variant?: QuoteCardVariant;
  className?: string;
}

const variantStyles: Record<QuoteCardVariant, string> = {
  sage: 'bg-sage',
  lavender: 'bg-lavender',
  coral: 'bg-coral/30',
};

export function QuoteCard({
  quote,
  analysis,
  variant = 'sage',
  className,
}: QuoteCardProps): JSX.Element {
  return (
    <Card
      className={cn(
        'flex flex-col overflow-hidden rounded-3xl border-0 shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05)]',
        className
      )}
    >
      <div
        className={cn(
          'flex min-h-[240px] items-center justify-center px-6 py-16',
          variantStyles[variant]
        )}
      >
        <Typography font="handwritten" size="h2" align="center">
          &ldquo;{quote}&rdquo;
        </Typography>
      </div>

      <div className="flex min-h-[200px] items-center justify-center bg-white px-6 py-16">
        <Typography size="body" align="center" className="font-medium">
          {analysis}
        </Typography>
      </div>
    </Card>
  );
}
