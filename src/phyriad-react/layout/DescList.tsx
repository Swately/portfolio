import type { ComponentProps } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styles from './DescList.module.css';

export type DescItem = { key: string; term: ReactNode; desc: ReactNode };

type DescListProps = {
  items: DescItem[];
  /** Width of the term column once the container has room for two. */
  termWidth?: string;
  className?: string;
} & Omit<ComponentProps<'div'>, 'children'>;

/**
 * A term/description list that goes two-column when it has the room and stacks
 * when it does not.
 *
 * This existed twice before, hand-written, with two different term widths
 * (10rem and 7rem) and the same magic `@media (max-width: 560px)` in both — the
 * same problem solved twice with numbers picked by eye.
 *
 * It adapts to ITS OWN CONTAINER, not to the viewport, which is the correct
 * dependency: the list's layout depends on how much space it was handed, not
 * on the size of the screen. That also means it stays right if it is ever put
 * in a card or a sidebar, where a viewport query would be wrong.
 *
 * The wrapper is not decoration: an element cannot query its own size, so the
 * container must be an ancestor of the thing the rules target.
 */
export default function DescList({
  items,
  termWidth = '10rem',
  className,
  ...rest
}: DescListProps) {
  return (
    <div className={['phy-container', className].filter(Boolean).join(' ')} {...rest}>
      {/* A custom property is not in React's CSSProperties keys, so the cast is
          the honest way to set one — not a workaround for a wrong type. */}
      <dl className={styles.list} style={{ '--dl-term': termWidth } as CSSProperties}>
        {items.map((item) => (
          <div className={styles.row} key={item.key}>
            <dt className={styles.term}>{item.term}</dt>
            <dd className={styles.desc}>{item.desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Made with my soul - Swately <3
