# AAP Frozen Objective — portfolio page design search

Status: **FROZEN 2026-08-27** (AT0 verdict: `FREEZE WITH FIXES`; the 5 point-fixes applied
below, nothing else changed except the operator's three A0 decisions recorded in §Operator
decisions). DO NOT drift — AINV-12 byte-checks this file at ATF.
Process: Phyriad AAP (`protocols/analysis/ARCHITECTURE_ANALYSIS_PROTOCOL.md`), scoped +
compressed run (compression declared in §Process deviations).
Candidate angles and the DESIGNER deliverable spec live in the amendable sibling
[`A1_CANDIDATE_ANGLES.md`](A1_CANDIDATE_ANGLES.md) — deliberately outside this byte-frozen file
(AT0 fix 5).

## Design problem

Design the portfolio web page for Eduardo Ramos Mendoza (Swately) inside
`F:\Phyriad\projects\portfolio`, an existing project that already carries climx's toolchain,
the five layout primitives, a token file, and the CV content — but no considered page design,
no second route, and no visual material. The operator's instruction is explicit: build it
**using climx's resources**.

The search covers exactly THREE axes; everything else is out of scope:

1. **Page structure** — how many routes, what lives on each, what the reader meets first.
2. **Evidence model** — how each project's claim is presented and how the reader gets from a
   claim to proof (repo, live site, diagram, measured number, declared status).
3. **climx reuse depth** — which climx resources do structural work here, and which are
   correctly left behind.

## Operator decisions (A0 inputs the supervisor could not decide alone)

Recorded 2026-08-27, before the freeze:

- **O1 — Audience: remote international work.** The page serves engineers and technical
  recruiters at companies outside Mexico evaluating the operator for a remote role. This is
  what the named workload below fixes.
- **O2 — Page language: Spanish.** Declared and honoured. **Declared tension, surfaced by the
  supervisor and overruled by the operator (CONDUCT §6 — the session corrects, the operator
  decides):** O1's audience is largely non-Spanish-speaking, so a Spanish page narrows the
  reader it was built for; the CV (`documentos_varios/cv.tex`) is in English, so the page and
  the CV will not match in language. The operator's call stands and the search proceeds in
  Spanish. Reversibility is real and cheap: all page text lives in `src/content.ts`, so the
  language is one file's rewrite, not a redesign. This tension is a recorded risk, NOT a
  metric, and no candidate is scored on it.
- **O3 — Project status shown as-is.** Each project displays its real declared maturity. This
  is the M2 metric and is not negotiable downward by any candidate.

## Named workload / use case (the fixed case feasibility is vetoed against)

An engineer or technical recruiter at a company outside Mexico, screening the operator for a
remote position, opens the page cold on desktop or phone — typically arriving from a GitHub
profile, a CV link, or an application. Inside roughly twenty seconds they must be able to say
what this person builds and whether it is real work. If they stay, every claim they are
curious about is reachable in one click, and nothing on the page overstates what the
underlying project actually is.

_(The ~20 s figure is a design target, deliberately NOT promoted to a metric: measuring it
would need a user study that does not exist on this machine.)_

## Success metrics (measurable; instrument named)

- **M1 — Claim-to-proof coverage.** Share of project claims on the page that are one click (or
  zero — inline number/diagram) from verifiable evidence: a repo URL, a live URL, a project
  diagram, or a number traceable to that project's own docs. **Enumeration unit (AT0 fix 4):
  one claim = one rendered assertion of fact about a project — its name, its status, a
  capability, or a number.** Instrument: enumerate every such rendered assertion, count those
  with attached evidence. **Target: 100%.**
- **M2 — Status honesty.** Count of the 5 projects whose page entry shows a maturity/status
  signal that MATCHES that project's own README, out of 5. Sources first-hand verified
  (§Verified input evidence): Phyriager `0.1.0-experimental`, PhyriadFG `0.4.0-experimental`,
  Phynned `0.2.0-experimental`, PHarvard "runs on silicon" (full ISA verified on the board
  2026-08-01), climx live/deployed. Instrument: diff the page text against each README.
  **Target: 5/5.** A page that renders five projects as five equal polished tiles scores 0 here.
- **M3 — Payload.** Two thresholds, two units, one production instrument (AT0 fix 1):
  (a) initial JS ≤ 150 KB **gzip**, and CSS reported alongside; instrument: `npm run build`
  output. Baseline measured 2026-08-27: 62.40 kB gzip JS, 1.12 kB gzip CSS.
  (b) heaviest single view ≤ 500 KB **transferred bytes** — not gzip, because the PNGs that
  dominate this budget are already-compressed formats that gzip does not shrink; instrument:
  `npm run preview` over `dist/` (a real production build, already in `package.json`) with the
  browser network panel. The dev server is NOT an instrument for this: it serves unbundled,
  unminified, uncompressed ES modules.
- **M4 — Quality gate.** `npm run lint` + `npm run typecheck` + `npm test` + `npm run build`
  all green. Instrument: the four commands, run first-hand, output quoted. **M4 is an
  unconditional gate, not a ranked tradeable metric.**
- **M5 — Accessibility floor.** (a) `eslint-plugin-jsx-a11y` clean under the existing config;
  (b) semantic landmarks present (`header`/`main`/`nav`/`footer`) and every interactive
  element keyboard-operable; (c) body and muted text meet WCAG AA contrast (≥ 4.5:1) against
  their background, computed from the token values. Instrument: the lint run, a DOM read of
  the rendered page, and an arithmetic contrast check on `tokens.css`. All three required.
- **M6 — climx reuse depth.** Count of DISTINCT climx resources doing **structural** work in
  the portfolio, where structural means: deleting it breaks the page or removes a capability,
  not merely a style. **The deletion test is scored against the deployment host GitHub Pages
  at a project path (`/portfolio/`) (AT0 fix 3)** — the host `vite.config.ts` already assumes
  and the one climx itself runs on. Under that referent, host-dependent resources such as the
  404 deep-link shim and the router's `BASE_URL` handling ARE structural. Cosmetic resemblance
  does not count. Candidate pool: the inventory's high/medium-value list (17 resources).
  **Target: ≥ 4.**

## Priority ordering (who wins on conflict — PERFECTION_TRADEOFF template, declared)

1. **P1 Credibility (M1, M2).** The page exists to represent the operator to technical readers.
   A page that impresses and overstates is worse than a plain one that holds up — CONDUCT's
   calibrated-reporting discipline applied to the artifact itself.
2. **P2 climx reuse (M6).** The operator's literal instruction for this build.
3. **P3 Presentation (M3, M5).** Fast, accessible, and pleasant to read.
4. **P4 Delivery speed.** Explicitly last.

**Tie-breaking at A3, declared because every metric above is a threshold rather than a score
(AT0 residual note):** when two candidates clear every threshold, the supervisor ranks by, in
order, (i) M2 count, (ii) M1 fraction, (iii) M6 count, (iv) M3(a) bytes. **M6 is a floor, not
a maximand:** additional climx reuse that costs payload or reading quality does NOT improve a
candidate's standing once M6 ≥ 4 — reuse past the floor is neutral, so P2 cannot be farmed.

**Quality veto (not a score):** every link resolves, and no statement about a project
contradicts that project's own source. A page with a broken link or an overstated claim fails
regardless of every metric above.

## Feasibility envelope (hard constraints)

- **E1** No backend, no runtime server, no secrets in client code. Static hosting.
- **E2** $0 recurring. No external service requiring an account, key, or card.
- **E3** **No new runtime dependencies.** Runtime deps stay `react` + `react-dom` (verified
  first-hand from `package.json`: those two are the entire `dependencies` block). Dev deps stay
  what `package.json` already installs — `npm install` reported verbatim "added 372 packages,
  and audited 373 packages… found 0 vulnerabilities" on 2026-08-27; that line is the source of
  the figure, which is npm's install count and does not equal the lockfile entry count.
- **E4** All content must exist on disk today and be verifiable against its source. The visual
  material that exists is listed in §Verified input evidence — a candidate may use those files
  and nothing invented.
- **E5** Toolchain, verified first-hand 2026-08-27: Node v24.19.0 (portable install), npm
  11.17.0, Vite 8.2.2, TypeScript strict, Vitest 4.1.11, ESLint flat config with
  typescript-eslint + react-hooks + jsx-a11y, Prettier. **Lighthouse is NOT installed and is
  NOT an available instrument** — no metric above depends on it.
- **E6** Solo developer (the operator) + LLM assistance. The project has a local git repo with
  no remote and no commits yet. **Deployment host for scoring purposes is fixed by M6 above
  (GitHub Pages, project path); which repo/URL it ultimately lives at remains an open question
  for the operator and is not a constraint on the search.**
- **E7** House rules bind: every code file ends with `Made with my soul - Swately <3`; no
  hardcoded px/hex outside `src/styles/tokens.css`; docs in English (the _page_ is Spanish per
  O2 — a different artifact from the docs).
- **E8 — Scope bound (AT0 fix 2).** Effort is NOT unbounded, and the axis is made vetoable:
  a candidate MUST fit within **≤ 4 routes** and **≤ 18 new files under `src/`**. A design
  exceeding either is disqualified under K7 regardless of its scores. This is the axis on
  which this build would most plausibly overrun, so it is a hard bound rather than a
  preference.

## Kill criteria (each can disqualify a candidate outright)

- **K1** Requires content that does not exist on disk — an invented screenshot, a photo of the
  operator, a project logo, a testimonial, a fabricated metric.
- **K2** Structural climx reuse below 3 resources (M6 < 3). Naming climx while reusing nothing
  is not reuse.
- **K3** Cannot pass the M4 gate (lint, typecheck, tests, build) as specified.
- **K4** Renders any claim about a project that its own README/docs do not support, or hides a
  project's real status behind uniform polish. _(K2 and K4 overlap M6 and M2 by design: a
  metric measures degree, a kill criterion sets the floor below which degree stops mattering.)_
- **K5** Not measurable: no path to real numbers for M1–M6 on this machine with E5's toolchain.
- **K6** Requires a new runtime dependency, an external service, a key, or recurring cost.
- **K7** Exceeds the E8 scope bound (> 4 routes or > 18 new files under `src/`).

## Declared constraints — dropped/forbidden drivers (smuggling check)

- **FORBIDDEN:** climx's `public/img/estados/*.webp` state photographs. Two independent
  reasons, both verified: (a) provenance — `scripts/build-state-images.mjs` records them as
  re-encodes of the 2023 v0 school project's images, and climx's own `CreditsPage.tsx` credits
  every _municipality_ photo with artist/license/Commons page while saying of the state photos
  only that they come from the original project — no author, no license, no source for any of
  them; (b) subject matter — they are photographs of Mexican geography, not of the operator's
  work. Their _mechanism_ (the `object-fit: cover` card CSS, lazy loading, the `onError`
  degrade, the `BASE_URL` asset helper) is explicitly NOT forbidden and is encouraged, pointed
  at the operator's own images.
- **DROPPED:** climx's data layer (`fetchWithCache`, `useFetch`, hooks, staleness), geo layer,
  `SearchCombobox`, and every weather-specific component (`AgeBanner`, `ForecastCard`,
  `skyIcon`, `NearestMunicipio`, `CommonsGallery`) — there is no external data source here, so
  porting them would be a speculative layer with no consumer.
- **NOT forbidden but must be argued against P2/M6:** a single-route design. It is admissible,
  but it forgoes climx's router — its strongest reusable asset — so it carries the burden of
  reaching M6 ≥ 4 by other means.

## Verified input evidence (supervisor, first-hand, 2026-08-27)

- **Portfolio project state:** toolchain installed and green — `typecheck` clean, `lint` clean,
  6/6 tests pass, production build 62.40 kB gzip JS. Has: 5 primitives, tokens.css, reset.css,
  `src/content.ts`, three plain components, one-page `app.tsx`. Has NOT: router, second route,
  404 shim, lab page, any image.
- **climx resource inventory:** 27 resources catalogued by a subordinate context and written to
  `PRE_AAP_CLIMX_INVENTORY.json` (8 high / 9 medium / 3 low / 7 none). High-value entries
  re-verified first-hand by the supervisor: the hand-rolled router (`src/router/router.tsx`,
  read in full), its test suite (`router.test.tsx`, read in full), the GH-Pages shim
  (`public/404.html`, read in full), `PrimitivesLab.tsx`, `NotFound.tsx`, `EstadoCard.tsx` +
  its module CSS, `MuniHeader.tsx` + its module CSS, `ErrorState.tsx`, `CreditsPage.tsx`,
  `tokens.css`, `reset.css`, `app.tsx`, `ci.yml`, `ARCHITECTURE.md`. [R2 applied: the inventory
  is a subordinate's claim; the entries this objective leans on were re-opened by the
  supervisor.]
- **Visual material that EXISTS** (supervisor opened each; this corrects a false premise the
  supervisor itself wrote into the discarded pre-AAP run — see §Process deviations):
  - `projects/PhyriadFG/docs/diagrams/phyriadfg_multigpu.png` (89,350 B) — a clean TikZ
    architecture diagram: Game → Capture (thread C, iGPU) → Optical flow (thread F, GTX 1080
    Ti) → Warp+blend+present (thread P, RTX 4090) → Display, with `c_seq`/`f_seq` handoffs and
    the `p_presenting` backpressure edge labelled. Portfolio-grade as-is.
  - `projects/PhyriadFG/docs/diagrams/phyriadfg_pipeline.png` (64,286 B) — a second diagram;
    **existence and size verified, contents NOT opened.** A candidate leaning on it leans on an
    unseen asset.
  - `projects/Phyriager/screenshots/trazado_1.png` (167,722 B, 1273×721) — an annotated agent
    frame: goal chip "have stone_pickaxe (1/1)", red projected-path overlay, metadata footer
    "frame.v1 · sensor-true · 384x216 · FOV 110 fixed · 3.0 Hz".
  - `projects/Phyriager/logs/audit_frame*.png` (six files) — raw VLM input frames.
- **Visual material that does NOT exist:** no photo of the operator, no project logos, no
  screenshot of climx live, of Phynned's UI, or of PHarvard's board/display. Capturable by the
  operator, but not on disk today, so no candidate may assume them.
- **Project facts available for the page** (each from that project's own README, read
  first-hand): PHarvard — 1,409 LUT4 of 6,864 (21%), 625 registers (9%), 12 of 26 block RAMs,
  post-route Fmax 20.4 MHz, runs at 2.08 MHz, full ISA verified on silicon 2026-08-01, seven of
  seven self-checks; Phynned — 49-test suite, A/B/A/B/A measurement protocol, 14-test
  exploratory catalog, renamed from Ayama 2026-07-16; PhyriadFG — one executable, LTO release,
  multi-GPU role split, `0.4.0-experimental`; Phyriager — three processes (Java/Fabric mod,
  C++23 brain, LLM router), versioned-ABI shared memory that refuses to attach on drift, ran a
  full session with every LLM endpoint dead; climx — 2,463 municipios, composite `(ides,
idmun)` key, 41 tests, ≥80% data-layer coverage gate.

## Process deviations (declared, per AAP §3 and §5)

1. **A discarded pre-AAP run.** Before loading this protocol the supervisor launched a design
   search with no frozen objective. It produced an inventory (kept — factual, not a candidate)
   and three designs with one verdict (sealed unread at `sealed/PRE_AAP_DESIGNS_SEALED.json`,
   never deleted per the no-deletion rule). Those designs are NOT admitted as A1 candidates for
   two reasons: AINV-1 (the objective did not precede them) and, materially, they were written
   against a briefing that falsely asserted no visual material existed — their design space was
   mis-drawn. The supervisor has not read them, so this objective is uncontaminated by their
   content. **AT0 correctly noted this assertion is unverifiable from outside; it rests on the
   supervisor's declaration.**
2. **Compression.** A3 (convergence) is performed by the supervisor as §2 requires; A4 and ATF
   run as a single combined clean-context gate, mirroring the declared compression of the climx
   run (AAP §0.1, run 2). A2 runs 2 diverse lenses per candidate rather than the RECOMMENDED 3
   — declared, given the scale of the artifact. AT1 (diversity gate) runs as a supervisor check
   rather than a clean gate, the same declared deviation climx's run made.
3. **Adversary discipline correction.** The discarded run asked its judges for `requiredFixes`,
   which grants the judge a redesign stake and collapses the producer/judge separation (AAP §2,
   §10). The A2 gate in this run is verdict-only: score, fatal flaws, salvageable ideas — no
   fixes.
4. **AT0 record.** Verdict `FREEZE WITH FIXES`, 2026-08-27, clean-context gate agent. Five
   point-fixes applied verbatim before freezing: M3 instrument + unit (MAJOR), E8 scope bound
   added (MAJOR), M6 host referent fixed (MAJOR), M1 enumeration unit defined (MINOR), A1
   angles split to a sibling file (MINOR). The gate's two residual notes (threshold-not-score
   ranking; M6-as-unbounded-maximand) were also resolved, in §Priority ordering. What AT0 could
   NOT verify, recorded rather than passed as good: the 62.40 kB build baseline (it declined to
   run a command that writes `dist/`), the 372-package count (reconciled here to its source
   line), and the contents of `phyriadfg_pipeline.png`.
