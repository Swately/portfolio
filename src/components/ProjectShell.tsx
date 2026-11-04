import type { ReactNode } from 'react';
import { Disclosure, Link, Stack, Text } from '../phyriad-react';
import type { Claim, FigureEvidence, Project } from '../content';
import EvidenceChip from './EvidenceChip';
import Figure from './Figure';
import { KeyFigures, keyFiguresOf } from './KeyFigure';
import SectionNav from './SectionNav';
import SectionSpine from './SectionSpine';
import { PENDING_YEAR } from './ProjectEntry';
import styles from './ProjectShell.module.css';

/**
 * THE FORMAT of a project page — the blank shell every project page is written on (operator, 2026-09-02:
 * one unique page per project, the shell as the template). It owns what is the same on every dossier: the
 * way back, the header (name, verbatim status, years, summary, repository), the document title, the
 * ONE-SCREEN "En breve" (headline figures, the hero diagram, the signposts), and the closing "Verificación"
 * note. Everything between is the page's own, written as `ProjectSection`s in the order of
 * `DEFAULT_SECTIONS`: mechanism before claims (concept §4.3, decision D1).
 *
 * The header and "En breve" read from the content ledger (`Project`), so a page cannot restate a status, a
 * figure or a claim the tests do not freeze. A figure is rendered ONCE: the first one is the hero of
 * "En breve", the rest belong to "Cómo funciona", and the claims list links to them by anchor.
 *
 * Direction E (VISUAL_LANGUAGE_CONCEPT.md, D-27/D-29): everything after the header sits in one grid cell
 * with the `SectionSpine`, which hangs in the left margin on wide screens and replaces the static
 * signposts there.
 */

/** The sections of a project page, in order, with their ids and titles. The ids are the anchors. */
export const SECTIONS = {
  resumen: 'En breve',
  contexto: 'Contexto y problema',
  mecanismo: 'Cómo funciona',
  diseno: 'Decisiones de diseño',
  comparativa: 'Comparativa con alternativas',
  afirmaciones: 'Qué hace, y cómo se comprueba',
  datos: 'Visualizaciones',
  limites: 'Límites declarados',
  reproducir: 'Cómo reproducirlo',
  verificacion: 'Verificación',
} as const;

export type SectionId = keyof typeof SECTIONS;

/** The order a project page is written in. The shell adds "En breve" first and "Verificación" last. */
export const DEFAULT_SECTIONS: SectionId[] = [
  'contexto',
  'mecanismo',
  'diseno',
  'comparativa',
  'afirmaciones',
  'datos',
  'limites',
  'reproducir',
];

/**
 * The figures of a project in order, numbered from 1 (the anchor is "figura-N"): first the figures that are the
 * evidence of a claim, then the diagrams the project handed over to explain how it works.
 */
export function figuresOf(project: Project): { n: number; evidence: FigureEvidence }[] {
  const fromClaims = project.claims.flatMap((c) =>
    c.evidence.kind === 'figure' ? [c.evidence] : [],
  );
  return [...fromClaims, ...(project.diagrams ?? [])].map((evidence, i) => ({
    n: i + 1,
    evidence,
  }));
}

export default function ProjectShell({
  project,
  years,
  sections = DEFAULT_SECTIONS,
  children,
}: {
  project: Project;
  /** Overrides the ledger's `years`. Absent and not in the ledger: visibly pending. */
  years?: string;
  /** The sections the page writes, in order: the signposts in "En breve" link to them. */
  sections?: SectionId[];
  children: ReactNode;
}) {
  const keyFigures = keyFiguresOf(project, 3);
  const hero = figuresOf(project)[0];
  const nav = [...sections, 'verificacion' as const].map((id) => ({ id, title: SECTIONS[id] }));
  return (
    <>
      <title>{`${project.name} — Eduardo Ramos Mendoza`}</title>
      <Stack as="header" gap="xs">
        <nav aria-label="Volver">
          <Link to="/" className="phy-target skin-pill">
            ← Índice
          </Link>
        </nav>
        <Text as="h1" size="xl">
          {project.name}{' '}
          <Text as="span" size="sm" mono muted className={styles.status}>
            {project.status}
          </Text>{' '}
          <Text as="span" size="sm" muted className={styles.status}>
            ({years ?? project.years ?? PENDING_YEAR})
          </Text>
        </Text>
        <Text muted>{project.summary}</Text>
        <Text as="span" size="sm">
          <a href={project.repoUrl} className="phy-target">
            Repositorio en GitHub
          </a>
        </Text>
      </Stack>

      <div className={`phy-full ${styles.spined}`}>
        <SectionSpine items={[{ id: 'resumen', title: SECTIONS.resumen }, ...nav]} />
        <div className={styles.body}>
          <ProjectSection id="resumen">
            {keyFigures.length > 0 ? (
              <KeyFigures items={keyFigures} />
            ) : (
              <Pending what="dos o tres cifras clave del proyecto, cada una con su instrumento y su fuente" />
            )}
            {hero && <Figure figure={hero.evidence} priority id={`figura-${hero.n}`} />}
            <div className={styles.topNav}>
              <SectionNav items={nav} />
            </div>
          </ProjectSection>

          {children}

          <Stack as="section" gap="xs" aria-labelledby="verificacion-h">
            <Text as="h2" size="sm" mono muted id="verificacion-h">
              {SECTIONS.verificacion}
            </Text>
            <Disclosure summary="Cómo se congela el estado de este proyecto">
              <Text size="sm" muted>
                El estado «{project.status}» está copiado literalmente de {project.statusSource} y
                congelado en una prueba: si alguien lo cambia aquí sin más, la integración continua
                falla. Comprobar que ese archivo <em>sigue</em> diciendo eso es trabajo humano, y se
                hizo a mano el {project.statusChecked ?? '27 de agosto de 2026'}.
              </Text>
            </Disclosure>
          </Stack>
        </div>
      </div>
    </>
  );
}

/** One section of a project page: a mono muted heading with its id, then whatever the page says. */
export function ProjectSection({
  id,
  title,
  children,
}: {
  /** The heading's id — the anchor a signpost or a link can target. */
  id: SectionId | (string & {});
  /** Defaults to the title of the standard section with this id. */
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Stack as="section" gap="s" aria-labelledby={`${id}-h`}>
      <Text as="h2" size="sm" mono muted id={`${id}-h`}>
        {title ?? SECTIONS[id as SectionId] ?? id}
      </Text>
      {children}
    </Stack>
  );
}

/** A visibly provisional paragraph: the section exists, its text does not yet. */
export function Pending({ what }: { what: string }) {
  return (
    <Text size="sm" muted>
      [Pendiente: {what}. Esta sección tiene su lugar en la página y se escribirá con el contenido
      del proyecto.]
    </Text>
  );
}

/**
 * The figures of a project from the ledger, after the hero: each rendered once, with its anchor
 * (`figura-N`), its caption and its text equivalent. Used by "Cómo funciona".
 */
export function ProjectFigures({ project, skip = 1 }: { project: Project; skip?: number }) {
  const rest = figuresOf(project).slice(skip);
  if (rest.length === 0) return null;
  return (
    <>
      {rest.map((f) => (
        <Figure key={f.n} figure={f.evidence} id={`figura-${f.n}`} />
      ))}
    </>
  );
}

/**
 * The claims of a project from the ledger, as an ordered list with an anchor per claim
 * (#afirmacion-N), each with its evidence chip. A figure claim links to its figure (it is shown in
 * "En breve" or "Cómo funciona", not repeated here).
 */
export function ClaimsList({ claims }: { claims: Claim[] }) {
  let figureNumber = 0;
  return (
    <ol className={styles.claims}>
      {claims.map((claim, i) => {
        const n = claim.evidence.kind === 'figure' ? ++figureNumber : 0;
        return (
          <Stack as="li" gap="xs" key={i} id={`afirmacion-${i + 1}`} className={styles.claim}>
            <Text>{claim.text}</Text>
            <EvidenceChip evidence={claim.evidence} />
            {n > 0 && (
              <Text as="span" size="sm">
                <a href={`#figura-${n}`} className="phy-target">
                  Ver la figura {n}
                </a>
              </Text>
            )}
          </Stack>
        );
      })}
    </ol>
  );
}

/** The project's own declared limits, quoted rather than composed. */
export function LimitsList({ limits }: { limits: string[] }) {
  return (
    <Stack as="ul" gap="xs">
      {limits.map((limit, i) => (
        <Text as="li" size="sm" key={i} className={styles.limit}>
          {limit}
        </Text>
      ))}
    </Stack>
  );
}

// Made with my soul - Swately <3
