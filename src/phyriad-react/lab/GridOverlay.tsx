import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './GridOverlay.module.css';

/**
 * The page's real column grid, drawn over the page.
 *
 * This replaces a static demo that drew twelve boxes INSIDE the content area —
 * which showed twelve of something, aligned with nothing. A column overlay is
 * only useful if it lands on the same lines the layout uses, so this one is
 * `position: fixed` over the viewport and repeats the grid's own declarations:
 * same track count, same `--phy-grid-gap`, same `--phy-grid-margin`. If content
 * does not sit on these lines, the layout is wrong — that is the whole point of
 * looking.
 *
 * `pointer-events: none` so it never intercepts a click, and `aria-hidden`
 * because it is a ruler, not content.
 *
 * BOTH parts render through a PORTAL to `document.body`, and that is not
 * incidental. `position: fixed` anchors to the viewport only while no ancestor
 * establishes a containing block — and `container-type: inline-size`, which the
 * page grid's wrapper needs in order to run its own container query, does
 * exactly that. Rendered in place, the overlay anchored to the wrapper AND
 * inherited a grid column, so it drew twelve 19px columns ending at 516px
 * instead of spanning the window. Measured, not guessed. The portal takes it
 * out of both.
 */
export default function GridOverlay({ columns = 12 }: { columns?: number }) {
  const [on, setOn] = useState(false);

  // `g` toggles it, the way design tools do. Ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) setOn((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <button type="button" className={styles.toggle} onClick={() => setOn((v) => !v)}>
        {on ? 'Ocultar rejilla' : 'Mostrar rejilla'} <kbd>g</kbd>
      </button>
      {on && (
        <div className={styles.overlay} aria-hidden="true">
          {Array.from({ length: columns }, (_, i) => (
            <span className={styles.col} key={i}>
              {i + 1}
            </span>
          ))}
        </div>
      )}
    </>,
    document.body,
  );
}

// Made with my soul - Swately <3
