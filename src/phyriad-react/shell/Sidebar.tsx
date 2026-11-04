import type { ComponentProps, ElementType, ReactNode } from 'react';
import { spaceVar, type SpaceStep } from '../scale';
import styles from './Sidebar.module.css';

type SidebarProps = {
  as?: 'div' | 'section' | 'article';
  /** The narrow region: nav, filters, a table of contents. */
  sidebar: ReactNode;
  /** Which side it sits on when there is room for both. */
  side?: 'start' | 'end';
  /** Width the sidebar takes when side by side. */
  sideWidth?: string;
  /**
   * The width below which the main region refuses to shrink further, expressed
   * as a percentage of the whole. THIS is the switch: when the main region
   * cannot keep this share, the two wrap and stack. No breakpoint is involved.
   */
  contentMin?: string;
  gap?: SpaceStep;
} & Omit<ComponentProps<'div'>, 'children'> & { children: ReactNode };

/**
 * The sidebar layout, done intrinsically.
 *
 * It stacks when there is not enough room and sits side by side when there is,
 * WITHOUT a media query or a container query: the switch is `flex-wrap` acting
 * on a main region that declares a minimum share of the line. The layout
 * responds to its own content and the space it was given, which is the property
 * a breakpoint-driven sidebar never has — a device-width breakpoint is wrong the
 * moment the same component is placed in a narrower slot.
 *
 * `flex-grow: 999` on the main region is the trick that makes it take all the
 * slack while both fit on one line; the sidebar keeps its basis. When the main
 * region's `min-inline-size` can no longer be honoured, the line breaks.
 */
export default function Sidebar({
  as = 'div',
  sidebar,
  side = 'start',
  sideWidth = '16rem',
  contentMin = '60%',
  gap = 'l',
  className,
  style,
  children,
  ...rest
}: SidebarProps) {
  const Tag = as as ElementType;
  const aside = <div className={styles.side}>{sidebar}</div>;
  const main = <div className={styles.content}>{children}</div>;

  return (
    <Tag
      className={[styles.sidebar, className].filter(Boolean).join(' ')}
      style={{
        '--sidebar-gap': spaceVar(gap),
        '--sidebar-width': sideWidth,
        '--sidebar-content-min': contentMin,
        ...style,
      }}
      {...rest}
    >
      {side === 'start' ? aside : main}
      {side === 'start' ? main : aside}
    </Tag>
  );
}

// Made with my soul - Swately <3
