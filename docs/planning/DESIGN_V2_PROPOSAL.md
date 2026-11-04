# Design v2 — proposal: "the work first" (2026-09-02)

Status: **ADOPTED 2026-09-02, built as S7.4.** The operator's decisions, verbatim in substance:
go; follow the OS scheme; serif body; show "(año pendiente)"; **the masthead is the name only** —
no GitHub or mail links either ("con mi nombre es más que suficiente"); the portfolio is
exclusively about the projects, each with an extensive page, PhyriadFG first. Deviations from
§2 as proposed: the masthead lost its two links; the dossier became the extensive-page template
(§2 dossier + six sections, three of them visibly provisional) rather than "unchanged".
Original direction: _"minimalista pero sofisticado, basarnos en madebyevan.com, el enfoque real
en los proyectos, no en mí"_.

## 1. What the reference actually does (read first-hand, 2026-09-02)

| Aspect | madebyevan.com, as observed                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout | one column, left-aligned, ≈ 545 px of text at a 560 px window; no sidebars, no cards                                                          |
| Top    | two links (Mastodon, GitHub), then the name as a 30 px serif `h1` — a signature, not a hero; no tagline, no photo, no navigation bar          |
| Body   | 15 projects under 6 category `h2`s; each entry: a small SVG icon, an `h3` with the years in parentheses, one to three sentences, "Read more…" |
| Type   | headings Georgia bold, white; body Arial 15 px / 22.5 px, `rgb(187,187,187)`; links `rgb(204,204,204)`, no underline                          |
| Colour | dark ground `rgb(34,34,34)`; one scheme only                                                                                                  |
| Absent | navigation, about page, contact page, images, rules, boxes, shadows, tags                                                                     |

Its sophistication is restraint: nothing on the page competes with the list of work.

## 2. The proposal, mapped to this site and its substrate

**Concept — the page IS the list.** `/` becomes the whole site: a one-line masthead, then the
projects, then a one-line foot. The dossiers stay as the "Read more…" pages. The ledger
(`/evidencia`) stays as the site's honesty page, reached from the foot and from every evidence
chip. **`/sobre` and `/contacto` go away** — that is the direct answer to "no en mí": the person
is one line at the top (name + GitHub + correo) and nothing more.

### Home, top to bottom

1. **Masthead** — `Eduardo Ramos Mendoza` as the `h1` at the `lg` step (not `xl`), and beside it
   two links: GitHub, correo. No tagline, no city, no theme control here. Built with the
   substrate's `Text` + `Cluster`, not `SiteHeader` (which is designed to carry brand + tagline
   - nav + meta — exactly the furniture the reference removes).
2. **The projects, as a list** — no cards, no grid, no surfaces, no hairlines: rhythm by space
   only (`2xl` between entries, `xs` inside). Each entry:
   - `h2`: the project name, then **the verbatim status** in mono muted (the site's honesty
     mark, kept) and **the years in parentheses** — dates are content the ledger does not have
     yet: rendered as `(año pendiente)` until the operator supplies them, visibly provisional.
   - the existing one-sentence `summary`;
   - the **lead evidence chip** — the one visual signature of this site, kept, but quieter
     (mono `xs`, no box);
   - `Leer el dossier →` (the reference's "Read more…").
     Five projects do not need category sections; the reference has fifteen. Order stays as it
     is (relevance to the reader). If the operator wants sections later, a `group` field on
     `Project` is the change — editorial, so not assumed here.
3. **Foot** — one muted line: `Cómo se verifica este sitio · Tema: Sistema` (the ledger link and
   the theme toggle live here, out of the way).

Gone from the home: the profile paragraph (the ledger keeps the "how" and the summary carries
the "what"), the skills table (a capability list is about the person — it moves to the ledger,
where each row's evidence is at home), the sidebar outline (a five-entry page needs none), the
header nav, breadcrumbs.

### Dossier (`/proyecto/:slug`)

Unchanged in structure (claims with evidence, figures, declared limits, verification
disclosure); the top becomes the reference's shape: `← Índice` as the only wayfinding, the
name as `h1`, status and years beside it. Same one-column measure as the home.

### Ledger (`/evidencia`)

Unchanged, plus the skills table it inherits. Reached from the foot and from every chip.

### Colour and type — two decisions for the operator

- **Scheme.** The reference is dark-only. The substrate follows the OS by default and has both
  palettes gated for contrast. **Recommendation: follow the OS** (NN/g's evidence for light on
  normal vision; the toggle in the foot for anyone who wants the other). The alternative — dark
  fixed, exactly like the reference — is one static attribute in `index.html` (documented in
  CONSUMING.md) and no code.
- **Body face.** The reference sets serif headings over a sans body. The substrate's identity
  is a serif TEXT system (prose serif, UI sans). **Recommendation: keep the serif body** — the
  restraint is what reads as sophisticated, not the sans. The alternative costs one MINOR
  substrate addition (a `face` prop on `Text`) and is reversible.

Everything else is already the substrate's: hairlines and boxes are removed by not using them;
type and space are fluid; the oxide accent stays on links only; forced colours and reduced
motion hold.

## 3. What it removes, kept honest

| Removed                                     | Where it goes                                                              | Why                         |
| ------------------------------------------- | -------------------------------------------------------------------------- | --------------------------- |
| `/sobre`, `/contacto`                       | the masthead line; the pages are deleted (they held provisional copy only) | "no en mí"                  |
| Profile paragraph, skills table on the home | the ledger                                                                 | the home is the work        |
| `SiteHeader` (brand, tagline, nav, meta)    | a two-element masthead                                                     | the reference has no header |
| Card grid, surfaces, hairlines on the home  | a spaced list                                                              | restraint                   |
| Sidebar outline, breadcrumbs                | `← Índice` on the dossier only                                             | one column, one way back    |

Nothing about the CONTENT changes: the projects, claims, evidence and limits are untouched;
dates are the one thing the design wants and does not have, shown as provisional until given.

## 4. Cost and gates

One node (S7.4): app shell recomposed, the home rewritten as a list (`ProjectCard` retired in
favour of a `ProjectEntry`), dossier top reshaped, two pages removed, tests adjusted, README.
Gates as S7.2: chain, size budget (expected to drop), five→three routes at 320 and 1280 in both
schemes with axe contrast ON, one `h1` per page, no overflow.

## 5. What I need from the operator before building

1. Go / no-go on the concept (§2).
2. Scheme: follow the OS (recommended) or dark fixed.
3. Body face: serif (recommended) or sans via a `Text` face prop.
4. Dates: show `(año pendiente)` now, or omit the years until the content arrives.

## 6. Distribution on wide screens (S8.5, 2026-09-02)

The operator saw the reading column at the left third of a 1846 px screen. Research (Baymard,
Butterick, web.dev, read first-hand — substrate UX doc §1.8) says: cap the line AND the
container. The substrate gained `--phy-page-max` and a centred layout mode; this site sets
`--phy-page-max: 64rem` and `layout="centered"`, tightens chrome-to-content rhythm (`xl`
between regions, `2xl` between sections) and folds "← Índice" into the page header. Measured
after: the reading column (≈ 58 characters) and the wide figures sit within 2 px of the viewport
centre at 1846 px; nothing changes at 320 px.

## 7. One page per project, the shell as the template (S7.5, 2026-09-02)

The operator's direction: a unique page per project, and the template is _literally the blank
shell_. Built as: `ProjectShell` (the format — way back, header from the ledger with status and
years, the page's sections, the closing verification note), `ProjectSection` / `Pending` /
`ClaimsList` / `LimitsList` as the vocabulary a page is written in, `_Blank.tsx` as the copy-me
starter (not routed), `PhyriadFGPage.tsx` as the first own page (prose provisional, claims and
limits from the ledger), and the generic `ProjectPage.tsx` rebuilt on the same shell for the
other four. Gate: 215/215 tests, axe clean in both schemes on the own page and on a generic one,
budget 69.30 / 85 kB.

<!-- Made with my soul - Swately <3 -->
