import type { ComponentProps, ElementType, ReactNode } from 'react';

type SkeletonizeProps = {
  loading: boolean;
  /**
   * What stands in while loading. Two legitimate shapes:
   * - simple content: a `SkeletonText` / a few `Skeleton` blocks;
   * - a composite: THE ELEMENT ITSELF with skeleton shapes inside (a `Table`
   *   with `SkeletonText` cells) — the derivation rule. A skeleton built from
   *   the real element cannot drift from it: change the element and its
   *   skeleton changes with it. Separate replica components can and do.
   */
  placeholder: ReactNode;
  children: ReactNode;
  as?: 'div' | 'section' | 'span';
} & ComponentProps<'div'>;

/**
 * The loading CONTRACT, owned once instead of re-remembered per page:
 *
 * - the region is `aria-busy` while loading (assistive tech knows to wait);
 * - the placeholder subtree is `aria-hidden` (skeletons are pictures of
 *   absence, not content);
 * - the swap is atomic — placeholder or children, never both.
 *
 * What it deliberately does NOT do: announce. The announcement belongs to a
 * `Status` region mounted EMPTY at page level (its own discipline) — a
 * component that mounts together with the loading state is exactly the case
 * screen readers may ignore.
 */
export default function Skeletonize({
  loading,
  placeholder,
  children,
  as = 'div',
  ...rest
}: SkeletonizeProps) {
  const Tag = as as ElementType;
  return (
    <Tag aria-busy={loading || undefined} {...rest}>
      {loading ? <span aria-hidden="true">{placeholder}</span> : children}
    </Tag>
  );
}

// Made with my soul - Swately <3
