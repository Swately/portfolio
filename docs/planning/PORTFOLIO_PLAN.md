# Portfolio page — implementation plan

**PLAN_TIER classification: Tier 1 (substantial).** Multi-step, cross-component,
architecture-touching (introduces routing and a typed content model). **Not Tier 2**: none of
the §1.1 qualifying risks apply — no crash/device-loss surface, no concurrency, no security or
untrusted-input path, no destructive or irreversible operation, no dogma at stake. Therefore
**no RISK_REGISTER**.

**Declared compression (PLAN_TIER §4, anti-over-process).** Tier 1 asks for a MASTER_PLAN +
IMPLEMENTATION_STRATEGIES pair. The "why / walls / architecture / design contract" half already
exists and is authoritative in the AAP record — [`aap/AAP_OBJECTIVE.md`](aap/AAP_OBJECTIVE.md)
(frozen objective, metrics, envelope, kill criteria) and [`aap/SYNTHESIS.md`](aap/SYNTHESIS.md)
(the chosen design, grafts, weak points). Restating them here would fork the source of truth
(D-16). This document is therefore the **strategies half only**: edit sites, milestones, gates.

**Release status:** the design left AAP with `APPROVED FOR HANDOFF` (AT4 `CLEARS`, ATF
`APPROVED`, zero blockers, run `wf_64cb39de-bd9`).

## Design in one paragraph

D1 evidence-index. Every assertion about a project is a typed `Claim` whose `evidence` field is
required, so an unbacked claim fails `tsc --noEmit`; `<EvidenceChip>` is the only component
that prints a claim's backing, making "rendered assertion" and "evidence affordance" the same
JSX node. Three routes: `/` (index, five projects ordered by relevance to a remote systems
role), `/proyecto/:slug` (dossier), `/evidencia` (the public ledger). Page copy in Spanish (O2).

**The guarantee, stated honestly:** the type gate proofs against _omission_, not against
_falsehood_. `tsc` cannot know a number is stale. Truth of each figure is a first-hand
verification obligation at authoring time.

## Milestones (each ends runnable AND measurable)

| #       | Lands                                                                                                                       | Measured at the end                                                                                                                                                   |
| ------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M-A** | Router + 404 shim + main.tsx restore + app shell + NotFound, with a ONE-entry route table rendering today's page untouched  | `npm run build` → the router's **isolated** gzip cost against the 62.40 kB baseline. This is the first real number and the reason M-A exists before any content work. |
| **M-B** | `content.ts` rewritten to the `Claim`/`Evidence` model; **`ProjectCard.test.tsx` repaired**                                 | `npm run typecheck` + `npm test` green                                                                                                                                |
| **M-C** | `IndexPage` — five cards, relevance order, status inside the `<h3>` (graft G2)                                              | `npm test`, DOM read                                                                                                                                                  |
| **M-D** | `ProjectPage` dossier + `Figure` + `assets.ts`; the two real diagrams wired                                                 | `npm run build` + `npm run preview` → M3(b) transferred bytes                                                                                                         |
| **M-E** | `EvidencePage` + `content.test.ts` that **computes and prints** the M1 fraction (graft G1) and freezes status literals (G4) | M1 read off the test run; M2 = 5/5                                                                                                                                    |
| **M-F** | Final measurement pass                                                                                                      | All four M4 commands + M3(a)/(b) + M5(a)(b)(c) recorded                                                                                                               |

## Known unpriced work, carried here because AT4 flagged it

1. **`src/components/ProjectCard.test.tsx` will break at M-B** — confirmed first-hand by the
   AT4 gate and by this session: it declares `const base: Project = { name, tag, description,
sourceUrl }` and asserts a link named `Source: GitHub`. M-B rewrites the `Project` type, so
   the file fails both `tsc --noEmit` and its own assertions. K3 is an unconditional gate, so
   this is mandatory, in-file, zero E8 cost. **Repaired inside M-B, not deferred.**
2. **E8 margin is thin, and it is the closest wall** — 16 new files of 18 as submitted, 17 if
   G6 adds `assets.test.ts`. Routes 3 of 4 (the router's `fallback` is a separate prop, not a
   `Route` — verified first-hand in climx `router.tsx:68`). Any new component pair (`.tsx` +
   `.module.css`) costs 2 files. **No file may be added without checking this budget.**
3. **M6 honest reading** — under the frozen metric text (no authorship requirement) the count
   is ≥5 and K2 clears with margin 2. Under a stricter "what this candidate itself contributes"
   reading it is 3, which clears the K2 floor but not the ≥4 target. Both readings are recorded
   rather than the favourable one being kept silently.

## Verified facts the page may use (first-hand, this session)

- All 7 outbound URLs return **200**: the five repos, `swately.github.io/climx/`, and the
  GitHub profile. The "repository publicity" risk AT4 could not close is **closed**.
- Contrast from `tokens.css`: text 18.88:1, muted 6.79:1 (6.51:1 on surface), accent 6.483:1
  (6.21:1 on surface) — all clear WCAG AA 4.5:1. Independently reproduced by the AT4 gate.
- Byte budget, measured: worst case with all three figures on one view = **384,003 B**
  transferred, against the 500,000 B bound. JS gzip headroom 88 KB.
- Images that exist: `phyriadfg_multigpu.png` (89,350 B), `phyriadfg_pipeline.png` (64,286 B),
  `trazado_1.png` (167,722 B). Both diagrams opened and confirmed legible/portfolio-grade.
- **Phynned's README is NOT self-contradictory.** AT4 flagged line 8 (`0.2.0-experimental`)
  against lines 27/135/179 (`0.1.0-experimental`). Read in context first-hand: those three are
  correct _historical_ references ("0.1.0 has no user base", "binaries are unsigned in 0.1.0").
  The current version is `0.2.0-experimental`. Finding not accepted.

## Numbers the page must NOT print (each verified as contradicted or stale)

- climx per-municipio payload "~350 B gzip" — `MEASUREMENTS.md:73` is a before/after pair,
  `344 B gz → 463 B gz`; 344 is superseded. **Struck.**
- climx test count without a date — README says 41, `MEASUREMENTS.md` records 41/41, 50/50 and
  51/51 on three dates. Either bare figure contradicts a source.
- climx Lighthouse figures — measured against the pre-rename `project-tw` URL, and E5 has no
  Lighthouse to re-run them.
