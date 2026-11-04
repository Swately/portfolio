import type { ComponentProps, ReactNode } from 'react';

type ScrollRegionProps = {
  /** Accessible name: a keyboard user lands here by Tab and must know what scrolls. */
  label: string;
  /** Cap; the region scrolls past it. Any length. */
  maxBlockSize?: string;
  children: ReactNode;
} & Omit<ComponentProps<'div'>, 'children'>;

/**
 * A vertically scrolling region that a keyboard can reach: focusable, named,
 * overscroll contained, with the base layer's shadow affordance
 * (`.phy-scroll-y`). Use it for a long list or log inside a panel; the
 * window's own regions already have this contract built in.
 */
export default function ScrollRegion({
  label,
  maxBlockSize,
  children,
  className,
  style,
  ...rest
}: ScrollRegionProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={['phy-scroll-y', className].filter(Boolean).join(' ')}
      style={maxBlockSize ? { '--phy-scroll-max': maxBlockSize, ...style } : style}
      {...rest}
    >
      {children}
    </div>
  );
}

// Made with my soul - Swately <3
