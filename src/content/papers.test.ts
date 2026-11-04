import { describe, it, expect } from 'vitest';
// The record and the published files are plain files outside the module graph; tests read them through this
// helper (same as substrate.test.ts).
// @ts-expect-error TS7016: untyped JavaScript helper
import { readText } from '../../scripts/read-text.mjs';
import { PAGES_ROOT, REPO_BLOB } from './substrate';
import {
  PAPERS_RECORD,
  funnel,
  methodClaims,
  paperFiles,
  paperLimits,
  pages,
  papers,
  protocols,
} from './papers';

const read = readText as (p: string) => string;
const record = read('docs/PAPERS_EVIDENCE.md');
const allClaims = [...papers.flatMap((p) => p.claims), ...methodClaims];

describe('the papers ledger (route /papers)', () => {
  it('lists the four papers of the series, each with at least two claims that carry evidence', () => {
    expect(papers.map((p) => p.slug)).toEqual(['holonico', 'desconexion', 'convergencia', 'grano']);
    for (const p of papers) {
      expect(p.claims.length, p.slug).toBeGreaterThanOrEqual(2);
      for (const c of p.claims) expect(c.evidence.kind).toMatch(/^(doc|number|provisional)$/);
    }
    expect(methodClaims.length).toBeGreaterThanOrEqual(4);
  });

  it('every outbound URL is https and points at this repository or its published site', () => {
    for (const c of allClaims) {
      const e = c.evidence;
      if (!('url' in e)) continue;
      expect(e.url.startsWith('https://'), e.url).toBe(true);
      expect(e.url.startsWith(REPO_BLOB) || e.url.startsWith(PAGES_ROOT), e.url).toBe(true);
    }
  });

  it('every published file a claim or a link names exists in public/papers', () => {
    const names = new Set<string>(paperFiles);
    for (const p of papers) if (p.spine) names.add(`${p.slug}-SPINE.md`);
    for (const n of names) expect(() => readFileSize(`public/papers/${n}`), n).not.toThrow();
    for (const c of allClaims) {
      const e = c.evidence;
      if ('url' in e && e.url.startsWith(`${PAGES_ROOT}papers/`)) {
        expect(names.has(e.url.slice(`${PAGES_ROOT}papers/`.length)), e.url).toBe(true);
      }
    }
  });

  it('every number the page prints is written in the evidence record', () => {
    for (const per of Object.values(pages)) {
      expect(record, per.es).toContain(per.es);
      expect(record, per.en).toContain(per.en);
    }
    for (const c of allClaims) {
      if (c.evidence.kind === 'number') {
        expect(record, `value not in the record: ${c.evidence.value}`).toContain(c.evidence.value);
      }
    }
  });

  it('every claim and protocol that links into the record links to a heading that exists in it', () => {
    const slug = (h: string) =>
      h
        .toLowerCase()
        .replace(/[^\p{L}\p{N} -]/gu, '')
        .trim()
        .replace(/ /g, '-');
    const anchors = new Set(
      [...record.matchAll(/^#{2,3} (.+)$/gm)].map((m) => slug(m[1]!.replace(/`/g, ''))),
    );
    const targets = [
      ...allClaims.flatMap((c) => ('url' in c.evidence ? [c.evidence.url] : [])),
      ...protocols.map((p) => `${PAPERS_RECORD}#${p.anchor}`),
    ].filter((u) => u.startsWith(PAPERS_RECORD));
    expect(targets.length).toBeGreaterThanOrEqual(5);
    for (const u of targets) {
      const anchor = decodeURIComponent(u.slice(PAPERS_RECORD.length).replace(/^#/, ''));
      if (anchor) expect(anchors.has(anchor), `no heading for #${anchor}`).toBe(true);
    }
  });

  it('describes the seven passes of the funnel and states the limits, including the audits it did not find', () => {
    expect(funnel).toHaveLength(7);
    expect(paperLimits.join(' ')).toContain('no encontré el registro de esas auditorías');
    expect(paperLimits.join(' ')).toContain('sin revisión por pares');
  });
});

function readFileSize(path: string): number {
  // readText throws when the file does not exist; the content is not needed, only its presence.
  return read(path).length;
}
