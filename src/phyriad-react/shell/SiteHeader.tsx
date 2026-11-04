import type { ComponentProps } from 'react';
import type { ReactNode } from 'react';
import { Link } from '../router/router';
import Stack from '../layout/Stack';
import Cluster from '../layout/Cluster';
import Text from '../text/Text';
import styles from './SiteHeader.module.css';

export type NavItem = { to: string; label: string };

type SiteHeaderProps = {
  /** The site's name. A node, not a string, so a wordmark or markup fits. */
  brand: ReactNode;
  tagline?: ReactNode;
  /** Site navigation. Omitted entirely on a site that has none — an empty nav
   *  landmark is noise for a screen-reader user. */
  nav?: NavItem[];
  /** Contact or identity line: location, email, profile links. */
  meta?: ReactNode[];
  navLabel?: string;
  className?: string;
} & Omit<ComponentProps<'div'>, 'children'>;

/**
 * The header a site repeats on every page: identity, optional navigation, and
 * an optional metadata line.
 *
 * The nav is a real `<nav>` with an accessible name, because a page can have
 * several navigation landmarks and "navigation" alone does not tell a screen
 * reader user which one they are in. It renders only when there are items:
 * shipping an empty landmark is worse than shipping none.
 */
export default function SiteHeader({
  brand,
  tagline,
  nav,
  meta,
  navLabel = 'Site',
  className,
  ...rest
}: SiteHeaderProps) {
  return (
    <Stack
      as="header"
      gap="xs"
      className={[styles.header, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Text as="h1" size="xl">
        {brand}
      </Text>

      {tagline && (
        <Text mono muted>
          {tagline}
        </Text>
      )}

      {nav && nav.length > 0 && (
        <nav aria-label={navLabel}>
          <Cluster as="ul" gap="m">
            {nav.map((item) => (
              <li key={item.to}>
                <Text as="span" size="sm">
                  <Link to={item.to} className="phy-target">
                    {item.label}
                  </Link>
                </Text>
              </li>
            ))}
          </Cluster>
        </nav>
      )}

      {meta && meta.length > 0 && (
        <Cluster as="ul" gap="xs" className={styles.meta}>
          {meta.map((node, i) => (
            <Text as="li" size="sm" key={i}>
              {node}
            </Text>
          ))}
        </Cluster>
      )}
    </Stack>
  );
}

// Made with my soul - Swately <3
