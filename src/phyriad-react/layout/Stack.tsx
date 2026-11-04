import type { ComponentProps, ElementType } from 'react';
import { spaceVar, type SpaceStep, type SpacePair } from '../scale';
import styles from './Stack.module.css';

type StackProps = {
  /** Semantic element to render — layout never forces a div. */
  as?: 'div' | 'section' | 'article' | 'nav' | 'main' | 'header' | 'footer' | 'ul' | 'li';
  /** Gap on the spacing scale: a step (`m`) or a fluid pair across two steps (`l-xl`). */
  gap?: SpaceStep | SpacePair;
  /** align-items for the column. */
  align?: 'stretch' | 'start' | 'center' | 'end';
} & ComponentProps<'div'>;

/**
 * A vertical flow with one gap on the space scale (`gap`, a step or a fluid pair) and an
 * `as` for the semantic element. The counterpart of Cluster. Layout is relationship, never
 * context: no media query lives here.
 */
export default function Stack({
  as = 'div',
  gap = 'm',
  align = 'stretch',
  className,
  style,
  ...rest
}: StackProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={[styles.stack, className].filter(Boolean).join(' ')}
      style={{ '--stack-gap': spaceVar(gap), '--stack-align': align, ...style }}
      {...rest}
    />
  );
}

// Made with my soul - Swately <3
