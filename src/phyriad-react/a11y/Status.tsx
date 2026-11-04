import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react';

type StatusProps = {
  /** The current message. Empty when there is nothing to say — see below. */
  children?: ReactNode;
  /**
   * `role="alert"` instead of `role="status"`: announces IMMEDIATELY,
   * interrupting whatever the screen reader was saying. Errors only —
   * an interruption for "saved ✓" is hostile.
   */
  assertive?: boolean;
  /** Hide visually while staying announced (reuses `.phy-visually-hidden`). */
  visuallyHidden?: boolean;
} & ComponentProps<'div'>;

/**
 * A live region for messages that do NOT take focus (WCAG 4.1.3): "saved",
 * "3 results", a background error. Route changes are NOT this — the shell
 * moves focus for those, and announcing them here too would double-announce.
 *
 * THE DISCIPLINE, and why this exists as a component: screen readers announce
 * *changes* to a region that is already in the accessibility tree. Mounting
 * the region together WITH its message — the obvious way to write it — is
 * exactly the case they are allowed to ignore. So: **mount it empty, keep it
 * mounted, inject the message later.** In development, mounting with content
 * warns, because the failure is otherwise silence — the one symptom nobody
 * notices.
 *
 * `role="status"` carries implicit `aria-live="polite"` and `aria-atomic`;
 * `role="alert"` carries assertive. The implicit semantics are trusted rather
 * than restated as attributes. No styling of its own: it is a semantic region
 * and the content belongs to the consumer.
 */
export default function Status({
  children,
  assertive = false,
  visuallyHidden = false,
  className,
  ...rest
}: StatusProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (ref.current?.textContent) {
      console.warn(
        '[Status] mounted WITH content. Screen readers announce changes to an ' +
          'existing live region and may stay silent about one that appears ' +
          'already filled. Mount it empty and inject the message afterwards.',
      );
    }
    // Mount-only on purpose: later renders are the legitimate injections.
  }, []);

  return (
    <div
      ref={ref}
      role={assertive ? 'alert' : 'status'}
      className={[visuallyHidden && 'phy-visually-hidden', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

// Made with my soul - Swately <3
