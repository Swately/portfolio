import { useId, useState, type ComponentProps, type ReactNode } from 'react';
import Splitter from './Splitter';
import styles from './WindowFrame.module.css';

type WindowFrameProps = {
  /** Static bar across the top: toolbar, title, search. */
  top?: ReactNode;
  /** Static bar across the bottom: status, breadcrumbs, live messages. */
  bottom?: ReactNode;
  /** Leading panel: menu, tree, filters. Scrolls on its own. */
  start?: ReactNode;
  /** Trailing panel: details, properties, a gallery. Scrolls on its own. */
  end?: ReactNode;
  /** Accessible names — site language, so props, not constants. */
  contentLabel: string;
  startLabel?: string;
  endLabel?: string;
  /** Panel widths when side by side (a CSS length; a px value seeds the resizable state). */
  startWidth?: string;
  endWidth?: string;
  /**
   * Resizable panels: a `Splitter` on the shared edge (24 px hit area straddling
   * the hairline, inert below 56rem where the panels stack). The frame owns the
   * width; `onStartResize` / `onEndResize` report pixels for persistence.
   */
  resizableStart?: boolean;
  resizableEnd?: boolean;
  startMin?: number;
  startMax?: number;
  endMin?: number;
  endMax?: number;
  onStartResize?: (px: number) => void;
  onEndResize?: (px: number) => void;
  /** Accessible names of the two splitters (site language). */
  startSplitterLabel?: string;
  endSplitterLabel?: string;
  /** The content: the ONE region that scrolls with the wheel by default. */
  children: ReactNode;
} & Omit<ComponentProps<'div'>, 'children'>;

/**
 * An application window: a 100svh grid with static furniture and ONE scrolling
 * content region. Mount it as the page of a `window` route (AppShell then
 * renders no site chrome), never inside a scrolling document — two scrollers
 * is the defect this component exists to prevent.
 *
 * Landmarks: the frame lives inside the routed `main`, so its bars are plain
 * `header`/`footer` (not banner/contentinfo there) and its panels are named
 * `aside`s. Every region that scrolls is focusable and named (axe:
 * scrollable-region-focusable) — a keyboard user must be able to reach a list
 * that only the wheel would otherwise move.
 *
 * Below 56rem of the frame's own width the window becomes a document: the
 * regions stack (top, start, content, end, bottom), the frame grows to its
 * content and the PAGE scrolls; the panels keep a capped scroll of their own.
 * Measured before this rule: a 100svh frame at 320 x 800 left the content
 * region 32px tall. A container query on the wrapper, since a grid cannot
 * query its own width.
 */
export default function WindowFrame({
  top,
  bottom,
  start,
  end,
  contentLabel,
  startLabel = 'Start panel',
  endLabel = 'End panel',
  startWidth = '16rem',
  endWidth = '18rem',
  resizableStart = false,
  resizableEnd = false,
  startMin = 160,
  startMax = 640,
  endMin = 160,
  endMax = 640,
  onStartResize,
  onEndResize,
  startSplitterLabel = 'Start panel width',
  endSplitterLabel = 'End panel width',
  children,
  className,
  style,
  ...rest
}: WindowFrameProps) {
  const id = useId();
  const startId = `${id}-start`;
  const endId = `${id}-end`;
  // The resizable state, seeded from a px width when given (16rem otherwise).
  const px = (v: string, fallback: number) =>
    /^\d+(\.\d+)?px$/.test(v) ? parseFloat(v) : fallback;
  const [startPx, setStartPx] = useState(() => px(startWidth, 256));
  const [endPx, setEndPx] = useState(() => px(endWidth, 288));
  const startSize = resizableStart ? `${startPx}px` : startWidth;
  const endSize = resizableEnd ? `${endPx}px` : endWidth;
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')} {...rest}>
      <div
        className={styles.frame}
        style={{ '--window-start': startSize, '--window-end': endSize, ...style }}
      >
        {top && <header className={styles.top}>{top}</header>}
        {start && (
          // A scrolling region must be reachable by keyboard (axe: scrollable-region-focusable);
          // the lint rule cannot see that it scrolls.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <aside id={startId} className={styles.start} aria-label={startLabel} tabIndex={0}>
            {start}
          </aside>
        )}
        {start && resizableStart && (
          <Splitter
            label={startSplitterLabel}
            controls={startId}
            side="start"
            value={startPx}
            defaultValue={px(startWidth, 256)}
            min={startMin}
            max={startMax}
            onValueChange={(n) => {
              setStartPx(n);
              onStartResize?.(n);
            }}
            className={styles.splitStart}
          />
        )}
        <div className={styles.content} role="region" aria-label={contentLabel} tabIndex={0}>
          {children}
        </div>
        {end && (
          // A scrolling region must be reachable by keyboard (axe: scrollable-region-focusable);
          // the lint rule cannot see that it scrolls.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <aside id={endId} className={styles.end} aria-label={endLabel} tabIndex={0}>
            {end}
          </aside>
        )}
        {end && resizableEnd && (
          <Splitter
            label={endSplitterLabel}
            controls={endId}
            side="end"
            value={endPx}
            defaultValue={px(endWidth, 288)}
            min={endMin}
            max={endMax}
            onValueChange={(n) => {
              setEndPx(n);
              onEndResize?.(n);
            }}
            className={styles.splitEnd}
          />
        )}
        {bottom && <footer className={styles.bottom}>{bottom}</footer>}
      </div>
    </div>
  );
}

// Made with my soul - Swately <3
