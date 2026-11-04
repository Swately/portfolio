import { Text } from '../phyriad-react';
import styles from './SectionNav.module.css';

/**
 * The signposts at the top of a long page (NN/g, Fold Manifesto: "signposts at the top of the page"): one
 * line of anchors to the sections below. Not a sidebar and not a table of contents that follows the reader;
 * the page is one column (design v2), and a five-to-ten-entry line is enough. The list is DATA the page
 * declares, not scraped from the DOM, and the tests assert every target exists.
 */
export default function SectionNav({
  items,
  label = 'En esta página',
}: {
  items: { id: string; title: string }[];
  label?: string;
}) {
  return (
    <nav aria-label={label}>
      <ul className={`${styles.list} skin-pills`}>
        {items.map((s) => (
          <li key={s.id}>
            <Text as="span" size="sm">
              <a href={`#${s.id}-h`} className="phy-target">
                {s.title}
              </a>
            </Text>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Made with my soul - Swately <3
