// Made with my soul - Swately <3
// Run: node --test figure-contract/contract.check.mjs   (Node built-in runner; named .check so the site's vitest does not pick it up)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validateChart } from './validate-chart.mjs';
import { validateMatrix } from './validate-matrix.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const load = (f) => JSON.parse(readFileSync(join(here, 'examples', f), 'utf8'));
const mutate = (base, fn) => {
  const c = structuredClone(base);
  fn(c);
  return validateChart(c);
};
const has = (errs, text) => errs.some((m) => m.includes(text));

test('the two shipped examples are valid', () => {
  assert.deepEqual(validateChart(load('chart.bar.example.json')), []);
  assert.deepEqual(validateChart(load('chart.range.example.json')), []);
});

test('each rule can fail (seen red): required fields', () => {
  const bar = load('chart.bar.example.json');
  assert.ok(
    has(
      mutate(bar, (c) => delete c.takeaway),
      'takeaway',
    ),
  );
  assert.ok(
    has(
      mutate(bar, (c) => (c.takeaway = 'corta')),
      'takeaway',
    ),
  );
  assert.ok(
    has(
      mutate(bar, (c) => delete c.instrument),
      'instrument',
    ),
  );
  assert.ok(
    has(
      mutate(bar, (c) => delete c.source),
      'source',
    ),
  );
  assert.ok(
    has(
      mutate(bar, (c) => (c.kind = 'pie')),
      'kind',
    ),
  );
  assert.ok(
    has(
      mutate(bar, (c) => (c.schema = 'v0')),
      'schema',
    ),
  );
  assert.ok(
    has(
      mutate(bar, (c) => (c.id = 'Not Kebab')),
      'kebab',
    ),
  );
  assert.ok(
    has(
      mutate(bar, (c) => (c.series[0].points[0].y = NaN)),
      'finite',
    ),
  );
});

test('each rule can fail (seen red): one accent, series and point limits', () => {
  const bar = load('chart.bar.example.json');
  const two = (c) => {
    c.series.push({ name: 'otra', emphasis: true, points: [{ x: 'a', y: 1 }] });
    c.series[0].emphasis = true;
  };
  assert.ok(has(mutate(bar, two), 'emphasised'));
  assert.ok(
    has(
      mutate(bar, (c) =>
        c.series.push(
          ...Array.from({ length: 5 }, (_, i) => ({ name: 'n' + i, points: [{ x: 'a', y: 1 }] })),
        ),
      ),
      'series',
    ),
  );
});

test('each rule can fail (seen red): the [DI] rule on spreads', () => {
  const range = load('chart.range.example.json');
  assert.ok(
    has(
      mutate(range, (c) => delete c.runs),
      '[DI]',
    ),
  );
  assert.ok(
    has(
      mutate(range, (c) => (c.runs = [c.runs[0]])),
      '[DI]',
    ),
  );
  assert.ok(
    has(
      mutate(range, (c) => (c.series[0].points[0].lo = 5)),
      'lo <= y <= hi',
    ),
  );
  assert.ok(
    has(
      mutate(range, (c) => delete c.series[0].points[0].hi),
      'come together',
    ),
  );
});

test('each rule can fail (seen red): kind-specific shapes', () => {
  const bar = load('chart.bar.example.json');
  assert.ok(
    has(
      mutate(
        bar,
        (c) => ((c.kind = 'line'), (c.series[0].points = c.series[0].points.slice(0, 2))),
      ),
      'at least 3',
    ),
  );
  assert.ok(
    has(
      mutate(bar, (c) => (c.kind = 'slope')),
      'exactly two',
    ),
  );
  assert.ok(
    has(
      mutate(bar, (c) => ((c.kind = 'stack'), (c.series[0].points[0].y = -1))),
      '>= 0',
    ),
  );
});

test('the generated colour files are current and the palette meets its contrast targets', () => {
  const r = spawnSync(process.execPath, [join(here, 'build-contract.mjs'), '--check'], {
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, r.stdout);
});

test('the contrast gate can fail (seen red): a too-strong dark tint is refused', () => {
  const roles = JSON.parse(readFileSync(join(here, 'figure-roles.json'), 'utf8'));
  roles.tint.dark = 0.3;
  const dir = mkdtempSync(join(tmpdir(), 'roles-'));
  const f = join(dir, 'roles.json');
  writeFileSync(f, JSON.stringify(roles));
  const r = spawnSync(
    process.execPath,
    [join(here, 'build-contract.mjs'), '--check', '--roles', f],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL\s+dark:/);
});

// ---- the approach matrix ("phyriad-matrix/1") -------------------------------------------------------
const matrix = () => ({
  schema: 'phyriad-matrix/1',
  id: 'm-ejemplo',
  title: 'EJEMPLO: matriz de enfoque',
  options: ['Propio', 'Otra'],
  rows: [
    { attribute: 'Dónde corre', kind: 'enfoque', cells: ['fuera', 'dentro'] },
    { attribute: 'Latencia', kind: 'medido', instrument: 'EJEMPLO', cells: ['1 ms', null] },
  ],
});

test('a valid approach matrix passes, and a null cell is allowed', () => {
  assert.deepEqual(validateMatrix(matrix()), []);
});

test('each matrix rule can fail (seen red)', () => {
  const bad = (fn) => {
    const m = matrix();
    fn(m);
    return validateMatrix(m).join(' | ');
  };
  assert.match(
    bad((m) => (m.schema = 'x')),
    /schema/,
  );
  assert.match(
    bad((m) => (m.options = ['solo una'])),
    /options/,
  );
  assert.match(
    bad((m) => m.rows[0].cells.pop()),
    /one entry per option/,
  );
  assert.match(
    bad((m) => (m.rows[0].kind = 'medida')),
    /kind/,
  );
  assert.match(
    bad((m) => delete m.rows[1].instrument),
    /instrument/,
  );
  assert.match(
    bad((m) => delete m.title),
    /title/,
  );
  assert.match(
    bad((m) => (m.sources = [[]])),
    /one entry per option/,
  );
});
