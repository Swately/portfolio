import { Text } from '../phyriad-react';
import type { Evidence } from '../content';
import styles from './EvidenceChip.module.css';

// THE single component permitted to print a claim's backing. That is deliberate:
// it makes "rendered assertion" and "evidence affordance" the same JSX node, so
// M1's enumeration unit is mechanically countable instead of a judgement call.

const LABELS: Record<Evidence['kind'], string> = {
  live: 'En vivo',
  number: 'Medido',
  figure: 'Figura',
  doc: 'Documento',
  provisional: 'Provisional',
};

export default function EvidenceChip({ evidence }: { evidence: Evidence }) {
  const label = LABELS[evidence.kind];

  if (evidence.kind === 'live') {
    return (
      <Text as="span" size="xs" mono className={styles.chip}>
        <span className={`${styles.tag} skin-tag`}>{label}</span>
        <a href={evidence.url} className="phy-target">
          {evidence.label}
        </a>
      </Text>
    );
  }

  if (evidence.kind === 'number') {
    return (
      <Text as="span" size="xs" mono className={styles.chip}>
        <span className={`${styles.tag} skin-tag`}>{label}</span>
        <span className={styles.value}>{evidence.value}</span>
        <span className={styles.detail}>
          {evidence.instrument} · <a href={evidence.url}>{evidence.source}</a>
        </span>
      </Text>
    );
  }

  if (evidence.kind === 'doc') {
    return (
      <Text as="span" size="xs" mono className={styles.chip}>
        <span className={`${styles.tag} skin-tag`}>{label}</span>
        <a href={evidence.url} className="phy-target">
          {evidence.label}
        </a>
      </Text>
    );
  }

  if (evidence.kind === 'provisional') {
    return (
      <Text
        as="span"
        size="xs"
        mono
        className={`${styles.chip} ${styles.provisional} skin-provisional`}
      >
        <span className={`${styles.tag} skin-tag`}>{label}</span>
        <span className={styles.detail}>
          {evidence.statement} <a href={evidence.url}>{evidence.source}</a>
        </span>
      </Text>
    );
  }

  // figure: the artifact itself is rendered by <Figure>; the chip names it so
  // that every claim carries a visible affordance, including this kind.
  return (
    <Text as="span" size="xs" mono className={styles.chip}>
      <span className={`${styles.tag} skin-tag`}>{label}</span>
      <span className={styles.detail}>producida por el propio proyecto</span>
    </Text>
  );
}

// Made with my soul - Swately <3
