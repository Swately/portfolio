import { useEffect, useState } from 'react';

/**
 * Loads `load()` once per `key` and returns the result, or `null` while it loads. The cleanup flag stops a
 * late result from landing on a page the reader has already left (route change).
 */
export function useLoaded<T>(key: string, load: () => Promise<T>): T | null {
  const [state, setState] = useState<{ key: string; value: T } | null>(null);
  useEffect(() => {
    let live = true;
    load().then((value) => {
      if (live) setState({ key, value });
    });
    return () => {
      live = false;
    };
    // `load` is a stable module function per key; the key is what changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state && state.key === key ? state.value : null;
}

// Made with my soul - Swately <3
