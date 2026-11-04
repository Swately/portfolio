import type { ComponentProps, ReactNode } from 'react';
import styles from './Empty.module.css';

type EmptyProps = {
  /** What is empty — "Sin resultados", "Aún no hay proyectos". */
  title: ReactNode;
  /** Why, or what to do about it. */
  hint?: ReactNode;
  /** An action that fills the emptiness — typically a `Button` or a `Link`. */
  action?: ReactNode;
} & ComponentProps<'div'>;

/**
 * The state a happy-path mock never shows. Text-first like everything here:
 * a raised block, a hairline, words — no illustration, no mascot. The `action`
 * slot exists because the best empty state says what to DO, not just what is
 * missing.
 */
export default function Empty({ title, hint, action, className, ...rest }: EmptyProps) {
  return (
    <div className={[styles.empty, className].filter(Boolean).join(' ')} {...rest}>
      <p className={styles.title}>{title}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

// Made with my soul - Swately <3
