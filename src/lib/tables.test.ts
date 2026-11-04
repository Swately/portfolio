import { describe, it, expect } from 'vitest';
import { loadAllTables, matrixCount } from './tables';
import { projects } from '../content';
// Plain ESM from the contract folder: untyped, and only tests import it (it stays out of the production bundle).
// @ts-expect-error TS7016: the contract's validator is untyped JavaScript
import { validateMatrix } from '../../figure-contract/validate-matrix.mjs';

const validate = validateMatrix as (m: unknown) => string[];

describe('the approach matrices the projects hand over (figure-contract, phyriad-matrix/1)', () => {
  it('every file in src/content/tables is valid, named after an existing project and has a unique id', async () => {
    const ids = new Set<string>();
    const slugs = new Set(projects.map((p) => p.slug));
    const tableFiles = await loadAllTables();
    expect(tableFiles.length).toBeGreaterThan(0);
    for (const f of tableFiles) {
      expect(validate(f.data), f.path).toEqual([]);
      expect(slugs.has(f.slug), `${f.path}: not a project slug`).toBe(true);
      expect(ids.has(f.data.id), `duplicate id ${f.data.id}`).toBe(false);
      ids.add(f.data.id);
      expect(
        f.path.endsWith(`${f.slug}--${f.data.id}.json`),
        `${f.path}: file name must be <slug>--<id>.json`,
      ).toBe(true);
    }
  });

  it('an approach matrix claims no measurement: a "medido" row, if any, names its instrument', async () => {
    const tableFiles = await loadAllTables();
    for (const f of tableFiles)
      for (const r of f.data.rows) if (r.kind === 'medido') expect(r.instrument).toBeTruthy();
  });

  it('a project without a matrix gets none (the page then shows a provisional line)', () => {
    expect(matrixCount('no-such-project')).toBe(0);
  });
});
