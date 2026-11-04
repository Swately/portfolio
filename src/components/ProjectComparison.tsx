import { Disclosure, Text } from '../phyriad-react';
import type { Project } from '../content';
import { loadMatrices, matrixCount } from '../lib/tables';
import { useLoaded } from '../lib/useLoaded';
import ComparisonMatrix from './ComparisonMatrix';
import { Pending } from './ProjectShell';

/**
 * The "Comparativa con alternativas" section's body: the project's approach matrices, or a visibly provisional
 * line. A matrix is APPROACH only (concept §2.4, D6): measured comparisons are charts or tables with their own
 * methodology. The project's words stay in their own language (`lang` on the cells), its sources are links, and
 * the quotes it relied on sit in a disclosure directly beneath.
 */
export default function ProjectComparison({ project }: { project: Project }) {
  const n = matrixCount(project.slug);
  const matrices = useLoaded(project.slug, () => loadMatrices(project.slug));
  if (n === 0) {
    return (
      <Pending what="la comparativa con alternativas del estado del arte: una matriz de enfoque, y las mediciones aparte con su metodología" />
    );
  }
  if (!matrices) {
    return (
      <Text size="sm" muted role="status">
        Cargando la comparativa…
      </Text>
    );
  }
  return (
    <>
      {matrices.map((m) => (
        <div key={m.id}>
          {m.note && (
            <Text size="sm" muted lang={m.cellsLang}>
              {m.note}
            </Text>
          )}
          <ComparisonMatrix
            caption={m.title}
            options={m.options}
            cellsLang={m.cellsLang}
            rows={[
              ...m.rows.map((r) => ({ attribute: r.attribute, kind: r.kind, cells: r.cells })),
              ...(m.sources
                ? [
                    {
                      attribute: 'Fuentes',
                      kind: 'enfoque' as const,
                      cells: m.sources.map((list) => (
                        <ul
                          key={list.map((s) => s.href).join()}
                          style={{ margin: 0, paddingInlineStart: '1.1em' }}
                        >
                          {list.map((s) => (
                            <li key={s.href}>
                              <a href={s.href}>{s.text}</a>
                            </li>
                          ))}
                        </ul>
                      )),
                    },
                  ]
                : []),
            ]}
          />
          {m.quotes && m.quotes.some((q) => q.length > 0) && (
            <Disclosure summary="Citas de las fuentes">
              <ul>
                {m.options.map((opt, i) =>
                  (m.quotes?.[i] ?? []).map((q, j) => (
                    <li key={`${opt}-${j}`} lang={m.cellsLang}>
                      <Text as="span" size="sm">
                        <strong>{opt}:</strong> {q}
                      </Text>
                    </li>
                  )),
                )}
              </ul>
            </Disclosure>
          )}
        </div>
      ))}
    </>
  );
}

// Made with my soul - Swately <3
