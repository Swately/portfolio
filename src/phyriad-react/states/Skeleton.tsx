import type { ComponentProps } from 'react';
import styles from './Skeleton.module.css';

type SkeletonProps = {
  /** CSS sizes; numbers mean px. Defaults: a text line (100% × 1em). */
  width?: string | number;
  height?: string | number;
} & ComponentProps<'span'>;

/**
 * A pulsing placeholder block — the operator-directed loading look (skeletons
 * whose blink says "something is coming", à la op.gg, translated to paper).
 *
 * `aria-hidden` ALWAYS: a skeleton is visual-only. The accessible loading
 * state is the consumer's `aria-busy` on the region plus a `Status`
 * announcement — a screen reader user should hear "cargando…", not meet a
 * field of unlabeled grey boxes.
 *
 * One reconciliation with the identity, on the record: the motion rule says
 * "interaction only", and this pulses unprompted — but a loading pulse is
 * STATE FEEDBACK about an ongoing process, not decoration. It still dies
 * under prefers-reduced-motion. And it is a blink (opacity), not a shimmer
 * sweep: the gradient sweep is the template look.
 */
export default function Skeleton({ width, height, className, style, ...rest }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      style={{
        inlineSize: width ?? '100%',
        blockSize: height ?? '1em',
        ...style,
      }}
      {...rest}
    />
  );
}

// Made with my soul - Swately <3
