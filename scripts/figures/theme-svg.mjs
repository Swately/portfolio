#!/usr/bin/env node
// Made with my soul - Swately <3
/*
 * The dark-theme step. Takes a minified dvisvgm SVG and appends ONE
 * `@media (prefers-color-scheme: dark)` block, generated from figure-contract/theme-map.json, so the
 * single file follows the site's theme toggle when painted through <img> (measured 2026-10-09).
 *
 *   node scripts/figures/theme-svg.mjs <in.svg> <out.svg>
 *
 * THE CONTRAST GATE, per figure: every colour the SVG paints must be a contract colour. The contract
 * itself is gated (figure-contract/build-contract.mjs --check: every role pair at 4.5:1 for text and 3:1
 * for lines in both themes), so a figure made only of contract colours has legible ink on every fill by
 * construction. A colour outside the contract has no dark mapping: the step FAILS and names it, and
 * the figure either moves to the contract colours or ships on a light plate (Evidence `plate: true`).
 *
 * Importable: `themeSvg(svgText, map) -> { svg, unmapped, usedRoles }`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const MAP_PATH = join(here, '..', '..', 'figure-contract', 'theme-map.json');

/** 3-digit hex to 6-digit, lower case. */
const norm = (h) => {
  const x = h.toLowerCase();
  return /^#[0-9a-f]{3}$/.test(x) ? '#' + [...x.slice(1)].map((c) => c + c).join('') : x;
};

export function themeSvg(svg, map) {
  const lightHexes = new Set(map.entries.map((e) => norm(e.light)));
  // dvisvgm writes black as #000 or leaves it implicit; both are the ink role
  lightHexes.add('#000000');
  const used = new Map(); // hex -> count, from fill= and stroke= attributes only
  for (const m of svg.matchAll(/\b(?:fill|stroke)="(#[0-9a-fA-F]{3,6})"/g)) {
    const h = norm(m[1]);
    used.set(h, (used.get(h) || 0) + 1);
  }
  const unmapped = [...used.keys()].filter((h) => !lightHexes.has(h));
  const usedRoles = map.entries
    .filter((e) => used.has(norm(e.light)) || e.role === 'ink')
    .map((e) => e.role);
  // idempotent: replace a block this step wrote before
  const clean = svg.replace(/<style id="phy-dark">[\s\S]*?<\/style>/, '');
  const themed = clean.replace(
    /<\/svg>\s*$/,
    `<style id="phy-dark">${map.darkBlock}</style></svg>`,
  );
  return { svg: themed, unmapped, usedRoles };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [inFile, outFile] = process.argv.slice(2);
  if (!inFile || !outFile) {
    console.error('usage: node scripts/figures/theme-svg.mjs <in.svg> <out.svg>');
    process.exit(2);
  }
  const map = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
  const { svg, unmapped, usedRoles } = themeSvg(readFileSync(inFile, 'utf8'), map);
  if (unmapped.length) {
    console.log(
      `  FAIL  ${inFile}: colours outside the contract (no dark mapping): ${unmapped.join(', ')}`,
    );
    console.log('        Use the figure-contract colours, or ship this figure on a light plate.');
    process.exit(1);
  }
  writeFileSync(outFile, svg);
  console.log(
    `  ok    ${outFile}: dark block written; contract roles used: ${usedRoles.join(', ')}`,
  );
}
