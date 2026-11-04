import { Prose, Text } from '../../phyriad-react';
import ProjectShell, {
  ClaimsList,
  LimitsList,
  ProjectFigures,
  ProjectSection,
} from '../../components/ProjectShell';
import ProjectCharts from '../../components/charts/ProjectCharts';
import ProjectComparison from '../../components/ProjectComparison';
import Decision from '../../components/Decision';
import CodeBlock from '../../components/CodeBlock';
import { projects } from '../../content';

/**
 * Phynned's own page. Written on the shell in the order of design v3 (mechanism before claims). The header,
 * "En breve", the claims and the limits come from the ledger; the prose below is adapted from the project's own
 * dossier (Phynned/docs/PORTFOLIO_DOSSIER.md, 2026-10-09 and 2026-10-10) with the operator's authorisation of
 * 2026-10-14. The dossier is in ENGLISH and its translation did not arrive (the Phynned session is gone), so the
 * project's own words are kept as they are and MARKED `lang="en"`: translation is pending, said on the page.
 * The dossier speaks in the first person of its author; here that becomes the passive ("observed", "not verified").
 */
const project = projects.find((p) => p.slug === 'phynned')!;
const REPO = 'https://github.com/Swately/Phynned/blob/main/';

export default function PhynnedPage() {
  return (
    <ProjectShell project={project}>
      <ProjectSection id="contexto">
        <Text size="sm" muted>
          Texto del proyecto en inglés, tal cual: su traducción al español está pendiente.
        </Text>
        <Prose lang="en">
          <p>
            Some modern CPUs are not uniform. A Ryzen 9 7950X3D has two chiplets: one carries a very
            large extra cache (96 MB) and runs at a lower clock, the other has less cache (32 MB)
            and boosts higher. Intel hybrid parts mix fast and efficient cores. The operating
            system&apos;s scheduler does not know which of those a given program prefers, and a
            program that hops between the two groups pays for it in cache misses. A game that is
            limited by memory latency wants the big cache; a compiler or encoder may want the faster
            clock; background noise wants neither.
          </p>
          <p>
            Phynned runs as an administrator-level agent that watches every process, decides which
            core group each should use, applies it with ordinary Win32 calls (no driver, no
            injection, no reading of game memory), and undoes it when it is wrong. Its design
            priority is the opposite of a &quot;tweak tool&quot;: <strong>safety first</strong>{' '}
            (never break a game or trip an anti-cheat), then efficacy, then the agent&apos;s own
            cost. The premise that the core group matters on this hardware was measured once on the
            operator&apos;s own machine (see the two charts below), not assumed.
          </p>
          <p>
            Timeline: the oldest dated implementation notes are from 2026-05-14 (it was born as{' '}
            <em>Ayama</em> inside the Phyriad container); the project has its own repository since
            2026-07-16 and was renamed Phynned that day. The last commit is from 2026-07-21. No
            statement of &quot;active&quot; or &quot;paused&quot; exists in the repository, and none
            is inferred here.
          </p>
        </Prose>
      </ProjectSection>

      <ProjectSection id="mecanismo">
        <Text size="sm">
          Dos diagramas: la arquitectura, tres programas alrededor de un bucle (observar,
          clasificar, admitir, decidir, actuar) con un diario, un guardián de reversión y un
          programa de rescate; y la ruta de decisión de ocho preguntas, donde un «sí» en cualquiera
          deja el proceso sin tocar.
        </Text>
        <ProjectFigures project={project} />
      </ProjectSection>

      <ProjectSection id="diseno">
        <Text size="sm" muted>
          Texto del proyecto en inglés, tal cual: su traducción al español está pendiente. Cada
          decisión dice qué descartó y por qué, con su fuente.
        </Text>

        <Decision
          lang="en"
          title="1. Record first, then touch; plus a separate rescue program"
          decision={
            <>
              The previous mask is written to disk before the change, and{' '}
              <code>phynned-revert</code> restores it after a kill.
            </>
          }
          discarded={[
            <>
              <strong>Relying on the agent undoing its own changes when it exits.</strong> The
              objective says &quot;affinity persists after setter death, so RAII revert is
              insufficient by [V1] evidence&quot; (M1b).
            </>,
          ]}
          cost={
            <>
              The old &quot;revert to all cores&quot; was kept for a while because &quot;a prior
              crashed instance leaves a residual narrow mask that a naive captured-prev revert would
              restore as &apos;default&apos;, drifting narrower each crash cycle&quot; (risk
              register, DR1), so the journal had to land before the new revert behaviour.
            </>
          }
          sources={[
            {
              text: 'PHYNNED_MASS_ROUTER_OBJECTIVE.md, M1b',
              href: `${REPO}docs/plans/PHYNNED_MASS_ROUTER_OBJECTIVE.md`,
            },
          ]}
        />

        <Decision
          lang="en"
          title="2. Default-deny: nothing is touched unless positively admitted"
          decision={
            <>
              The denylist runs before any <code>OpenProcess</code>, so a protected process never
              receives a handle. The decision-path figure shows the gate chain; it condenses master
              plan §2 and the use-modes precedence, and is not a code trace.
            </>
          }
          discarded={[
            <>
              <strong>&quot;Touch everything except a list of exceptions.&quot;</strong> Master plan
              §2: &quot;never &apos;touch everything except exceptions&apos;&quot;.
            </>,
          ]}
        />

        <Decision
          lang="en"
          title="3. Judge by cycles per unit of work, not by wall time"
          decision={
            <>
              The arbiter measures with <code>QueryProcessCycleTime</code> (ON_BOX_FACTS §4).{' '}
              <strong>Status: the arbiter is designed (MR-3), not built.</strong> The decision is
              real; the mechanism is not shipping.
            </>
          }
          discarded={[
            <>
              <strong>Wall-clock latency or FPS as the arbiter.</strong> The first per-CCD attempt
              gave &quot;13.0–18.2 ns/hop on one and 16.3–43.0 ns/hop on the other — variance larger
              than any CCD signal&quot;; the file concludes &quot;wall-time is the wrong
              instrument&quot; because boost clocks confound it.
            </>,
          ]}
        />

        <Decision
          lang="en"
          title="4. Detect anti-cheat per title and per running service, not by “any anti-cheat driver installed”"
          decision={
            <>
              Detection is per title and per running service. The 0.2.2 incident showed that even
              correct detection is not enough, because handle <em>volume</em> matters, which
              produced AC-quiet mode.
            </>
          }
          discarded={[
            <>
              <strong>A box-wide driver fold.</strong> After measuring on the box, the register
              records it as the wrong gate because Vanguard&apos;s <code>vgk</code> driver &quot;is
              always Running (boot-resident) even with no Riot game open, so driver-presence ≠
              game-protected&quot; (risk register, CR1).
            </>,
          ]}
        />

        <Decision
          lang="en"
          title="5. Advise first, act later, and make “off” mean “undo”"
          decision={
            <>
              A shadow router (advice only) came first, then the corral in dry-run, then a live
              switch. Switching the corral off <em>reverts</em> its pins: &quot;corral switch-off
              must REVERT by default, with an option for the old stop-only behavior&quot; (use-modes
              plan). Precedence is frozen: safety, then the user&apos;s &quot;never&quot;, then the
              user&apos;s &quot;always&quot;, then automatic.
            </>
          }
          discarded={[<>Shipping placement on by default.</>]}
        />
      </ProjectSection>

      <ProjectSection id="comparativa">
        <ProjectComparison project={project} />
        <Prose lang="en">
          <p>
            Honest reading: the frozen objective claims &quot;nobody on Windows routes by{' '}
            <em>measured</em> per-process cache benefit, and nobody publishes per-app A/B
            evidence&quot;. That is the project&apos;s own statement; none of the four pages read
            describes such a measurement, but the field was not surveyed. Phynned&apos;s measurement
            arbiter is exactly the part that is designed and not built. The differentiator available
            today is the safety design and the honesty of the record.
          </p>
        </Prose>
      </ProjectSection>

      <ProjectSection id="afirmaciones">
        <ClaimsList claims={project.claims} />
      </ProjectSection>

      <ProjectSection id="datos">
        <ProjectCharts project={project} />
      </ProjectSection>

      <ProjectSection id="limites">
        <LimitsList limits={project.limits} />
      </ProjectSection>

      <ProjectSection id="reproducir">
        <Text size="sm" muted>
          Texto del proyecto en inglés, tal cual: su traducción al español está pendiente.
        </Text>
        <Prose lang="en">
          <p>
            <strong>Hardware and OS.</strong> Windows 11 and an administrator account. Any CPU
            builds and runs the unit tests; the V-Cache behaviour needs a dual-CCD X3D part
            (7900X3D, 7950X3D or 9950X3D). The project&apos;s own numbers are from a 7950X3D with an
            RTX 4090.
          </p>
          <CodeBlock label="Commands to build and test Phynned">{`git clone https://github.com/Swately/Phynned
cd Phynned
# MinGW is the documented compiler; a bare cmake on a machine with Visual Studio picks MSVC and fails
CC=gcc CXX=g++ cmake -S . -B build -G Ninja -DPHYNNED_BUILD_TESTS=ON
cmake --build build --parallel
ctest --test-dir build --output-on-failure`}</CodeBlock>
          <p>
            The first configure downloads GLFW and ImGui (network once). Observed on 2026-10-09 in a
            non-elevated shell: <code>96% tests passed, 2 tests failed out of 56</code>. Running the
            agent printed <code>Phynned Agent v0.2.2-experimental</code> and{' '}
            <code>[Phynned] WARNING: Not admin. ETW and affinity operations disabled.</code> The two
            failures are
            <code> ac_driver_oracle_test</code> and <code>agent_idle_budget_test</code>; their cause
            is not established.
          </p>
          <p>
            <strong>
              Pending runs, not executed for this page (each needs the operator&apos;s machine):
            </strong>{' '}
            the suite from an elevated shell, to decide whether the two failures are an elevation
            effect; using the program (<code>build\phynned-dist\phynned-ui.exe</code>, accepting UAC
            and the anti-cheat notice, and reading <code>[OK] Agent: live</code> in the status bar);
            an A/B baseline against treated capture with <code>phynned-bench</code>, each run twice
            with the correlation between runs reported; and a clean re-run of the 14-game catalog,
            which would lift that claim out of <em>provisional</em>.
          </p>
        </Prose>
      </ProjectSection>
    </ProjectShell>
  );
}

// Made with my soul - Swately <3
