import { describe, it, expect } from 'vitest';
import { assetUrl } from './assets';

describe('assetUrl', () => {
  it('prefixes the deployment base path', () => {
    // BASE_URL is '/' under test; the prefix must still be applied, not skipped.
    expect(assetUrl('img/x.png')).toBe(`${import.meta.env.BASE_URL}img/x.png`);
  });

  it('rejects a leading slash', () => {
    // The host-path failure that works in dev and 404s in production: an
    // absolute path escapes the /portfolio/ base entirely.
    expect(() => assetUrl('/img/x.png')).toThrow();
  });
});

// Made with my soul - Swately <3
