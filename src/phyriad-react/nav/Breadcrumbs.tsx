import type { ComponentProps, ReactNode } from 'react';
import { Link } from '../router/router';
import styles from './Breadcrumbs.module.css';

export type Crumb = {
  /** Route to link to. The LAST crumb is the current page: give it no `to`. */
  to?: string;
  label: ReactNode;
};

type BreadcrumbsProps = {
  items: Crumb[];
  /** Accessible name for the landmark — site language, so a prop. */
  label?: string;
} & ComponentProps<'nav'>;

/**
 * "Where am I": the ancestor trail, home first, current page last. The
 * current page is marked `aria-current="page"` and is NOT a link — a link to
 * where you already stand is noise. Separators are drawn by CSS content, so
 * they never reach the accessibility tree.
 *
 * (AAA territory — 2.4.8 — shipped as furniture, not conformance: NN/g finds
 * benefits and no downsides.)
 */
export default function Breadcrumbs({
  items,
  label = 'Breadcrumb',
  className,
  ...rest
}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className} {...rest}>
      <ol className={styles.trail}>
        {items.map((item, i) => (
          <li key={i} className={styles.crumb}>
            {item.to ? (
              <Link to={item.to} className="phy-target">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Made with my soul - Swately <3
