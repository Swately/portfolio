import type { ComponentProps, ElementType } from 'react';

type ProseProps = {
  as?: 'div' | 'article' | 'section';
} & ComponentProps<'div'>;

/**
 * Adopted rich text — markdown output, CMS HTML, anything the page did not
 * write by hand — dressed in the system's rhythm. The styling is all in the
 * tokens base (`.phy-prose`, testbench-guarded measure cap); this wrapper
 * exists so JSX reads as intent.
 */
export default function Prose({ as = 'div', className, ...rest }: ProseProps) {
  const Tag = as as ElementType;
  return <Tag className={['phy-prose', className].filter(Boolean).join(' ')} {...rest} />;
}

// Made with my soul - Swately <3
