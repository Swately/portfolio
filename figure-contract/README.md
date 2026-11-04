# Figure contract — what a project hands the portfolio

Status: **v1, 2026-10-10.** The design behind it is
[`../docs/planning/CONTENT_PRESENTATION_CONCEPT.md`](../docs/planning/CONTENT_PRESENTATION_CONCEPT.md)
(§5 charts, §6 diagrams). Three project sessions (PhyriadFG, Phyriager, Phynned) draw their diagrams and write
their chart JSON against this folder. Nothing here is site code: it is the agreement.

| File                        | What it is                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `figure-roles.json`         | **The single source** of the colours a figure may use (light and dark hexes per role). Edit only this.                   |
| `phyriad-figure-colors.sty` | **Generated.** The LaTeX colour file a `.tex` loads.                                                                     |
| `theme-map.json`            | **Generated.** The map from those hexes to the site's dark theme, and the ready-made `@media` block.                     |
| `build-contract.mjs`        | Generates both files; `--check` fails if either is stale or if any role pair misses its contrast target in either theme. |
| `validate-chart.mjs`        | Validates chart JSON against `phyriad-chart/1`.                                                                          |
| `contract.check.mjs`        | Seven tests, each rule seen able to fail. `node --test figure-contract/contract.check.mjs`                               |
| `examples/`                 | One bar and one range example. **Invented numbers; never a measurement.**                                                |

## 1. Diagrams (TikZ)

**Colours.** Add `phyriad-figure-colors.sty` to the project's LaTeX path (copy it next to the `.tex`, or put it
on `TEXINPUTS`) and `\usepackage{phyriad-figure-colors}`. Roles, light-theme hex:

| Name                                         | Hex                             | Use                                                                   |
| -------------------------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| (TeX black, **do not set it**)               | `#000000`                       | all body text, box outlines and ordinary arrows: this is the ink role |
| `figMuted`                                   | `#5F5C52`                       | secondary text, context lines                                         |
| `figAccent`                                  | `#8A3324`                       | **the one thing to look at**; at most one accent per figure           |
| `figOk` / `figError`                         | `#2F6238` / `#A3242E`           | success and failure semantics only                                    |
| `figFill`                                    | `#F2F0EA`                       | neutral box fill                                                      |
| `figFillAccent`, `figFillOk`, `figFillError` | `#EADDD9`, `#DEE4DB`, `#EEDBDA` | tinted box fills under the matching role                              |
| `figPaper`                                   | `#FAF9F6`                       | a "paper" fill when a box must look empty                             |
| `figBorder`                                  | `#DDD9CF`                       | decorative hairlines only; a line that carries meaning uses ink       |

**Rules for authors.**

1. Use only these colours. A hex that is not here has no dark-theme mapping and will be left as authored,
   which is unreadable on the dark paper.
2. One accent against muted ink. Tell series apart by direct labels and by dash or marker, never by hue alone
   (WCAG 1.4.1). The tab20 palette the first two diagrams used is gone: three of its seven line colours miss
   3:1 on the light paper (concept §3).
3. Text no smaller than `\footnotesize`. The site shows a figure at its natural width or scrolls it; it does
   not shrink it below that.
4. Every diagram ships with a **text equivalent** in the project's dossier: the stages in order, what each
   consumes and produces (concept §6). The text in the SVG is paths and cannot be read by a screen reader.

**Compilation recipe.** The warning rule is the one two project sessions hit on 2026-10-09 and I hit on
2026-10-10 (ledger L-036):

```bash
latex -interaction=nonstopmode fig.tex
dvisvgm --no-fonts -o fig.svg fig.dvi 2> dvisvgm.log
# a warning means a font failed to build and the SVG has missing text: treat it as a FAILED build
grep -q "failed to create" dvisvgm.log && echo "FAILED: see dvisvgm.log" && exit 1
svgo --multipass fig.svg -o fig.min.svg
```

- With `\usepackage[T1]{fontenc}` you **must** also load `\usepackage{lmodern}`. Without it `dvisvgm` writes the
  file anyway, with most glyphs missing and a small, flattering size. Measured on PhyriadFG's pipeline: 30
  glyph shapes without, 144 with; 8.5 kB gzip without (wrong), 24.8 kB with (right).
- Check the result by eye at full size, not on a thumbnail, and compare the number of text items with the source.
- The site's build step (`scripts/figures/build-figure.mjs`, which also runs the four steps above and refuses a warning) appends the dark `@media` block from
  `theme-map.json` and checks the figure's colour pairs. A figure that fails that check is shown on a light
  plate in the dark theme, which is the documented fallback and not an error.

## 2. Charts from data (JSON, `phyriad-chart/1`)

```json
{
  "schema": "phyriad-chart/1",
  "id": "kebab-case-unique-across-the-site",
  "title": "what is plotted",
  "takeaway": "one sentence, 20 to 200 characters: what the reader should see",
  "kind": "bar | line | range | slope | stack | scatter",
  "unit": "ms",
  "xLabel": "optional",
  "yLabel": "optional",
  "series": [
    {
      "name": "series name",
      "emphasis": true,
      "points": [{ "x": "label or number", "y": 2.1, "lo": 1.9, "hi": 2.3, "n": 2 }]
    }
  ],
  "instrument": "what produced the numbers",
  "source": { "label": "where it is recorded", "url": "https://... or a repository path" },
  "runs": [
    { "id": "r1", "file": "path" },
    { "id": "r2", "file": "path" }
  ],
  "notes": ["optional caveats, one per entry"]
}
```

Rules (all enforced by `validate-chart.mjs`; each is tested to be able to fail):

- `takeaway`, `instrument` and `source` are **required**: a chart with no stated message, no instrument or no
  source does not build.
- At most 5 series, 200 points, **one** `emphasis` series (one accent against muted ink).
- **`[DI]` A chart that shows a spread needs `runs`: at least two, each with an id and a file.** `lo` and `hi`
  come together and bracket `y`. This is the container's rule that a quantity is computed twice and the
  run-to-run agreement reported with it.
- `kind` shapes: `line` needs 3 or more points per series (fewer: use `bar` or `slope`); `slope` has exactly two
  x values; `stack` parts are not negative and cover the same x values; `range` needs `lo` and `hi` on every
  point.
- Choose the `kind` by the data (concept §5): bar for a metric across a few alternatives, line over an ordered
  axis, range for repeated runs, slope for before and after, stack for a total split into parts, scatter for two
  metrics against each other.

```bash
node figure-contract/validate-chart.mjs path/to/*.json    # exit 1 on any error; ids must also be unique across files
```

## 2b. Approach comparisons (matrix JSON, `phyriad-matrix/1`)

The DESCRIPTIVE half of a comparison with alternatives. Measured comparisons are charts or tables with a methodology, never
rows here. Options are columns, attributes are rows (NN/g), a project goes first or last consistently.

```json
{
  "schema": "phyriad-matrix/1",
  "id": "kebab-case-unique",
  "title": "the caption: what the table is, in one sentence",
  "note": "optional: how to read the status of the comparison",
  "cellsLang": "en",
  "options": ["Tool A", "Tool B", "Project"],
  "rows": [
    { "attribute": "Mecanismo", "kind": "enfoque", "cells": ["...", "...", "..."] },
    {
      "attribute": "Latencia",
      "kind": "medido",
      "instrument": "what measured it",
      "cells": ["...", null, "..."]
    }
  ],
  "sources": [[{ "text": "host/path", "href": "https://..." }], [], []],
  "quotes": [["verbatim quote"], [], []]
}
```

Rules (`validate-matrix.mjs`, each tested to be able to fail): 2 to 6 options, unique; every row typed (`medido`,
`declarado` or `enfoque`); one cell per option, text or `null` (a null is shown as "sin dato", never left blank); a
`medido` row names its instrument; `sources` and `quotes`, when present, have one entry per option. File name
`src/content/tables/<slug>--<id>.json`.

## 3. Keeping the contract honest

```bash
node figure-contract/build-contract.mjs          # regenerate after editing figure-roles.json
node figure-contract/build-contract.mjs --check  # CI side: stale files or a missed contrast target fail
node --test figure-contract/contract.check.mjs
```

Changing a hex is a deliberate act: edit `figure-roles.json`, regenerate, and the gate says whether every pair
still has 4.5:1 for text and 3:1 for lines in both themes. The three projects must then re-include the new `.sty`.

<!-- Made with my soul - Swately <3 -->
