import { useState } from 'react';
import { Link, Text } from '../phyriad-react';
import type { FigureEvidence, Project } from '../content';
import { assetUrl } from '../lib/assets';
import EvidenceChip from './EvidenceChip';
import styles from './ProjectEntry.module.css';

/**
 * One entry of the list that IS the site: name (a link to the dossier) with
 * the verbatim status and the years beside it, the one-sentence summary, the
 * lead evidence chip, and the way in. No card, no surface, no rule: rhythm by
 * space only. The years are content the ledger does not carry yet, so they
 * read "(año pendiente)" — visibly provisional — until the operator gives them.
 */
export const PENDING_YEAR = 'año pendiente';

/** The figure a project's page opens with: the first figure that is a claim's evidence, else its first diagram. */
export function plateOf(project: Project): FigureEvidence | undefined {
  for (const c of project.claims) if (c.evidence.kind === 'figure') return c.evidence;
  return project.diagrams?.[0];
}

/**
 * Direction B of VISUAL_LANGUAGE_CONCEPT.md ("the shelf", D-27/D-28): the project's opening figure, shown on
 * the home entry as a plate under the text. It supplies the only colour in the list. It is a preview, so it
 * is exempt from `Figure`'s natural-width floor (D-28, this plate only): it fits the column and never
 * scrolls; the same figure at a readable size is one link away, in the dossier. Its alt is still the real
 * description, and a failed load removes it instead of leaving an empty frame.
 */
function Plate({ figure }: { figure: FigureEvidence }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className={`${styles.plate} skin-cover${figure.plate ? ` ${styles.light}` : ''}`}>
      <img
        src={assetUrl(figure.file)}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        className={styles.plateImg}
        style={{ maxInlineSize: `${figure.width}px` }}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function ProjectEntry({ project }: { project: Project }) {
  const lead = project.claims[0];
  // D9 (concept §4.2): when the lead evidence is not a measurement, the first measured number still gets a
  // line of its own on the home entry. It is the same Evidence row the dossier shows: no new data.
  const headline = project.claims.find((c) => c.evidence.kind === 'number');
  const plate = plateOf(project);
  return (
    <li className={`${styles.entry} skin-card`}>
      {/* The showcase skin's typographic cover for a project with no figure (SHOWCASE_SKIN_SPEC §5): hidden
          unless the skin is on, and a duplicate of the heading, so it is kept from assistive tech. */}
      {!plate && (
        <div className="skin-typecover" aria-hidden="true">
          {project.name}
        </div>
      )}
      <Text as="h2" size="md">
        <Link to={`/proyecto/${project.slug}`} className={styles.name}>
          {project.name}
        </Link>{' '}
        <Text as="span" size="xs" mono muted className={styles.status}>
          {project.status}
        </Text>{' '}
        <Text as="span" size="sm" muted className={styles.years}>
          ({project.years ?? PENDING_YEAR})
        </Text>
      </Text>
      <Text size="sm">{project.summary}</Text>
      {lead && <EvidenceChip evidence={lead.evidence} />}
      {headline && headline !== lead && <EvidenceChip evidence={headline.evidence} />}
      {plate && <Plate figure={plate} />}
      <Text as="p" size="sm">
        <Link to={`/proyecto/${project.slug}`} className="phy-target">
          Leer el dossier →
        </Link>
      </Text>
    </li>
  );
}

// Made with my soul - Swately <3
