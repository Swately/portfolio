# Presenting a technical project — research and a proposal for the portfolio (2026-10-09)

> **Diátaxis type:** Concept (research + proposal). **Written as design only on 2026-10-09; built 2026-10-14 with D1 to D10 as recommended (§10).**
> **Requested by** the operator through the prompt-workshop session, 2026-10-09: order the content of a
> technical portfolio (figures and numbers, images and diagrams, explanatory text), decide how charts
> from JSON and TikZ diagrams are drawn, and propose the home and project pages. Three project sessions
> (PhyriadFG, Phyriager, Phynned) are gathering their data in parallel, each in
> `docs/PORTFOLIO_DOSSIER.md` of its repository; this document is the design side of that work.
> **Reads on top of:** `DESIGN_V2_PROPOSAL.md` (the adopted "work first" design, §6 distribution, §7 one
> page per project), `src/content.ts` (the `Evidence` type, five kinds), `ProjectShell.tsx`.
> **Site state when written:** tokens 1.4.0, react 1.1.1, both synced; 216 tests green.

## 0. The short version

- The evidence a portfolio reader can use is thin and mostly about **UX designers**, not engineers. The
  one primary source on portfolio review (NN/g, 204 hiring managers) says: 3 to 5 projects, show the
  process and the constraints, make it scannable, lead with what the reader should take away. The
  famous "7 seconds" is a **résumé** study and must not be quoted as a portfolio number.
- The proposal keeps the site's identity (the list is the site, one column, serif, evidence chips) and
  changes **what each project page opens with and in what order it explains**: a one-screen
  "En breve" (what it is, two or three key figures, one diagram), then the **mechanism before the
  claims**, because the brief's emphasis is how each project works and what is interesting about its
  approach.
- **Measured here:** the two TikZ diagrams already on the site are unreadable in the dark theme (ink
  pixels with 4.5:1 contrast: 99.7 % in light, 35.4 % in dark; on bare paper, 0 %). A recompiled and
  recoloured file with one internal `@media (prefers-color-scheme: dark)` block reaches 99.4 % in dark,
  follows the site's theme toggle when painted through `<img>`, and weighs **24.8 kB gzip against
  32.0 kB** for the same diagram. (**Corrected 2026-10-10:** the first version of these numbers, 8.5 kB
  and 100 %, came from a recompilation with missing text; see §3.)
- Charts from JSON are drawn by the site as inline SVG with the existing tokens, one accent against
  muted ink, direct labels, and **the table always next to the chart**. Types by data class are in §5.
- Ten decisions need the operator (§7), each with options and a recommendation.

## 1. How the research was done, and what it can claim

Sources were fetched and read on 2026-10-09 with `WebFetch`, which returns a **summary written by a
small model**, so every quote below was requested verbatim and the page's own words are what is
cited; a quote is not re-checked against the raw HTML. Levels follow the container's FDP convention:

| Level    | Meaning here                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **[V1]** | the source's own page, read first-hand, quoted, and the claim is about what that page says                                     |
| **[V2]** | the page reports someone else's study or survey; the finding is the page's claim, method read only as far as the page gives it |
| **[V3]** | secondary, a search snippet, or not fetched; **not used to decide anything**                                                   |

## 2. What the research says

### 2.1 How portfolios are reviewed

| Finding                                                                                                                                                                                                                                                                                                                                                                    | Source                                                                   | Level                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------- |
| 204 UX professionals in charge of hiring surveyed; "3–5 detailed case studies"; "Quality over quantity"; "Very rarely will hiring managers take the time to read your entire portfolio word for word"; the portfolio should be "scannable" with no "unnecessary detail"; "Don't just show me the finished product"; ask which "top three things" a reader should take away | NN/g, R. Krause, _5 Steps to Creating a UX-Design Portfolio_, 2019-08-04 | [V2]                              |
| "Show me how you started with an opportunity and produced real value"; hiring managers "want to know that you'll be able to navigate challenges and constraints"                                                                                                                                                                                                           | same                                                                     | [V2]                              |
| Recruiters "skim resumes for an average of 7.4 seconds"; layouts that held attention had "simple layouts, with clear sections and heading titles"; cluttered ones had "a lack of white space on the page, multiple columns and long sentences". **A résumé study (Ladders, 2018), sample size not stated by the article; the primary PDF returned 404.**                   | HR Dive coverage of the 2018 study                                       | [V3] for the number, as secondary |

**Limits, stated because they bind the design:** the one primary survey is of _UX design_ hiring, not
systems engineering; no source found measures how engineers read an engineering portfolio. Career-blog
claims about "30 to 60 seconds" and "10 seconds" are unsourced and were **not used**. The transferable
points are the ones that do not depend on the field: scannability, a stated takeaway, process and
constraints beside results, few projects.

### 2.2 What goes above the fold, and what is hidden

| Finding                                                                                                                                                                                                                                                                                        | Source                                      | Level |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----- |
| "What is visible on the page without requiring any action is what encourages us to scroll"; the 100 px above the fold were viewed 102 % more than the 100 px below (eyetracking, 57,453 fixations); put signposts at the top of a long page; avoid "false floors"                              | NN/g, A. Schade, _The Fold Manifesto_, 2015 | [V2]  |
| Accordions "should be avoided" when readers need most of the content; "Accordions increase interaction cost"; "Hiding content behind navigation diminishes people's awareness of it"; "It is easier to scroll down the page than to decide which heading to click on"; better on small screens | NN/g, H. Loranger, 2014 (desktop)           | [V1]  |

Consequence: do not hide the explanation. Hide **reference material a reader looks up** (methodology
detail, long tables, a diagram's text equivalent) and keep the narrative open.

### 2.3 Numbers: a headline figure, a table, or a chart

| Finding                                                                                                                                                                                                                                                                                                                                                                            | Source                                                                               | Level                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------- |
| "Use tables if you want to enable readers to look up specific information"; "Use charts instead of tables if you want to give an overview of your numerical data or show a pattern"; "most people won't read a whole table (especially if it's made out of more than 3 rows)"; a "short table" should be "shorter than a desktop screen"; bars only on "the most important" column | Datawrapper, _What to consider when creating tables_                                 | [V1]                                               |
| "if you expect them to read off data points, give a table"; "when a chart shows lots of data points, a table is not normally a suitable text alternative"; text alternative "directly beneath the visualisation"; the chart image "in the SVG format"                                                                                                                              | UK Government Analysis Function, _Publishing charts_                                 | [V1]                                               |
| Bars compare categories, lines show change over an ordered axis, a line over categories "is mostly visual noise"                                                                                                                                                                                                                                                                   | search summaries of Syncfusion, Observable, Atlassian (Observable page returned 429) | [V3], used only as common ground, not as authority |

### 2.4 Comparison against alternatives

| Finding                                                                                                                                                                                                                                                                                                                                                                                                               | Source                                                                   | Level          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------- |
| "options as columns, attributes as rows, with row labels on the left and column labels above"; "When more than 5 items need to be compared, add other mechanisms such as filters"; mobile "unlikely ... more than 2 items at a time"; "keep column headers fixed as users scroll"; "keep it short" and "avoid full sentences"; "The biggest problem with most comparison tables isn't design, it's content"           | NN/g, K. Moran and T. Dykes, _Comparison Tables_, 2024-02-09             | [V1]           |
| A benchmark write-up that separates **claims** (a prose pitch and "anti-pitch") from **measured results** (per-benchmark tables with mean and deviation, best value marked, rows grouped by variant), then an "Analysis" section, and states machine, versions and method, and where the tool **loses** ("There is a performance edge case where ripgrep doesn't do well"). Read: first 100,000 of 121,487 characters | A. Gallant, _ripgrep is faster than {grep, ag, git grep, ucg, pt, sift}_ | [V1] (partial) |

### 2.5 Figures, images and the measure

| Finding                                                                                                                                                                                                                                                                                                                                                                                                                                  | Source                                     | Level                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------- |
| Three placements: a `figure` "constrained to the main column", a "full-width" figure, and a margin figure; the stated reason is that "Data, graphs, and figures are kept with the text that discusses them"; on small screens margin items "are hidden until the user toggles them"                                                                                                                                                      | Tufte CSS documentation                    | [V1]                                           |
| A technical project page that works: summary and a link to the demo first, then explanation; figures inline at column width between paragraphs, no galleries; **numbers in prose** ("draws this image in 6 ms"); comparisons mostly with the author's own earlier versions and with the alternative **described, not benchmarked** ("Fidget is using the same meshing strategy as libfive"). The projects index is a dated one-line list | M. Keeter, _Fidget_ and the projects index | [V1], observation of the page as of 2026-10-09 |

The Tufte margin placement is **incompatible with this site**: the page is capped at 64rem and centred
(`DESIGN_V2_PROPOSAL.md` §6), so there is no margin, and hiding a figure on a phone contradicts the rule
that these figures carry information.

### 2.6 Accessibility of charts and diagrams

| Finding                                                                                                                                                                                                                               | Source                                | Level                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------- |
| Complex images need "a two-part text alternative": a short description and a long one; the long one may be in adjacent text, behind a link, or "wrapped in the `<figcaption>` element ... (presented as headings, text, and a table)" | W3C WAI, _Complex images_             | [V1]                                     |
| Contrast of 3:1 for "parts of graphics required to understand the content"; text inside a graphic still needs 4.5:1; a hue difference alone "is likely to fail the Use of color criterion" (1.4.1)                                    | WCAG 2.2, 1.4.11 Understanding        | [V1]                                     |
| The chart announced as an image with an `aria-label`, the text content after it; the author chose an alternative text/table view over trying to make the SVG's parts navigable                                                        | S. Soueidan, Khan Academy 2018 report | [V1]                                     |
| An SVG used as an image can respond to `prefers-color-scheme` "based on the `color-scheme` of the parent element"; the page does not say whether a page-level `data-theme` reaches it                                                 | MDN `prefers-color-scheme`            | [V1], completed by the measurement in §3 |

## 3. Measured on this rig (2026-10-09)

Instrument: the Browser pane (Chromium) and scripts, on the two diagrams the site already ships
(`public/img/phyriadfg_pipeline.svg`, `phyriadfg_multigpu.svg`) and on a recompilation of the pipeline's
`.tex` source (`projects/PhyriadFG/docs/diagrams/`, MiKTeX `latex` then `dvisvgm --no-fonts` then
`svgo --multipass`). One engine, one machine; each number is a single run of a deterministic script.

**Weight.**

| File                                                                      | Raw       | gzip     | After svgo, raw | After svgo, gzip |
| ------------------------------------------------------------------------- | --------- | -------- | --------------- | ---------------- |
| pipeline, as shipped                                                      | 126,518 B | 32,012 B | 83,720 B        | 28,058 B         |
| multigpu, as shipped                                                      | 176,870 B | 48,633 B | 135,184 B       | 44,889 B         |
| pipeline, recompiled with `dvisvgm --no-fonts` **and `lmodern`**          | 138,678 B | n/m      | 78,710 B        | **24,847 B**     |
| pipeline, recompiled **without** `lmodern` (text missing, **do not use**) | 52,416 B  | 13,223 B | 35,085 B        | 8,521 B          |

The shipped files carry their text as bitmap masks (121 and 83 black-filled elements in the two files, no `<text>`),
which svgo cannot shrink (gzip down 12 % and 8 %). The recompiled file is real vector paths, **if the source loads `lmodern`**. **Correction of my first
measurement (2026-10-10):** the pipeline source uses `\usepackage[T1]{fontenc}` without `lmodern`;
`dvisvgm` then printed `WARNING: failed to create ecrm0900.gf` (and two more) and still wrote a file.
I judged the glyphs fine from a thumbnail and published 8.5 kB gzip; the file had **30 glyph shapes
where the correct one has 144**, so most text was missing. Another session found the same trap and
named the fix. Both weights are in the table; only the `lmodern` row is valid. The warning was the
evidence and I did not read it as such. The multigpu diagram was not recompiled.

**Contrast of the diagram's monochrome ink (black and greys), 4.5:1 target.** Computed per ink pixel
against the pixel actually beneath it (bare paper or a pastel box), light paper `#faf9f6`, dark `#16150f`.

| Case                                                                                                           | Ink pixels | Share at 4.5:1 or more | On bare paper | On boxes  |
| -------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- | ------------- | --------- |
| shipped file, light theme                                                                                      | 10,645     | 99.7 %                 | 100 %         | 99.1 %    |
| shipped file, dark theme                                                                                       | 10,645     | **35.4 %**             | **0 %**       | 98.7 %    |
| shipped file, dark, ink inverted to light                                                                      | 10,645     | 64.6 %                 | 100 %         | **1.3 %** |
| recompiled with `lmodern`, light theme                                                                         | 11,522     | 99.4 %                 | n/m           | n/m       |
| recompiled with `lmodern`, dark, no change                                                                     | 11,522     | 29.0 %                 | n/m           | n/m       |
| recompiled with `lmodern`, dark: black ink to paper-ink, grey ink to muted-ink, six pastel fills to dark tints | 11,522     | **99.4 %**             | n/m           | n/m       |

Neither simple trick works: leaving the ink black loses everything on bare paper (the title, the arrow
labels); inverting it loses the text inside the boxes. The two ink pixel counts differ because they
were rasterised at 2x and 1.5x. A screenshot of the shipped figure in the dark theme shows the same: the
box text reads, the title and the labels vanish.

**Does the site's toggle reach an SVG used as `<img>`?** Painted check, OS preference dark: with
`data-theme="light"` the recoloured file drew pastel boxes, with `data-theme="dark"` dark tints, so a
single file with one internal `@media (prefers-color-scheme: dark)` block follows the site's toggle in
this engine. **Canvas read-backs of the same image followed the OS and contradicted each other across
three test shapes, so they were discarded as evidence**; only the painted screenshots count. One engine.

**Line colours of the TikZ palette** against the two papers (non-text contrast, 3:1):

| Colour           | Light    | Dark |
| ---------------- | -------- | ---- |
| red `#d62728`    | 4.77     | 3.64 |
| blue `#1f77b4`   | 4.58     | 3.79 |
| purple `#9467bd` | 4.04     | 4.30 |
| green `#2ca02c`  | 3.23     | 5.37 |
| orange `#ff7f0e` | **2.40** | 7.22 |
| pink `#e377c2`   | **2.60** | 6.69 |
| cyan `#17becf`   | **2.14** | 8.10 |

Three of the seven fail 3:1 on the light paper (the pipeline's "flow" line is cyan). Whether each is
"required to understand" the diagram is a judgement per figure, since the stages are also labelled.

**Legibility floor of `Figure`.** The component sets `min-width: 32rem` (512 px) "because labels stop
being readable below it". The pipeline is 742.5 px wide at natural size and uses `\small` (9 pt) for box
text and `\scriptsize` (7 pt) for edge labels. Arithmetic, not a rendering: at 512 px the scale is 0.69,
so box text is about 8.3 px and edge labels about **6.4 px**; at the 990 px the page gives it on a
desktop they are 16 px and 12.4 px. The floor was never tied to a figure's natural width.

## 4. The proposal

### 4.1 Principles, each tied to a source or a measurement

1. **One screen says what the project is** and gives the reader the takeaway before they scroll
   (§2.1, §2.2): header, a plain summary, two or three key figures, one diagram.
2. **Mechanism before claims.** The brief stresses how it works and what is interesting about it; the
   NN/g respondents want the process and the constraints. The claims ledger stays, as the proof.
3. **Every number carries its instrument; every figure carries its text.** That is what the site's five
   evidence kinds already encode; the proposal gives each kind a place.
4. **Measured and described are different artefacts** (§2.4), never the same table.
5. **Do not hide the explanation** (§2.2): disclosures only for reference material.
6. **Charts are never the only copy of the data**, and no chart uses colour alone (§2.6).

### 4.2 Home page

Unchanged in structure: the name, the list, the foot (`DESIGN_V2_PROPOSAL.md` §2). Three changes:

- Order by what the reader should see first (strongest project first, already so), at most **five**
  entries until the others have their own pages (NN/g: 3 to 5).
- Each entry gains **one headline figure line** when its lead evidence is a measured number: the value,
  its unit and what it measures, in mono, from the same `Evidence` row that the chip already shows
  (no new data, so the claim cannot drift from its evidence).
- No thumbnails and no cards: a thumbnail of a 740 px diagram is illegible and heavy, and the figure
  line is the verifiable part.

### 4.3 Project page, in order

| #   | Section (id)                     | Holds                                                                                                                                                                                             | Visible or hidden                                                       |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Header                           | name, status verbatim, years, one-sentence summary, repository                                                                                                                                    | visible                                                                 |
| 2   | **En breve** (`resumen`)         | the takeaway in two sentences; **two or three key figures** each with unit, instrument and a link to its claim; **one hero diagram**; a one-line row of anchors to the sections below (signposts) | visible, above the fold at 1280                                         |
| 3   | Contexto (`contexto`)            | the problem and who has it, in prose                                                                                                                                                              | visible                                                                 |
| 4   | **Cómo funciona** (`mecanismo`)  | the pipeline or architecture as a numbered walk-through, each step beside the part of the diagram it explains; what is unusual about the approach, said once, early                               | visible; the diagram's text equivalent in a disclosure directly beneath |
| 5   | Decisiones de diseño (`diseno`)  | each decision as chosen, rejected, why, and what it cost, with the number that backs it                                                                                                           | visible                                                                 |
| 6   | **Comparativa** (`comparativa`)  | two artefacts: an **approach matrix** (what each alternative does differently; no numbers) and **measured tables or charts** (what was benchmarked, with methodology)                             | matrix visible; a long methodology note in a disclosure                 |
| 7   | Afirmaciones (`afirmaciones`)    | the claims ledger with evidence chips and anchors (as today)                                                                                                                                      | visible                                                                 |
| 8   | Visualizaciones (`datos`)        | charts drawn from JSON, each with its table                                                                                                                                                       | visible; a table longer than about 12 rows in a disclosure              |
| 9   | Límites (`limites`)              | the project's own declared limits                                                                                                                                                                 | visible                                                                 |
| 10  | Cómo reproducirlo (`reproducir`) | steps and the machine needed                                                                                                                                                                      | visible                                                                 |
| 11  | Verificación (`verificacion`)    | how the status is frozen                                                                                                                                                                          | disclosure, as today                                                    |

Sections 4, 5 and 6 are the answer to "how it works and why the approach is interesting". Sections 7 and
8 are the proof. If a project has no data for a section it keeps the visibly provisional marker the
shell already provides; a section is never silently dropped.

### 4.4 Each evidence kind, where it appears

| `Evidence.kind` | In the claims list                                               | Elsewhere                                                                                     |
| --------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `number`        | the chip with value, instrument and source                       | **headline figure** in "En breve" and on the home entry; a row in a table; a point in a chart |
| `figure`        | the diagram inline, wide, with its caption                       | hero diagram in "En breve"; the mechanism section                                             |
| `live`          | a "Probar" line with the URL                                     | "En breve" when it is the strongest proof                                                     |
| `doc`           | the chip, a link to the repository document                      | the methodology note of a comparison                                                          |
| `provisional`   | the chip, visibly different, quoting the project's own statement | never promoted to a headline figure                                                           |

### 4.5 Numbers: when each form

| Situation                                       | Form                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| One to three numbers carry the claim            | **headline figure**: value, unit, instrument, link. No chart        |
| Lookup or precision, up to about 12 rows        | **table**: label, value, unit, instrument, source; numerals aligned |
| A pattern, a trend, a distribution, many points | **chart**, with the same data as a table beneath it                 |
| A result with run-to-run spread                 | an interval on the chart and the two runs in the table              |

The container's data rule applies: a quantity a claim rests on is computed twice and the run-to-run
agreement is reported with it, so the number row needs a place for that agreement (§6).

### 4.6 Figures, images and the measure

- **Diagrams and wide tables:** the existing wide breakout (`.phy-wide`), caption beneath, a text
  equivalent in a disclosure. Text stays at the measure (tokens 1.4.0 keeps it so in the stacked layout
  too).
- **Small figures (a screenshot, a single plot under about 30rem):** inline at column width, like
  Keeter's page.
- **Several screenshots:** a row of at most three in the wide breakout, each captioned; a click opens
  the large version in the `Dialog` (now centred, react 1.1.1). **No carousel**: it hides content and
  costs interaction for no reader benefit (§2.2).
- **The scroll floor** moves from a fixed 32rem to the figure's own natural width, which the
  `Evidence` row already carries (`width`, `height`); below it the region scrolls, as today.
- **Caption pattern:** `Figura N. <what it shows>. <what to look at>. Fuente: <where it comes from>.`

## 5. Charts from JSON, drawn by the site

**How.** A small set of React components in the portfolio, emitting inline `<svg>` that reads the
existing tokens through CSS custom properties. No dependency, so both colour schemes and any palette
(`data-palette`) work with no extra code and the size budget (69.31 of 85 kB today) stays comfortable;
the estimate is a few kB gzip for the four chart kinds, **not measured**. Promote to the substrate only
when a second consumer needs them (the FR door).

**Colour.** One accent against muted ink: context in `--phy-ink-muted`, the thing to look at in
`--phy-accent`, labels in `--phy-ink`. No categorical palette (the substrate has none, and a seven-hue
palette fails 3:1 on light paper, §3). Series are told apart by **direct labels at the line end and by
marker or dash**, so colour never carries meaning alone (1.4.1); strokes need 3:1 against the paper in
both schemes, which `--phy-accent` and `--phy-ink-muted` are gated for in the tokens testbench.

**Accessibility.** `<figure>` with a real `<figcaption>`; the SVG is `role="img"` with an
`aria-labelledby` title and an `aria-describedby` summary of the one-sentence takeaway; the **table of
the same data sits directly beneath** (Analysis Function; WAI approach 3). Pointer tooltips are an
extra, never the only route to a value. Dense charts get a downloadable file in addition, as the
Analysis Function says a table alone is not a suitable alternative for many points.

**Types by data class.**

| Data                                                    | Chart                                            | Notes                                        |
| ------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| one metric across a few alternatives or configurations  | **horizontal bar**, sorted, value at the bar end | up to about 12 bars; zero baseline           |
| a metric over an ordered axis (resolution, time, load)  | **line**, end-of-line labels                     | few series; never for unordered categories   |
| the same metric, repeated runs                          | **range or dot-and-interval**                    | the DI rule: spread shown, runs in the table |
| before and after on the same items                      | **slope or dumbbell**                            | one accent for the changed ones              |
| a total split into parts (a frame-time budget by stage) | **single stacked bar**, parts labelled           | not a pie: the parts are compared by length  |
| two metrics against each other                          | **scatter**, labelled points                     | only labelled outliers                       |
| the same chart across several conditions                | **small multiples**, shared scale                | readable at the column width                 |

**JSON contract (a sketch to agree with the three sessions, not built).**

```json
{
  "id": "fg-frame-budget",
  "title": "Tiempo por etapa del pipeline",
  "takeaway": "una frase: lo que el lector debe ver",
  "kind": "stack",
  "unit": "ms",
  "series": [
    { "name": "flujo óptico", "points": [{ "x": "1080p", "y": 2.1, "lo": 1.9, "hi": 2.3, "n": 2 }] }
  ],
  "instrument": "qué lo midió",
  "source": { "label": "docs/...", "url": "..." },
  "runs": [
    { "id": "r1", "file": "..." },
    { "id": "r2", "file": "..." }
  ]
}
```

The portfolio's content tests validate the file before the build, the same way `content.test.ts`
already freezes statuses: a chart without `takeaway`, `instrument` or `source` fails.

## 6. TikZ diagrams

**Today:** black ink fixed, text as bitmap masks, 32 to 49 kB gzip each, unreadable in the dark theme
(§3). **Needs** if the diagrams are to be recompiled by their projects and themed by the site:

1. **Compile with `latex` then `dvisvgm --no-fonts`, then `svgo`.** The recipe is already in
   `llm/GRAPHICS_TOOLCHAIN.md`; the measurement says it is 22 % lighter in gzip (24.8 against 32.0 kB) and truly vector, **provided the
   source loads `\usepackage{lmodern}` after `fontenc`**; without it the text silently disappears.
2. **Use one shared colour set in the `.tex`** (named colours, the same hex for the same role across the
   three projects). A build step then maps those few hexes to the site's roles for the dark scheme and
   writes **one `@media (prefers-color-scheme: dark)` block into the SVG**; the file stays a single
   asset used through `<img>`, which follows the toggle (§3).
3. **A check in the build:** for each figure, every (ink, fill) pair in its colour map has 4.5:1 in
   both schemes, and every line colour 3:1. This is the computation of §3 turned into a test.
4. **Accessibility.** `alt` is one sentence on what the diagram shows. The long description is visible:
   the caption says how to read it, and a **text equivalent** (the stages in order, what each consumes
   and produces) sits in a disclosure directly beneath. The text in a `--no-fonts` SVG is paths, so it
   cannot be selected or searched; the equivalent is what makes it findable too. **Ask of the project
   sessions:** one short "descripción textual" per diagram in their dossiers.

## 7. Decisions for the operator

Each has options and a recommendation. None is built.

**D1 · Order of a project page.** (a) as today: context, claims, design, limits, reproduce;
(b) **mechanism first** (§4.3) _(recommended: it answers the stated emphasis and the survey's call for
process before results)_; (c) tabs per topic _(rejected: interaction cost, hidden content, §2.2)_.

**D2 · What opens the page.** (a) header only; (b) **header plus "En breve" with two or three key figures
and one hero diagram** _(recommended)_; (c) a hero image alone.

**D3 · How numbers show.** (a) only in the claims list; (b) **headline figures, tables and charts by the
rule of §4.5** _(recommended)_; (c) charts for everything _(rejected: precision and lookup need tables)_.

**D4 · What is hidden.** (a) nothing; (b) **only reference material: methodology detail, tables over
about 12 rows, a diagram's text equivalent** _(recommended)_; (c) a collapsible per section.

**D5 · Figure placement.** (a) inline at column width; (b) **wide breakout for diagrams, inline for small
figures, a short row for screenshots** _(recommended)_; (c) margin figures _(rejected: no margin, §2.5)_.

**D6 · Comparison with alternatives.** (a) one matrix mixing everything; (b) prose per alternative;
(c) **two artefacts: an approach matrix with no numbers, and separate measured tables or charts with
their methodology, including where the project loses** _(recommended: after the ripgrep write-up and
NN/g)_. On a phone the matrix collapses to one block per alternative.

**D7 · Charts.** (a) **site-generated inline SVG, no dependency** _(recommended)_; (b) static SVGs
produced by a build script from the JSON; (c) a charting library _(excluded by the brief)_.

**D8 · Making the diagrams work in the dark theme.** (a) leave them on a light plate in the dark theme:
zero authoring, a bright slab in a dark page; (b) **recompile, one shared colour set, a build step that
injects the dark block, a contrast test** _(recommended; (a) stays as the fallback for any figure that
fails the test)_; (c) two hand-drawn variants per diagram.

**D9 · The home entry.** (a) as today; (b) **plus a headline figure line from the lead number**
_(recommended)_; (c) plus a thumbnail.

**D10 · The data contract.** (a) each project invents its own; (b) **one JSON shape validated by the
portfolio's tests, agreed with the three sessions** _(recommended)_.

## 8. Components named, not built

| Name                                                                     | Exists?                  | What it is                                                                                                         | Where it would live                      |
| ------------------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `Table`, `Disclosure`, `DescList`, `TableOfContents`, `Dialog`, `Figure` | yes (API.md, 1.1.1)      | used as they are; `Figure` needs the floor change of §4.6                                                          | substrate                                |
| `KeyFigure`                                                              | no                       | value, unit, instrument, link                                                                                      | portfolio                                |
| `Chart` (bar, line, range, stack, slope, scatter) with its `DataTable`   | no                       | §5                                                                                                                 | portfolio first                          |
| `ThemedFigure`                                                           | no                       | `<img>` of a themed SVG, caption, text-equivalent disclosure                                                       | portfolio                                |
| `ComparisonMatrix`                                                       | no                       | options as columns, attributes as rows, a row-type chip, a mobile stack                                            | portfolio, a candidate for the substrate |
| `SectionNav`                                                             | `TableOfContents` exists | an inline, one-line presentation for the "En breve" row; whether `TableOfContents` can take it is **not verified** | substrate, if it cannot                  |
| `ImageGrid`                                                              | no                       | up to three captioned images opening in `Dialog`                                                                   | portfolio                                |

Schema changes the plan implies and does **not** make: optional `unit`, `runs` and `n` on the `number`
kind; a `figure` kind that also carries a text equivalent. Both are content-contract decisions, so they
wait for D10.

## 9. What was not verified

- **Engineering-specific reader behaviour.** No source measured it; the survey is UX design.
- **The 7.4 s figure's primary source**, and its sample size.
- **Chart-type guidance** beyond Datawrapper and the Analysis Function is [V3].
- **A third portfolio example**: the iquilezles.org index returned 404; the reference examples are
  Keeter's two pages, the ripgrep write-up (a project article, not a portfolio) and the already read
  madebyevan.com.
- **Recompiling the multigpu diagram**, and a figure-by-figure visual check of the `dvisvgm` output.
- **The toggle behaviour in any engine but this Chromium**, and screen-reader output of any proposed
  markup; nothing here was run with assistive technology.
- **The size of the chart code**, **`SectionNav` on the existing `TableOfContents`**, and the numeral
  alignment inside `Table` were not measured.
- The two shipped diagrams were read from `public/img`; the portfolio's `Figure` was not changed.

## 10. What was built (2026-10-14)

All ten decisions as recommended. **Built:** the page order and "En breve" with signposts (`ProjectShell`); `KeyFigure`
and `KeyFigures`; `Chart` for all six kinds with its `ChartTable`; `ComparisonMatrix`; the `Figure` changes (natural-width
floor, text equivalent, light plate, anchor); the home headline line (D9); the chart loader and its validating tests; the
figure contract (`figure-contract/`) and the build step (`scripts/figures/`); a dev-only exhibit at `/figuras`; the two
PhyriadFG diagrams migrated to the contract colours and recompiled.

**Not built, and why.** `ImageGrid`: no screenshots exist yet to lay out. `SectionNav` is its own small component;
`TableOfContents` was not tried, so the open question of §8 is closed by not needing it. The chart-code size was
estimated at "a few kB"; **measured:** +5.34 kB gzip for everything new (74.65 against 69.31 kB).

**Differences from the proposal.** A figure is drawn once: the hero of "En breve" is the first figure of the ledger and the
claims link to it, so "Cómo funciona" holds the rest. The migrated diagrams use the contract colours, which gave up the seven
stage hues for one accent (the labels carry the stages); the originals are kept in `figure-sources/previous/`. The chart SVG
is capped at 45rem inside its wide frame (at 62rem its labels were 22 px). The home headline appears only for a project whose
first measured number is not already its lead evidence.

**Measured results** are in the portfolio README ("Measured, 2026-10-14"). The corrected figure weights of §3 hold: the
pipeline is 21.9 kB gzip and the multigpu diagram 36.7 kB, against 32.0 and 48.6 kB before.

**Content integrated the same day** (the three project sessions' deliveries; see the portfolio README): six diagrams, six
charts and Phynned's approach matrix, with their prose and the corrections to the ledger deliberately left out until the
operator decides. The matrix added the `phyriad-matrix/1` shape to the contract. Charts and matrices became load-on-demand
after eager loading took the initial JS from 74.65 to 89.35 kB.

**Prose and corrections integrated later the same day**, after a second authorisation: the dossiers' context, decisions,
comparisons and reproduction notes, the four corrections to the ledger and the years. The Phynned prose stays in English
(marked) because its translation did not arrive. See the portfolio README for what was checked against which file.

## 11. Sources

NN/g: [5 Steps to Creating a UX-Design Portfolio](https://www.nngroup.com/articles/ux-design-portfolios/) ·
[Comparison Tables](https://www.nngroup.com/articles/comparison-tables/) ·
[Accordions Are Not Always the Answer](https://www.nngroup.com/articles/accordions-complex-content/) ·
[The Fold Manifesto](https://www.nngroup.com/articles/page-fold-manifesto/). W3C:
[Complex images](https://www.w3.org/WAI/tutorials/images/complex/) ·
[WCAG 2.2, 1.4.11 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
Charts and tables: [Datawrapper](https://www.datawrapper.de/blog/guide-what-to-consider-when-creating-tables) ·
[Analysis Function, Publishing charts](https://analysisfunction.civilservice.gov.uk/support/communicating-analysis/introduction-to-data-visualisation-e-learning/module-10-publishing-charts) ·
[Soueidan, Khan Academy charts](https://www.sarasoueidan.com/blog/accessible-data-charts-for-khan-academy-2018-annual-report).
Layout: [Tufte CSS](https://edwardtufte.github.io/tufte-css/). Examples:
[Keeter, Fidget](https://www.mattkeeter.com/projects/fidget/) ·
[Keeter, projects](https://mattkeeter.com/projects/) ·
[ripgrep](https://burntsushi.net/ripgrep/). Platform:
[MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme).
Secondary only: [HR Dive on the Ladders study](https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/).

<!-- Made with my soul - Swately <3 -->
