# The "showcase" skin — a dark, surface-based variant of the portfolio (specification, 2026-10-19)

> **Diátaxis type:** Reference (specification). **Phase 1 written 2026-10-19; phase 2 built and measured
> 2026-10-20 on the operator's word ("Autorizo y continua"), §9. The substrate was not changed.**
> **Requested by** the operator through the prompt-workshop session, 2026-10-19: carry the feel of the
> new Epic Games Launcher (dark, surfaces, the image as the protagonist) into the portfolio, its
> principles and not its look or assets. It revisits direction D of `VISUAL_LANGUAGE_CONCEPT.md`, which
> was declined then and is now to be explored.
> **Reads on top of:** `VISUAL_LANGUAGE_CONCEPT.md` (§1 sources, §3b clashes), `README.md` (current state),
> `catalog/web/react/docs/concepts/NON_PROSE_WIDTH_AUDIT.md` (the widths every variant must keep),
> `catalog/web/tokens/phyriad.tokens.css` (the `data-palette` mechanism, `--phy-radius`).

## 0. The short version

- **Name and switch:** `data-palette="showcase"` on `<html>` plus one portfolio stylesheet scoped to
  `:root[data-palette='showcase']`. Absent attribute = today's site, byte for byte. Nothing in
  `catalog/web/` changes.
- **The form travels without breaking the substrate's rule.** The tokens testbench forbids shadows and
  non-zero radii _in the base layer_; `--phy-radius` is a token, and every rounded surface in the
  portfolio already reads it. The skin sets it to 8 px in its own scope, and elevation is by tone, never
  by shadow, so the "no shadows" half of the identity survives unchanged.
- **Separation by surface, with three exceptions that stay lines:** an interactive control's boundary
  (WCAG 1.4.11, 3:1), a table's header rule, and an invisible border on every surface that becomes
  visible in forced colours, where tone differences collapse.
- **The image as protagonist, sized to three images:** on the home page the five projects become cards
  on surfaces; the three with a figure lead with it as a cover, the two without get a typographic cover,
  never an invented image.
- **Text does not go low-contrast.** The launcher's small grey secondary text is the one trait that is
  explicitly not carried over: every text pair below is computed ≥ 5.7:1.

## 1. What is carried over, and from where

From the prompt-workshop session's first-hand look at Epic's announcement page on 2026-10-19 (text
**[V1]**; the main image is a promotional composite seen at 1920 × 1080, **[V2]**: not the running app),
and from §1 of the visual-language concept:

| Trait observed                                                                            | Carried over as                                                                                                       | Not carried over                                                        |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Near-black neutral chrome; zones separated by surface tone, the side panel a step lighter | Three neutral surface levels (§2)                                                                                     | Pure black; any blue cast                                               |
| Rounded corners, about 8 px, on window, covers, search, buttons                           | `--phy-radius: 8px` in the skin's scope, with a stated where-yes / where-no (§3)                                      | Glass, blur, glow                                                       |
| Two-level navigation: filled pill on the active top item, underlined tabs below           | Pills for the site's own controls; underline for the current section in the spine (§4)                                | A store/library/develop hierarchy the site does not have                |
| A dense grid of uniform images supplies all the colour; scarce accent in the chrome       | Project covers lead each card; the oxide accent stays on links and the one measured series (§5)                       | Hundreds of covers; uniform cropping that would cut diagrams            |
| Small, low-contrast secondary text                                                        | —                                                                                                                     | **Not carried**: secondary text stays ≥ 4.5:1 (measured below ≥ 5.96:1) |
| Bar chart: own result in accent, rival in grey, value at the bar end, method note below   | Already the grammar of the portfolio's `Chart` (one accent against muted ink, takeaway and instrument in the caption) | —                                                                       |

## 2. Palette and surfaces

The nine substrate roles are redefined as a palette (both schemes, as every palette must). Two
skin-local properties add the surface levels the nine roles do not name. The page background is
`--phy-paper`; the first surface is `--phy-paper-2` (already a role); the raised surface is
`--skin-raised` (local).

| Role                             | Dark                  | Light                 | Used for                                                                             |
| -------------------------------- | --------------------- | --------------------- | ------------------------------------------------------------------------------------ |
| `--phy-paper` (background)       | `#0e0f11`             | `#eceef1`             | the page                                                                             |
| `--phy-paper-2` (surface)        | `#17181b`             | `#ffffff`             | cards, figures, table regions, the spine panel                                       |
| `--skin-raised` (raised surface) | `#212328`             | `#f6f7f9`             | table header row, chip tags, the active pill, the current spine item                 |
| `--phy-ink`                      | `#eceef1`             | `#14161a`             | text                                                                                 |
| `--phy-ink-muted`                | `#a4a8b0`             | `#555a63`             | secondary text (kept legible)                                                        |
| `--phy-rule`                     | `#6c717b`             | `#7c818b`             | control boundaries and the table header rule only                                    |
| `--phy-accent`                   | `#e0836a`             | `#8a3324`             | links, the measured series; the substrate's oxide, kept as the identity's one colour |
| `--phy-accent-on`                | `#0e0f11`             | `#ffffff`             | text on the accent                                                                   |
| `--phy-error` / `--phy-ok`       | `#f0868c` / `#7fbb8c` | `#a3242e` / `#2f6238` | unchanged from oxide                                                                 |

**Computed contrast** (WCAG relative luminance, script run 2026-10-19):

| Pair                | Dark: on background / surface / raised | Light: on background / surface / raised |
| ------------------- | -------------------------------------- | --------------------------------------- |
| ink                 | 16.50 / 15.27 / 13.53                  | 15.58 / 18.11 / 16.90                   |
| ink-muted           | 8.04 / 7.44 / 6.59                     | 5.96 / 6.93 / 6.47                      |
| accent              | 6.96 / 6.45 / 5.71                     | 7.00 / 8.14 / 7.59                      |
| error               | 7.76 / 7.18 / 6.36                     | 6.34 / 7.37 / 6.88                      |
| ok                  | 8.57 / 7.94 / 7.03                     | 6.18 / 7.18 / 6.70                      |
| rule (3:1 needed)   | 3.91 / 3.62 / 3.21                     | 3.36 / 3.91 / 3.65                      |
| accent-on on accent | 6.96                                   | 8.14                                    |

The light rule was first `#868b95` and measured **2.94:1** on the background; it was darkened to
`#7c818b` before this table. Surface against background is 1.08 to 1.22:1 in both schemes: that is
**decoration, not information**. WCAG 1.4.11 asks 3:1 of the parts needed to identify a control or a
graphic, not of layout regions, so nothing relies on a surface edge to be understood, and every control
keeps a 3:1 rule border.

**Forced colours.** Tone differences disappear under a forced palette. Every surface carries
`border: 1px solid transparent`; forced-colours mode paints transparent borders in the system text
colour, so each card, figure and table region regains a visible edge exactly there and nowhere else (a documented Windows high-contrast behaviour; to be verified in phase 2, which is the first time this pane would be asked to emulate it).

**Scheme.** The skin follows the site's existing scheme logic (OS preference, the footer toggle). The
launcher's feel is the dark half; the light half exists because a palette that only works in the dark
is half a palette. Whether activating the skin should also select dark is a question for §8.

## 3. Radius: where yes, where no

`--phy-radius: 8px` inside `:root[data-palette='showcase']`. Everything in the portfolio that is a
**surface** already reads the token: `Figure` viewport, the home plate (`ProjectEntry`), `Chart`'s frame,
`EvidenceChip`'s tag, `ComparisonMatrix`'s type tag, and the substrate's `Button`, `Input`, `Dialog`,
`Box`, `Skeleton`.

| Yes (8 px)                                                                                        | Pill (999 px)                                                      | No (stays square)                                                                                                                        |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| cards, figures and plates, table regions, chart frames, inputs, buttons, dialogs, the spine panel | chip tags, the active navigation pill, the theme toggle's segments | inline `code`, the spine's rail and its 2 px current bar, table cells, the focus outline (it follows the element's radius automatically) |

A rounded **scroll region** clips its content at the corners: a table region gets
`overflow: clip` on its rounded box and keeps its `.phy-scroll-x` behaviour inside, so a sticky row label
is never cut by the radius. To be measured in phase 2.

## 4. Navigation in that language

The site's navigation stays what the operator decided in v2 (the name as masthead, the way back, the
footer links, the section spine); the skin restyles it and adds no destination.

- **Masthead:** the name on the background, no bar.
- **"← Índice" and the footer links:** pills on the surface, the hover state a step up to the raised
  surface (no motion; a colour change is not motion).
- **Theme toggle:** a segmented control of three pills, the current one filled with the raised surface
  and bold. Bold carries the state, not the fill, so forced colours keep it.
- **Section spine (wide screens):** a surface panel with the 8 px radius; the current item keeps its
  weight and its 2 px ink bar (the launcher's underline, turned vertical). The static signposts on
  narrow screens become a wrapping row of pills on the surface.
- **D-32 is separate:** the decision to move the spine outward so matrices fit from about 1600 px is
  recorded, not built, and needs its own authorisation; the skin changes nothing about the spine's
  position.

## 5. The image as protagonist (five projects, three images)

**Home.** The list becomes a set of cards, each a surface with the 8 px radius:

- **cover first:** the project's opening figure (`plateOf`) fills the top of the card, edge to edge
  inside it, at its own aspect ratio. No uniform crop: these are diagrams, and cropping removes
  labels. A raster capture (Phyriager) is the one place a uniform 16:9 crop would be acceptable; it is
  not proposed, so the three covers stay comparable.
- **no figure, no picture:** PHarvard and climx get a typographic cover, the project name set large on
  the raised surface. An invented image would be a false assertion on a site whose whole claim is
  evidence.
- **below the cover:** name, status, years, summary, the evidence chips and "Leer el dossier", as today.
- **layout:** one column under about 48rem of container; at wider containers two columns of cards,
  never more: three images do not make a grid, and the reading measure of the summaries stays.
  The cards order is the content order (relevance), so reflow at 320 px is one column in the same
  order.

**Project page.** The hero figure of "En breve" sits on a surface card at the wide band (62rem),
followed by the key figures as small raised tiles. The rest of the page keeps the reading column on the
background; figures, charts and tables sit on surfaces.

## 6. Chips, tables, charts

- **`EvidenceChip`:** the tag becomes a raised pill without a border (muted ink on raised: 6.59 dark,
  6.47 light); `provisional` keeps its accent text and gains a 1 px accent border, so it differs by word,
  colour and edge, never by colour alone.
- **Tables (`Table`, the matrices, chart data tables):** the region is a surface with the radius and the
  transparent border; the header row is raised with the 3:1 rule under it (the one structural line);
  body rows are separated by alternating surface and raised tone, not by lines. **Scoped override:** the
  region sets `--phy-paper: var(--phy-paper-2)` on itself, so the substrate's scroll-shadow gradients and
  the sticky row labels, which paint `--phy-paper`, match the surface they sit on with no substrate
  change. Widths: exactly as react 1.2.0 measured (no change to `width`, `columns`, `stickyFirst`).
- **Charts:** the frame is a surface card; grid lines keep `--phy-rule`; the series grammar is unchanged
  (one accent, muted rivals, value at the bar end, instrument in the caption).
- **Diagrams (TikZ SVG):** their colours come from the figure contract, gated against oxide paper. On the
  skin's surfaces they need re-measuring (phase 2) before they can be claimed legible; a `plate` figure
  keeps its forced light scheme.

## 7. Constraints, and how each is kept

| Constraint                          | How                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| 4.5:1 text, 3:1 lines, both schemes | §2 table, computed; phase 2 re-measures with axe in the page                   |
| Forced colours                      | transparent borders on surfaces; state by weight and word, never by fill alone |
| Reduced motion                      | the skin adds no transition and no transform; hover is a colour change         |
| Reflow at 320 px                    | one column of cards; tables scroll in their region as today                    |
| The width audit's ratios            | the skin changes no width rule; phase 2 repeats the ten sizes                  |
| `EvidenceChip` beside every claim   | unchanged placement; only its look                                             |
| No Epic assets                      | no image, logo or typeface of theirs; the type stays the substrate's           |

## 8. Phase 2 (only on the operator's word) and what might go to the substrate

**Build:** `src/styles/skin-showcase.css` (palette block, `--skin-raised`, `--phy-radius`, the surface
rules), the card layout in `ProjectEntry` behind the attribute (CSS only where possible), a fourth
option in the test-page-style palette switch, or `?palette=showcase` for review. Default unchanged.
**Measure:** the ten window sizes of the width audit, light and dark, axe-core with contrast; forced
colours if the pane can emulate it; captures at 1920 × 1080 and 390 × 844 of the skin against today.

**Open question for the operator:** should switching the skin on also select the dark scheme?

**Candidates for the substrate, not moved:**

| Candidate                                                               | Why it could be general                                                                             | SemVer                                                                             |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| A third surface role (`--phy-paper-3`, "raised")                        | every palette would gain an elevation step without shadows                                          | tokens **MINOR** if oxide and maid get a derived value and nothing visible changes |
| A per-palette radius (the skin's `--phy-radius` inside a palette block) | already works as a token; only the testbench's wording ("base layer") and a documented rule are new | tokens **PATCH** (documentation and a testbench case)                              |
| Transparent-border surfaces for forced colours                          | the substrate's `Box` would inherit the edge in forced colours                                      | react **MINOR** (visible only in forced colours)                                   |
| The scoped `--phy-paper` override for scroll regions on surfaces        | a documented pattern, no code                                                                       | react docs only                                                                    |

## 9. Built (phase 2, 2026-10-20) and D-32

**Switch.** `src/lib/skin.ts`: `?palette=showcase` turns the skin on and remembers it in the browser,
`?palette=default` turns it off; no visible control was added, so the default site does not change.
**Scheme:** the skin follows the existing scheme logic (the open question of §8 was not answered; the
recommendation applied is not to force dark).
**Sheet.** `src/styles/skin-showcase.css`, everything under `:root[data-palette='showcase']` except one
hidden hook (`.skin-typecover`). Hook classes `skin-*` were added to `ProjectEntry`, `IndexPage`,
`Figure`, `Chart`, `EvidenceChip`, `ComparisonMatrix`, `KeyFigure`, `SectionNav`, `SectionSpine` and
`ProjectShell`; they carry no style outside the skin.
**Deviation from §4:** the theme control is one cycling button (substrate `ThemeToggle`), not three
segments, so it became a single pill.

**D-32** (same authorisation): the spine hangs outside a data band of `min(90rem, 100vw − 26rem)`, and
tables are capped at that band where the spine shows. This changes the default site at ≥ 1440 px.

**Tests:** `src/lib/skin.test.ts`, 7 tests: the switch (off by default, on and remembered, off again,
unknown names ignored), all ten roles in both schemes, 4.5:1 / 3:1 computed from the sheet's own values,
no shadow, nothing applied outside the skin but the hook. Seen red with three mutations at once (a 3.x:1
muted ink, a `box-shadow`, an unscoped rule): "3 failed | 4 passed". Vitest returns CSS empty even with
`?raw`, so the test reads the file through `scripts/read-text.mjs`.

**Measured in the Browser pane** (fresh load at each size; home, the three project pages and `/evidencia`;
default and skin; light and dark: 20 rows per size, 200 in all):

| Viewport  | axe-core 4.13.0 (contrast on) | Page overflow | Home cards (skin) | Matrices (both looks)                                                   | Spine                     |
| --------- | ----------------------------- | ------------- | ----------------- | ----------------------------------------------------------------------- | ------------------------- |
| 390×844   | 0 in all 20                   | none          | 1 column, 342     | scroll, 0 cells spill                                                   | hidden                    |
| 768×1024  | 0                             | none          | 1 column, 702     | scroll                                                                  | hidden                    |
| 1024×768  | 0                             | none          | 2 columns, 465    | scroll                                                                  | hidden                    |
| 960×1080  | 0                             | none          | 2 columns, 434    | scroll                                                                  | hidden                    |
| 1280×720  | 0                             | none          | 2 columns, 483    | **fit** (x 27 to 1238)                                                  | hidden                    |
| 1440×900  | 0                             | none          | 2 columns, 483    | scroll (band 1009); Phyriager fits without the skin and scrolls with it | x 21 to 181, no crossing  |
| 1536×864  | 0                             | none          | 2 columns, 483    | PhyriadFG and Phynned scroll, Phyriager fits                            | x 21 to 181, no crossing  |
| 1920×1080 | 0                             | none          | 2 columns, 483    | **fit** (PhyriadFG x 295 to 1609)                                       | x 46 to 206, no crossing  |
| 2560×1080 | 0                             | none          | 2 columns, 483    | fit                                                                     | x 366 to 526, no crossing |
| 3440×1440 | 0                             | none          | 2 columns, 483    | fit                                                                     | x 806 to 966, no crossing |

Found while measuring and fixed: at 768 the cards were 507 px, flush left in a 720 px shelf (the
substrate's narrow-mode measure cap on `li`); cards now lift that cap (702). The 390 row was measured
before that fix, where the card (342) is narrower than the measure and the fix cannot change it.
Not fixed, stated: the skin pads table regions, so at 1440 Phyriager's matrix (needs 1003) scrolls by a
few pixels in the skin where it fits without it. Cards in a row align at the top and keep their own
height, so covers of different aspect ratios leave uneven rows (see the 1920 capture).

**Gates:** 272/272 tests (25 files), typecheck, lint, prettier, build, substrate in sync; JS 111.93 of
115 kB, **CSS 5.79 of 6 kB** (the skin costs about 0.5 kB; little room is left).

**Captures** (`docs/planning/captures/`, dark scheme; 1920 ones are the pane's 800-px-wide scaled
screenshots): `1920x1080-home-default-dark.jpg` / `-showcase-`, `1920x1080-matrix-default-dark.jpg` /
`-showcase-`, `390x844-home-default-dark.jpg` / `-showcase-`. Capture trap of this pane: after a change
of attribute the screenshot can return the previous frame; re-setting the viewport forces a repaint, and
every saved capture was taken that way.

**Not measured:** forced colours (the transparent-border edge is untested), a coarse pointer, screen
readers, other engines, the diagrams' ink against the skin's surfaces per pixel, the `maid` palette.

**Candidates for the substrate, unchanged from §8**, now with evidence: the raised surface was used on
six component kinds; the radius-by-palette worked with no substrate change; the scoped `--phy-paper`
override made the substrate's scroll shadows and sticky labels match the surfaces with zero substrate
edits.

## 10. Default since tokens 2.0.0 (2026-10-20)

The operator made showcase the substrate's default palette. The skin's selectors became
`:root:is(:not([data-palette]), [data-palette='showcase'])`, `src/lib/skin.ts` now selects the other looks
(`?palette=oxide` / `maid`), and `skin.test.ts` asserts both the new default and that oxide still returns
the old look. Measurements in the README section "The skin is the default".

<!-- Made with my soul - Swately <3 -->
