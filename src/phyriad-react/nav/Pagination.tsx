import type { ComponentProps } from 'react';
import { Link } from '../router/router';
import styles from './Pagination.module.css';

type PaginationProps = {
  /** 1-based current page. */
  current: number;
  total: number;
  /**
   * Builds the route for a page number. A BUILDER, not a base path, so any
   * routing scheme adapts — `/blog/pagina/3`, `?p=3`, whatever the consumer
   * uses (operator doctrine: transferable, easy to adapt).
   */
  href: (page: number) => string;
  label?: string;
  prevLabel?: string;
  nextLabel?: string;
} & ComponentProps<'nav'>;

/**
 * Windowed page navigation: first and last always visible, a window around
 * the current page, ellipsis where pages are elided (marked aria-hidden — an
 * ellipsis is a picture of absence, not a stop). The current page is
 * `aria-current="page"` and not a link; prev/next at the ends become inert
 * text rather than disabled buttons, because a link that goes nowhere is not
 * a link.
 */
export default function Pagination({
  current,
  total,
  href,
  label = 'Pagination',
  prevLabel = '‹ Previous',
  nextLabel = 'Next ›',
  className,
  ...rest
}: PaginationProps) {
  // window: 1 … c-1 c c+1 … total (collapses naturally when total ≤ 7)
  const pages: (number | '…')[] = [];
  for (let p = 1; p <= total; p++) {
    const inWindow = p === 1 || p === total || Math.abs(p - current) <= 1;
    if (inWindow) pages.push(p);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  return (
    <nav aria-label={label} className={className} {...rest}>
      <ul className={styles.list}>
        <li>
          {current > 1 ? (
            <Link to={href(current - 1)} className="phy-target">
              {prevLabel}
            </Link>
          ) : (
            <span className={styles.inert}>{prevLabel}</span>
          )}
        </li>
        {pages.map((p, i) =>
          p === '…' ? (
            <li key={`e${i}`} aria-hidden="true" className={styles.ellipsis}>
              …
            </li>
          ) : (
            <li key={p}>
              {p === current ? (
                <span aria-current="page" className={styles.current}>
                  {p}
                </span>
              ) : (
                <Link to={href(p)} className="phy-target">
                  {p}
                </Link>
              )}
            </li>
          ),
        )}
        <li>
          {current < total ? (
            <Link to={href(current + 1)} className="phy-target">
              {nextLabel}
            </Link>
          ) : (
            <span className={styles.inert}>{nextLabel}</span>
          )}
        </li>
      </ul>
    </nav>
  );
}

// Made with my soul - Swately <3
