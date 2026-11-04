import type { ComponentProps } from 'react';
import { useFieldContext } from './Field';
import styles from './Input.module.css';

/** `Input`'s multiline sibling — same context wiring, same attribute-keyed
 *  invalid state, same skin (they share Input.module.css on purpose: two
 *  files drifting apart is how a form stops looking like one form). */
export default function TextArea({ className, rows = 4, ...rest }: ComponentProps<'textarea'>) {
  const field = useFieldContext();
  return (
    <textarea
      id={field?.id}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      rows={rows}
      className={[styles.control, styles.multiline, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

// Made with my soul - Swately <3
