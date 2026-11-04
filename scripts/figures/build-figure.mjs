#!/usr/bin/env node
// Made with my soul - Swately <3
/*
 * Compiles one TikZ figure to the site's themed SVG.
 *
 *   node scripts/figures/build-figure.mjs figure-sources/x.tex public/img/x.svg
 *
 * latex  ->  dvisvgm --no-fonts  ->  svgo --multipass  ->  the dark-theme step (theme-svg.mjs)
 *
 * It FAILS (exit 1) on:
 *   - a LaTeX error;
 *   - any dvisvgm warning. "WARNING: failed to create ecrm0900.gf" means a font bitmap was not built and
 *     the SVG is missing text although the file was written (ledger L-036: that is how a diagram looked
 *     3.7 times lighter than it was);
 *   - a source that loads `fontenc` without `lmodern` (the cause of the warning above);
 *   - a colour outside the figure contract (see theme-svg.mjs).
 *
 * Needs MiKTeX (latex, dvisvgm) and svgo on PATH; the MiKTeX user install is added to PATH when found.
 * This step is NOT part of `npm test` (it needs a TeX installation); its output is committed to
 * public/img, and the cheap gate (`npm run figures:check`) re-verifies the committed files.
 */
import {
  readFileSync,
  writeFileSync,
  mkdtempSync,
  copyFileSync,
  rmSync,
  existsSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { themeSvg } from './theme-svg.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error('usage: node scripts/figures/build-figure.mjs <figure.tex> <out.svg>');
  process.exit(2);
}

process.noDeprecation = true; // spawnSync with shell:true is only needed for svgo.cmd on Windows

const die = (m) => {
  console.log('  FAIL  ' + m);
  process.exit(1);
};

const env = { ...process.env };
const miktex = join(process.env.LOCALAPPDATA || '', 'Programs', 'MiKTeX', 'miktex', 'bin', 'x64');
if (existsSync(miktex)) env.PATH = miktex + ';' + env.PATH;
const run = (cmd, args, cwd) =>
  spawnSync(cmd, args, { cwd, env, encoding: 'utf8', shell: process.platform === 'win32' });

const tex = readFileSync(src, 'utf8');
if (
  /\\usepackage(\[[^\]]*\])?\{fontenc\}/.test(tex) &&
  !/\\usepackage(\[[^\]]*\])?\{lmodern\}/.test(tex)
) {
  die(
    `${src}: loads fontenc without lmodern; dvisvgm would drop most glyphs. Add \\usepackage{lmodern}.`,
  );
}

const work = mkdtempSync(join(tmpdir(), 'fig-'));
try {
  const name = basename(src, '.tex');
  copyFileSync(src, join(work, name + '.tex'));
  copyFileSync(
    join(root, 'figure-contract', 'phyriad-figure-colors.sty'),
    join(work, 'phyriad-figure-colors.sty'),
  );

  const lx = run('latex', ['-interaction=nonstopmode', '-halt-on-error', name + '.tex'], work);
  if (lx.status !== 0) die(`latex failed:\n${(lx.stdout || '').split('\n').slice(-15).join('\n')}`);

  const dv = run('dvisvgm', ['--no-fonts', '-o', name + '.svg', name + '.dvi'], work);
  const dvlog = (dv.stdout || '') + (dv.stderr || '');
  if (dv.status !== 0) die('dvisvgm failed:\n' + dvlog);
  if (/WARNING|failed to create/i.test(dvlog))
    die('dvisvgm warned, so the SVG is not trustworthy:\n' + dvlog.trim());

  const raw = readFileSync(join(work, name + '.svg'), 'utf8');
  const sv = run('svgo', ['--multipass', name + '.svg', '-o', name + '.min.svg'], work);
  if (sv.status !== 0) die('svgo failed:\n' + (sv.stdout || '') + (sv.stderr || ''));
  const min = readFileSync(join(work, name + '.min.svg'), 'utf8');

  const map = JSON.parse(readFileSync(join(root, 'figure-contract', 'theme-map.json'), 'utf8'));
  const { svg, unmapped } = themeSvg(min, map);
  if (unmapped.length) die(`${src}: colours outside the contract: ${unmapped.join(', ')}`);

  writeFileSync(out, svg);
  const glyphDefs = (svg.match(/<path id="/g) || []).length;
  const uses = (svg.match(/<use /g) || []).length;
  console.log(
    `  ok    ${out}: raw ${raw.length} B, themed ${statSync(out).size} B, gzip ${gzipSync(svg, { level: 9 }).length} B; ` +
      `glyph shapes ${glyphDefs}, placed ${uses}`,
  );
} finally {
  rmSync(work, { recursive: true, force: true });
}
