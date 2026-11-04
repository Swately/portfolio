# portfolio

Personal portfolio site for Eduardo Ramos Mendoza. Spanish-language, three routes, built on
climx's machinery.

**The idea:** every assertion about a project is a typed `Claim` whose `evidence` field is
**required**, so an unbacked claim fails `tsc --noEmit` — a gate CI already runs. `EvidenceChip`
is the only component permitted to print a claim's backing, which makes "rendered assertion" and
"evidence affordance" the same JSX node.

**The honest limit, stated on the page itself:** the type gate proofs against _omission_, not
against _falsehood_. TypeScript cannot know a number is stale. Verifying each figure against its
source is human work, done first-hand on 2026-08-27.

## Design (v2, 2026-09-02 — "the work first")

Minimal and about the projects only, after madebyevan.com read first-hand: the name as a
signature, the projects as a spaced list, no navigation, no about, no contact, no cards, no
rules. The proposal and the operator's decisions (OS scheme, serif body, «año pendiente», the
name alone in the masthead) are [`docs/planning/DESIGN_V2_PROPOSAL.md`](docs/planning/DESIGN_V2_PROPOSAL.md);
the v1 document is kept as the record of what was removed. Every project, claim, evidence and
limit is unchanged; the three provisional sections of each dossier say so on the page.

## Routes (design v2, 2026-09-02)

| Route             | What it is                                                                                                                                                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`               | **The list is the site**: the name as a signature, then the five projects — each with its verbatim status, its years («año pendiente» until given), its summary, its lead evidence and «Leer el dossier →». Nothing about the author beyond the name.                                                                    |
| `/proyecto/:slug` | **The extensive page**, one template for every project: contexto (provisional), qué hace y cómo se comprueba (every claim with its evidence, figures inline), decisiones de diseño (provisional), límites declarados, cómo reproducirlo (provisional), verificación. PhyriadFG is the first to receive its real content. |
| `/evidencia`      | The public ledger: what counts as proof, the mechanism and its limit, all assertions (filterable), what is missing, the tools with their evidence, how the site is built. Reached from the foot of every page.                                                                                                           |

## Measured (first-hand, 2026-08-27)

| Metric                     | Result                                                                                 | Instrument                                                   |
| -------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| M1 claim-to-proof coverage | **28/28 = 100.0%**                                                                     | printed by `src/content.test.ts` on every run                |
| M2 status honesty          | **5/5**                                                                                | status literals frozen in test, verified against each README |
| M3(a) initial JS           | **69.28 kB gzip** (bound 150)                                                          | `npm run build`                                              |
| M3(b) heaviest view        | **238,895 B transferred** (bound 500,000)                                              | `dist/` sizes, `/proyecto/phyriager`                         |
| Diagram view after SVG     | **151,818 B** — was 224,809 B as PNG (**−32%**), and now resolution-independent        | `dist/` sizes, `/proyecto/phyriadfg`                         |
| M4 quality gate            | lint ✓ · typecheck ✓ · **24/24 tests** ✓ · build ✓                                     | the four commands                                            |
| M5 accessibility           | jsx-a11y clean; landmarks + skip link; contrast 18.88 / 6.79 / 6.48 : 1 (AA needs 4.5) | lint, DOM read, arithmetic on `tokens.css`                   |
| Router cost, isolated      | **0.77 kB gzip**                                                                       | build diff at milestone M-A, before any content change       |

All 7 outbound URLs return 200 (five repos, the live climx site, the GitHub profile).

## Measured (first-hand, 2026-09-02, after the redesign on the stable substrate)

| Metric                     | Result                                                                                                                                                                                       | Instrument                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| M1 claim-to-proof coverage | **28/28** (18 claims + name and status of 5 projects)                                                                                                                                        | `src/content.test.ts`, unchanged             |
| M3(a) initial JS           | **70.37 kB gzip** by `size-budget.mjs` (72.75 by Vite's reporter — the tool's figure is the budget's; bound **85 kB**)                                                                       | `npm run build` + `npm run size:budget`      |
| M3(c) CSS                  | **4.00 kB gzip** (bound 6 kB)                                                                                                                                                                | same                                         |
| M4 quality gate            | lint ✓ · typecheck ✓ · **216/216 tests** (the substrate's own 200+ run here too) · build ✓ · 117/117 vendored files in sync                                                                  | the commands                                 |
| M5 accessibility           | **axe-core 4.13.0 with colour contrast ON: 0 violations** on all five routes, at 1280 and 320 px, light and dark (20 runs); one `<title>` per route; one `h1`; no horizontal overflow at 320 | Browser pane, axe served from `node_modules` |
| Wayfinding                 | sidebar outline links land 24 px below the top (the substrate's scroll margin); the ledger filter reports "3 de 18 afirmaciones" for "PhyriadFG"                                             | DOM read                                     |

## Measured (first-hand, 2026-09-02, design v2)

| Metric           | Result                                                                                                                                                                                                                                 | Instrument                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| M3(a) initial JS | **68.95 kB gzip** by `size-budget.mjs` (bound 85)                                                                                                                                                                                      | `npm run build` + `npm run size:budget`      |
| M3(c) CSS        | **3.72 kB gzip** (bound 6)                                                                                                                                                                                                             | same                                         |
| M4 quality gate  | lint ✓ · typecheck ✓ · **213/213 tests** · build ✓ · 117/117 vendored files in sync                                                                                                                                                    | the commands                                 |
| M5 accessibility | **axe-core 4.13.0 with colour contrast ON: 0 violations** on the three routes at 1280 and 320 px, light and dark (12 runs); one `h1` per page, a banner landmark on every page, heading levels in order, no horizontal overflow at 320 | Browser pane, axe served from `node_modules` |
| Reading measure  | an entry's paragraph is 489 px ≈ 65 characters at 1280 (Bringhurst 45–75)                                                                                                                                                              | DOM read                                     |

## Measured (first-hand, 2026-10-09, re-synced to tokens 1.3.0)

Only the tokens changed (1.2.0 -> 1.3.0: the `--phy-ok` role and `data-palette` palettes); react stayed at 1.1.0.
This site sets no `data-palette`, so it renders in oxide exactly as before.

| Metric           | Result                                                                                                                                    | Instrument                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| M3(a) initial JS | **69.30 kB gzip** by `size-budget.mjs` (bound 85), unchanged                                                                              | `npm run build` + `npm run size:budget` |
| M3(c) CSS        | **3.95 kB gzip** (bound 6); 3.81 -> 3.95 is the palette block the tokens file now carries                                                 | same                                    |
| M4 quality gate  | lint ✓ · typecheck ✓ · prettier ✓ · **215/215 tests** (20 files) · build ✓ · 117/117 vendored in sync                                     | the commands                            |
| Colour           | oxide values read from the painted page equal the documented ones in light and dark; `maid` values equal the token file's in both schemes | Browser pane, computed styles           |

**Not re-run this time:** the axe sweep with colour contrast ON and the 320 px overflow check. The tokens testbench gates
contrast per palette and scheme, but this site's rendered pages were not re-audited after the sync.

## Measured (first-hand, 2026-10-09, re-synced to tokens 1.4.0 and react 1.1.1)

The responsiveness audit's changes (narrow-mode text cap, container hyphenation, `.phy-target` width,
`Dialog` centring) reached this site with the sync. This site has no `Dialog`.

| Metric                  | Result                                                                                                                          | Instrument                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| M3(a) initial JS        | **69.31 kB gzip** (bound 85)                                                                                                    | `npm run build` + `size:budget`   |
| M3(c) CSS               | **3.97 kB gzip** (bound 6)                                                                                                      | same                              |
| M4 quality gate         | typecheck ✓ · lint ✓ · prettier ✓ · **216/216 tests** (20 files) · build ✓ · 117/117 vendored in sync                           | the commands                      |
| Horizontal overflow     | none at 320, 848 and 1280 px on `/` and on the PhyriadFG page                                                                   | Browser pane, `scrollWidth`       |
| PhyriadFG dossier prose | 38 / 68 / 68 characters per line at 320 / 848 / 1280 (was 103 at 846 before the text cap on the stacked layout)                 | Browser pane, canvas text metrics |
| Index entry summary     | 44 / 79 / 81 characters at 320 / 848 / 1280: the summary is small type inside a 60ch block, so it runs slightly past 80 at 1280 | same                              |

**Not re-run:** axe with colour contrast and the 320 px sweep of the other three routes. The wide figure
sits about 9 px right of centre at 1280: its list item has 18 px of left padding, which is this site's own
markup and not something the sync changed.

## Design v3 — how a project is presented (built 2026-10-14)

Research and decisions: [`docs/planning/CONTENT_PRESENTATION_CONCEPT.md`](docs/planning/CONTENT_PRESENTATION_CONCEPT.md)
(D1 to D10, all taken as recommended). A project page now runs in this order, **mechanism before claims**:
En breve (headline figures, the hero diagram, the signposts) · Contexto · Cómo funciona · Decisiones de diseño ·
Comparativa con alternativas · Qué hace y cómo se comprueba · Visualizaciones · Límites · Cómo reproducirlo ·
Verificación. Each figure is drawn once (the first is the hero of "En breve"; the claims link to it); every
diagram carries a text equivalent; charts come from JSON, drawn by the site, with their table beneath.

| What                                                                            | Where                                                              |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| The page order, the signposts, the "En breve"                                   | `src/components/ProjectShell.tsx` (`SECTIONS`, `DEFAULT_SECTIONS`) |
| Headline figures (a `number` evidence row, never new data)                      | `src/components/KeyFigure.tsx`                                     |
| Charts (bar, line, range, slope, stack, scatter) and their data table           | `src/components/charts/`                                           |
| The approach matrix (typed rows; a missing cell says "sin dato")                | `src/components/ComparisonMatrix.tsx`                              |
| A figure: natural-width legibility floor, text equivalent, light-plate fallback | `src/components/Figure.tsx`                                        |
| Chart data from the projects (`<slug>--<id>.json`), validated by the tests      | `src/content/charts/`, `src/lib/charts.ts`                         |
| The figure contract: colours, chart JSON shape, validator                       | `figure-contract/` (README inside)                                 |
| TikZ sources adapted to the contract, and the build step                        | `figure-sources/`, `scripts/figures/` (`npm run figures:build`)    |
| The exhibit of every chart kind, **invented numbers**, dev only                 | route `/figuras` (`src/pages/FiguresLab.tsx`)                      |

`npm run figures:check` runs the contract gate (generated files current, every colour pair at 4.5:1 text and 3:1 lines in
both schemes), its seven tests and the example validation. The TikZ build (`npm run figures:build -- <tex> <svg>`) needs
MiKTeX and svgo and is not part of `npm test`; its output is committed, and `src/lib/figures.test.ts` re-checks the
committed files (themed, contract colours only, glyphs present, text equivalent declared).

## Measured (first-hand, 2026-10-14, design v3)

| Metric                              | Result                                                                                                                                                  | Instrument                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| M3(a) initial JS                    | **74.65 kB gzip** (bound 85): +5.34 kB over 69.31 for charts, key figures and the new shell                                                             | `npm run build` + `size:budget`           |
| M3(c) CSS                           | **4.52 kB gzip** (bound 6)                                                                                                                              | same                                      |
| M4 quality gate                     | typecheck ✓ · lint ✓ · prettier ✓ · **240/240 tests** (23 files) · build ✓ · 117/117 vendored in sync                                                   | the commands                              |
| Figure weight, gzip                 | pipeline **21.9 kB** (was 32.0), multigpu **36.7 kB** (was 48.6)                                                                                        | `build-figure.mjs` output                 |
| Figure ink at 4.5:1, per pixel      | pipeline **100 %** in light and dark; multigpu **99.1 % / 99.2 %** (residual in muted and accent text, not isolated)                                    | scripted raster against the pixel beneath |
| PhyriadFG page                      | ten sections in order, each of 2 figures drawn once, 9 signposts all resolve, no horizontal overflow at 320 and 1280                                    | DOM read                                  |
| axe-core 4.13.0, colour contrast ON | 0 violations on the PhyriadFG page and on `/figuras`, light and dark, at 1280; at 320 the same, after the scrollable figure regions took their tab stop | Browser pane                              |
| Charts at 320, 848 and 1280         | six kinds, six tables, no NaN, no horizontal overflow; the SVG is capped at 45rem so a label is about 16 px                                             | DOM read                                  |

**Not measured:** a coarse pointer, forced colours, any engine but this Chromium, a screen reader on the figures and charts,
and the `maid` palette on the new components. The scrollable-region tab stop at 320 px arrives a moment after the resize in
this pane (the observer's callback is deferred while the document is hidden); an axe run taken immediately after the resize
reported it missing, and one taken after the callback did not.

## Content integrated from the three dossiers (2026-10-14)

Authorised by the operator in this chat ("con tu recomendación"): the **figures and data** the three project sessions
delivered, in the shape of the figure contract, copied without touching their repositories. **Their prose, the four corrections and the other two comparisons were integrated LATER THE SAME DAY**, once the operator
authorised them (next section). Until then those parts stood as visibly provisional sections.

| What                                                               | From                                                                 | Where on the site                                                                                                                                                                     |
| ------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2 + 2 + 2 diagrams (TikZ, rebuilt here with the site's build step) | PhyriadFG, Phyriager, Phynned `docs/portfolio/*.tex`                 | `figure-sources/`, `public/img/`, `Project.diagrams` in `src/content.ts` (alt, caption and text equivalent copied from each dossier; Phynned's are in English and marked `lang="en"`) |
| 6 charts (2 range/bar, 2 slope/line, 2 bar)                        | the six `phyriad-chart/1` JSON                                       | `src/content/charts/`, loaded on demand per project                                                                                                                                   |
| 1 approach matrix (5 tools, no winner, sources and quotes)         | Phynned `docs/portfolio/tables/approach_comparison.json`, transposed | `src/content/tables/`, `phyriad-matrix/1`, validated by `figure-contract/validate-matrix.mjs`                                                                                         |

The evidence links these items cite point at files nothing has published yet (no dossier, no `docs/portfolio` is on GitHub, and
PhyriadFG excludes its own on purpose, which is why the site hosts its figures): they do not open today. That is the
operator's call, not this site's.

**Budget.** Charts and matrices are loaded per project page. Measured: eager loading took the initial JS from 74.65 to
89.35 kB gzip; on demand it is **80.39 kB** initial plus 11.58 kB in seven small chunks that load only on their project's
page. `size-budget.mjs` sums every chunk, so the script then read **--js 95** (total 91.97 kB), raised on purpose in that
change with that reason. It was raised again later the same day (next section).

## Measured (first-hand, 2026-10-14, content integrated)

| Metric                              | Result                                                                                                                                           | Instrument                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| M4 quality gate                     | typecheck ✓ · lint ✓ · prettier ✓ · **252/252 tests** (24 files) · build ✓ · 117/117 vendored in sync                                            | the commands              |
| Budget                              | JS **91.97 kB** of 95 total (80.39 initial); CSS **4.57 kB** of 6                                                                                | `npm run size:budget`     |
| New diagrams, gzip                  | 18.3, 24.1 (PhyriadFG), 15.5, 11.0 (Phyriager), 15.9, 15.5 kB (Phynned); no dvisvgm warning, contract colours only, 76 to 148 glyph shapes each  | `build-figure.mjs` output |
| The three project pages             | diagrams drawn once each, charts with their tables, Phynned's matrix with its sources and quotes, no horizontal overflow at 320, 848 and 1280 px | DOM read                  |
| axe-core 4.13.0, colour contrast ON | 0 violations, light and dark, at 320, 848 and 1280 px on all three project pages (loaded at each width)                                          | Browser pane              |
| Contract                            | 9 tests (7 plus 2 for the matrix) and the example validation pass                                                                                | `npm run figures:check`   |

**Not measured:** ink contrast per pixel for the six new diagrams (the contract colours are gated, the pixel test was run only
on PhyriadFG's first two); a coarse pointer, forced colours, other engines, screen readers; the `maid` palette on any of it.
Resizing the window with a page already loaded leaves a scrollable figure region without its tab stop in this pane until the
next rendering opportunity (the pane's document is hidden, so the observer's callback is deferred); loading each page at the
target width, which measures the component rather than the pane, was clean.

## Prose and corrections integrated (2026-10-14, operator-authorised: "integrar la prosa y las cuatro correcciones")

**Prose**, adapted from each project's own dossier (read-only, nothing in the three repositories was touched): context,
mechanism, five design decisions each with what was rejected and what it cost, the comparison with alternatives, how to
reproduce, and the span of the work. Each project now has its own page (`PhyriadFGPage`, `PhyriagerPage`,
`PhynnedPage`). A decision whose source is a record the project has not published says so in words ("no publicado")
instead of linking; public lines are links. The PhyriadFG comparison and the Phyriager one became matrices
(`src/content/tables/`); PhyriadFG's measured comparison with Lossless Scaling is NOT on the site (the operator withdrew it
from all public text on 2026-09-29), and a test asserts no watts figure appears on that page.

**Phynned's prose is in English, marked `lang="en"`, with a visible note that its Spanish translation is pending**: the
Phynned session that was to translate it is gone. The dossier speaks in the first person of its author; on the page that
became the passive ("observed", "not verified").

**The four corrections, each checked against the project's own file on 2026-10-14** (the Verificación note on each page now
prints that date):

| Correction                                                                                                                                                                                                       | Checked against                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PhyriadFG status 0.4.0 to **0.6.0-experimental** (and the limit that quotes it)                                                                                                                                  | `PhyriadFG/README.md:8`                                                                                                                                |
| Phynned status 0.2.0 to **0.2.2-experimental**                                                                                                                                                                   | `Phynned/README.md:8` and `core/include/phynned/version.hpp:33`; **the README edit is a local copy, not yet committed**, and the status source says so |
| Phynned: the claim «49 pruebas» **removed**                                                                                                                                                                      | the dossier counts 56 tests (2 failing, cause not established) and recommends dropping the count                                                       |
| Phyriager: the limit "no validado en vivo" **replaced** by the new README's own words (runs are "a record of runs, not a release", open defects, hosted LLM providers never tested, activity stopped 2026-08-09) | `Phyriager/README.md`, **committed locally (5a79df0), not pushed**; the old public README still carries the old text                                   |

Years now live in the ledger: «desde junio de 2026» (PhyriadFG), «2026, en pausa desde agosto» (Phyriager, the operator's
wording), «desde mayo de 2026» (Phynned); PHarvard and climx stay «año pendiente».

**Not integrated, and why.** The new Phyriager summary the dossier proposes and the extra declared limits it and the others list
(the ledger's `limits` are quotes and the operator's list was four corrections); the dossiers' new claims (C1 to C8 and A1 to
A8); Phyriager's second limit, «el puerto a Minecraft 26.2 y la arquitectura de cliente de red están en curso», which looks
stale against D·5 of its own logbook but is not one of the four, so it is flagged and untouched. Evidence links that point at
files nobody has published (no dossier and no `docs/portfolio`; PhyriadFG excludes its own on purpose) do not open today.

**Budget, again.** The three prose pages are loaded per route (`src/lib/lazyPage.tsx`): initial JS **80.68 kB** (was 80.39);
the pages and their data are 30.1 kB more in 13 chunks that load only where they are used, so the total is **110.73 kB** and the
script now reads **--js 115**. The 95 kB the operator's session accepted earlier did not cover this growth: it is a new deliberate
raise, with these numbers, and the initial load did not grow.

## Measured (first-hand, 2026-10-14, prose and corrections)

| Metric                                            | Result                                                                                                                                                   | Instrument             |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| M4 quality gate                                   | typecheck ✓ · lint ✓ · prettier ✓ · **257/257 tests** (24 files) · build ✓ · figures:check ✓                                                             | the commands           |
| Budget                                            | JS **110.73 kB** of 115 total (**80.68 initial**); CSS **4.71 kB** of 6                                                                                  | `npm run size:budget`  |
| The three project pages, each loaded at its width | five decisions each, figures and charts drawn once, matrix with sources and quotes, code block focusable; no horizontal overflow at 320, 848 and 1280 px | DOM read, Browser pane |
| axe-core 4.13.0, colour contrast ON               | 0 violations, light and dark, at 320, 848 and 1280 px on all three pages (loaded at each width)                                                          | Browser pane           |

**What the browser found that the tests did not** (ledger L-037): at 1280 px axe reported `scrollable-region-focusable` on the
code blocks of all three pages, in both schemes. jsdom computes no layout, so the 256 passing tests, which run axe on every page,
could not see it. `CodeBlock` (a focusable, named region) fixed it and has its own test; the browser run is the instrument for
every layout-dependent accessibility claim, and the jsdom run is the semantic half only.

**Not measured:** ink contrast of the new diagrams per pixel, a coarse pointer, forced colours, other engines, screen readers, the
`maid` palette on any of it. The English text of Phynned is marked but a screen reader's pronunciation of it was not tested.

## The web substrate section (`/sustrato-web`, 2026-11-04)

A new section, in Spanish, that explains how the substrate this site is built on works (`catalog/web`: phyriad-tokens +
phyriad-react, copying with `sync.mjs`, the gates), with a live demonstration and the substrate's own laboratory. Linked from
the **foot** (not the home list). Built on the operator's word ("usa tus recomendaciones": link in the foot, demonstrations in an
isolated box).

| Route                       | What it is                                                                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `/sustrato-web`             | the page: nine sections in the v3 order (mechanism before claims), a TikZ diagram, three decisions, ten `Claim`s with evidence, declared limits |
| `/sustrato-web/demo`        | a **window route** (no site chrome): real substrate components in a document of their own, shown in an iframe by the page                       |
| `/sustrato-web/laboratorio` | the substrate's `StandardsLab` (it was a development-only route before), with its own h1 and a way back                                         |

**Why the demonstration is an iframe.** A palette and a type theme are attributes of the root element, so one page can show one
at a time. The controls (palette, type theme, text size) post a message to the box, which sets the attributes **on its own
document and never writes to storage**, so a demonstration cannot change the site's look on the next visit. The box follows the
page's light/dark choice.

**Files.** `src/content/substrate.ts` (the ledger: claims, limits, figure), `src/pages/{SustratoWebPage,SustratoLabPage,
SustratoDemo}.tsx`, `src/components/SubstrateDemoFrame.tsx`, `figure-sources/sustrato_flujo.tex` →
`public/img/sustrato_flujo.svg`, `docs/SUSTRATO_WEB_EVIDENCE.md` (the record behind every number), and `src/app.tsx` (three lazy
routes, the foot link; the development-only `/lab` route is gone, the public one replaces it). Tests: `src/content/substrate.test.ts`
(a number the page prints must be written in the record; versions equal the copied files'; every evidence link lands on a heading
of the record; the diagram is themed and its declared size is its file size) and `src/pages/sustrato.test.tsx`; each was seen red
with a deliberate break.

**Cost, measured (declared on purpose).** The budget went from JS 115 / CSS 7 kB to **135 / 9** (`package.json`):

|                                     | Before   | After                  |
| ----------------------------------- | -------- | ---------------------- |
| JS, sum of every chunk              | 112.0 kB | 129.7 kB               |
| CSS, sum of every chunk             | 6.7 kB   | 8.7 kB                 |
| **Home page** JS (entry + preloads) | 83.96 kB | 93.19 kB (**+9.2 kB**) |
| **Home page** CSS                   | 6.68 kB  | 8.43 kB (**+1.75 kB**) |

The section itself is about 8 kB; the rest is the laboratory, and the **home page pays for it** although it never opens it: the
substrate's barrel (`src/phyriad-react/index.ts`) re-exports `StandardsLab`, so the bundler merges the laboratory with the shared
pieces and preloads it on every page. Isolated on a copy: without those three re-export lines the home page pays about +2.5 kB. A lazy
`import()`, importing from the file, and a chunk group in the bundler config were each tried and changed nothing. **Fixing it is a
catalog change** (removing exports from the barrel is a MAJOR of phyriad-react) and is **pending**. Details and numbers:
`docs/SUSTRATO_WEB_EVIDENCE.md`, "Presupuesto de tamaño".

**Not verified.** Safari; forced colours; a screen reader; the type scale outside Chromium and Firefox 157. The page names
phyriad-react 1.4.0 but the copy does not declare react's version (tokens' 2.1.1 is declared and tested): it is quoted from the
catalog's changelog. Evidence links point into this repository and open once it is published. Private project names were left out of
the diagram and the record on purpose.

## Synced to tokens 2.1.1 / react 1.4.0 (2026-10-21)

The type system arrived (face roles, `data-type` themes, a computed scale); this site stays on the default `editorial` theme,
so its text did not change (base 18 px at 1920, equal to the literal step). The CSS grew to **6.65 kB**, so the budget went
from 6 to **7 kB** (`package.json`), deliberately. Measured: axe 0 in 40 runs (five pages, default and oxide palettes, both
schemes, 1920 and 390 px); 280/280 tests.

## The skin is the default (tokens 2.0.0, 2026-10-20)

The operator made showcase the substrate's default palette. Synced; the skin's rules now apply with no attribute, and
`?palette=oxide` (or `maid`) returns the site's earlier look, remembered in the browser; `?palette=default` forgets it.
Measured: axe 0 in 40 runs (five pages, default and oxide, both schemes, 1920 × 1080 and 390 × 844); 274/274 tests; CSS
**5.89 of 6 kB** (no room left for another skin rule without a budget decision).

## The "showcase" skin and D-32 (2026-10-20)

**Synced the same day to tokens 1.6.0 / react 1.3.0** (operator: "sincroniza el portafolio"): the palette, the third surface
(`--phy-paper-3`) and the 8 px radius now come from the vendored substrate, and `skin-showcase.css` keeps only the
portfolio's component rules and the pill radius. Painted values unchanged (measured: background `rgb(14, 15, 17)`, card
`rgb(23, 24, 27)`, raised `rgb(33, 35, 40)`); axe 0 in 40 runs at 1920 × 1080 and 390 × 844; 273/273 tests; CSS 5.84 of 6 kB.

A switchable dark, surface-based variant (`?palette=showcase`, off with `?palette=default`; nothing changes without
it): palette and radius in `src/styles/skin-showcase.css`, switch in `src/lib/skin.ts`, specification and measurements in
`docs/planning/SHOWCASE_SKIN_SPEC.md` (§9), captures in `docs/planning/captures/`. D-32 moved the section spine outside a
`min(90rem, 100vw − 26rem)` data band, so the comparison matrices fit from about 1600 px (default site, ≥ 1440 px).
Measured at ten window sizes, five pages, both looks and both schemes: axe 0 in all 200 runs. 272/272 tests; CSS 5.79 of 6 kB.

## Matrices sized by their columns (2026-10-18, react 1.2.0 + tokens 1.5.0)

Synced on the operator's word ("Sí, autorizo construir B y sincronizar el portafolio"); decisions D-30 and D-31. The three
comparison matrices use the substrate `Table` with `width="content" columns="even" stickyFirst`: no word breaks inside a
cell any more (before: 16 to 42 broken cells and up to 76-line cells), the matrix is as wide as its columns need up to the
window, and below that it scrolls in its own focusable region with the row labels in view. Where the section spine shows
(from 1440 px) tables are capped at the 62rem band (`--phy-table-max` in `ProjectShell.module.css`), so there the matrices
are 992 px and scroll; whether to move the spine further out so they fit is the operator's call. `Figure` keeps its
natural-width floor for SVG diagrams only: the raster capture of Phyriager now fits its column instead of scrolling at every
size. Measured at ten window sizes, both themes, axe 0: `catalog/web/react/docs/concepts/NON_PROSE_WIDTH_AUDIT.md` §5c.
265/265 tests; JS 111.66 of 115 kB, CSS 5.27 of 6.

## Visual language: the shelf and the spine (2026-10-18)

From `docs/planning/VISUAL_LANGUAGE_CONCEPT.md` (research on the new Epic Games Launcher, principles not look), decisions
D-27 to D-29, built on the operator's word in chat. **Home (B):** each entry shows its project's opening figure as a
hairline-framed plate under its text, fitted to the column (exempt from the natural-width floor, that plate only). **Project
page (E):** `SectionSpine`, a sticky list of the ten sections in the left margin, the current one in bold with an ink bar, no
colour; from **1440 px** only, because below that the wide figures occupy the margin (measured); narrower screens keep the
static signposts. Measured: axe 0 violations at 320, 848, 1280 and 1440 px, light and dark, on the home and the three project
pages; no horizontal overflow; 260/260 tests; JS 111.23 of 115 kB (initial 81.19), CSS 5.00 of 6. Details, the one deviation
(plate under the text, not to its right) and what was not measured: §7c of that document.

## Where the pages live (2026-09-02)

| What                                                                                                                       | File                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| The index (the list)                                                                                                       | `src/pages/IndexPage.tsx` + `src/components/ProjectEntry.tsx`                                                       |
| **The page format** (the shell every project page is written on: way back, header from the ledger, sections, verification) | `src/components/ProjectShell.tsx` — exports `ProjectShell`, `ProjectSection`, `Pending`, `ClaimsList`, `LimitsList` |
| **The blank page** (copy it to start a project's own page; not routed)                                                     | `src/pages/projects/_Blank.tsx`                                                                                     |
| PhyriadFG's own page (the first)                                                                                           | `src/pages/projects/PhyriadFGPage.tsx`, routed at `/proyecto/phyriadfg` **before** the generic route                |
| The generic page (the other four, until each has its own)                                                                  | `src/pages/ProjectPage.tsx`                                                                                         |
| The ledger                                                                                                                 | `src/pages/EvidencePage.tsx`                                                                                        |
| The content (projects, claims with evidence, limits, skills)                                                               | `src/content.ts` — a page's header, claims and limits come from here, so nothing escapes the evidence gate          |

## Where the UI code lives

`src/phyriad-react/` is **vendored, not written here** (tracking mode since 2026-09-02; last synced 2026-10-21 to `phyriad-react 1.4.0` + `phyriad-tokens 2.1.1`; `npm run substrate:check` fails on drift): it is the container's web substrate
([`catalog/web/react`](../../catalog/web/react)), copied in so this repository stays clonable on
its own. Do not edit it — changes belong upstream, and `npm run substrate:check` fails if the
copy drifts.

```bash
npm run substrate:check   # verify the vendored copy matches upstream
npm run substrate:sync    # pull upstream changes in
```

The site's own code is everything else: `content.ts` (the ledger), `components/` (EvidenceChip,
ProjectCard, Figure, SkillsTable), `pages/`, and `styles/` (two import seams plus the page frame).

## What is reused from climx, and what is not

**Structural** (delete it and the page breaks or loses a capability): the hand-rolled router
(`src/router/router.tsx`, ported verbatim); the GitHub-Pages deep-link shim, counted as one
resource because its two halves are useless apart (`public/404.html` together with the restore
block in `main.tsx`); the `BASE_URL` asset helper generalized from `EstadoCard`'s `estadoImg`;
the five layout primitives; and `tokens.css`.

**Deliberately not reused:** climx's data layer, geo layer, `SearchCombobox` and every
weather-specific component — no consumer here. And its 32 state photographs: their provenance
is undocumented (climx credits every _municipality_ photo with author and licence but says of
the state photos only that they come from the 2023 project), and they are pictures of Mexican
geography, not of this operator's work. The _mechanism_ around them — `object-fit` cards, the
`onError` degrade, the `BASE_URL` prefix — is reused, pointed at the operator's own diagrams.

## Run it

```bash
npm ci
npm run dev        # http://localhost:5174/portfolio/
npm test           # 24 tests; prints the M1 coverage fraction
npm run build && npm run preview   # the M3(b) instrument
```

Node here is a portable install; `dev.cmd` exists only to put it on PATH for the preview
runner. See the note at the bottom of this file.

## How the design was chosen

Through a full Phyriad AAP run (`protocols/analysis/ARCHITECTURE_ANALYSIS_PROTOCOL.md`), not by
preference. Record in [`docs/planning/aap/`](docs/planning/aap/): a frozen objective gated by a
clean adversary (AT0 → `FREEZE WITH FIXES`, 5 point-fixes applied), three mutually-isolated
candidate designs, two diverse adversarial lenses each (all six `SCORED`, zero FATAL), a
supervisor convergence citing the scorecards, and a combined feasibility-veto + release gate
(AT4 `CLEARS`, ATF `APPROVED FOR HANDOFF`, zero blockers).

The adversarial phase earned its cost: it caught a figure the page was about to print
(«~350 B gzip per municipio») that climx's own `MEASUREMENTS.md` supersedes with 463 B — struck
before it shipped. Implementation plan: [`docs/planning/PORTFOLIO_PLAN.md`](docs/planning/PORTFOLIO_PLAN.md).

## Known gaps, carried openly

- No screenshot of Phynned running or of PHarvard's display. Both are capturable in minutes;
  until then those two projects show no figure rather than a borrowed image.
- The deployment target is undecided. `vite.config.ts` assumes a GitHub Pages project path
  (`/portfolio/`); the 404 shim's base string is the one thing that must change with it.
- **A GitHub profile README would reach the same reader where they already are, and this page
  does not beat it by default.** Recorded rather than quietly dropped — the two complement each
  other.
- The page is Spanish while the CV and every quoted status string are English, so the evidence
  rows read bilingual by construction. A declared consequence of the language decision, not an
  oversight.

## `dev.cmd` — a local-machine workaround, not part of the project

Node.js is a **portable** extraction at
`C:\Users\Swately\AppData\Local\Programs\nodejs-portable\node-v24.19.0-win-x64` (no admin
rights in that session), added to the user `PATH`. A fresh terminal sees it; a preview-runner
process started before that change does not. `dev.cmd` sets `PATH` for its own process and runs
`npm run dev`. If Node ever gets a normal install here, delete `dev.cmd` and point
`.claude/launch.json`'s `portfolio-dev` back at bare `npm`.
