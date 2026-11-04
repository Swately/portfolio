import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react';
import { useId } from 'react';
import styles from './ErrorSummary.module.css';

export type SummaryError = {
  /** The id of the control to focus — supply it via `Field`'s `controlId`. */
  controlId: string;
  message: ReactNode;
};

type ErrorSummaryProps = {
  /** e.g. "Hay 3 errores en el formulario". Site language, so a prop. */
  title: ReactNode;
  errors: SummaryError[];
} & ComponentProps<'section'>;

/**
 * The loud path of a failed submit (WCAG 3.3.3): one box, every error, each a
 * link that takes the user TO its field.
 *
 * The announcement doctrine from S1/F0 converges here: **moving focus to the
 * summary IS the announcement.** No `role="alert"`, and no `Status` for
 * errors — either would double-announce on top of the focus move. (`Status`
 * keeps the success path, which moves no focus.)
 *
 * It focuses itself whenever it receives a NEW `errors` array — so the
 * contract is: build a fresh array per submit attempt, and a user who submits
 * a still-broken form is re-announced instead of left in silence.
 *
 * Each item is a real link, but the focus move is done in the handler:
 * a bare fragment jump does not reliably focus form controls.
 */
export default function ErrorSummary({ title, errors, className, ...rest }: ErrorSummaryProps) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();

  useEffect(() => {
    ref.current?.focus();
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={[styles.summary, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <p id={titleId} className={styles.title}>
        {title}
      </p>
      <ul className={styles.list}>
        {errors.map((e, i) => (
          <li key={i}>
            <a
              href={`#${e.controlId}`}
              onClick={(ev) => {
                ev.preventDefault();
                document.getElementById(e.controlId)?.focus();
              }}
            >
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Made with my soul - Swately <3
