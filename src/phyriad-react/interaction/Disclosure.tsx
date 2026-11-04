import type { ComponentProps, ReactNode } from 'react';
import styles from './Disclosure.module.css';

type DisclosureProps = {
  /** The always-visible line — the question, the section name. */
  summary: ReactNode;
  children: ReactNode;
} & ComponentProps<'details'>;

/**
 * Native `<details>/<summary>`: open/close, keyboard operation and semantics
 * come from the platform — the substrate only dresses it (marker hidden, a
 * token-colour chevron that rotates on `[open]`). The native `open` attribute
 * and `onToggle` pass straight through, so both uncontrolled and observed
 * usage work the way the platform defines them.
 */
export default function Disclosure({ summary, children, className, ...rest }: DisclosureProps) {
  return (
    <details className={[styles.disclosure, className].filter(Boolean).join(' ')} {...rest}>
      <summary className={styles.summary}>{summary}</summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}

// Made with my soul - Swately <3
