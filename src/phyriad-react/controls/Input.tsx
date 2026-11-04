import type { ComponentProps } from 'react';
import { useFieldContext } from './Field';
import styles from './Input.module.css';

/**
 * The text control, context-wired: inside a `Field` it receives the id,
 * aria-describedby and aria-invalid the field generated; standalone it is a
 * plain styled input. Explicit props always win over the context.
 *
 * The invalid look keys off the ATTRIBUTE (`[aria-invalid='true']` in the
 * module css), so the truth CSS paints is the same truth assistive tech
 * reads — one source, no class to forget.
 */
export default function Input({ className, ...rest }: ComponentProps<'input'>) {
  const field = useFieldContext();
  return (
    <input
      id={field?.id}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      className={[styles.control, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

// Made with my soul - Swately <3
