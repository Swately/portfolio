import {
  useEffect,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type ElementType,
} from 'react';
import { spaceVar, type SpaceStep } from '../scale';
import styles from './Container.module.css';

type ContainerProps = {
  as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer' | 'nav' | 'ul' | 'li';
  /**
   * How many columns of the PARENT grid this takes.
   * Omitted, it takes the whole width of the slot it lands in (`1 / -1`) — a
   * container should not need to know where it is in order to fill it.
   */
  span?: number;
  /** Start on a specific column line of the parent, instead of flowing. */
  start?: number;
  gap?: SpaceStep;
  rowGap?: SpaceStep;
} & Omit<ComponentProps<'div'>, 'children'> & { children?: React.ReactNode };

/**
 * `cols` and `subgrid` are mutually exclusive IN THE TYPE, not checked at
 * runtime: a container cannot both invent lines and inherit them, and a
 * compile error says so before the page is ever rendered. A runtime throw
 * would also have had to sit between two hooks, which breaks the rules of
 * hooks — the type is both stricter and simpler.
 */
type Subdividing = {
  /**
   * Subdivide into N LOCAL columns — the container's own lines, which do NOT
   * align with the page. Correct inside a card, wrong for a page region.
   */
  cols?: number;
  subgrid?: false;
};

type Inheriting = {
  cols?: never;
  /**
   * INHERIT the parent's column lines, so what is inside lands on the same
   * lines as what is outside. What you want for a page region.
   */
  subgrid: true;
};

type Props = ContainerProps & (Subdividing | Inheriting);

/**
 * A box that fills the space it is given and can subdivide it.
 *
 * Three questions, three props, and keeping them separate is the point:
 *   `span`    — how much of the parent do I take?   (default: all of it)
 *   `cols`    — into how many columns do I divide?  (my own, local)
 *   `subgrid` — or do I inherit the parent's lines? (aligned with the page)
 *
 * `cols` and `subgrid` are NOT interchangeable, and picking the wrong one has
 * no visible symptom — it just quietly stops aligning. A container that divides
 * itself into 6 inside a parent of 12 produces six lines that coincide with the
 * page's only by arithmetic accident; that is the failure mode of every classic
 * 12-column framework. Use `cols` where local subdivision is what you mean (the
 * inside of a card), `subgrid` where alignment is the whole point (a page
 * region).
 *
 * In development, a `subgrid` container whose parent is not a grid warns —
 * because subgrid silently degrades instead of erroring, and the result looks
 * almost right.
 */
export default function Container({
  as = 'div',
  span,
  start,
  cols,
  subgrid = false,
  gap = 'l',
  rowGap,
  className,
  style,
  children,
  ...rest
}: Props) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!import.meta.env.DEV || !subgrid) return;
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const display = getComputedStyle(parent).display;
    if (display !== 'grid' && display !== 'inline-grid') {
      console.warn(
        '[Container] `subgrid` needs a grid parent to inherit lines from; this ' +
          `one's parent is display: ${display}. The subgrid will be ignored and ` +
          'the content will not align with the page grid.',
        ref.current,
      );
    }
  }, [subgrid]);

  // No span: fill the slot, whatever it is. That is the default a container
  // should have — it needs no knowledge of its surroundings to be correct.
  const gridColumn =
    span === undefined
      ? '1 / -1'
      : start === undefined
        ? `span ${span}`
        : `col ${start} / span ${span}`;

  return (
    <Tag
      ref={ref}
      className={[
        styles.container,
        (cols !== undefined || subgrid) && styles.grid,
        subgrid && styles.subgrid,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--c-column': gridColumn,
          ...(cols !== undefined ? { '--c-cols': String(cols) } : {}),
          '--c-gap': spaceVar(gap),
          '--c-row-gap': spaceVar(rowGap ?? gap),
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Made with my soul - Swately <3
