// Generalized from climx's `estadoImg(ides)` (src/components/EstadoCard.tsx),
// which hardcoded a domain path. The mechanism — prefixing BASE_URL so assets
// resolve under a GitHub Pages project path — is exactly what the frozen
// objective blesses while forbidding the state photographs it originally served.

/**
 * Resolve a public/ asset against the deployment base path.
 * @param path relative to public/, WITHOUT a leading slash — a leading slash
 * escapes the base path, which works in dev and 404s in production.
 */
export function assetUrl(path: string): string {
  if (path.startsWith('/')) {
    throw new Error(`assetUrl: path must be relative to public/, got "${path}"`);
  }
  return `${import.meta.env.BASE_URL}${path}`;
}

// Made with my soul - Swately <3
