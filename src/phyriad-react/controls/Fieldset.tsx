import { useId, type ComponentProps, type ReactNode } from 'react';
import styles from './Fieldset.module.css';

type FieldsetProps = {
  /** The question the grouped controls answer — a real `<legend>`. */
  legend: ReactNode;
  description?: ReactNode;
  /** Group-level error, wired to the GROUP via aria-describedby. */
  error?: ReactNode;
  children: ReactNode;
} & ComponentProps<'fieldset'>;

/**
 * A real `<fieldset>`/`<legend>` — the group semantics WCAG 1.3.1 wants for
 * related choices (a radio group, a set of checkboxes). Description and error
 * attach to the GROUP: `aria-describedby` sits on the fieldset itself, so the
 * group's error is read when the group is entered, not glued onto one
 * arbitrary member.
 */
export default function Fieldset({
  legend,
  description,
  error,
  children,
  className,
  ...rest
}: FieldsetProps) {
  const base = useId();
  const descId = `${base}-desc`;
  const errId = `${base}-err`;
  const describedBy =
    [description ? descId : null, error ? errId : null].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      aria-describedby={describedBy}
      className={[styles.fieldset, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <legend className={styles.legend}>{legend}</legend>
      {description && (
        <p id={descId} className={styles.description}>
          {description}
        </p>
      )}
      <div className={styles.choices}>{children}</div>
      {error && (
        <p id={errId} className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

// Made with my soul - Swately <3
