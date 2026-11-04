import { describe, it, expect } from 'vitest';
import { projects } from '../content';
// The dark-theme step and the contract's map are plain ESM/JSON outside src and are only ever imported by tests.
// @ts-expect-error TS7016: untyped JavaScript from the build step
import { themeSvg } from '../../scripts/figures/theme-svg.mjs';

type ThemeResult = { svg: string; unmapped: string[]; usedRoles: string[] };
const theme = themeSvg as (svg: string, map: unknown) => ThemeResult;
// The built figures and the contract's map, read through Vite so the test needs no Node typings.
const svgs = import.meta.glob('../../public/img/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const map = Object.values(
  import.meta.glob('../../figure-contract/theme-map.json', { eager: true, import: 'default' }),
)[0] as unknown;

/**
 * The cheap half of the figure gate (the build half needs TeX and lives in scripts/figures/build-figure.mjs):
 * every SVG figure the ledger points at must exist, carry the dark-theme block, paint only contract colours
 * (the contract is itself gated at 4.5:1 text and 3:1 lines in both schemes, so a figure made only of those
 * colours has legible ink on every fill) and have its text (a figure with its glyphs missing is the failure
 * of ledger L-036). A figure that is not made of contract colours must declare `plate: true`.
 */
const figures = projects.flatMap((p) => [
  ...p.claims.flatMap((c) =>
    c.evidence.kind === 'figure' ? [{ project: p.slug, ev: c.evidence }] : [],
  ),
  ...(p.diagrams ?? []).map((ev) => ({ project: p.slug, ev })),
]);

describe('the SVG figures of the ledger (figure-contract)', () => {
  for (const { project, ev } of figures.filter((f) => f.ev.file.endsWith('.svg'))) {
    it(`${project}: ${ev.file} is themed, contract-coloured and has its text`, () => {
      const svg = svgs[`../../public/${ev.file}`] ?? '';
      expect(svg, `public/${ev.file} is missing`).not.toBe('');
      const { unmapped } = theme(svg, map);
      // the ledger's size is the file's own (rounded): Figure's legibility floor and the home plate's cap read it.
      // A rebuilt figure left two PhyriadFG entries ~23 % under their natural width until 2026-10-18.
      const size = svg.match(
        /<svg[^>]*?\swidth="([\d.]+)(?:pt|px)?"[^>]*?\sheight="([\d.]+)(?:pt|px)?"/,
      );
      expect(size, `${ev.file}: no width/height on <svg>`).not.toBeNull();
      expect([ev.width, ev.height], `${ev.file}: ledger size vs file`).toEqual([
        Math.round(Number(size![1])),
        Math.round(Number(size![2])),
      ]);
      if (ev.plate) return; // a plate figure opts out of the dark block by design
      expect(svg, 'no dark-theme block: run scripts/figures/build-figure.mjs').toContain(
        '<style id="phy-dark">',
      );
      expect(unmapped, `colours outside the contract: ${unmapped.join(', ')}`).toEqual([]);
      // text as vector paths: a figure with most glyphs missing has only a handful of shapes (L-036)
      expect(
        (svg.match(/<path id="/g) ?? []).length,
        'too few glyph shapes: was lmodern loaded?',
      ).toBeGreaterThan(60);
      // each figure ships its text equivalent (the SVG text is paths and cannot be read)
      expect(ev.textEquivalent?.length ?? 0, `${ev.file}: no textEquivalent`).toBeGreaterThan(0);
    });
  }

  it('the gate can fail (seen red): a colour outside the contract, a missing dark block', () => {
    const bad = '<svg><path fill="#1f77b4" d="M0 0"/></svg>';
    expect(theme(bad, map).unmapped).toEqual(['#1f77b4']);
    const good = '<svg><path fill="#8a3324" stroke="#000" d="M0 0"/></svg>';
    const out = theme(good, map);
    expect(out.unmapped).toEqual([]);
    expect(out.svg).toContain('<style id="phy-dark">@media (prefers-color-scheme:dark)');
    // idempotent: running the step twice leaves one block
    expect((theme(out.svg, map).svg.match(/phy-dark/g) ?? []).length).toBe(1);
    expect(bad).not.toContain('phy-dark');
  });
});

// Made with my soul - Swately <3
