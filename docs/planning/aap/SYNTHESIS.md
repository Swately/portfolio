# AAP A3 — Convergence and synthesis

Supervisor: this session, 2026-08-27. Performed by the SUPERVISOR as AAP §2 requires (the
convergence role is not delegable to an adversary). Selection cites the A2 scorecards
(AINV-7) and uses the frozen priority ordering (AINV-3), not the supervisor's taste.

Inputs: [`AAP_OBJECTIVE.md`](AAP_OBJECTIVE.md) (frozen), three candidates and six clean-lens
verdicts from run `wf_d3e71b50-5be` (9 agents, 0 errors, all six gates returned `SCORED`,
zero FATAL defects across the board).

## Scorecard roll-up (means of the two lenses, per frozen metric)

| Candidate                | M1  | M2  | M3  | M4  | M5  | M6  | **P1 (M1,M2)** | **P2 (M6)** | P3 (M3,M5) |
| ------------------------ | --- | --- | --- | --- | --- | --- | -------------- | ----------- | ---------- |
| D1 evidence-index        | 4.5 | 5.0 | 5.0 | 4.0 | 4.0 | 4.0 | **4.75**       | **4.00**    | 4.50       |
| D2 craft-demonstrator    | 3.5 | 5.0 | 4.5 | 5.0 | 3.5 | 3.5 | 4.25           | 3.50        | 4.00       |
| D3 editorial-single-page | 4.0 | 5.0 | 4.5 | 4.0 | 5.0 | 3.5 | 4.50           | 3.50        | **4.75**   |

Scope recompute (budget-auditor, first-hand): D1 4 routes / 16 files, D2 3 / 16, D3 1 / 12 —
**all three close under E8** (≤ 4 routes, ≤ 18 files). Fit verdicts: D1 tight/fits, D2
tight/tight, D3 fits/fits.

## Selection

**Winner: D1 evidence-index**, on the frozen ordering and nothing else.

- **P1 Credibility is the top priority and D1 wins it outright** (4.75 vs 4.50 vs 4.25). Its
  mechanism — evidence as a required field of a typed `Claim`, with `EvidenceChip` as the only
  component permitted to print a claim's backing — is what earned it: both lenses scored M2 at
  5.0 and the credibility-skeptic verified all five README status strings hold.
- **P2 climx reuse: D1 wins again** (4.00 vs 3.50 vs 3.50), and it is the only candidate whose
  M6 count survived a hostile recount. D3's headline of 7 was recounted to 5; D2's hedged entry
  was struck.
- D3 wins P3 (presentation, 4.75) but P3 is the third priority and cannot overturn the first
  two. Its own weakest point concedes the M6 problem: three of its counted resources were
  already on disk before the design existed.

Ranking did not need the declared tie-break; D1 leads on the two highest-priority axes
directly. **Scope of the claim (AINV-11): best of the three candidates generated, against the
objective declared. No absolute-optimality claim is made.**

## Mandatory repair before implementation — the K4 hit

The budget-auditor returned `K4 NOT CLEARED` for D1, and **the supervisor re-verified it
first-hand** (SUBAGENT_DELEGATION R2 / AAP §6.1 req 4) rather than accepting the claim:

> `climx/docs/planning/MEASUREMENTS.md:73` — `| forecast 3/1 = 344 B gz | 463 B gz (≪ 200 KB,
M4) |` — a before/after pair. 344 B is the **superseded** value; the current measured
> per-municipio payload is **463 B gz**.

D1 specified printing "~350 B gzip per municipio file". That contradicts the project's own
current source and trips the quality veto, which fails a page regardless of every metric.
**Disposition: `fixed`.** The figure is struck from the page. The repair is bounded to one
string and does not touch the architecture, so it is a repair at A3 rather than a
disqualification — but it is binding, and A4 checks it.

**The structural lesson, which the synthesis adopts explicitly.** All six verdicts converged on
the same limit, in different words: _the type gate enforces the PRESENCE of an `evidence`
field, not the TRUTH of the evidence._ `tsc` cannot know that 344 B is stale. D1 caught climx's
README-vs-MEASUREMENTS test-count contradiction and missed this one in the same file. The
design is therefore adopted **with its guarantee stated honestly** — omission-proofing, not
validity-proofing — and the page will not claim otherwise. Truth of each number remains a
first-hand verification obligation at authoring time (CONDUCT §2), assisted by, not replaced
by, the toolchain.

## Grafts from the losing candidates (salvage-not-discard)

From **D3** (all present in D3's own submission, per the salvage rule):

- **G1** — `content.test.ts` **computes and prints** the claims-with-evidence / total fraction
  rather than asserting coverage in prose, so M1 arrives as a number read off a run.
- **G2** — the status goes **inside the `<h3>` beside the project name**, not in a badge or a
  footer, so it cannot be skipped while reading the name. Directly answers M2's "five equal
  polished tiles score 0".
- **G3** — `onError` hides the **whole `<figure>`**, image and caption together: an orphan
  caption describing an image the reader cannot see is a false assertion, i.e. an M1 defect
  rather than a cosmetic one. Strictly sharper than the donor's `display:none` on the `<img>`.
- **G4** — the status literal is **frozen in a test** against its README, so README drift breaks
  CI. Converts M2 from a one-time diff into a regression gate — the only mechanism that keeps
  M2 true after the page ships.
- **G5** — each in-column figure is wrapped in an `<a>` to the full-resolution PNG, and the
  `figcaption` restates the diagram's content in Spanish. Verified necessary first-hand: the
  multi-GPU diagram is 2063×507 and its box labels are unreadable at a ~44rem measure.
- **G6** — `assetUrl(path)` with a test asserting the `BASE_URL` prefix **and rejecting a
  leading slash** — the host-path failure that works in dev and 404s in production.
- **G7** — MEASUREMENTS.md's governing rule adopted for the page's own figures: _no entry, no
  claim_ — every number with its date and instrument.

From **D2**:

- **G8** — a «Límites declarados» block per project, quoting that project's **own** README
  warnings. This is what makes M2/K4 hard to fail independently of any type machinery.
- **G9** — **repo-root links only**, no deep blob URLs, shrinking the quality veto's
  "every link resolves" surface from ~20 URLs to the 7 already verified 200 by the supervisor.
- **G10** — keep the malformed-percent-escape regression verbatim when porting `router.test.tsx`
  (`/x/%E0%A4%A` must not throw) — it guards a real defect climx hit in production.
- **G11** — **PrimitivesLab is demoted** from its own `/lab` route to nothing at all here; the
  route budget is spent on evidence, not on a styleguide for a token set this page barely grows.

## Supervisor decision on D1's declared weakest point

D1 named it honestly: _ordering by provability is not ordering by relevance_, and its index
would lead with climx and PHarvard while the two projects a systems engineer finds most
interesting (PhyriadFG, Phyriager) sit last. For the frozen workload — an engineer screening
for a **remote systems role** (O1) — that optimizes the wrong axis.

**The order is not a frozen metric.** M1 measures coverage and M2 measures status honesty;
neither constrains sequence. So the graft is: **keep D1's evidence mechanism, order by
relevance to the named reader.** Adopted order and its declared reason:

1. **PhyriadFG** — the deepest systems work (multi-GPU, real-time, Vulkan/CUDA) and it owns the
   two strongest artifacts on disk.
2. **Phyriager** — the most distinctive (embodied LLM agent, C++ brain ↔ JNI ↔ shared memory)
   and it has a real annotated frame.
3. **PHarvard** — the most independently checkable (vendor-toolchain numbers, verified on
   silicon). Its evidence is the strongest on the page and it anchors the fundamentals.
4. **Phynned** — measurement discipline (A/B/A/B/A), but its own README calls its dataset
   provisional; that is rendered, not hidden.
5. **climx** — last by relevance to a systems role, first by checkability: it is the only one
   the reader can open and use immediately, and it is what this very page is built from.

Every card carries its evidence chip, so a reader sees at a glance which claims are checkable
regardless of position — the credibility mechanism is preserved intact while the ordering
defect is repaired.

## The second weakest point, unrepaired and declared

The credibility-skeptic's finding stands and the supervisor's own blind-spot filter reached it
independently: **the honest competitor — a well-written GitHub profile README — is never
confronted.** It lives where the reader already is, is self-verifying by construction, and
costs zero routes and no deploy. This page's one structural advantage over it is real (a typed
ledger with a test suite that fails when an assertion loses its backing), but the comparison is
not something the design wins by default. **Disposition: `deferred` — surfaced to the operator
as a recommendation to write the profile README too, not as a blocker for this page.** It is
recorded here rather than quietly dropped.

## Explicitly NOT built (scope discipline)

- No `/lab` styleguide route (G11). No `CreditsPage`-style `<details>` ledger beyond `/evidencia`.
- No climx data layer, geo layer, `SearchCombobox`, or weather components — DROPPED by the
  objective; no consumer here.
- No state photographs — FORBIDDEN by the objective on provenance and subject-matter grounds.
- No invented imagery: no operator photo, no logos, no fabricated screenshots (K1). Phynned and
  PHarvard will have **no figure**, and the layout must read as deliberate rather than broken.
- No Lighthouse figures from climx: measured against the pre-rename `project-tw` URL, and E5 has
  no Lighthouse to re-run them with.
- No undated "41 tests" for climx: its README says 41 while MEASUREMENTS.md records 41/41,
  50/50 and 51/51 on three dates. Either one contradicts a source.

## Open questions for the operator (not decidable by the search)

1. **Deployment target.** `vite.config.ts` assumes `/portfolio/`; M6 is scored against GitHub
   Pages at a project path. Whether this becomes `swately.github.io/portfolio/` or the root
   site is the operator's call, and it is the one decision the 404 shim's base string depends on.
2. **The linking plan.** Blind-spot flag F5: the page is only read if GitHub/LinkedIn/the CV
   point at it.
3. **The missing captures.** A screenshot of climx live, of Phynned's UI, and of PHarvard's
   four-digit display would each close a declared content gap. They are capturable by the
   operator in minutes; nothing in this design fabricates them in the meantime.
