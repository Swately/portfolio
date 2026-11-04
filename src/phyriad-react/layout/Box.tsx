import type { ComponentProps, ElementType } from 'react';
import { spaceVar, type SpaceStep } from '../scale';
import styles from './Box.module.css';

type BoxProps = {
  as?: 'div' | 'section' | 'article' | 'aside' | 'li' | 'figure';
  /** Padding step on the spacing scale. */
  padding?: SpaceStep;
  /** surface = card look (surface color + border + radius); plain = no chrome. */
  variant?: 'plain' | 'surface';
} & ComponentProps<'div'>;

/**
 * A padded surface: `padding` on the space scale, `variant="surface"` for the raised paper-2
 * box with a hairline. The smallest layout primitive — it owns padding so no component has to.
 */
export default function Box({
  as = 'div',
  padding = 'm',
  variant = 'plain',
  className,
  style,
  ...rest
}: BoxProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={[styles.box, variant === 'surface' && styles.surface, className]
        .filter(Boolean)
        .join(' ')}
      style={{ '--box-padding': spaceVar(padding), ...style }}
      {...rest}
    />
  );
}

// Made with my soul - Swately <3
