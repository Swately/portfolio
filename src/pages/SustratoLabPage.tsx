import { lazy, Suspense } from 'react';
import { Link, Stack, Text } from '../phyriad-react';

// The laboratory is loaded when this route renders. KNOWN COST (measured 2026-11-04 on a copy of the project):
// the substrate's barrel (src/phyriad-react/index.ts) re-exports StandardsLab, and while it does the bundler
// preloads the laboratory chunk from the entry on EVERY page: the home page downloads about 9 kB of JS and
// 1.75 kB of CSS more (gzip). Without those three re-export lines the laboratory separates and the home page
// pays about 2.5 kB. Neither this lazy import nor importing from the file directly changes it; the fix is in
// the catalog's barrel, not here (docs/SUSTRATO_WEB_EVIDENCE.md, "Presupuesto de tamaño").
const StandardsLab = lazy(() => import('../phyriad-react/lab/StandardsLab'));

/**
 * /sustrato-web/laboratorio — the substrate's own laboratory (StandardsLab), now public at the operator's
 * request. Before this route it was mounted only in development, as "a debugging instrument, not public
 * furniture"; it measures the visitor's device, so it says so and links back. The lab brings its own <title>
 * and h2; the page adds the h1 and the way back.
 */
export default function SustratoLabPage() {
  return (
    <>
      <Stack as="header" gap="xs">
        <nav aria-label="Volver">
          <Link to="/sustrato-web" className="phy-target">
            ← El sustrato web
          </Link>
        </nav>
        <Text as="h1" size="xl">
          Laboratorio del sustrato
        </Text>
        <Text muted>
          Un instrumento de depuración: las cifras de arriba se miden en su navegador, con su
          ventana y su fuente, no se copian de los tokens. Cambie el tamaño de la ventana y se
          recalculan.
        </Text>
      </Stack>
      <Suspense
        fallback={
          <Text size="sm" muted role="status">
            Cargando el laboratorio…
          </Text>
        }
      >
        <StandardsLab />
      </Suspense>
    </>
  );
}

// Made with my soul - Swately <3
