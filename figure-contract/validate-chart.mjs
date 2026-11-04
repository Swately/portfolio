#!/usr/bin/env node
// Made with my soul - Swately <3
/*
 * Validates a project's chart JSON files against the final contract ("phyriad-chart/1").
 * Zero dependencies. The site's chart components consume ONLY files that pass this.
 *
 *   node validate-chart.mjs <file.json> [more.json ...]     exit 1 on the first file with an error
 *
 * Importable: `validateChart(object) -> string[]` (empty = valid).
 * The rules marked [DI] come from the container's DATA_INSPECTION rule: a quantity a claim rests on is
 * computed twice and the run-to-run agreement is reported with it, so a chart that shows a spread must
 * say which two runs produced it.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const SCHEMA = 'phyriad-chart/1';
export const KINDS = ['bar', 'line', 'range', 'slope', 'stack', 'scatter'];
const MAX_SERIES = 5;
const MAX_POINTS = 200;

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isUrlOrPath = (v) => isStr(v) && (/^https:\/\//.test(v) || /^[\w./-]+$/.test(v));

export function validateChart(c) {
  const e = [];
  const need = (cond, msg) => {
    if (!cond) e.push(msg);
  };
  if (c === null || typeof c !== 'object' || Array.isArray(c)) return ['not an object'];

  need(c.schema === SCHEMA, `schema must be "${SCHEMA}"`);
  need(isStr(c.id) && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id), 'id must be kebab-case');
  need(isStr(c.title), 'title is required');
  // The takeaway is what a recruiter reads in one glance: one sentence, said, not implied.
  need(
    isStr(c.takeaway) && c.takeaway.trim().length >= 20 && c.takeaway.length <= 200,
    'takeaway is required, 20 to 200 characters',
  );
  need(KINDS.includes(c.kind), `kind must be one of ${KINDS.join(', ')}`);
  need(isStr(c.unit), 'unit is required ("none" for a dimensionless quantity)');
  need(isStr(c.instrument), 'instrument is required: what produced the numbers');
  need(
    c.source && isStr(c.source.label) && isUrlOrPath(c.source.url),
    'source needs a label and an https URL or a repository path',
  );

  if (!Array.isArray(c.series) || c.series.length === 0) {
    e.push('series must be a non-empty array');
    return e;
  }
  need(c.series.length <= MAX_SERIES, `at most ${MAX_SERIES} series`);
  const names = new Set();
  let emphasised = 0;
  let points = 0;
  let anySpread = false;
  for (const [i, s] of c.series.entries()) {
    const at = `series[${i}]`;
    need(isStr(s.name), `${at}.name is required`);
    need(!names.has(s.name), `${at}.name "${s.name}" is duplicated`);
    names.add(s.name);
    if (s.emphasis === true) emphasised++;
    if (!Array.isArray(s.points) || s.points.length === 0) {
      e.push(`${at}.points must be a non-empty array`);
      continue;
    }
    points += s.points.length;
    for (const [j, p] of s.points.entries()) {
      const pa = `${at}.points[${j}]`;
      need(isStr(p.x) || isNum(p.x), `${pa}.x must be a string or a number`);
      need(isNum(p.y), `${pa}.y must be a finite number`);
      const hasLo = p.lo !== undefined;
      const hasHi = p.hi !== undefined;
      need(hasLo === hasHi, `${pa}: lo and hi come together`);
      if (hasLo && hasHi) {
        anySpread = true;
        need(isNum(p.lo) && isNum(p.hi) && p.lo <= p.y && p.y <= p.hi, `${pa}: lo <= y <= hi`);
      }
      if (p.n !== undefined)
        need(Number.isInteger(p.n) && p.n >= 1, `${pa}.n must be a positive integer`);
    }
    if (c.kind === 'line')
      need(
        s.points.length >= 3,
        `${at}: a line needs at least 3 points (use bar or slope for fewer)`,
      );
    if (c.kind === 'stack')
      need(
        s.points.every((p) => isNum(p.y) && p.y >= 0),
        `${at}: stack parts must be >= 0`,
      );
    if (c.kind === 'range')
      need(
        s.points.every((p) => p.lo !== undefined),
        `${at}: every range point needs lo and hi`,
      );
  }
  need(points <= MAX_POINTS, `at most ${MAX_POINTS} points in total`);
  need(emphasised <= 1, 'at most one emphasised series (one accent against muted ink)');

  if (c.kind === 'slope') {
    const xs = new Set(c.series.flatMap((s) => (s.points || []).map((p) => String(p.x))));
    need(xs.size === 2, 'a slope chart has exactly two x values (before and after)');
  }
  if (c.kind === 'stack') {
    const xs = c.series.map((s) => (s.points || []).map((p) => String(p.x)).join('|'));
    need(new Set(xs).size === 1, 'stack: every part must cover the same x values');
  }

  // [DI] a spread is only a spread if it says which runs it came from.
  if (anySpread || c.kind === 'range') {
    need(
      Array.isArray(c.runs) && c.runs.length >= 2,
      '[DI] a chart with a spread needs runs: at least two, each { id, file }',
    );
    if (Array.isArray(c.runs)) {
      for (const [i, r] of c.runs.entries())
        need(isStr(r.id) && isUrlOrPath(r.file), `runs[${i}] needs id and file`);
      need(new Set(c.runs.map((r) => r.id)).size === c.runs.length, 'runs ids must be unique');
    }
  }
  if (c.notes !== undefined)
    need(
      Array.isArray(c.notes) && c.notes.every(isStr),
      'notes must be an array of non-empty strings',
    );
  return e;
}

// ---- CLI ---------------------------------------------------------------------------------------------
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('usage: node validate-chart.mjs <file.json> [more.json ...]');
    process.exit(2);
  }
  const ids = new Map();
  let bad = 0;
  for (const f of files) {
    let obj;
    try {
      obj = JSON.parse(readFileSync(f, 'utf8'));
    } catch (err) {
      console.log(`  FAIL  ${f}: not valid JSON (${err.message})`);
      bad++;
      continue;
    }
    const errs = validateChart(obj);
    if (obj && obj.id) {
      if (ids.has(obj.id)) errs.push(`id "${obj.id}" is also used by ${ids.get(obj.id)}`);
      else ids.set(obj.id, f);
    }
    if (errs.length) {
      bad++;
      for (const m of errs) console.log(`  FAIL  ${f}: ${m}`);
    } else console.log(`  ok    ${f}`);
  }
  console.log(bad ? `FAIL: ${bad} of ${files.length} file(s)` : `PASS: ${files.length} file(s)`);
  process.exit(bad ? 1 : 0);
}
