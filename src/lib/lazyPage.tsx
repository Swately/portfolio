import { lazy, Suspense, type ComponentType } from 'react';
import { Text } from '../phyriad-react';

/**
 * A route's page loaded on demand. The three project pages with prose carry about 12 kB gzip of text between
 * them; the home page and the ledger should not pay for it. The fallback renders its own <title> so the
 * shell's development audit never sees a route without one while the chunk loads, and a polite status
 * message instead of an empty main.
 */
export function lazyPage(load: () => Promise<{ default: ComponentType }>): ComponentType {
  const Page = lazy(load);
  return function LazyPage() {
    return (
      <Suspense
        fallback={
          <>
            <title>Cargando — Eduardo Ramos Mendoza</title>
            <Text size="sm" muted role="status">
              Cargando la página…
            </Text>
          </>
        }
      >
        <Page />
      </Suspense>
    );
  };
}

// Made with my soul - Swately <3
