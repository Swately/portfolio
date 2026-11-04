# Portfolio — the complete design (S7, 2026-09-02)

> **Superseded the same day** by design v2, "the work first":
> [`DESIGN_V2_PROPOSAL.md`](DESIGN_V2_PROPOSAL.md) (adopted, built as S7.4). §1 (identity inherited),
> §5 (gates) and §6 (content touched) still hold; §2–§4 describe the v1 shape that was replaced
> — kept as the record of why v2 removed what it removed.

Status: **design + implementation, no new real content** — the operator's direction of
2026-09-02 (_"de momento solo el diseño completo y la implementación, el contenido de momento
no"_). The existing content (5 projects, 28 claims with evidence, skills, limits) is verified
work and stays exactly as it is; every section the design adds that has no content yet carries
**visibly provisional copy**, marked on the page and listed in §6, so nothing reads as a claim.
Built on the stable substrate: `phyriad-tokens 1.0.0` + `phyriad-react 1.0.0`, vendored in
tracking mode (re-attached 2026-09-02 after 105 files of drift; the 0.5-era numeric tokens that
had gone dangling in three CSS modules were mapped to the named scale).

Decisions are the session's, delegated by the operator, each with its reason. Companion:
[`PORTFOLIO_PLAN.md`](PORTFOLIO_PLAN.md) (the original plan and the verified facts the page may
use — still binding for content).

## 1. Identity, inherited

Everything visual comes from the substrate: paper and ink with the oxide accent on links only,
radius zero, hairlines, no shadows, fluid type and space, both colour schemes (the toggle in the
header; the OS preference by default), forced-colours survival, reduced motion. The portfolio
adds **no colour, no font and no motion of its own** — its identity is the evidence discipline,
which is content-shaped, not decoration-shaped. The one visual signature that is the site's:
the **evidence chip** beside every assertion (the existing `EvidenceChip`, unchanged).

## 2. Information architecture

| Route             | Page             | Purpose                                                                                                                 | State                                                      |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `/`               | Inicio           | Who, the thesis of the site, the five projects, the tools                                                               | content exists                                             |
| `/proyecto/:slug` | Dossier          | Every claim with its evidence, figures, declared limits, how the status is frozen                                       | content exists                                             |
| `/evidencia`      | Cómo se verifica | What counts as proof, the mechanism and its limit, every assertion (filterable), what is missing, how the site is built | content exists; one paragraph corrected (§6)               |
| `/sobre`          | Sobre mí         | Trajectory, how I work, formation                                                                                       | **provisional copy**                                       |
| `/contacto`       | Contacto         | Channels and availability                                                                                               | channels real (mail, GitHub); availability **provisional** |
| `*`               | 404              | The substrate's view, Spanish copy                                                                                      | exists                                                     |
| `/lab` (DEV)      | Standards lab    | Instrument, dev-only route                                                                                              | exists                                                     |

**Navigation moves to the header** (`SiteHeader nav`: Inicio · Evidencia · Sobre mí ·
Contacto) — five destinations is a header's job, and the header is on every page. **The leading
sidebar becomes wayfinding**: a table of contents for the current page's sections, computed
from the route (the section list is fixed per page family, so it is data, not DOM scraping),
rendered with the substrate's `TableOfContents`; on a narrow screen it stacks above the content,
which is exactly where a page outline belongs. Breadcrumbs (`Breadcrumbs`) replace the ad-hoc
"← Volver" links on the dossier, the ledger, about and contact.

## 3. Page by page

### Inicio

1. **Perfil** — the existing paragraph, plus the site's thesis as one line with a link:
   _"Cada afirmación de este sitio lleva su evidencia → Cómo se verifica"_.
2. **Proyectos** — the existing card grid (`ProjectCard`, subgrid-aligned rows: name + status,
   tag, summary, lead evidence, actions), unchanged: it is the best thing on the site.
3. **Herramientas** — the existing `SkillsTable` (every row names the project that evidences it).

### Dossier (`/proyecto/:slug`)

1. Breadcrumbs: Inicio / _name_.
2. Header: name with the verbatim status beside it, the summary, the repository link.
3. **Qué hace, y cómo se comprueba** — the claims as an ordered list with an anchor per claim
   (`#afirmacion-N`), each with its `EvidenceChip`; figures rendered by the project's own
   `Figure` (it owns the LCP priority and the scrollable-diagram region; kept).
4. **Límites declarados** — the project's own limits, quoted, in a raised surface.
5. **Verificación** — the "how the status is frozen" note inside a `Disclosure`, closed by
   default: it matters, it is long, and it is the same on every dossier.

### Cómo se verifica (`/evidencia`)

Sections as today, with two upgrades: **a filter** over the assertions (the substrate's `Search`
surface with a small client-side engine — text includes, per project or across all — and a
polite `Status` that reads "N de 28 afirmaciones"), and each assertion linking to its anchor on
the dossier. The "Cómo está hecha" paragraph is corrected (§6).

### Sobre mí (`/sobre`) — provisional

Breadcrumbs; **Trayectoria** (a `DescList` of three dated rows — placeholders); **Cómo
trabajo** (one `Prose` paragraph — placeholder); **Formación** (ESCOM, IPN — real, from the
tagline). A visible note at the top: _"Contenido provisional: esta página tiene la estructura
final y textos de relleno."_

### Contacto (`/contacto`)

Breadcrumbs; a `DescList` of channels (correo, GitHub — real); **Disponibilidad** (placeholder
line, marked). No form: a form without a backend would be a false affordance.

### Footer

`© 2026 Eduardo Ramos Mendoza · Hecho con phyriad-tokens 1.0.0 y phyriad-react 1.0.0 · Cómo se
verifica`.

## 4. States and details

- Every page renders its own `<title>` (`Sección — Eduardo Ramos Mendoza`); the shell's DEV
  audit enforces it.
- Theme toggle in the header meta (Sistema / Claro / Oscuro), persisted; boot script in
  `index.html`.
- Skip link, landmarks, focus-on-route-change: the shell's.
- No skeletons: the content is static and bundled; a skeleton would be theatre.
- Print, safe areas, `prefers-contrast`: not in this pass (substrate S8.4, when a consumer asks).

## 5. Gates

- Chain: lint · typecheck · tests (the substrate's 200+ run here too, plus the site's) · build.
- **Size budget** (`size-budget.mjs`) with the measured figure + headroom, in `package.json`.
- Browser: every route at 320 and 1280, light and dark — no horizontal overflow, one `<title>`
  per route, the sidebar TOC links land with the scroll margin; **axe with contrast ON** on
  every route in both schemes (the S10.3 method).
- README "Measured" table refreshed with today's numbers, marked with the date.

## 6. Content touched, exactly

- **Corrected for truth** (the site must not say something false about itself): the "Cómo está
  hecha" paragraph said the tokens and primitives were reused from climx; they are the
  container's substrate now (`phyriad-tokens` / `phyriad-react` 1.0.0, vendored). One paragraph.
- **Provisional copy, marked on the page**: Sobre mí (trayectoria ×3, cómo trabajo), Contacto
  (disponibilidad). Nothing else is new text.
- **Unchanged**: every project, claim, evidence, limit, skill, and the "what is missing" list.

<!-- Made with my soul - Swately <3 -->
