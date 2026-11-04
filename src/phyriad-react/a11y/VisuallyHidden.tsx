import type { ComponentProps, ElementType, ReactNode } from 'react';

type VisuallyHiddenProps = {
  /** `span` by default so it sits inside prose; `div` for block contexts. */
  as?: 'span' | 'div';
  children: ReactNode;
} & ComponentProps<'span'>;

/**
 * Content for assistive technology only: rendered, in the accessibility tree,
 * and visually absent.
 *
 * Thin by design — the actual hiding lives in the tokens base layer as
 * `.phy-visually-hidden`, the one recipe that hides visually WITHOUT leaving
 * the a11y tree (`display: none` and `visibility: hidden` both remove content
 * from it, which is the opposite of the point). The tokens testbench verifies
 * the recipe mechanically; this component exists so JSX reads as intent
 * (`<VisuallyHidden>` says what it means, a bare class does not).
 *
 * NOT for focusable content: a focusable element hidden this way is a
 * keyboard stop a sighted user cannot see. The reveal-on-focus variant is the
 * skip link's own business (`.phy-skip`).
 */
export default function VisuallyHidden({
  as = 'span',
  children,
  className,
  ...rest
}: VisuallyHiddenProps) {
  const Tag = as as ElementType;
  return (
    <Tag className={['phy-visually-hidden', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  );
}

// Made with my soul - Swately <3
