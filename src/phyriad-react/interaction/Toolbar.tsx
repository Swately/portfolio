import type { ComponentProps, KeyboardEvent, ReactNode } from 'react';
import Cluster from '../layout/Cluster';

type ToolbarProps = {
  /** Accessible name of the toolbar (site language). */
  label: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Cluster>, 'children' | 'as'>;

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * `role="toolbar"`: a named group of controls where the arrow keys move
 * between them (APG toolbar pattern). Stated deviation from the full pattern:
 * every control stays tabbable rather than the toolbar being one tab stop —
 * simpler, and a keyboard user loses nothing until a window carries several
 * long toolbars. Home/End jump to the ends.
 */
export default function Toolbar({ label, children, onKeyDown, ...rest }: ToolbarProps) {
  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) return;
    const i = items.indexOf(document.activeElement as HTMLElement);
    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else next = items.length - 1;
    e.preventDefault();
    items[next]?.focus();
  };
  return (
    <Cluster
      role="toolbar"
      aria-label={label}
      gap="xs"
      align="center"
      onKeyDown={handleKey}
      {...rest}
    >
      {children}
    </Cluster>
  );
}

// Made with my soul - Swately <3
