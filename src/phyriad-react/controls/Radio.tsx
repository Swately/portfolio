import type { ComponentProps, ReactNode } from 'react';
import styles from './Choice.module.css';

type RadioProps = {
  label: ReactNode;
} & Omit<ComponentProps<'input'>, 'type'>;

/**
 * `Checkbox`'s sibling — same skin, same one-label-row target. Radios come in
 * groups by nature: share `name` across them and put the group inside a
 * `Fieldset`, whose legend is the question the radios answer.
 */
export default function Radio({ label, className, style, ...rest }: RadioProps) {
  return (
    <label className={[styles.row, className].filter(Boolean).join(' ')} style={style}>
      <input type="radio" className={styles.box} {...rest} />
      <span>{label}</span>
    </label>
  );
}

// Made with my soul - Swately <3
