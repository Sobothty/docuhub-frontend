import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const hoverFillButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs sm:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] group',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground border border-[var(--accent)]',
        ghost: 'bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-8 sm:h-9 px-3 sm:px-4 py-1.5 sm:py-2',
        sm: 'h-7 sm:h-8 rounded-md gap-1 sm:gap-1.5 px-2 sm:px-3',
        lg: 'h-9 sm:h-10 rounded-md px-5 sm:px-6',
        icon: 'size-8 sm:size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function HoverFillButton({
  className,
  variant,
  size,
  strokeIcon,
  fillIcon,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof hoverFillButtonVariants> & {
    asChild?: boolean;
    strokeIcon: React.ReactNode;
    fillIcon: React.ReactNode;
    children?: React.ReactNode;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="hover-fill-button"
      className={cn(hoverFillButtonVariants({ variant, size, className }))}
      {...props}
    >
      {/* Stroke icon (default) */}
      <span className="block group-hover:hidden">{strokeIcon}</span>

      {/* Fill icon (on hover) */}
      <span className="hidden group-hover:block">{fillIcon}</span>

      {children && <span>{children}</span>}
    </Comp>
  );
}

export { HoverFillButton, hoverFillButtonVariants };
