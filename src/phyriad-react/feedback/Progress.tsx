import { useId, type ComponentProps, type ReactNode } from 'react';
import VisuallyHidden from '../a11y/VisuallyHidden';
import styles from './Progress.module.css';

type ProgressProps = {
  /** The accessible name — always required; visible unless `labelHidden`. */
  label: ReactNode;
  labelHidden?: boolean;
  /** Current value; omit for an indeterminate bar. */
  value?: number;
  max?: number;
  /** The human reading beside the bar, e.g. "3 de 9". */
  valueText?: ReactNode;
} & Omit<ComponentProps<'progress'>, 'value' | 'max'>;

/**
 * Native `<progress>`: the platform supplies the role, the value semantics and
 * the indeterminate state; the substrate supplies the label discipline and the
 * ink colour via `accent-color` (both schemes). Space class: in-flow, full
 * inline size (C1).
 */
export default function Progress({
  label,
  labelHidden = false,
  value,
  max = 1,
  valueText,
  className,
  style,
  ...rest
}: ProgressProps) {
  const id = useId();
  // className and style dress the WRAPPER (the thing that takes space); the
  // remaining props reach the native <progress>.
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')} style={style}>
      {labelHidden ? (
        <VisuallyHidden as="span">
          <label htmlFor={id}>{label}</label>
        </VisuallyHidden>
      ) : (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <progress id={id} className={styles.bar} value={value} max={max} {...rest} />
      {valueText !== undefined && <span className={styles.value}>{valueText}</span>}
    </div>
  );
}

// Made with my soul - Swately <3
