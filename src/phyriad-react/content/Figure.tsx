import type { ComponentProps, ReactNode } from 'react';
import styles from './Figure.module.css';

type FigureProps = {
  /** The explanation bound to the content — a real `<figcaption>`. */
  caption: ReactNode;
  /** The figure content: an `<img>` (give it width/height against layout shift), a diagram, a chart. */
  children: ReactNode;
  /**
   * Reserve the box before the media loads: an `aspect-ratio` such as
   * `'16 / 9'` or `'1'`. The one CLS insurance the wrapper can give when the
   * consumer does not know the pixel size up front (a CMS image, a chart that
   * renders later). Omit it and the media's own width/height decide.
   */
  ratio?: string;
} & ComponentProps<'figure'>;

/**
 * `<figure>`/`<figcaption>`: content and its explanation bound structurally,
 * not by proximity. The image inside is the consumer's — including its
 * `width`/`height` attributes, which are what prevent layout shift while it
 * loads; the wrapper constrains, it does not describe.
 */
export default function Figure({ caption, children, ratio, className, ...rest }: FigureProps) {
  return (
    <figure className={[styles.figure, className].filter(Boolean).join(' ')} {...rest}>
      {ratio ? (
        <div className={styles.box} style={{ aspectRatio: ratio }}>
          {children}
        </div>
      ) : (
        children
      )}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

// Made with my soul - Swately <3
