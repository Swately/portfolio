import { describe, it, expect, beforeEach } from 'vitest';
import { bootSkin } from './skin';

// @ts-expect-error TS7016: untyped JavaScript helper (vitest empties CSS, even with ?raw)
import { readText } from '../../scripts/read-text.mjs';

const css = (readText as (p: string) => string)('src/styles/skin-showcase.css');

describe('skin switch', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.palette;
  });

  it('the default is the showcase skin: no parameter, nothing remembered, no attribute (tokens 2.0.0)', () => {
    expect(bootSkin('')).toBeNull();
    expect(document.documentElement.dataset.palette).toBeUndefined();
  });

  it('?palette=oxide returns the old look and is remembered; ?palette=showcase or default forgets it', () => {
    expect(bootSkin('?palette=oxide')).toBe('oxide');
    expect(document.documentElement.dataset.palette).toBe('oxide');
    expect(bootSkin('')).toBe('oxide');
    expect(bootSkin('?palette=showcase')).toBeNull();
    expect(document.documentElement.dataset.palette).toBeUndefined();
    bootSkin('?palette=maid');
    expect(bootSkin('?palette=default')).toBeNull();
    expect(document.documentElement.dataset.palette).toBeUndefined();
  });

  it('ignores an unknown palette name', () => {
    expect(bootSkin('?palette=launcher')).toBeNull();
    expect(document.documentElement.dataset.palette).toBeUndefined();
  });
});

/** WCAG 2.x relative luminance and contrast, computed from the skin's own declarations. */
const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const l = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0]! + 0.7152 * l[1]! + 0.0722 * l[2]!;
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// The palette itself lives in the vendored substrate since tokens 1.6.0 (gated there too); this reads the
// copy the site actually ships, so a sync that dropped or changed it would fail here.
const tokens = (readText as (p: string) => string)('src/phyriad-react/phyriad.tokens.css');

describe('showcase palette (vendored tokens, default since 2.0.0) and the skin stylesheet', () => {
  const block = tokens.match(/:root\[data-palette='showcase'\]\s*\{([^}]*)\}/)![1]!;
  const role = (name: string): [string, string] => {
    const m = block.match(
      new RegExp(`--${name}:\\s*light-dark\\((#[0-9a-f]{6}),\\s*(#[0-9a-f]{6})\\)`),
    );
    expect(m, name).not.toBeNull();
    return [m![1]!, m![2]!];
  };

  it('declares all ten substrate roles in both schemes, and the 8 px radius', () => {
    for (const r of [
      'phy-paper',
      'phy-paper-2',
      'phy-paper-3',
      'phy-ink',
      'phy-ink-muted',
      'phy-rule',
      'phy-accent',
      'phy-accent-on',
      'phy-error',
      'phy-ok',
    ])
      role(r);
    expect(block).toMatch(/--phy-radius:\s*8px/);
  });

  it('meets 4.5:1 for every text colour and 3:1 for the rule on all three surfaces, in both schemes', () => {
    const surfaces = ['phy-paper', 'phy-paper-2', 'phy-paper-3'].map(role);
    for (const scheme of [0, 1]) {
      for (const s of surfaces) {
        for (const t of ['phy-ink', 'phy-ink-muted', 'phy-accent', 'phy-error', 'phy-ok'])
          expect(
            ratio(role(t)[scheme]!, s[scheme]!),
            `${t} on ${s[scheme]}`,
          ).toBeGreaterThanOrEqual(4.5);
        expect(
          ratio(role('phy-rule')[scheme]!, s[scheme]!),
          `rule on ${s[scheme]}`,
        ).toBeGreaterThanOrEqual(3);
      }
      expect(
        ratio(role('phy-accent-on')[scheme]!, role('phy-accent')[scheme]!),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps the identity rule it shares with the substrate: no shadow anywhere', () => {
    expect(css).not.toMatch(/box-shadow|filter:\s*drop-shadow/);
  });

  it('applies nothing outside the skin except the hidden hook, and the skin is off under oxide and maid', () => {
    const SCOPE = ":root:is(:not([data-palette]), [data-palette='showcase'])";
    const unscoped = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(^|\})\s*([^{}@]+)\{/g)]
      .map((m) => m[2]!.trim())
      .filter((sel) => !sel.startsWith(SCOPE));
    expect(unscoped).toEqual(['.skin-typecover']);
  });

  it('the default palette of the vendored tokens is showcase, and oxide is still selectable', () => {
    const defaults = tokens.slice(0, tokens.indexOf('[data-palette='));
    expect(defaults).toMatch(/--phy-paper:\s*light-dark\(#eceef1,\s*#0e0f11\)/);
    expect(tokens).toMatch(/:root\[data-palette='oxide'\]/);
  });
});

// Made with my soul - Swately <3
