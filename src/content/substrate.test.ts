import { describe, it, expect } from 'vitest';
// The record, the vendored tokens and the built figure are plain files outside the module graph; vitest returns
// CSS empty even with ?raw and the app's tsconfig has no Node types, so tests read them through this helper
// (the same way skin.test.ts and figures.test.ts do).
// @ts-expect-error TS7016: untyped JavaScript helper
import { readText } from '../../scripts/read-text.mjs';
import { projects } from '../content';
import {
  EVIDENCE_DOC,
  PAGES_ROOT,
  REPO_BLOB,
  SUBSTRATE_VERSIONS,
  measured,
  substrateClaims,
  substrateFigure,
  substrateLimits,
} from './substrate';

const read = readText as (p: string) => string;
const record = read('docs/SUSTRATO_WEB_EVIDENCE.md');

describe('the substrate ledger (route /sustrato-web)', () => {
  it('every assertion is a claim with evidence, and the figure claim carries the diagram', () => {
    expect(substrateClaims.length).toBeGreaterThanOrEqual(8);
    for (const c of substrateClaims) {
      expect(c.text.length, c.text).toBeGreaterThan(30);
      expect(c.evidence.kind).toMatch(/^(live|number|figure|doc|provisional)$/);
    }
    const figures = substrateClaims.filter((c) => c.evidence.kind === 'figure');
    expect(figures).toHaveLength(1);
    expect(figures[0]!.evidence).toBe(substrateFigure);
  });

  it('every outbound URL is https and points at this repository, its published site or the record', () => {
    for (const c of substrateClaims) {
      const e = c.evidence;
      if (!('url' in e)) continue;
      expect(e.url.startsWith('https://'), e.url).toBe(true);
      expect(e.url.startsWith(REPO_BLOB) || e.url.startsWith(PAGES_ROOT), e.url).toBe(true);
    }
  });

  it('every number a claim prints is written in the evidence record, with the command that produced it', () => {
    const numbers = substrateClaims.flatMap((c) =>
      c.evidence.kind === 'number' ? [c.evidence] : [],
    );
    expect(numbers.length).toBeGreaterThanOrEqual(6);
    for (const e of numbers) {
      expect(record, `value not in the record: ${e.value}`).toContain(e.value);
      // the first command of the instrument is also in the record, so a reader can repeat it
      const command = e.instrument.split(' · ')[0]!.split(' (')[0]!;
      expect(record, `command not in the record: ${command}`).toContain(command);
    }
    for (const value of Object.values(measured)) expect(record, value).toContain(value);
  });

  it('every claim that links into the record links to a heading that exists in it', () => {
    const slug = (h: string) =>
      h
        .toLowerCase()
        .replace(/[^\p{L}\p{N} -]/gu, '')
        .trim()
        .replace(/ /g, '-');
    const anchors = new Set(
      [...record.matchAll(/^#{2,3} (.+)$/gm)].map((m) => slug(m[1]!.replace(/`/g, ''))),
    );
    for (const c of substrateClaims) {
      const e = c.evidence;
      if (!('url' in e) || !e.url.startsWith(EVIDENCE_DOC)) continue;
      const anchor = decodeURIComponent(e.url.slice(EVIDENCE_DOC.length).replace(/^#/, ''));
      if (anchor) expect(anchors.has(anchor), `no heading "${anchor}" in the record`).toBe(true);
    }
  });

  it('the tokens version the page names is the one in the copied files, and the copied files carry it twice', () => {
    const tokens = read('src/phyriad-react/phyriad.tokens.css');
    const base = read('src/phyriad-react/phyriad.base.css');
    const v = (s: string) => (s.match(/@version\s+(\d+\.\d+\.\d+)/) || [])[1];
    expect(v(tokens)).toBe(SUBSTRATE_VERSIONS.tokens);
    expect(v(base)).toBe(SUBSTRATE_VERSIONS.tokens);
  });

  it('the project entry of the ledger carries these claims and a status built from the same versions', () => {
    const p = projects.find((q) => q.slug === 'sustrato-web')!;
    expect(p).toBeDefined();
    expect(p.claims).toBe(substrateClaims);
    expect(p.limits).toBe(substrateLimits);
    expect(p.status).toBe(
      `tokens ${SUBSTRATE_VERSIONS.tokens} · react ${SUBSTRATE_VERSIONS.react} (stable)`,
    );
    // the dossier's own figure is the first figure among its claims (the hero of "En breve")
    expect(p.claims.find((c) => c.evidence.kind === 'figure')!.evidence).toBe(substrateFigure);
    // its comparison and its chart exist and are named after the slug, as the loaders require
    expect(
      readText('src/content/tables/sustrato-web--sustrato-web-approach-comparison.json'),
    ).toContain('phyriad-matrix/1');
    expect(
      readText('src/content/charts/sustrato-web--sustrato-web-contraste-texto-atenuado.json'),
    ).toContain('phyriad-chart/1');
  });

  it('what the page says about react 1.4.0 can only be true if the copy has its features', () => {
    // The copy does not declare react's version (only the tokens' is written in the files), so the version is
    // quoted from the catalog's changelog (the record says so); this guards the features 1.4.0 added.
    const index = read('src/phyriad-react/index.ts');
    expect(index).toContain('useTypeSettings');
    expect(index).toContain('faceVar');
    expect(SUBSTRATE_VERSIONS.react).toBe('1.4.0');
  });

  it('the diagram ships, is themed for the dark scheme, and its declared size is the file size', () => {
    const svg = read('public/img/sustrato_flujo.svg');
    expect(svg).toContain('<style id="phy-dark">');
    const size = svg.match(
      /<svg[^>]*?\swidth="([\d.]+)(?:pt|px)?"[^>]*?\sheight="([\d.]+)(?:pt|px)?"/,
    );
    expect(size).not.toBeNull();
    expect([substrateFigure.width, substrateFigure.height]).toEqual([
      Math.round(Number(size![1])),
      Math.round(Number(size![2])),
    ]);
    expect(substrateFigure.alt.length).toBeGreaterThan(20);
    expect(substrateFigure.textEquivalent?.length ?? 0).toBeGreaterThan(0);
  });

  it('the limits are stated, and the first ones name what was not tested', () => {
    expect(substrateLimits.length).toBeGreaterThanOrEqual(4);
    expect(substrateLimits.join(' ')).toMatch(/Safari/);
    expect(substrateLimits.join(' ')).toMatch(/colores forzados/);
  });
});

// Made with my soul - Swately <3
