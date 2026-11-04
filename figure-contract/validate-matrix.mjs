#!/usr/bin/env node
// Made with my soul - Swately <3
/*
 * Validates an approach matrix file ("phyriad-matrix/1"): the descriptive half of a comparison with
 * alternatives (concept §2.4, decision D6). The MEASURED half is a chart or a table with a methodology
 * (phyriad-chart/1), never a row here without an instrument.
 *
 *   node validate-matrix.mjs <file.json> [more.json ...]     exit 1 on the first file with an error
 *
 * Importable: `validateMatrix(object) -> string[]` (empty = valid).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const SCHEMA = 'phyriad-matrix/1';
export const ROW_KINDS = ['medido', 'declarado', 'enfoque'];
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

export function validateMatrix(m) {
  const e = [];
  const need = (cond, msg) => {
    if (!cond) e.push(msg);
  };
  if (m === null || typeof m !== 'object' || Array.isArray(m)) return ['not an object'];
  need(m.schema === SCHEMA, `schema must be "${SCHEMA}"`);
  need(isStr(m.id) && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.id), 'id must be kebab-case');
  need(
    isStr(m.title),
    'title is required: it is the table caption and what a screen reader hears first',
  );
  need(
    Array.isArray(m.options) && m.options.length >= 2 && m.options.length <= 6,
    'options: between 2 and 6 (NN/g: above 5, filter instead)',
  );
  const opts = Array.isArray(m.options) ? m.options : [];
  need(
    opts.every(isStr) && new Set(opts).size === opts.length,
    'options must be unique non-empty strings',
  );
  if (!Array.isArray(m.rows) || m.rows.length === 0) {
    e.push('rows must be a non-empty array');
    return e;
  }
  for (const [i, r] of m.rows.entries()) {
    const at = `rows[${i}]`;
    need(isStr(r.attribute), `${at}.attribute is required`);
    need(ROW_KINDS.includes(r.kind), `${at}.kind must be one of ${ROW_KINDS.join(', ')}`);
    need(
      Array.isArray(r.cells) && r.cells.length === opts.length,
      `${at}.cells must have one entry per option (${opts.length})`,
    );
    if (Array.isArray(r.cells))
      need(
        r.cells.every((c) => c === null || isStr(c)),
        `${at}.cells entries are text or null (null is written out as "sin dato")`,
      );
    // a measured row says what measured it: otherwise it would pass as a claim with no evidence
    if (r.kind === 'medido') need(isStr(r.instrument), `${at}: a "medido" row needs an instrument`);
  }
  for (const key of ['sources', 'quotes']) {
    if (m[key] !== undefined)
      need(
        Array.isArray(m[key]) && m[key].length === opts.length,
        `${key} must have one entry per option`,
      );
  }
  if (m.sources)
    for (const [i, list] of m.sources.entries())
      need(
        Array.isArray(list) && list.every((s) => isStr(s.text) && /^https:\/\//.test(s.href)),
        `sources[${i}]: each needs text and an https href`,
      );
  if (m.quotes)
    for (const [i, list] of m.quotes.entries())
      need(Array.isArray(list) && list.every(isStr), `quotes[${i}]: strings`);
  return e;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('usage: node validate-matrix.mjs <file.json> [more.json ...]');
    process.exit(2);
  }
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
    const errs = validateMatrix(obj);
    if (errs.length) {
      bad++;
      for (const m of errs) console.log(`  FAIL  ${f}: ${m}`);
    } else console.log(`  ok    ${f}`);
  }
  console.log(bad ? `FAIL: ${bad} of ${files.length} file(s)` : `PASS: ${files.length} file(s)`);
  process.exit(bad ? 1 : 0);
}
