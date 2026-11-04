import { useId, useState, type ComponentProps, type ReactNode } from 'react';
import Button from '../controls/Button';
import styles from './Panel.module.css';

type PanelProps = {
  /** The heading — pass a real heading element (`<Text as="h3">`) so the outline stays honest. */
  title: ReactNode;
  /** Controls that act on the panel: a toolbar, a close button, a menu. */
  actions?: ReactNode;
  /** Optional footer: totals, pagination, a status line. */
  footer?: ReactNode;
  /** Let the body scroll on its own instead of growing (needs a bounded height from the parent). */
  scroll?: boolean;
  /**
   * The header sticks to the top of the nearest SCROLLING ancestor — the
   * window's content region, or this panel's own body with `scroll`. Any
   * `overflow: hidden` ancestor in between breaks sticky; that is CSS, stated.
   */
  stickyHeader?: boolean;
  /**
   * A toggle in the header hides the body. The body STAYS MOUNTED (`hidden`),
   * so a collapsed form keeps its values (WINDOW_ROSTER C3). Controlled with
   * `collapsed` + `onCollapsedChange`, or uncontrolled with `defaultCollapsed`.
   */
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Copy for the toggle — site language, so props (C4). */
  collapseLabel?: string;
  expandLabel?: string;
  children: ReactNode;
} & Omit<ComponentProps<'section'>, 'title' | 'children'>;

/**
 * A titled surface inside a window: header (title + actions), body, optional
 * footer. A `section` named by its own title, so a screen reader can list the
 * panels of a window the way a sighted user scans them. The body is a plain
 * block by default; with `scroll` it becomes the panel's own scrolling region
 * (focusable and named after the title). Space class: in-flow; bounded with
 * `scroll` (C1).
 */
export default function Panel({
  title,
  actions,
  footer,
  scroll = false,
  stickyHeader = false,
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapseLabel = 'Collapse',
  expandLabel = 'Expand',
  children,
  className,
  ...rest
}: PanelProps) {
  const titleId = useId();
  const bodyId = useId();
  const [own, setOwn] = useState(defaultCollapsed);
  const isCollapsed = collapsible && (collapsed ?? own);
  const toggle = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) setOwn(next);
    onCollapsedChange?.(next);
  };
  const bodyClass = [styles.body, scroll ? 'phy-scroll-y' : ''].filter(Boolean).join(' ');
  return (
    <section
      aria-labelledby={titleId}
      className={[styles.panel, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <header
        className={[styles.header, stickyHeader ? styles.sticky : ''].filter(Boolean).join(' ')}
      >
        <div id={titleId} className={styles.title}>
          {title}
        </div>
        {(collapsible || actions) && (
          <div className={styles.actions}>
            {collapsible && (
              <Button onClick={toggle} aria-expanded={!isCollapsed} aria-controls={bodyId}>
                {isCollapsed ? expandLabel : collapseLabel}
              </Button>
            )}
            {actions}
          </div>
        )}
      </header>
      {scroll ? (
        <div
          id={bodyId}
          hidden={isCollapsed}
          className={bodyClass}
          tabIndex={0}
          aria-labelledby={titleId}
          role="region"
        >
          {children}
        </div>
      ) : (
        <div id={bodyId} hidden={isCollapsed} className={bodyClass}>
          {children}
        </div>
      )}
      {footer && (
        <footer hidden={isCollapsed} className={styles.footer}>
          {footer}
        </footer>
      )}
    </section>
  );
}

// Made with my soul - Swately <3
