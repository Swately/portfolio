import { Stack, Text } from '../phyriad-react';
import Chart from '../components/charts/Chart';
import type { ChartData } from '../components/charts/chartMath';
import ComparisonMatrix from '../components/ComparisonMatrix';
import { KeyFigures, type KeyFigureData } from '../components/KeyFigure';

/**
 * DEVELOPMENT ONLY (route `/figuras`, dropped from the production bundle with the lab). The exhibit for
 * the figure and chart components: every chart kind, the approach matrix and the headline figures, in
 * the shape the project sessions will hand over. EVERY NUMBER HERE IS INVENTED, said in each title and
 * instrument: this page exists to be measured in both colour schemes, never to be read as a result.
 */
const base = {
  schema: 'phyriad-chart/1' as const,
  instrument: 'EJEMPLO: cifras inventadas para ejercitar el componente',
  source: { label: 'figure-contract/README.md', url: 'https://example.invalid/figure-contract' },
};

const bar: ChartData = {
  ...base,
  id: 'ejemplo-barra',
  title: 'EJEMPLO: tiempo por etapa (cifras inventadas)',
  takeaway: 'Ejemplo de barra: el flujo óptico es la etapa más cara de las cuatro.',
  kind: 'bar',
  unit: 'ms',
  series: [
    {
      name: 'tiempo',
      emphasis: true,
      points: [
        { x: 'captura', y: 1.2 },
        { x: 'flujo óptico', y: 2.1 },
        { x: 'warp', y: 0.8 },
        { x: 'presentación', y: 0.6 },
      ],
    },
  ],
};

const line: ChartData = {
  ...base,
  id: 'ejemplo-linea',
  title: 'EJEMPLO: coste por resolución (cifras inventadas)',
  takeaway: 'Ejemplo de línea: el método propio crece más despacio que las dos alternativas.',
  kind: 'line',
  unit: 'ms',
  xLabel: 'resolución',
  series: [
    {
      name: 'método propio',
      emphasis: true,
      points: [
        { x: '720p', y: 1.1 },
        { x: '1080p', y: 2.1 },
        { x: '1440p', y: 3.4 },
        { x: '2160p', y: 7.2 },
      ],
    },
    {
      name: 'alternativa A',
      points: [
        { x: '720p', y: 1.4 },
        { x: '1080p', y: 3.0 },
        { x: '1440p', y: 5.6 },
        { x: '2160p', y: 12.1 },
      ],
    },
    {
      name: 'alternativa B',
      points: [
        { x: '720p', y: 1.9 },
        { x: '1080p', y: 3.9 },
        { x: '1440p', y: 6.5 },
        { x: '2160p', y: 11.4 },
      ],
    },
  ],
};

const range: ChartData = {
  ...base,
  id: 'ejemplo-rango',
  title: 'EJEMPLO: error con dispersión entre dos corridas (cifras inventadas)',
  takeaway:
    'Ejemplo de rango: el error baja con k y las dos corridas coinciden dentro del intervalo.',
  kind: 'range',
  unit: 'px',
  series: [
    {
      name: 'método',
      emphasis: true,
      points: [
        { x: 'k=2', y: 0.31, lo: 0.29, hi: 0.33, n: 2 },
        { x: 'k=4', y: 0.22, lo: 0.21, hi: 0.23, n: 2 },
        { x: 'k=8', y: 0.17, lo: 0.15, hi: 0.2, n: 2 },
      ],
    },
  ],
  runs: [
    { id: 'r1', file: 'ejemplo/r1.csv' },
    { id: 'r2', file: 'ejemplo/r2.csv' },
  ],
};

const slope: ChartData = {
  ...base,
  id: 'ejemplo-pendiente',
  title: 'EJEMPLO: antes y después del cambio (cifras inventadas)',
  takeaway: 'Ejemplo de pendiente: tres de los cuatro casos mejoran y uno empeora.',
  kind: 'slope',
  unit: 'ms',
  series: [
    {
      name: 'caso 1',
      emphasis: true,
      points: [
        { x: 'antes', y: 8.4 },
        { x: 'después', y: 5.1 },
      ],
    },
    {
      name: 'caso 2',
      points: [
        { x: 'antes', y: 6.2 },
        { x: 'después', y: 4.8 },
      ],
    },
    {
      name: 'caso 3',
      points: [
        { x: 'antes', y: 4.0 },
        { x: 'después', y: 3.1 },
      ],
    },
    {
      name: 'caso 4',
      points: [
        { x: 'antes', y: 2.2 },
        { x: 'después', y: 2.9 },
      ],
    },
  ],
};

const stack: ChartData = {
  ...base,
  id: 'ejemplo-pila',
  title: 'EJEMPLO: presupuesto de un cuadro (cifras inventadas)',
  takeaway: 'Ejemplo de pila: el flujo óptico consume la mitad del presupuesto de un cuadro.',
  kind: 'stack',
  unit: 'ms',
  series: [
    {
      name: 'captura',
      points: [
        { x: 'cuadro medio', y: 1.2 },
        { x: 'cuadro pesado', y: 1.5 },
      ],
    },
    {
      name: 'flujo óptico',
      emphasis: true,
      points: [
        { x: 'cuadro medio', y: 2.1 },
        { x: 'cuadro pesado', y: 3.4 },
      ],
    },
    {
      name: 'warp',
      points: [
        { x: 'cuadro medio', y: 0.8 },
        { x: 'cuadro pesado', y: 1.1 },
      ],
    },
    {
      name: 'presentación',
      points: [
        { x: 'cuadro medio', y: 0.6 },
        { x: 'cuadro pesado', y: 0.7 },
      ],
    },
  ],
};

const scatter: ChartData = {
  ...base,
  id: 'ejemplo-dispersion',
  title: 'EJEMPLO: calidad frente a coste (cifras inventadas)',
  takeaway: 'Ejemplo de dispersión: más coste no compró más calidad pasado cierto punto.',
  kind: 'scatter',
  unit: 'ms',
  xLabel: 'coste (ms)',
  yLabel: 'calidad (puntos)',
  series: [
    {
      name: 'configuraciones',
      emphasis: true,
      points: [
        { x: 1.2, y: 61, label: 'rápida' },
        { x: 2.1, y: 78, label: 'por defecto' },
        { x: 3.4, y: 84, label: 'alta' },
        { x: 5.8, y: 85, label: 'máxima' },
      ],
    },
  ],
};

export const LAB_CHARTS: ChartData[] = [bar, line, range, slope, stack, scatter];

const keyFigures: KeyFigureData[] = [
  {
    index: 0,
    claim: {
      text: 'EJEMPLO: una cifra clave con su instrumento.',
      evidence: {
        kind: 'number',
        value: '2,1 ms',
        instrument: 'EJEMPLO: cifra inventada',
        source: 'figure-contract',
        url: 'https://example.invalid/a',
      },
    },
    evidence: {
      kind: 'number',
      value: '2,1 ms',
      instrument: 'EJEMPLO: cifra inventada',
      source: 'figure-contract',
      url: 'https://example.invalid/a',
    },
  },
  {
    index: 1,
    claim: {
      text: 'EJEMPLO: una segunda cifra, con un valor más largo que se parte en dos líneas.',
      evidence: {
        kind: 'number',
        value: '1,409 LUT4 de 6,864 (21 %); 625 registros (9 %)',
        instrument: 'EJEMPLO: cifra inventada',
        source: 'figure-contract',
        url: 'https://example.invalid/b',
      },
    },
    evidence: {
      kind: 'number',
      value: '1,409 LUT4 de 6,864 (21 %); 625 registros (9 %)',
      instrument: 'EJEMPLO: cifra inventada',
      source: 'figure-contract',
      url: 'https://example.invalid/b',
    },
  },
  {
    index: 2,
    claim: {
      text: 'EJEMPLO: una tercera cifra.',
      evidence: {
        kind: 'number',
        value: '49 pruebas',
        instrument: 'EJEMPLO: cifra inventada',
        source: 'figure-contract',
        url: 'https://example.invalid/c',
      },
    },
    evidence: {
      kind: 'number',
      value: '49 pruebas',
      instrument: 'EJEMPLO: cifra inventada',
      source: 'figure-contract',
      url: 'https://example.invalid/c',
    },
  },
];

export default function FiguresLab() {
  return (
    <>
      <title>Figuras (laboratorio) — Eduardo Ramos Mendoza</title>
      <Stack as="header" gap="xs">
        <Text as="h1" size="xl">
          Figuras y gráficas, en ejercicio
        </Text>
        <Text muted>
          Solo desarrollo. Todas las cifras de esta página son inventadas: sirve para medir los
          componentes en los dos temas, no para leerse como un resultado.
        </Text>
      </Stack>

      <Stack as="section" gap="s" aria-labelledby="lab-cifras-h">
        <Text as="h2" size="sm" mono muted id="lab-cifras-h">
          Cifras clave
        </Text>
        <KeyFigures items={keyFigures} />
      </Stack>

      {/* inside a section, like on a project page: a direct child of the grid would take the centred-mode cap */}
      <Stack as="section" gap="l" aria-labelledby="lab-graficas-h">
        <Text as="h2" size="sm" mono muted id="lab-graficas-h">
          Gráficas
        </Text>
        {LAB_CHARTS.map((c) => (
          <Chart key={c.id} chart={c} />
        ))}
      </Stack>

      <Stack as="section" gap="s" aria-labelledby="lab-matriz-h">
        <Text as="h2" size="sm" mono muted id="lab-matriz-h">
          Matriz de enfoque
        </Text>
        <ComparisonMatrix
          caption="EJEMPLO: matriz de enfoque (sin cifras inventadas como si fueran medidas)"
          options={['Método propio', 'Alternativa A', 'Alternativa B']}
          rows={[
            {
              attribute: 'Dónde corre',
              kind: 'enfoque',
              cells: ['fuera del juego', 'dentro del motor', 'fuera del juego'],
            },
            {
              attribute: 'Qué necesita del juego',
              kind: 'enfoque',
              cells: ['solo la imagen', 'vectores de movimiento y profundidad', 'solo la imagen'],
            },
            {
              attribute: 'Latencia añadida',
              kind: 'declarado',
              cells: ['declarada por el proyecto', 'declarada por el fabricante', null],
            },
            {
              attribute: 'Error de interpolación',
              kind: 'medido',
              cells: ['0,22 px (EJEMPLO)', null, '0,41 px (EJEMPLO)'],
            },
          ]}
        />
      </Stack>
    </>
  );
}

// Made with my soul - Swately <3
