import type { ReactNode } from 'react';
import { Table, Text } from '../phyriad-react';
import styles from './ComparisonMatrix.module.css';

/**
 * The APPROACH matrix of a comparison (concept §2.4, D6): options as columns, attributes as rows, row labels
 * on the left, every row typed. It carries what each alternative does differently and, where a number is
 * shown, says whether it was measured here, declared by the project, or is only a difference of approach.
 * MEASURED comparisons are NOT drawn here: they are their own tables or charts with a methodology, so a
 * matrix never makes a descriptive cell look measured (the ripgrep write-up keeps its pitch and its
 * benchmarks apart for the same reason).
 *
 * A missing cell is written out ("sin dato"), never left blank: a blank reads as "the same" or "zero".
 * The substrate `Table` sizes it (react 1.2.0, D-30): as wide as its columns need up to the window
 * (`width="content"`), every option the same width (`columns="even"`), and the row labels stay put while a
 * matrix wider than the window scrolls in its own region (`stickyFirst`).
 */
export type RowKind = 'medido' | 'declarado' | 'enfoque';

export type MatrixRow = {
  attribute: string;
  kind: RowKind;
  /** One entry per option, in the order of `options`; `null` = no data, and it says so. */
  cells: (ReactNode | null)[];
};

const KIND: Record<RowKind, string> = {
  medido: 'Medido',
  declarado: 'Declarado',
  enfoque: 'Enfoque',
};

export default function ComparisonMatrix({
  caption,
  options,
  rows,
  cellsLang,
}: {
  caption: ReactNode;
  /** The compared things; the project itself first. Two to six (NN/g: above five, filter instead). */
  options: string[];
  rows: MatrixRow[];
  /** Language of the cells when it is not the page's: the project's own words are kept verbatim. */
  cellsLang?: string;
}) {
  return (
    <Table caption={caption} width="content" columns="even" stickyFirst>
      <thead>
        <tr>
          <th scope="col">Atributo</th>
          <th scope="col">Tipo</th>
          {options.map((o) => (
            <th scope="col" key={o}>
              {o}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.attribute}>
            <th scope="row">{r.attribute}</th>
            <td>
              <Text
                as="span"
                size="xs"
                mono
                className={`${styles.kind} ${styles[r.kind] ?? ''} skin-tag`}
              >
                {KIND[r.kind]}
              </Text>
            </td>
            {options.map((o, i) => (
              <td key={o} lang={r.cells[i] != null ? cellsLang : undefined}>
                {r.cells[i] ?? (
                  <Text as="span" size="sm" muted>
                    sin dato
                  </Text>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

// Made with my soul - Swately <3
