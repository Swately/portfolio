import type { ComponentProps } from 'react';
import { useFieldContext } from './Field';
import inputStyles from './Input.module.css';
import styles from './Select.module.css';

/**
 * Native select, context-wired like `Input` and wearing the same skin.
 *
 * `appearance: none` removes the platform arrow, and the replacement chevron
 * is a border-drawn triangle on the wrapper's `::after` — NOT a data-URI SVG,
 * because that would hardcode a hex inside a component and the tokens rule
 * ("no literal colour ever appears in a component") exists precisely for
 * that. The chevron hides itself when the select is `multiple`/`size` (list
 * box: no popup, no chevron).
 */
export default function Select({ className, children, ...rest }: ComponentProps<'select'>) {
  const field = useFieldContext();
  return (
    <span className={styles.wrap}>
      <select
        id={field?.id}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        className={[inputStyles.control, styles.select, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </select>
    </span>
  );
}

// Made with my soul - Swately <3
