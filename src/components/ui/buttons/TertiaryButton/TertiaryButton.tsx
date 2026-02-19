import type { JSX, ReactNode, ComponentProps } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/shadcn/button';
import { cn } from '@/lib/utils';

interface TertiaryButtonProps extends Omit<
  ComponentProps<typeof Button>,
  'variant'
> {
  children: ReactNode;
  fullWidth?: boolean;
  href?: string | { pathname: string; query?: Record<string, string> };
}

/**
 * Tertiary button - Soft sage background
 * Size controlled via className (default: px-10 py-5 text-lg)
 */
export function TertiaryButton({
  children,
  fullWidth = false,
  href,
  className,
  ...props
}: TertiaryButtonProps): JSX.Element {
  const buttonElement = (
    <Button
      className={cn(
        'h-auto rounded-full',
        'bg-sage text-dark',
        'px-10 py-5 text-lg font-semibold',
        'shadow-[0_2px_8px_0_rgba(212,228,212,0.4)]',
        'transition-all duration-200 ease-out',
        'hover:bg-sage/85 hover:scale-[1.02]',
        'hover:shadow-[0_4px_14px_0_rgba(212,228,212,0.6)]',
        'active:scale-[0.98] active:bg-sage/75',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );

  if (href) {
    return <Link href={href as any}>{buttonElement}</Link>;
  }

  return buttonElement;
}
