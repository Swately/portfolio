import { Disclosure, Text } from '../phyriad-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Evidence } from '../content';
import { assetUrl } from '../lib/assets';
import styles from './Figure.module.css';

type FigureEvidence = Extract<Evidence, { kind: 'figure' }>;

/**
 * A project's own diagram or capture.
 *
 * The mobile problem this solves: these diagrams are ~2000px wide. Fitted into
 * a 60ch column on a 375px screen they render about 307px across, which makes
 * their labels unreadable — the figure is present but carries no information.
 * So the image keeps a legible minimum width and lives inside a horizontal
 * scroll region: it scrolls on a phone and fits without scrolling on a desktop,
 * where the column is already wider than that minimum.
 *
 * `tabindex` is applied ONLY while the region actually overflows. A permanent
 * tab stop on a region that fits is an empty stop for keyboard users; a
 * scrollable region with no tab stop is unreachable by keyboard. Both are
 * defects, so the state is measured rather than assumed.
 *
 * Ported from climx's EstadoCard/MuniHeader image handling, with two deliberate
 * reversals of the donor's choices:
 *  - alt is a real description, not "" — climx's images are decorative, these
 *    carry the information, so an empty alt would be a lie.
 *  - onError hides the WHOLE <figure>, caption included: an orphan caption
 *    describing an image the reader cannot see is a false assertion, which
 *    makes it an M1 defect rather than a cosmetic one.
 */
export default function Figure({
  figure,
  priority = false,
  id,
}: {
  figure: FigureEvidence;
  priority?: boolean;
  /** Anchor of this figure ("figura-2"): the claims list links here instead of repeating the image. */
  id?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (el) setOverflows(el.scrollWidth > el.clientWidth + 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  if (failed) return null;

  const src = assetUrl(figure.file);
  const isDiagram = figure.file.endsWith('.svg');

  return (
    // A diagram is not prose either: it breaks out of the reading measure so a
    // wide display shows it at a size where its labels can be read.
    <figure id={id} className={`phy-wide ${styles.figure} skin-figure`}>
      <div
        ref={ref}
        className={`phy-scroll-x ${styles.viewport}${figure.plate ? ` ${styles.plate}` : ''}`}
        {...(overflows
          ? {
              tabIndex: 0,
              role: 'region' as const,
              'aria-label': `Diagrama, desplazable: ${figure.alt}`,
            }
          : {})}
      >
        <img
          src={src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          className={styles.img}
          // The legibility floor is the figure's own natural width (concept §4.6): below it the region
          // scrolls. A fixed 32rem put a 7 pt edge label at 6.4 px on the 742 px pipeline diagram.
          // Diagrams only (D-31): a raster photograph stays legible when it shrinks, and with the floor
          // Phyriager's 1275 px capture scrolled sideways at every window size measured, 1920 included.
          style={isDiagram ? { minInlineSize: `${figure.width}px` } : undefined}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailed(true)}
          onLoad={measure}
        />
      </div>
      <Text as="figcaption" size="xs" muted className={styles.caption} lang={figure.lang}>
        {figure.caption}{' '}
        <a href={src} className="phy-target">
          Ver a tamaño completo
        </a>
      </Text>
      {figure.textEquivalent && (
        <Disclosure summary="Descripción textual de la figura">
          <ol className={styles.equivalent} lang={figure.lang}>
            {figure.textEquivalent.map((line, i) => (
              <li key={i}>
                <Text as="span" size="sm">
                  {line}
                </Text>
              </li>
            ))}
          </ol>
        </Disclosure>
      )}
    </figure>
  );
}

// Made with my soul - Swately <3
