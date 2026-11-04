import { describe, it, expect } from 'vitest';
import { chartCount, loadAllCharts } from './charts';
import { projects } from '../content';
// Plain ESM from the contract folder: no types, and kept out of the production bundle because only tests import it.
// @ts-expect-error TS7016: the contract's validator is untyped JavaScript
import { validateChart } from '../../figure-contract/validate-chart.mjs';

const validate = validateChart as (c: unknown) => string[];

describe('the chart files the projects hand over (figure-contract, phyriad-chart/1)', () => {
  it('every file in src/content/charts is valid, named after an existing project, and has a unique id', async () => {
    const ids = new Set<string>();
    const slugs = new Set(projects.map((p) => p.slug));
    const chartFiles = await loadAllCharts();
    expect(chartFiles.length).toBeGreaterThan(0);
    for (const f of chartFiles) {
      expect(validate(f.data), f.path).toEqual([]);
      expect(slugs.has(f.slug), `${f.path}: "${f.slug}" is not a project slug`).toBe(true);
      expect(ids.has(f.data.id), `${f.path}: duplicate id ${f.data.id}`).toBe(false);
      ids.add(f.data.id);
      expect(
        f.path.endsWith(`${f.slug}--${f.data.id}.json`),
        `${f.path}: file name must be <slug>--<id>.json`,
      ).toBe(true);
    }
  });

  it('the gate can fail: a chart without a takeaway or with a spread and one run is refused', () => {
    const good = {
      schema: 'phyriad-chart/1',
      id: 'x',
      title: 't',
      takeaway: 'Una frase de al menos veinte caracteres.',
      kind: 'range',
      unit: 'px',
      series: [{ name: 's', points: [{ x: 'a', y: 1, lo: 0.9, hi: 1.1 }] }],
      instrument: 'i',
      source: { label: 'l', url: 'https://example.invalid/x' },
      runs: [
        { id: 'r1', file: 'a.csv' },
        { id: 'r2', file: 'b.csv' },
      ],
    };
    expect(validate(good)).toEqual([]);
    expect(validate({ ...good, takeaway: '' }).join(' ')).toContain('takeaway');
    expect(validate({ ...good, runs: [good.runs[0]] }).join(' ')).toContain('[DI]');
  });

  it('a project with no chart file has a count of zero (the page then shows a provisional line)', () => {
    expect(chartCount('no-such-project')).toBe(0);
  });
});
