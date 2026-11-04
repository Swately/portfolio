import type { ComponentProps } from 'react';
import Button from '../controls/Button';
import { dismiss, pauseTimers, resumeTimers, useToasts } from './toasts';
import styles from './Toaster.module.css';

type ToasterProps = {
  /** Accessible name of the stack's region (site language). */
  label?: string;
  /** Name of every toast's dismiss button. */
  dismissLabel?: string;
} & Omit<ComponentProps<'div'>, 'children'>;

/**
 * The notification stack. Mount ONE per window (or page), anywhere: it is a
 * fixed region at the inline-end top that never affects layout, with
 * `pointer-events: none` on the region itself so an empty stack blocks
 * nothing. Info and success toasts are `status` (polite); errors are `alert`.
 * Not the top layer on purpose: a toast must not compete with a dialog for it,
 * and `popover` would light-dismiss on the first click elsewhere.
 */
export default function Toaster({
  label = 'Notifications',
  dismissLabel = 'Dismiss',
  className,
  ...rest
}: ToasterProps) {
  const toasts = useToasts();
  return (
    <div
      role="region"
      aria-label={label}
      className={[styles.region, className].filter(Boolean).join(' ')}
      onMouseEnter={pauseTimers}
      onMouseLeave={resumeTimers}
      onFocus={pauseTimers}
      onBlur={resumeTimers}
      {...rest}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === 'error' ? 'alert' : 'status'}
          className={[styles.toast, styles[t.kind]].join(' ')}
        >
          <div className={styles.text}>
            <div className={styles.title}>{t.title}</div>
            {t.body && <div className={styles.body}>{t.body}</div>}
          </div>
          {t.action}
          <Button onClick={() => dismiss(t.id)} aria-label={dismissLabel}>
            ×
          </Button>
        </div>
      ))}
    </div>
  );
}

// Made with my soul - Swately <3
