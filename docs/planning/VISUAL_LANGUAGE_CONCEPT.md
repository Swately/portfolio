# A better visual language for the portfolio — research and a proposal (2026-10-18)

> **Diátaxis type:** Concept (research + proposal). **Written as design only; B and E built 2026-10-18 on the
> operator's word (§7c). The substrate was not changed.**
> **Requested by** the operator through the prompt-workshop session, 2026-10-18: understand what the new
> Epic Games Launcher does well and carry over its _principles_, not its look; do not copy images, logos
> or typefaces.
> **Reads on top of:** `README.md`, `DESIGN.md` §1, `DESIGN_V2_PROPOSAL.md` ("Colour and type"),
> `CONTENT_PRESENTATION_CONCEPT.md` §4, `catalog/web/tokens/README.md`, the `data-palette` block of
> `phyriad.tokens.css`.
> **Evidence levels** as in `UX_RESPONSIVE_AESTHETICS.md`: **[V1]** read first-hand in full; **[V2]**
> partial primary, or a summary produced by a tool of a page I fetched; **[V3]** secondary, or only seen
> as a search snippet.

## 0. The short version

- **What could not be seen:** the launcher itself. It is a desktop application in Preview; I did not
  install it (no installs were authorised) and no first-hand screenshot of its real interface exists in
  my evidence. Everything below about its _look_ comes from one promotional composite image on Epic's
  announcement page. Everything about its _behaviour_ comes from Epic's own text, which is marketing
  and not a design specification. **The principles are therefore inferences from stated intent, not
  observations of the product.**
- What Epic states, and what transfers: **speed as the design value** ("a speedboat and not a
  yacht"), **one frame instead of separate apps**, **a dedicated page per item**, **search that filters
  as you type**, **a switch between grid and list**, **one place for status** (the downloads view),
  and **user-arranged top bar and collections**.
- Most of that the site already does, for its own reasons. The gap that is real and cheap to close is
  not decoration: it is **orientation and scan speed inside a page** (a persistent "where am I" and a
  denser list), plus **one controlled use of image** (the figures already exist).
- Recommendation: **Direction B, "the shelf"** (§6) for the home page and **Direction E, "the spine"**
  for the project page: both within the current identity, no new colour, no substrate change beyond one
  optional MINOR. A dark-first palette in the launcher's manner **clashes** with the paper-and-ink
  identity and is not recommended.

## 1. Observations and sources

### 1.1 Epic Games Launcher (Preview, announced 2026-10-14)

| #   | Observation                                                                                                                                                                                                                                                                                                        | Source                                                                                                                                                                             | Level                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Epic says it "vibe coded" a new launcher that is "way faster and more responsive" with "a new look"; "light on features. Think of it as a speedboat and not a yacht."                                                                                                                                              | Epic Games Store Team, "The new Epic Games Launcher is finally here in Preview", store.epicgames.com/news/epic-games-launcher-preview, read in full in the Browser pane 2026-10-18 | V1 for what Epic _says_; marketing, not a spec                                            |
| 2   | Preview for Windows, macOS and Linux; "faster cold starts, snappier navigation between library and store, and less load on your system".                                                                                                                                                                           | same                                                                                                                                                                               | V1 (claims, not measured by me)                                                           |
| 3   | "Select any game to check its status, activity, details, and play controls on a dedicated page."                                                                                                                                                                                                                   | same                                                                                                                                                                               | V1                                                                                        |
| 4   | "Keep collections alongside your library, switch between grid and list views, and customize the top bar with your favorite games and apps."                                                                                                                                                                        | same                                                                                                                                                                               | V1                                                                                        |
| 5   | "Search and filter as you type, with a cleaner layout that makes even large libraries easier to navigate."                                                                                                                                                                                                         | same                                                                                                                                                                               | V1                                                                                        |
| 6   | A downloads view with speeds and active, queued, scheduled and failed items in one place.                                                                                                                                                                                                                          | same                                                                                                                                                                               | V1                                                                                        |
| 7   | One frame for Store, Library and Develop; a Details view with the list on the left and the selected item's page on the right.                                                                                                                                                                                      | gaming.net, 2026-10-14, author labelled "AI Research Agent"                                                                                                                        | V3                                                                                        |
| 8   | Speed numbers (cold start 5.47 s vs Steam 10.07 s; 46 % faster to the store page) and the earlier "Launcher V2" roadmap.                                                                                                                                                                                           | search snippets of VideoCardz / Tom's Hardware; **not fetched**                                                                                                                    | V3, and Epic's own numbers                                                                |
| 9   | Look, as seen in the promotional composite on the announcement page: a near-black chrome, a **dense, uniform grid of portrait cover art** as the main content, a narrow left rail, a **side panel of friends** to the right, small low-contrast labels. The art supplies all the colour; the chrome supplies none. | one screenshot of the Epic page, viewed in the Browser pane, 2026-10-18                                                                                                            | V2 (a marketing composite, not the running app, and I could not measure contrast or type) |

What I looked for and did not find: any statement on dark theme rationale, density, motion or type.
Epic's page says nothing about them, and the V3 article says nothing either. **I make no claim about
them.** PC Gamer, Tom's Hardware and Digital Trends returned empty bodies to my fetch tool.

### 1.2 Contrast interfaces (content-centred)

| Interface                                     | What it shows                                                                                                                                                                                                                                                                                                                                                             | Source                                                                                                            | Level                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Linear**, "How we redesigned the Linear UI" | Chrome noise removed (sidebar, tabs, headers aligned); **navigation made denser with a stronger hierarchy**; text contrast _raised_ in both themes; both themes come from one generator with three inputs (base, accent, contrast) instead of 98 variables; blue cast limited so neutral surfaces stay neutral; a navigation overhaul deliberately deferred as too risky. | linear.app/now/how-we-redesigned-the-linear-ui, fetched 2026-10-18                                                | **V2**: I received a summary produced by the fetch tool, not the raw page |
| **Are.na**                                    | The block (image, text, link, file) is the unit; channels are containers with grid and table views. The page does not state a design philosophy; "minimal chrome" is my inference.                                                                                                                                                                                        | are.na/about, fetched 2026-10-18                                                                                  | V2 (same caveat; inference flagged)                                       |
| **MDN Web Docs** (CSS grid guide)             | A reference whose chrome is a left tree, breadcrumbs, and an **"In this article" table of contents** above six anchored sections; the article is the content. Visual placement not seen, only order and hierarchy.                                                                                                                                                        | developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout, fetched 2026-10-18 (read 100 000 of 134 124 characters) | V2                                                                        |
| **madebyevan.com** (the adopted reference)    | One column, name as signature, list of work, no chrome.                                                                                                                                                                                                                                                                                                                   | `DESIGN_V2_PROPOSAL.md` §1, read first-hand 2026-09-02                                                            | V1                                                                        |

## 2. Principles carried over (abstract, each tied to its evidence row)

| #   | Principle                                                                       | From            | What it means for a portfolio                                                                                                                  |
| --- | ------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | **Speed is a feature the reader perceives.**                                    | 1.1 rows 1–2, 5 | Instant navigation, no layout shift, search or filter without a round-trip; the page's weight is part of its design.                           |
| P2  | **One frame; items are pages, not modals.**                                     | rows 3, 7       | A project is a full page with its own status block; the list is the way in, not a wall of cards.                                               |
| P3  | **Status is first-class and in one place.**                                     | rows 3, 6       | The reader sees "what is true now about this" (version, last checked, provisional or measured) at a glance. This is the evidence ledger's job. |
| P4  | **The content supplies the colour; the chrome gets out of the way.**            | row 9, Linear   | Neutral surfaces; the project's own figure is the one coloured thing on screen.                                                                |
| P5  | **Two views of the same set (grid / list) chosen by the reader, not two sets.** | row 4, Are.na   | Scan view (dense) and read view (spacious) of the same list.                                                                                   |
| P6  | **Dense navigation with strong hierarchy beats sparse navigation.**             | Linear, MDN     | A visible, persistent "where am I" in a long page.                                                                                             |
| P7  | **Contrast is raised, not lowered, in dark.**                                   | Linear          | Dark must not mean grey on grey. The site's gates already require it.                                                                          |
| P8  | **A theme is generated from few inputs.**                                       | Linear          | The `data-palette` mechanism is already this (nine roles × two schemes).                                                                       |

A caution on P2, P5 and "customisable top bar": the launcher serves a library of hundreds of items owned
by one user. The portfolio has **three projects** (`README.md`). Mechanisms made for scale (filter as you
type, collections, grid/list switch) would be machinery without a problem here. P5 survives only as a
density choice, not as a control.

## 3. Translation to the site

### 3a. What the substrate and the portfolio already do

- **P1:** lazy routes, JS 110.73 of 115 kB, CSS 4.71 of 6 kB, measured by `size-budget.mjs`; initial
  JS 80.68 kB. Speed here is a gate, not an aspiration.
- **P2:** every project is its own page (`/proyecto/:slug` and the three own pages); the list on the home
  page is the entry.
- **P3:** the ledger, `EvidenceChip` beside every claim, `statusChecked`, five evidence kinds, content
  tests that freeze statuses.
- **P4:** one accent against muted ink in figures (`figure-contract/`); the oxide accent on links only.
- **P7, P8:** both schemes gated for 4.5:1 text and 3:1 lines; `data-palette` with `oxide` (default) and
  `maid`; absent attribute = oxide byte for byte.
- **P6 partly:** `SectionNav` ("En esta página") exists on project pages.

### 3b. What clashes with the current identity

The identity (`DESIGN.md` §1, `DESIGN_V2_PROPOSAL.md`): paper and ink, **radius zero**, hairlines, **no
shadows**, no colour beyond one accent, serif text, one column, own type and motion. Against that:

| Launcher trait                               | Clash                                                                                                              | Verdict                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| Near-black chrome as the _only_ mode         | The site follows the OS and is paper-first (`DESIGN_V2_PROPOSAL.md` "Colour and type", decided with the operator). | Do not adopt. Dark already exists as a scheme. |
| Cover-art grid as the main surface           | Needs images per project. The projects have diagrams, not covers; a grid of three would be three large rectangles. | Do not adopt for the list.                     |
| Rounded cards, glass panels, glow, elevation | Radius zero, no shadows.                                                                                           | Do not adopt.                                  |
| Side panels (friends, party)                 | Social function the site does not have.                                                                            | Not applicable.                                |
| Customisable top bar, collections, pinning   | Personal state for a returning user with a big library. Three projects, no accounts.                               | Not applicable.                                |
| Autoplay or looping imagery                  | Violates reduced motion unless gated.                                                                              | Not applicable.                                |

### 3c. What would need something new

| Need                                             | What is new                                                                                                                                                              | Substrate change                                                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| A **persistent** in-page position indicator (P6) | `SectionNav` today is a static list at the top; a sticky variant that highlights the current section needs an `IntersectionObserver` and a layout slot in the wide mode. | Portfolio-local component first; substrate only if a second consumer asks. Forced-colours and reduced-motion handling are the new gates. |
| A **dense list row** (P5)                        | A second row layout for `ProjectEntry` (one line: name · years · status chip · key figure).                                                                              | Portfolio-local. No token.                                                                                                               |
| A **plate** for one image per project (P4)       | The `plate` prop of `Figure` already exists.                                                                                                                             | None.                                                                                                                                    |
| A **third palette**                              | Only for Direction D (§6), a dark-first "launcher" palette.                                                                                                              | A `data-palette` block: nine roles × two schemes, each pair gated. A MINOR in tokens.                                                    |

## 4. Constraints every proposal must keep

4.5:1 text and 3:1 lines in both themes; forced colours; reduced motion; 320 px reflow; **`EvidenceChip`
beside every claim.** Each direction below was checked against this list _on paper_; none was built or
measured.

## 5. What the research does not support

- That the launcher's look is "better" for a portfolio. Epic claims speed, not legibility; I could not
  measure either.
- That a dark-first mode is the reason it feels fast. Epic's page says nothing of the kind.
- That any of these ideas improves hiring outcomes. The only primary source on portfolio review (NN/g,
  in `CONTENT_PRESENTATION_CONCEPT.md` §0) concerns scannability and a clear takeaway, not visual style.

## 6. Directions

Costs are my estimates in work-sessions of the kind already done here (S8.x items), **not measured**.

### Direction A — "The ledger as the frame" (status first)

**Home:** unchanged list, but each row's chip line is promoted to a fixed column: status, version,
`statusChecked`, so the list reads as a status board. **Project page:** the "En breve" block gains a
status strip (P3). **Cost:** small. **Substrate:** none. **Clashes:** none. **Risk:** looks like a
dashboard; the serif voice may weaken. **Value:** low-medium: it makes visible what is already there.

### Direction B — "The shelf" (a denser list, one image) — **recommended for home**

**Home:** the list keeps its single column and serif, but each entry becomes a two-level row: a dense
scan line (name, years, status chip, one key figure from `keyFiguresOf`) and, below it, the existing
sentence. The **one figure** that best states the project sits to the right at wide widths as a plate,
and below the text at narrow widths (reflow at 320 px by stacking). The figure supplies the only colour
(P4); chrome stays ink on paper. **Project page:** unchanged by this direction.
**Cost:** medium, one new row variant in `ProjectEntry` and its tests; the figures exist. The JS budget
(5 kB headroom) is sufficient if no new dependency is added. **Substrate change:** none.
**Clashes:** none with the identity; at 320 px the plate must not force horizontal scroll (the existing
natural-width rule on `Figure` would have to be waived for the home plate, a decision to make).
**Evidence kept:** the chip stays on the scan line. **Risk:** with three projects it is a short page; the
value is clarity, not scale.

### Direction C — "Two views" (grid/list as a reader choice)

**Home:** a toggle between the current list and a three-up grid. **Cost:** medium-high (state, focus
management, tests, reduced-motion). **Substrate:** none for the toggle; a grid uses the 12-column
system. **Verdict:** **not recommended.** With three items the toggle solves nothing (§2 caution).

### Direction D — "Dark-first launcher palette"

**Whole site:** a third `data-palette` (provisionally `shelf`): near-black paper, cooler neutral ink, one
accent, dark as default scheme. **Cost:** medium (nine roles × two schemes, each gated; the figure
contract's dark block would need a re-check against the new paper). **Substrate:** MINOR in tokens.
**Clashes:** **yes**: with the paper-and-ink identity and with the operator's recorded decision to follow
the OS scheme. **Verdict:** not recommended; offered only because the operator may prefer a darker
mood, in which case the `maid` palette's dark half is the nearer start (warm, already gated).

### Direction E — "The spine" (project page orientation) — **recommended for the project page**

**Project page:** the project pages are long (ten sections in the v3 order). Add a **sticky, quiet
section spine** at wide widths: the `SectionNav` list set in the margin, with the current section
marked by weight and a hairline, not colour (so forced colours and colour-alone, WCAG 1.4.1, hold). At
narrow widths it stays the current static list. Add one rule at the top of each section for status
("provisional", "measured", "designed, not built") taken from the ledger. **Cost:** medium: an
`IntersectionObserver` hook, wide-mode slot, tests including a reduced-motion and a keyboard check; the
jsdom axe pass cannot see layout defects, so a browser check at 320 / 848 / 1280 is required (L-037).
**Substrate change:** none; if a second consumer wants it, a `SectionSpine` could be promoted as a
MINOR. **Clashes:** none (hairline, no shadow, no colour). **Evidence kept:** claims stay in
`ClaimsList` with their chips. **Source:** P6 (Linear, MDN "In this article").

## 7. Recommendation

1. **B for the home page, E for the project page.** Both stay inside the identity and add no token.
2. **Do not adopt** C or D unless the operator wants a different mood (D is then his decision, a MINOR
   in tokens).
3. **Smallest first step** if he wants to see something: B's scan line alone, with no plate, measured at
   320 / 848 / 1280 in both themes.
4. **Open decisions for the operator:** (a) may the home plate waive the natural-width floor of `Figure`;
   (b) is a sticky spine acceptable on pages whose section count is ten; (c) does he want D explored.

## 7b. Decisions recorded (2026-10-18)

Taken by the prompt-workshop session under the operator's delegation ("Decide D-27, D-28 y D-29 con
tu recomendación"), relayed as a peer message:

- **D-27:** build B for the home page and E for the project page; A, C and D are not built.
- **D-28:** the home plate is exempt from `Figure`'s natural-width floor. The exemption covers that plate
  only.
- **D-29:** the ten-section sticky spine is acceptable, only at wide widths, marked by weight and a
  hairline, never colour.

**These decisions do not authorise building.** That authorisation comes from the operator directly in
this session's chat; until then nothing is built.

## 7c. Built (2026-10-18, operator in chat: "Sí, autorizo construir B y E")

**B, the shelf.** `ProjectEntry` shows the project's opening figure (`plateOf`: the first claim figure,
else the first diagram) as a plate under the entry's text, framed by a hairline, fitted to the column and
never upscaled past its natural width; no `min-inline-size` (D-28, this plate only); `loading="lazy"`; a
failed load removes it. The list's gap went one step tighter (2xl to xl).
**Deviation from §6, stated:** the plate sits **under the text at every width**, not to the right at wide
widths. The home column is the 60ch measure (537 px at 1280); the room to its right inside the page cap
is roughly 220 px, which would show these 2.9:1 to 4.6:1 diagrams at a quarter of their natural width.
Under the text they show at 537 / 909 = 0.59 of natural size for the widest one. If the operator wants
them to the right, it means breaking the list out of the measure, which misaligns it with the name above.

**E, the spine.** `SectionSpine`: the ten sections (En breve, the eight of the page, Verificación) as a
named `nav` ("Secciones de la página"), sticky in the left margin, the current one marked by weight and a
2 px ink bar on a hairline rail, `aria-current="location"`; no colour, no transition. It comes before
the body in the DOM, and where it shows, the static signposts are hidden, so one list is ever exposed.
**Premise corrected by measurement:** §6 assumed the margin beside the reading column was free. At 1280
px the spine fitted (x 176 to 336, column from 363) but the hero figure, a `.phy-wide` 992 px band, ran
from x 137, under it. The spine therefore sits outside the wide band and appears from **90rem
(1440 px)**: 88rem on paper, measured at 1408 it started at x 14. Below 1440 the page is as before, with
the static signposts.

**Measured** (Browser pane, axe-core 4.13.0 with colour contrast on, light and dark):

| Width | Home                        | PhyriadFG / Phyriager / Phynned | Horizontal overflow | Spine                                                                                                                                                              |
| ----- | --------------------------- | ------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 320   | 0 violations, plates 270 px | 0 violations                    | none                | hidden, static list shown                                                                                                                                          |
| 848   | 0, plates 510 px            | 0                               | none                | hidden                                                                                                                                                             |
| 1280  | 0, plates 537 px            | 0                               | none                | hidden                                                                                                                                                             |
| 1440  | 0                           | 0                               | none                | shown, clear of every `.phy-wide` (left x 30 to 190, nearest band from x 216); sticky at 27 px; current section followed while scrolling, last section at the foot |

Gates: typecheck, lint, prettier, **260/260 tests** (24 files; three new, each seen failing with its
feature removed), build, substrate in sync. Budget: JS **111.23 kB** of 115 (initial **81.19**, was 80.68);
CSS **5.00 kB** of 6. The home page now loads three images lazily (raw 119 kB, 168 kB, 68 kB; not gzip
measured).

**Not measured:** forced colours, a coarse pointer, screen readers, other engines, the `maid` palette.

**Found, not changed:** two PhyriadFG figures declare widths in the ledger that their rebuilt SVGs no
longer have: `phyriadfg_multigpu.svg` 701 × 238 in `content.ts`, 908.7 × 286.7 in the file;
`phyriadfg_pipeline.svg` 742 × 182 against 964.5 × 207.7. `Figure`'s legibility floor reads the ledger,
so on the dossier those two floors are about 23 % below the natural width. A content correction, left
to the operator. **Corrected the same day on his word** ("Sí, corrige las medidas de las dos figuras"):
909 × 287 and 964 × 208, and `src/lib/figures.test.ts` now fails when a ledger size differs from its
SVG's (seen red with the old 701). Browser, both themes, axe 0: at 1280 both fit the 990 px band; at
848 both now scroll in their focusable region (floors 909 and 964), where before they shrank.

## 8. What was not done

No install of the launcher; no first-hand look at it running; no contrast measurement of any observed
interface; the three contrast sources are tool summaries (V2); no prototype of A, C or D; costs are
estimates.

<!-- Made with my soul - Swately <3 -->
