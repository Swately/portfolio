import type { ReactNode } from 'react';
import { Text } from '../phyriad-react';
import type { Claim, Evidence, Project } from '../content';
import styles from './KeyFigure.module.css';

type NumberEvidence = Extract<Evidence, { kind: 'number' }>;

/**
 * A headline figure: the value, what it measures, the instrument that produced it and where it is
 * recorded. It is NEVER new data: it renders a `number` Evidence row that already sits in the claims
 * ledger, so a headline cannot drift from the evidence it summarises (concept §4.4, M1 intact).
 * When the claim has an anchor, the label links to it.
 */
export default function KeyFigure({
  evidence,
  label,
  href,
}: {
  evidence: NumberEvidence;
  /** What it measures: the claim's own text. */
  label: ReactNode;
  /** The claim's anchor (`#afirmacion-3`), so a reader can go from the figure to its proof. */
  href?: string;
}) {
  return (
    <div className={styles.figure}>
      <Text as="p" size="md" bold className={styles.value}>
        {evidence.value}
      </Text>
      <Text as="p" size="sm">
        {href ? <a href={href}>{label}</a> : label}
      </Text>
      <Text as="p" size="xs" mono muted>
        {evidence.instrument} · <a href={evidence.url}>{evidence.source}</a>
      </Text>
    </div>
  );
}

export type KeyFigureData = { claim: Claim; index: number; evidence: NumberEvidence };

/** The first `max` claims whose evidence is a measured number, with their position in the ledger. */
export function keyFiguresOf(project: Project, max = 3): KeyFigureData[] {
  const out: KeyFigureData[] = [];
  project.claims.forEach((claim, index) => {
    if (out.length < max && claim.evidence.kind === 'number') {
      out.push({ claim, index, evidence: claim.evidence });
    }
  });
  return out;
}

/** The row of headline figures: one column each when there is room, stacked when there is not. */
export function KeyFigures({ items }: { items: KeyFigureData[] }) {
  return (
    <ul className={styles.row}>
      {items.map((k) => (
        <li key={k.index} className={`${styles.item} skin-tile`}>
          <KeyFigure
            evidence={k.evidence}
            label={k.claim.text}
            href={`#afirmacion-${k.index + 1}`}
          />
        </li>
      ))}
    </ul>
  );
}

// Made with my soul - Swately <3
