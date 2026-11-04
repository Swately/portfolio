// Chart data type ("phyriad-chart/1", validated by figure-contract/validate-chart.mjs) and the small
// arithmetic the renderers share. No dependencies.

export type ChartKind = 'bar' | 'line' | 'range' | 'slope' | 'stack' | 'scatter';

export type ChartPoint = {
  x: string | number;
  y: number;
  lo?: number;
  hi?: number;
  n?: number;
  label?: string;
};

export type ChartSeries = { name: string; emphasis?: boolean; points: ChartPoint[] };

export type ChartData = {
  schema: 'phyriad-chart/1';
  id: string;
  title: string;
  takeaway: string;
  kind: ChartKind;
  unit: string;
  xLabel?: string;
  yLabel?: string;
  series: ChartSeries[];
  instrument: string;
  source: { label: string; url: string };
  runs?: { id: string; file: string }[];
  notes?: string[];
};

/** Locale-aware number, at most 3 decimals. */
export const fmt = (n: number): string => n.toLocaleString('es-MX', { maximumFractionDigits: 3 });

/** A "nice" axis: a step of 1, 2 or 5 times a power of ten, covering [min, max] with about `count` ticks. */
export function niceScale(min: number, max: number, count = 5) {
  if (!(max > min)) {
    const pad = Math.abs(min) > 0 ? Math.abs(min) * 0.1 : 1;
    min -= pad;
    max += pad;
  }
  const raw = (max - min) / Math.max(count, 1);
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / pow;
  const step = (frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10) * pow;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v / step) * step);
  return { lo, hi, ticks };
}

/** Linear map from a data domain to a pixel range. */
export const linear = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  d1 === d0 ? (r0 + r1) / 2 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

/** The categories of a chart: the distinct x values in the order they first appear. */
export function categories(series: ChartSeries[]): string[] {
  const seen: string[] = [];
  for (const s of series)
    for (const p of s.points) if (!seen.includes(String(p.x))) seen.push(String(p.x));
  return seen;
}

/** The value of series `s` at category `x`, if it has one. */
export const pointAt = (s: ChartSeries, x: string) => s.points.find((p) => String(p.x) === x);

/** Pushes labels apart so that none is closer than `gap` to its neighbour, keeping their order. */
export function spreadLabels(ys: number[], gap: number): number[] {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < order.length; k++) {
    const prev = order[k - 1]!;
    const cur = order[k]!;
    if (cur.y - prev.y < gap) cur.y = prev.y + gap;
  }
  const out = new Array<number>(ys.length);
  for (const o of order) out[o.i] = o.y;
  return out;
}

// Made with my soul - Swately <3
