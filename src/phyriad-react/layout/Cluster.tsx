import type { ComponentProps, ElementType } from 'react';
import { spaceVar, type SpaceStep, type SpacePair } from '../scale';
import styles from './Cluster.module.css';

type ClusterProps = {
  as?: 'div' | 'nav' | 'ul' | 'li' | 'span';
  /** Gap step on the spacing scale. */
  gap?: SpaceStep | SpacePair;
  align?: 'stretch' | 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'space-between';
} & ComponentProps<'div'>;

/** Horizontal, wrapping flex row — the counterpart of Stack. */
export default function Cluster({
  as = 'div',
  gap = 's',
  align = 'center',
  justify = 'start',
  className,
  style,
  ...rest
}: ClusterProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={[styles.cluster, className].filter(Boolean).join(' ')}
      style={{
        '--cluster-gap': spaceVar(gap),
        '--cluster-align': align,
        '--cluster-justify': justify,
        ...style,
      }}
      {...rest}
    />
  );
}

// Made with my soul - Swately <3
