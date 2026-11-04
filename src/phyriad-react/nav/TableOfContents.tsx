import type { ComponentProps, ReactNode } from 'react';
import styles from './TableOfContents.module.css';

export type TocItem = {
  /** The id of the heading it points to. The CONSUMER owns the ids — no magic
   *  heading-scraping, which breaks the moment a heading moves (operator
   *  doctrine: transferable and predictable beats clever). */
  id: string;
  label: ReactNode;
  children?: TocItem[];
};

type TableOfContentsProps = {
  items: TocItem[];
  label?: string;
} & ComponentProps<'nav'>;

function Level({ items }: { items: TocItem[] }) {
  return (
    <ol className={styles.level}>
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="phy-target">
            {item.label}
          </a>
          {item.children && item.children.length > 0 && <Level items={item.children} />}
        </li>
      ))}
    </ol>
  );
}

/**
 * The within-page jump list for long documents. Plain fragment links —
 * headings are not focusable, and the native jump is exactly the right
 * behaviour for reading positions (unlike form controls, where ErrorSummary
 * has to focus by hand).
 */
export default function TableOfContents({
  items,
  label = 'On this page',
  className,
  ...rest
}: TableOfContentsProps) {
  return (
    <nav aria-label={label} className={className} {...rest}>
      <Level items={items} />
    </nav>
  );
}

// Made with my soul - Swately <3
