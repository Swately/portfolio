import type { ReactNode } from 'react';
import { Stack, Text } from '../phyriad-react';
import styles from './Decision.module.css';

/**
 * One design decision, in the shape the concept asks for (CONTENT_PRESENTATION_CONCEPT §4.3): what was chosen,
 * what was rejected and why, and what it cost, with its sources. Each decision names what it gave up, because
 * the reader of a technical portfolio looks for the constraint beside the result (NN/g).
 *
 * Sources split in two on purpose: a LINK is something a reader can open; a plain line is a record of the
 * project that is not published, and says so ("no publicado") instead of pretending to be checkable.
 * `lang` marks the title and the body (not the Spanish labels) when they are the project's own words in another
 * language than the page's.
 */
export type DecisionSource = { text: string; href?: string };

export default function Decision({
  id,
  title,
  decision,
  discarded,
  cost,
  sources,
  lang,
}: {
  id?: string;
  title: ReactNode;
  /** What was chosen. */
  decision: ReactNode;
  /** What was rejected, each with the reason. */
  discarded?: ReactNode[];
  /** What the choice cost, or the limit it keeps. */
  cost?: ReactNode;
  sources?: DecisionSource[];
  lang?: string;
}) {
  return (
    <Stack as="article" gap="xs" id={id} className={styles.decision}>
      <Text as="h3" size="md" lang={lang}>
        {title}
      </Text>
      <Text size="sm">
        <strong>Decisión.</strong> <span lang={lang}>{decision}</span>
      </Text>
      {discarded && discarded.length > 0 && (
        <div>
          <Text size="sm">
            <strong>Descartado.</strong>
          </Text>
          <ul className={styles.list}>
            {discarded.map((d, i) => (
              <li key={i}>
                <Text as="span" size="sm" lang={lang}>
                  {d}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cost && (
        <Text size="sm">
          <strong>Coste aceptado.</strong> <span lang={lang}>{cost}</span>
        </Text>
      )}
      {sources && sources.length > 0 && (
        <Text size="xs" muted>
          Fuentes:{' '}
          {sources.map((s, i) => (
            <span key={i}>
              {i > 0 && ' · '}
              {s.href ? <a href={s.href}>{s.text}</a> : s.text}
            </span>
          ))}
        </Text>
      )}
    </Stack>
  );
}

// Made with my soul - Swately <3
