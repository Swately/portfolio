import { useEffect, useLayoutEffect, useRef, type ComponentProps, type ReactNode } from 'react';
import { mergeRefs } from '../mergeRefs';
import styles from './Table.module.css';

type TableProps = {
  /** A visible `<caption>` — what this table IS. Also names the scroll region. */
  caption: ReactNode;
  /** The real table markup: thead/tbody/th/td, written by the consumer. */
  children: ReactNode;
  /**
   * How wide the table may be. `measure` (default): the width of the block it sits in, as before 1.2.0.
   * `content`: as wide as its COLUMNS need, between that block and the window — the header cells are
   * counted and the table takes `clamp(100%, --phy-col-head + (columns - 1) x --phy-col, the block plus
   * the room on both sides of it)`, the room measured to the window edge minus the page gutter. It
   * grows evenly where both sides have room (centred in a centred layout) and into the larger side
   * where one has less. One rule at every screen ratio: a 3-column table stays narrow on an ultrawide,
   * a 7-column one gets the room the window has, and below its need it scrolls in this region.
   * Left-to-right pages only (the room is measured as left and right). A consumer that keeps something
   * in the margin caps it with the custom property `--phy-table-max` on any ancestor.
   */
  width?: 'measure' | 'content';
  /**
   * `even`: fixed layout, the first column `--phy-col-head` wide and every other column the same share —
   * for a comparison matrix, where each option deserves the same width. Default `auto` (the browser
   * shares width by minimum content, which can give a long cell a narrow column).
   */
  columns?: 'auto' | 'even';
  /** The first cell of every row stays in view while the table scrolls sideways (the row labels). */
  stickyFirst?: boolean;
  /**
   * The table sits on a surface (`.phy-surface`, tokens 1.6.0) and its rows part by TONE instead of lines:
   * header row on `--phy-paper-3` with its one structural rule kept, body rows alternating surface and
   * `--phy-paper-3`. The showcase palette's way of drawing a table; usable in any palette.
   */
  surface?: boolean;
} & ComponentProps<'table'>;

// Before paint where there is a DOM, so a content-width table never paints once at the measure first.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * A styled wrapper that keeps the CONSUMER writing the actual `<table>`
 * markup — thead, `<th scope>`, tbody — with zero lock-in (operator doctrine:
 * transferable, easy to adapt; a column-config API is how table components
 * stop being portable).
 *
 * What the wrapper owns: the visible `<caption>` (WCAG 1.3.1's "what is
 * this"), the accessible horizontal scroll region (`.phy-scroll-x`, keyboard
 * reachable, named after the caption via the aria-label prop the consumer
 * passes on the wrapper), and — in DEV — an audit that warns on `<th>`
 * without `scope`, because a header that does not say its axis silently
 * unmoors every cell it labels.
 *
 * Cells never break inside a word (1.2.0): the page's `overflow-wrap: anywhere` (reflow insurance)
 * used to reach the cells, so the automatic layout squeezed columns letter by letter instead of
 * scrolling. Links and code inside a cell may still break — a URL is one token. Widths: `width`,
 * `columns` and `stickyFirst`, all opt-in.
 */
export default function Table({
  caption,
  children,
  width = 'measure',
  columns = 'auto',
  stickyFirst = false,
  surface = false,
  className,
  style,
  ref: userRef,
  ...rest
}: TableProps) {
  const ref = useRef<HTMLTableElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  // The column count is read from the markup the consumer wrote (first row, colSpan included), not
  // declared twice. Only the opt-in modes need it.
  useIsoLayoutEffect(() => {
    if (width === 'measure' && columns === 'auto') return;
    const row = ref.current?.rows[0];
    const n = row ? Array.from(row.cells).reduce((sum, c) => sum + (c.colSpan || 1), 0) : 1;
    regionRef.current?.style.setProperty('--phy-cols', String(Math.max(1, n)));
  });

  // width="content" grows into the room the window really has on each side of the table's block,
  // measured, instead of assuming the block is centred: centred on a left-aligned column, a wide
  // table started 128 px off the left edge of a 1280 px window, where nothing can scroll to it.
  useIsoLayoutEffect(() => {
    const region = regionRef.current;
    const block = region?.parentElement;
    if (width !== 'content' || !region || !block) return;
    const measure = () => {
      const r = block.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      region.style.setProperty('--phy-table-left', `${Math.max(0, r.left)}px`);
      region.style.setProperty('--phy-table-right', `${Math.max(0, vw - r.right)}px`);
    };
    measure();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    // The block, and the page itself: in a capped, centred page the block keeps its size while the
    // window grows, so only the root's size says it moved. The resize event alone was not enough in
    // the Browser pane's emulation (measured: rooms stale from 1280 px at 2560, the table scrolling).
    ro?.observe(block);
    ro?.observe(document.documentElement);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const bare = ref.current?.querySelectorAll('th:not([scope])');
    if (bare?.length) {
      console.warn(
        `[Table] ${bare.length} <th> without scope. A header that does not say ` +
          'its axis (scope="col" / scope="row") unmoors the cells it labels ' +
          'for assistive tech (WCAG 1.3.1).',
        ref.current,
      );
    }
  });

  return (
    <div
      ref={regionRef}
      className={[
        'phy-scroll-x',
        styles.region,
        width === 'content' && styles.content,
        columns === 'even' && styles.even,
        stickyFirst && styles.sticky,
        surface && 'phy-surface',
        surface && styles.surfaced,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      role="region"
      aria-label={typeof caption === 'string' ? caption : undefined}
      tabIndex={0}
    >
      <table ref={mergeRefs(ref, userRef)} className={styles.table} {...rest}>
        <caption className={styles.caption}>{caption}</caption>
        {children}
      </table>
    </div>
  );
}

// Made with my soul - Swately <3
