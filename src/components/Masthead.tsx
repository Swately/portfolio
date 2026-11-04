import { Link, Stack, Text, usePath } from '../phyriad-react';

/**
 * The whole "about the author" surface of the site: the name. On the index it
 * is the page's h1 (a signature above the work); everywhere else it is a small
 * link back to the index, so each dossier keeps its own h1. Nothing else from
 * the CV is repeated here — the operator's direction (2026-09-02): the
 * portfolio is exclusively about the projects.
 */
export default function Masthead() {
  const path = usePath();
  const home = path === '/';
  // A banner landmark, so the name is inside a region (axe: region) on every page.
  return (
    <Stack as="header" gap="3xs">
      {home ? (
        <Text as="h1" size="lg">
          Eduardo Ramos Mendoza
        </Text>
      ) : (
        <Text as="p" size="sm" muted>
          <Link to="/">Eduardo Ramos Mendoza</Link>
        </Text>
      )}
    </Stack>
  );
}

// Made with my soul - Swately <3
