import { Text } from '../../phyriad-react';
import type { Project } from '../../content';
import { chartCount, loadCharts } from '../../lib/charts';
import { useLoaded } from '../../lib/useLoaded';
import { Pending } from '../ProjectShell';
import Chart from './Chart';

/**
 * The "Visualizaciones" section's body: the project's charts, or a visibly provisional line. The files are
 * loaded on demand (see lib/charts.ts); the section knows synchronously whether the project has any.
 */
export default function ProjectCharts({ project }: { project: Project }) {
  const n = chartCount(project.slug);
  const charts = useLoaded(project.slug, () => loadCharts(project.slug));
  if (n === 0) {
    return <Pending what={`las gráficas de los datos de ${project.name}, cada una con su tabla`} />;
  }
  if (!charts) {
    return (
      <Text size="sm" muted role="status">
        Cargando {n} {n === 1 ? 'gráfica' : 'gráficas'}…
      </Text>
    );
  }
  return (
    <>
      {charts.map((c) => (
        <Chart key={c.id} chart={c} />
      ))}
    </>
  );
}

// Made with my soul - Swately <3
