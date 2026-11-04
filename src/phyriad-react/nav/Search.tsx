import type { ComponentProps } from 'react';
import { createElement, type ReactNode } from 'react';

type SearchProps = {
  /** Needed when a page has more than one search landmark. */
  label?: string;
  /** The search UI — compose Field/Input/Button; the ENGINE is the consumer's. */
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<'div'>, 'children'>;

/**
 * The `search` landmark, via the native `<search>` element (Baseline since
 * Oct 2023 — verified in the anatomy research; it carries the role
 * implicitly, so no `role="search"` bolt-on). The substrate ships the
 * accessible SURFACE only: what performs the search — the engine, the
 * sorting, the data — belongs to the consuming project (operator doctrine:
 * transferable, easy to adapt).
 *
 * `createElement('search', …)` because the React JSX types in use do not
 * know the element yet; the DOM does.
 */
export default function Search({ label, children, className, ...rest }: SearchProps) {
  return createElement('search', { 'aria-label': label, className, ...rest }, children);
}

// Made with my soul - Swately <3
