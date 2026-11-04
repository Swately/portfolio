import 'react';

/**
 * Custom properties in `style` objects. React passes them through to the DOM,
 * but its `CSSProperties` type does not know them, so a literal such as
 * `style={{ '--window-start': '16rem' }}` on a typed element fails excess
 * property checking (Stack and Cluster escaped only because their tag is a
 * generic ElementType). One augmentation for the whole substrate — and for
 * consumers, since this file is vendored with the rest.
 */
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

// Made with my soul - Swately <3
