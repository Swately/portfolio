import type { ComponentProps, ReactNode } from 'react';
import styles from './Choice.module.css';

type CheckboxProps = {
  /** The visible label. The whole row is the label, so the row is the target. */
  label: ReactNode;
} & Omit<ComponentProps<'input'>, 'type'>;

/**
 * Native checkbox with `accent-color`: no custom drawing, platform
 * accessibility intact, ink doctrine for free. A single checkbox carries its
 * own label (this prop) rather than living inside a `Field`; a GROUP of them
 * belongs in a `Fieldset`, whose legend names the group.
 */
export default function Checkbox({ label, className, style, ...rest }: CheckboxProps) {
  return (
    <label className={[styles.row, className].filter(Boolean).join(' ')} style={style}>
      <input type="checkbox" className={styles.box} {...rest} />
      <span>{label}</span>
    </label>
  );
}

// Made with my soul - Swately <3
