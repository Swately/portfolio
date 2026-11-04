import type { ComponentProps } from 'react';
import { createContext, useContext, useId, type ReactNode } from 'react';
import styles from './Field.module.css';

/**
 * What a control needs to be programmatically associated with its field.
 * Handed down via CONTEXT, not cloneElement: cloning breaks on wrapped
 * children and silently drops props, while context degrades to "the control
 * still works standalone". Explicit props on the control win over this.
 */
export const FieldContext = createContext<{
  id: string;
  describedBy?: string;
  invalid: boolean;
} | null>(null);

export function useFieldContext() {
  return useContext(FieldContext);
}

type FieldProps = {
  /** The visible label. Always — a placeholder is not a label. */
  label: ReactNode;
  /**
   * Explicit id for the control. Needed when something must LINK to the
   * control — `ErrorSummary` items focus fields by id, and `useId`'s
   * generated ids are private. Omitted, an id is generated.
   */
  controlId?: string;
  /** Optional help text, wired to the control via aria-describedby. */
  description?: ReactNode;
  /**
   * The current error. Its presence IS the invalid state: the control gets
   * `aria-invalid` and the message joins aria-describedby, so assistive tech
   * reads it with the control. Deliberately NO per-field role="alert" — the
   * loud path on submit belongs to the error summary + `Status`, and a page
   * of alert-firing fields is noise.
   */
  error?: ReactNode;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<'div'>, 'children'>;

/**
 * The association core of a form field (WCAG 3.3.2 / 3.3.1 / 1.3.1 / 4.1.2).
 *
 * Everything this component does is INVISIBLE, which is exactly why it exists:
 * label→control (`for`/`id`), description and error→control
 * (`aria-describedby`, description first, error last), machine-readable
 * invalidity (`aria-invalid`). Hand-wiring those ids is the discipline that
 * silently rots; `Field` owns it so a consumer cannot forget it.
 */
export default function Field({
  label,
  controlId,
  description,
  error,
  children,
  className,
  ...rest
}: FieldProps) {
  const base = useId();
  const id = controlId ?? `${base}-control`;
  const descId = `${base}-desc`;
  const errId = `${base}-err`;
  const describedBy =
    [description ? descId : null, error ? errId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')} {...rest}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {description && (
        <p id={descId} className={styles.description}>
          {description}
        </p>
      )}
      <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error) }}>
        {children}
      </FieldContext.Provider>
      {error && (
        <p id={errId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

// Made with my soul - Swately <3
