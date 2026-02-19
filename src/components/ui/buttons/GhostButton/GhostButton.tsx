import type { JSX, ReactNode, ComponentProps } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/shadcn/button';
import { cn } from '@/lib/utils';

interface GhostButtonProps extends Omit<
  ComponentProps<typeof Button>,
  'variant'
> {
  children: ReactNode;
  fullWidth?: boolean;
  href?: string | { pathname: string; query?: Record<string, string> };
}

/**
 * Ghost button - transparent until interaction
 * Size controlled via className (default: px-10 py-5 text-lg)
 */
export function GhostButton({
  children,
  fullWidth = false,
  href,
  className,
  ...props
}: GhostButtonProps): JSX.Element {
  const buttonElement = (
    <Button
      variant="ghost"
      className={cn(
        'h-auto rounded-full',
        'bg-transparent text-dark',
        'px-10 py-5 text-lg font-semibold',
        'transition-all duration-200 ease-out',
        'hover:bg-dark/8 hover:scale-[1.02]',
        'active:scale-[0.98] active:bg-dark/12',
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
