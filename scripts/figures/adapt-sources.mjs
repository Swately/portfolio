// Made with my soul - Swately <3
// One-off migration (2026-10-10): copies PhyriadFG's two TikZ diagrams (READ-ONLY there) into
// figure-sources/ and re-colours them with the figure contract. The PhyriadFG session will make its
// own contract-colour sources; these copies are what the site compiles until then.
// Usage: node scripts/figures/adapt-sources.mjs
import fs from 'node:fs';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const SRC = path.join('F:', 'Phyriad', 'projects', 'PhyriadFG', 'docs', 'diagrams');
const DEST = path.join(here, '..', '..', 'figure-sources');
fs.mkdirSync(DEST, { recursive: true });

function patch(file, pairs, extra) {
  let s = fs.readFileSync(path.join(SRC, file), 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) throw new Error(file + ': pattern not found: ' + a);
    s = s.split(a).join(b);
  }
  // drop the old \definecolor block, load lmodern (required after fontenc) and the contract colours
  s = s.replace(/^\\definecolor\{[^}]*\}\{HTML\}\{[0-9A-F]{6}\}\r?\n/gm, '');
  s = s.replace('\\usepackage[T1]{fontenc}', '\\usepackage[T1]{fontenc}\n\\usepackage{lmodern}');
  s = s.replace(
    '\\usepackage{xcolor}',
    '\\usepackage{xcolor}\n\\usepackage{phyriad-figure-colors}',
  );
  const header =
    '% Adapted for the portfolio on 2026-10-10 from PhyriadFG/docs/diagrams/' +
    file +
    '.\n% Colours are the site figure contract (figure-contract/): ink, figMuted, figFill, figFillAccent, figAccent.\n% ONE accent against muted ink; the hues the original used to tell stages apart are carried by the labels.\n';
  fs.writeFileSync(path.join(DEST, file), header + s + (extra || ''));
  console.log('wrote figure-sources/' + file);
}

patch('phyriadfg_pipeline.tex', [
  ['fill=Lcapture!20, draw=Lcapture,', 'fill=figFill,'],
  ['fill=Lflow!25, draw=Lflow,', 'fill=figFill,'],
  ['fill=Lwarp!22, draw=Lwarp,', 'fill=figFill,'],
  ['fill=Lblend!18, draw=Lblend,', 'fill=figFillAccent, draw=figAccent,'],
  ['fill=Lquality!20, draw=Lquality,', 'fill=figFill,'],
  ['fill=Lblend!32, draw=Lblend,', 'fill=figFillAccent, draw=figAccent, very thick,'],
  ['\\fill[Lblend]', '\\fill[figAccent]'],
  ['Lblend, font=\\scriptsize', 'figAccent, font=\\scriptsize'],
  ['text=black!70', 'text=figMuted'],
]);

patch('phyriadfg_multigpu.tex', [
  ['fill=Lgame!12, draw=Lgame}', 'fill=figFill}'],
  ['font=\\scriptsize\\bfseries, fill=white}', 'font=\\scriptsize\\bfseries, fill=figPaper}'],
  ['text=Lring, align=center}', 'text=figMuted, align=center}'],
  ['text=black!70}', 'text=figMuted}'],
  ['fill=Lcapture!18, draw=Lcapture,', 'fill=figFill,'],
  ['fill=Lflow!22, draw=Lflow,', 'fill=figFill,'],
  ['fill=Lwarp!20, draw=Lwarp,', 'fill=figFill,'],
  ['fill=Lpresent!14, draw=Lpresent]', 'fill=figFill]'],
  ['[badge, draw=Ligpu,', '[badge,'],
  ['[badge, draw=L1080,', '[badge,'],
  ['[badge, draw=L4090,', '[badge,'],
  ['\\draw[->, very thick, Lgame]', '\\draw[->, very thick, figMuted]'],
  ['\\draw[->, very thick, Lring]', '\\draw[->, very thick, figMuted]'],
  [
    '\\draw[->, very thick, Lpresent] (pres) -- (disp) node[ringlab, text=Lpresent]',
    '\\draw[->, very thick] (pres) -- (disp) node[ringlab, text=figMuted]',
  ],
  ['\\draw[->, dashed, thick, black!55]', '\\draw[->, dashed, thick, figAccent]'],
  [
    'font=\\scriptsize\\itshape, text=black!60]{\\texttt{p\\_presenting}',
    'font=\\scriptsize\\itshape, text=figAccent]{\\texttt{p\\_presenting}',
  ],
  ['text=black!65]', 'text=figMuted]'],
  [
    'lane/.style  ={draw, dashed, rounded corners, inner sep=4mm}',
    'lane/.style  ={draw=figMuted, dashed, rounded corners, inner sep=4mm}',
  ],
  ['[lane, fill=Lcapture!6,', '[lane, fill=figPaper,'],
  ['[lane, fill=Lflow!6,', '[lane, fill=figPaper,'],
  ['[lane, fill=Lwarp!6,', '[lane, fill=figPaper,'],
]);
