import type { Ref, RefCallback } from 'react';

/**
 * One ref for two owners: a component that needs its own ref to an element it
 * renders (Dialog, Table, MenuButton) AND forwards the consumer's ref (React 19
 * ref-as-prop). Without this, whichever `ref` is spread last silently wins —
 * the contract test caught exactly that on MenuButton.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (node) => {
    for (const r of refs) {
      if (!r) continue;
      if (typeof r === 'function') r(node);
      else (r as { current: T | null }).current = node;
    }
  };
}

// Made with my soul - Swately <3
