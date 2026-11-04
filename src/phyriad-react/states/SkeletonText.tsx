import Skeleton from './Skeleton';
import { spaceVar, type SpaceStep } from '../scale';
import type { ComponentProps } from 'react';

type SkeletonTextProps = {
  lines?: number;
  /** Width of the LAST line — a real paragraph never ends flush. */
  lastLine?: string;
  gap?: SpaceStep;
} & ComponentProps<'span'>;

/**
 * The text shape — 80% of every skeleton is "some lines of text".
 *
 * Heights are in `em` ON PURPOSE, and that is the whole trick: dropped inside
 * a heading it produces thick lines, inside a caption thin ones, on a page
 * with a different type scale it adapts without a single parameter — the
 * skeleton inherits the typography of wherever it stands, exactly like the
 * text it stands for. Hardcoded pixel skeletons are how a placeholder ends up
 * lying about the layout it placeholds.
 */
export default function SkeletonText({
  lines = 3,
  lastLine = '60%',
  gap = 'xs',
  className,
  style,
  ...rest
}: SkeletonTextProps) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: spaceVar(gap), ...style }}
      {...rest}
    >
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height="1em" width={i === lines - 1 ? lastLine : '100%'} />
      ))}
    </span>
  );
}

// Made with my soul - Swately <3
