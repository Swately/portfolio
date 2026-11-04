import { useEffect, useState } from 'react';
import { Text } from '../phyriad-react';
import styles from './SectionSpine.module.css';

/**
 * Direction E of VISUAL_LANGUAGE_CONCEPT.md ("the spine", D-27/D-29): the section signposts of a long project
 * page, held in the left margin while the page scrolls, with the section being read marked by WEIGHT and a
 * HAIRLINE, never by colour (WCAG 1.4.1; forced colours keep both). Wide screens only: the CSS shows it where
 * the margin has room and hides the static `SectionNav` there, so exactly one of the two is ever in the
 * accessibility tree. It comes BEFORE the content in the DOM, so keyboard order matches what is seen.
 *
 * The current section is the last heading whose top has passed a line at a third of the window. Computed on
 * scroll, not animated: nothing here moves, so reduced motion has nothing to reduce.
 */
export default function SectionSpine({
  items,
  label = 'Secciones de la página',
}: {
  items: { id: string; title: string }[];
  label?: string;
}) {
  const [current, setCurrent] = useState<string | null>(null);
  // The ids, not the array: the shell builds a new array on every render.
  const ids = items.map((s) => s.id).join(' ');

  useEffect(() => {
    const list = ids.split(' ');
    const update = () => {
      const line = window.innerHeight / 3;
      let found: string | null = null;
      for (const id of list) {
        const h = document.getElementById(`${id}-h`);
        if (h && h.getBoundingClientRect().top <= line) found = id;
      }
      // A short last section never reaches the line: at the foot of the page it is the one being read
      // (measured: "Verificación" stayed unmarked, its predecessor held the mark).
      const atEnd =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setCurrent(atEnd ? (list[list.length - 1] ?? null) : (found ?? list[0] ?? null));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ids]);

  return (
    <nav aria-label={label} className={`${styles.spine} skin-spine`}>
      <ol className={styles.list}>
        {items.map((s) => (
          <li key={s.id}>
            <Text as="span" size="sm">
              <a
                href={`#${s.id}-h`}
                className={`phy-target ${styles.link}`}
                aria-current={current === s.id ? 'location' : undefined}
              >
                {s.title}
              </a>
            </Text>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Made with my soul - Swately <3
