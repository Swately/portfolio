import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Disclosure, Table, Text } from '../../phyriad-react';
import {
  categories,
  fmt,
  linear,
  niceScale,
  pointAt,
  spreadLabels,
  type ChartData,
  type ChartSeries,
} from './chartMath';
import styles from './Chart.module.css';

// CSS-module class names are `string | undefined` under noUncheckedIndexedAccess; every class used here exists in Chart.module.css.
const S = styles as Record<string, string>;

/**
 * Charts from data, drawn by the site as inline SVG (concept §5, decision D7): no dependency, the
 * tokens through CSS classes (so both colour schemes and any palette follow), ONE accent against muted
 * ink, direct labels, and the SAME data as a table directly beneath, always. Colour never carries
 * meaning alone: series differ by label, marker and dash as well.
 *
 * The input is a `phyriad-chart/1` file already validated by `figure-contract/validate-chart.mjs`.
 * The SVG has a fixed design width and a legibility floor (it scrolls below it, like `Figure`); text is
 * 14 design units, which is about 12 px at the floor.
 */

const W = 640;
const FLOOR = '35rem';
const MARKERS = ['circle', 'square', 'triangle', 'diamond', 'cross'] as const;
const DASHES = ['', '7 4', '2 3', '9 3 2 3', '4 4'];

type Rendered = { height: number; body: ReactNode; legend?: ReactNode };

const baseFill = (s: ChartSeries, i: number) =>
  s.emphasis ? S.fAccent : [S.fMuted, S.fInk, S.fRule, S.fPaper2, S.fMuted][i % 5]!;
const baseStroke = (s: ChartSeries, i: number) =>
  s.emphasis ? S.sAccent : [S.sMuted, S.sInk, S.sMuted, S.sInk, S.sMuted][i % 5]!;

function Marker({
  kind,
  x,
  y,
  className,
}: {
  kind: (typeof MARKERS)[number];
  x: number;
  y: number;
  className?: string;
}) {
  const r = 5;
  if (kind === 'circle') return <circle cx={x} cy={y} r={r} className={className} />;
  if (kind === 'square')
    return <rect x={x - r} y={y - r} width={2 * r} height={2 * r} className={className} />;
  if (kind === 'triangle')
    return (
      <polygon
        points={`${x},${y - r - 1} ${x + r + 1},${y + r} ${x - r - 1},${y + r}`}
        className={className}
      />
    );
  if (kind === 'diamond')
    return (
      <polygon
        points={`${x},${y - r - 1} ${x + r + 1},${y} ${x},${y + r + 1} ${x - r - 1},${y}`}
        className={className}
      />
    );
  return (
    <path
      d={`M${x - r},${y - r}L${x + r},${y + r}M${x - r},${y + r}L${x + r},${y - r}`}
      className={`${className} ${S.cross}`}
    />
  );
}

function XAxisTicks({
  scale,
  ticks,
  y0,
  y1,
  unit,
}: {
  scale: (v: number) => number;
  ticks: number[];
  y0: number;
  y1: number;
  unit: string;
}) {
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={scale(t)} x2={scale(t)} y1={y0} y2={y1} className={S.grid} />
          <text x={scale(t)} y={y1 + 18} textAnchor="middle" className={S.t}>
            {fmt(t)}
          </text>
        </g>
      ))}
      {unit && unit !== 'none' && (
        <text x={scale(ticks[ticks.length - 1]!)} y={y1 + 36} textAnchor="end" className={S.t}>
          {unit}
        </text>
      )}
    </g>
  );
}

function YAxisTicks({
  scale,
  ticks,
  x0,
  x1,
  unit,
}: {
  scale: (v: number) => number;
  ticks: number[];
  x0: number;
  x1: number;
  unit: string;
}) {
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x0} x2={x1} y1={scale(t)} y2={scale(t)} className={S.grid} />
          <text x={x0 - 8} y={scale(t) + 5} textAnchor="end" className={S.t}>
            {fmt(t)}
          </text>
        </g>
      ))}
      {unit && unit !== 'none' && (
        <text x={x0 - 8} y={scale(ticks[ticks.length - 1]!) - 10} textAnchor="end" className={S.t}>
          {unit}
        </text>
      )}
    </g>
  );
}

// ---- bar: one metric across categories, horizontal, zero baseline ----------------------------------------
function bar(c: ChartData): Rendered {
  const cats = categories(c.series);
  const multi = c.series.length > 1;
  const ordered = multi
    ? cats
    : [...cats].sort(
        (a, b) => (pointAt(c.series[0]!, b)?.y ?? 0) - (pointAt(c.series[0]!, a)?.y ?? 0),
      );
  const ML = 150;
  const MR = 90;
  const rowH = 26;
  const bandH = multi ? c.series.length * rowH + 10 : rowH + 8;
  const top = 8;
  const max = Math.max(...c.series.flatMap((s) => s.points.map((p) => p.y)), 0);
  const sc = niceScale(0, max, 5);
  const x = linear(0, sc.hi, ML, W - MR);
  const h = top + ordered.length * bandH + 44;
  return {
    height: h,
    body: (
      <>
        <XAxisTicks
          scale={x}
          ticks={sc.ticks}
          y0={top}
          y1={top + ordered.length * bandH}
          unit={c.unit}
        />
        {ordered.map((cat, ri) => (
          <g key={cat}>
            <text
              x={ML - 10}
              y={top + ri * bandH + bandH / 2 + 5}
              textAnchor="end"
              className={S.tInk}
            >
              {cat}
            </text>
            {c.series.map((s, si) => {
              const p = pointAt(s, cat);
              if (!p) return null;
              const y = top + ri * bandH + (multi ? si * rowH + 5 : 4);
              return (
                <g key={s.name}>
                  <rect
                    x={ML}
                    y={y}
                    width={Math.max(x(p.y) - ML, 1)}
                    height={rowH - 6}
                    className={baseFill(s, si)}
                  />
                  <text x={x(p.y) + 8} y={y + rowH / 2 + 2} className={S.tInk}>
                    {fmt(p.y)}
                    {multi ? ` · ${s.name}` : ''}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
        <line x1={ML} x2={ML} y1={top} y2={top + ordered.length * bandH} className={S.axis} />
      </>
    ),
  };
}

// ---- line: ordered axis, direct end labels -------------------------------------------------------------------
function line(c: ChartData): Rendered {
  const cats = categories(c.series);
  const numeric = cats.every((k) => Number.isFinite(Number(k)));
  const ML = 56;
  const MR = 150;
  const top = 14;
  const H = 240;
  const ys = c.series.flatMap((s) => s.points.map((p) => p.y));
  const sc = niceScale(Math.min(...ys), Math.max(...ys), 5);
  const y = linear(sc.lo, sc.hi, top + H, top);
  const xs = numeric ? cats.map(Number) : cats.map((_, i) => i);
  const x = linear(Math.min(...xs), Math.max(...xs), ML + 8, W - MR);
  const px = (k: string) => x(numeric ? Number(k) : cats.indexOf(k));
  const endY = spreadLabels(
    c.series.map((s) => y(s.points[s.points.length - 1]!.y)),
    16,
  );
  return {
    height: top + H + 50,
    body: (
      <>
        <YAxisTicks scale={y} ticks={sc.ticks} x0={ML} x1={W - MR + 8} unit={c.unit} />
        {cats.map((k) => (
          <text key={k} x={px(k)} y={top + H + 20} textAnchor="middle" className={S.t}>
            {k}
          </text>
        ))}
        {c.xLabel && (
          <text x={W - MR} y={top + H + 40} textAnchor="end" className={S.t}>
            {c.xLabel}
          </text>
        )}
        {c.series.map((s, i) => {
          const pts = s.points.map((p) => `${px(String(p.x))},${y(p.y)}`).join(' ');
          const last = s.points[s.points.length - 1]!;
          return (
            <g key={s.name}>
              <polyline
                points={pts}
                fill="none"
                strokeDasharray={DASHES[i % DASHES.length]}
                className={`${baseStroke(s, i)} ${s.emphasis ? S.thick : S.thin}`}
              />
              {s.points.map((p) => (
                <Marker
                  key={String(p.x)}
                  kind={MARKERS[i % MARKERS.length]!}
                  x={px(String(p.x))}
                  y={y(p.y)}
                  className={baseFill(s, i)}
                />
              ))}
              <text
                x={px(String(last.x)) + 12}
                y={endY[i]! + 5}
                className={s.emphasis ? S.tAccent : S.tInk}
              >
                {s.name}
              </text>
            </g>
          );
        })}
      </>
    ),
  };
}

// ---- range: a value with its spread across repeated runs -----------------------------------------------------
function range(c: ChartData): Rendered {
  const cats = categories(c.series);
  const ML = 120;
  const MR = 160;
  const rowH = 34;
  const top = 8;
  const vals = c.series.flatMap((s) => s.points.flatMap((p) => [p.lo ?? p.y, p.hi ?? p.y]));
  const sc = niceScale(Math.min(...vals), Math.max(...vals), 5);
  const x = linear(sc.lo, sc.hi, ML, W - MR);
  const band = c.series.length * rowH;
  return {
    height: top + cats.length * band + 44,
    body: (
      <>
        <XAxisTicks
          scale={x}
          ticks={sc.ticks}
          y0={top}
          y1={top + cats.length * band}
          unit={c.unit}
        />
        {cats.map((cat, ri) => (
          <g key={cat}>
            <text
              x={ML - 10}
              y={top + ri * band + band / 2 + 5}
              textAnchor="end"
              className={S.tInk}
            >
              {cat}
            </text>
            {c.series.map((s, si) => {
              const p = pointAt(s, cat);
              if (!p) return null;
              const cy = top + ri * band + si * rowH + rowH / 2;
              const lo = p.lo ?? p.y;
              const hi = p.hi ?? p.y;
              return (
                <g key={s.name}>
                  <line
                    x1={x(lo)}
                    x2={x(hi)}
                    y1={cy}
                    y2={cy}
                    className={`${baseStroke(s, si)} ${S.thick}`}
                  />
                  <line
                    x1={x(lo)}
                    x2={x(lo)}
                    y1={cy - 6}
                    y2={cy + 6}
                    className={`${baseStroke(s, si)} ${S.thin}`}
                  />
                  <line
                    x1={x(hi)}
                    x2={x(hi)}
                    y1={cy - 6}
                    y2={cy + 6}
                    className={`${baseStroke(s, si)} ${S.thin}`}
                  />
                  <Marker
                    kind={MARKERS[si % MARKERS.length]!}
                    x={x(p.y)}
                    y={cy}
                    className={baseFill(s, si)}
                  />
                  <text x={x(hi) + 12} y={cy + 5} className={S.tInk}>
                    {fmt(p.y)} [{fmt(lo)} – {fmt(hi)}]{c.series.length > 1 ? ` · ${s.name}` : ''}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </>
    ),
  };
}

// ---- slope: before and after on the same items --------------------------------------------------------------
function slope(c: ChartData): Rendered {
  const cats = categories(c.series);
  const [a, b] = cats as [string, string];
  const top = 40;
  const H = 240;
  const L = 200;
  const R = 440;
  const vals = c.series.flatMap((s) => s.points.map((p) => p.y));
  const sc = niceScale(Math.min(...vals), Math.max(...vals), 4);
  const y = linear(sc.lo, sc.hi, top + H, top);
  const left = spreadLabels(
    c.series.map((s) => y(pointAt(s, a)?.y ?? 0)),
    16,
  );
  const right = spreadLabels(
    c.series.map((s) => y(pointAt(s, b)?.y ?? 0)),
    16,
  );
  return {
    height: top + H + 30,
    body: (
      <>
        <text x={L} y={22} textAnchor="middle" className={S.tStrong}>
          {a}
        </text>
        <text x={R} y={22} textAnchor="middle" className={S.tStrong}>
          {b}
        </text>
        {c.series.map((s, i) => {
          const pa = pointAt(s, a);
          const pb = pointAt(s, b);
          if (!pa || !pb) return null;
          return (
            <g key={s.name}>
              <line
                x1={L}
                y1={y(pa.y)}
                x2={R}
                y2={y(pb.y)}
                className={`${baseStroke(s, i)} ${s.emphasis ? S.thick : S.thin}`}
              />
              <circle cx={L} cy={y(pa.y)} r={4.5} className={baseFill(s, i)} />
              <circle cx={R} cy={y(pb.y)} r={4.5} className={baseFill(s, i)} />
              <text
                x={L - 12}
                y={left[i]! + 5}
                textAnchor="end"
                className={s.emphasis ? S.tAccent : S.tInk}
              >
                {s.name} {fmt(pa.y)}
              </text>
              <text x={R + 12} y={right[i]! + 5} className={s.emphasis ? S.tAccent : S.tInk}>
                {fmt(pb.y)}
                {c.unit && c.unit !== 'none' ? ` ${c.unit}` : ''}
              </text>
            </g>
          );
        })}
      </>
    ),
  };
}

// ---- stack: one total split into parts, compared by length --------------------------------------------------
function stack(c: ChartData): Rendered {
  const cats = categories(c.series);
  const ML = 130;
  const MR = 24;
  const rowH = 38;
  const top = 8;
  const totals = cats.map((k) => c.series.reduce((sum, s) => sum + (pointAt(s, k)?.y ?? 0), 0));
  const sc = niceScale(0, Math.max(...totals), 5);
  const x = linear(0, sc.hi, ML, W - MR);
  const label = (i: number, s: ChartSeries) =>
    s.emphasis ? S.tOnAccent : [S.tOnMuted, S.tInk, S.tOnInk, S.tInk, S.tOnMuted][i % 5]!;
  return {
    height: top + cats.length * rowH + 44,
    body: (
      <>
        <XAxisTicks
          scale={x}
          ticks={sc.ticks}
          y0={top}
          y1={top + cats.length * rowH}
          unit={c.unit}
        />
        {cats.map((cat, ri) => {
          let acc = 0;
          return (
            <g key={cat}>
              <text
                x={ML - 10}
                y={top + ri * rowH + rowH / 2 + 5}
                textAnchor="end"
                className={S.tInk}
              >
                {cat}
              </text>
              {c.series.map((s, si) => {
                const p = pointAt(s, cat);
                if (!p) return null;
                const x0 = x(acc);
                acc += p.y;
                const w = x(acc) - x0;
                return (
                  <g key={s.name}>
                    <rect
                      x={x0}
                      y={top + ri * rowH + 4}
                      width={Math.max(w, 0)}
                      height={rowH - 8}
                      className={`${baseFill(s, si)} ${S.segment}`}
                    />
                    {w >= 78 && (
                      <text
                        x={x0 + w / 2}
                        y={top + ri * rowH + rowH / 2 + 5}
                        textAnchor="middle"
                        className={label(si, s)}
                      >
                        {s.name} {fmt(p.y)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </>
    ),
    legend: (
      <ul className={S.legend}>
        {c.series.map((s, i) => (
          <li key={s.name}>
            <svg width="14" height="14" aria-hidden="true">
              <rect
                x="1"
                y="1"
                width="12"
                height="12"
                className={`${baseFill(s, i)} ${S.segment}`}
              />
            </svg>{' '}
            <Text as="span" size="sm">
              {s.name}
            </Text>
          </li>
        ))}
      </ul>
    ),
  };
}

// ---- scatter: two measures against each other ---------------------------------------------------------------
function scatter(c: ChartData): Rendered {
  const ML = 64;
  const MR = 90;
  const top = 26;
  const H = 260;
  const xv = c.series.flatMap((s) => s.points.map((p) => Number(p.x)));
  const yv = c.series.flatMap((s) => s.points.map((p) => p.y));
  const sx = niceScale(Math.min(...xv), Math.max(...xv), 5);
  // 8 % of headroom: the highest point must not sit on the edge of the plot with its label cut off
  const headroom = (Math.max(...yv) - Math.min(...yv)) * 0.08;
  const sy = niceScale(Math.min(...yv), Math.max(...yv) + headroom, 5);
  const x = linear(sx.lo, sx.hi, ML, W - MR);
  const y = linear(sy.lo, sy.hi, top + H, top);
  return {
    height: top + H + 52,
    body: (
      <>
        <YAxisTicks scale={y} ticks={sy.ticks} x0={ML} x1={W - MR} unit={c.yLabel ?? c.unit} />
        <XAxisTicks scale={x} ticks={sx.ticks} y0={top} y1={top + H} unit={c.xLabel ?? ''} />
        {c.series.map((s, i) =>
          s.points.map((p, j) => (
            <g key={`${s.name}-${j}`}>
              <Marker
                kind={MARKERS[i % MARKERS.length]!}
                x={x(Number(p.x))}
                y={y(p.y)}
                className={baseFill(s, i)}
              />
              {(p.label || c.series.length === 1) && (
                <text
                  x={x(Number(p.x)) + 10}
                  y={y(p.y) - 8}
                  className={s.emphasis ? S.tAccent : S.tInk}
                >
                  {p.label ?? String(p.x)}
                </text>
              )}
            </g>
          )),
        )}
      </>
    ),
    legend:
      c.series.length > 1 ? (
        <ul className={S.legend}>
          {c.series.map((s, i) => (
            <li key={s.name}>
              <Text as="span" size="sm">
                {MARKERS[i % MARKERS.length]} · {s.name}
              </Text>
            </li>
          ))}
        </ul>
      ) : undefined,
  };
}

const RENDER = { bar, line, range, slope, stack, scatter } as const;

// ---- the same data as a table ----------------------------------------------------------------------------------
export function ChartTable({ chart }: { chart: ChartData }) {
  const cats = categories(chart.series);
  const withSpread = chart.series.some((s) => s.points.some((p) => p.lo !== undefined));
  const unit = chart.unit && chart.unit !== 'none' ? ` (${chart.unit})` : '';
  const cell = (s: ChartSeries, cat: string) => {
    const p = pointAt(s, cat);
    if (!p) return '—';
    return p.lo !== undefined && p.hi !== undefined
      ? `${fmt(p.y)} [${fmt(p.lo)} – ${fmt(p.hi)}]`
      : fmt(p.y);
  };
  const body = (
    <Table caption={`Datos de la gráfica: ${chart.title}`}>
      <thead>
        <tr>
          <th scope="col">{chart.xLabel ?? 'x'}</th>
          {chart.series.map((s) => (
            <th scope="col" key={s.name}>
              {chart.series.length > 1 ? s.name : (chart.yLabel ?? 'Valor')}
              {unit}
            </th>
          ))}
          {chart.kind === 'stack' && <th scope="col">Total{unit}</th>}
          {withSpread && chart.series.some((s) => s.points.some((p) => p.n !== undefined)) && (
            <th scope="col">n</th>
          )}
        </tr>
      </thead>
      <tbody>
        {cats.map((cat) => (
          <tr key={cat}>
            <th scope="row">{cat}</th>
            {chart.series.map((s) => (
              <td key={s.name} className={S.num}>
                {cell(s, cat)}
              </td>
            ))}
            {chart.kind === 'stack' && (
              <td className={S.num}>
                {fmt(chart.series.reduce((sum, s) => sum + (pointAt(s, cat)?.y ?? 0), 0))}
              </td>
            )}
            {withSpread && chart.series.some((s) => s.points.some((p) => p.n !== undefined)) && (
              <td className={S.num}>
                {chart.series
                  .map((s) => pointAt(s, cat)?.n)
                  .filter((n) => n !== undefined)
                  .join(', ')}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
  // A table of up to about 12 rows is shown (Datawrapper: "shorter than a desktop screen"); a longer one
  // sits in a disclosure directly beneath the chart (concept §4.3, D4).
  return cats.length <= 12 ? (
    body
  ) : (
    <Disclosure summary={`Tabla de datos (${cats.length} filas)`}>{body}</Disclosure>
  );
}

/** The chart, its caption (takeaway, instrument, source, runs) and its data table. */
export default function Chart({ chart }: { chart: ChartData }) {
  const r = RENDER[chart.kind](chart);
  const regionRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const measure = useCallback(() => {
    const el = regionRef.current;
    if (el) setOverflows(el.scrollWidth > el.clientWidth + 1);
  }, []);
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const titleId = `${chart.id}-t`;
  const descId = `${chart.id}-d`;
  return (
    <figure id={`grafica-${chart.id}`} className={`phy-wide ${S.chart}`}>
      <Text as="p" bold>
        {chart.title}
      </Text>
      <div
        ref={regionRef}
        className={`phy-scroll-x ${S.viewport} skin-surface`}
        {...(overflows
          ? {
              tabIndex: 0,
              role: 'region' as const,
              'aria-label': `Gráfica, desplazable: ${chart.title}`,
            }
          : {})}
      >
        <svg
          viewBox={`0 0 ${W} ${r.height}`}
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          className={S.svg}
          style={{ minInlineSize: FLOOR }}
        >
          <title id={titleId}>{chart.title}</title>
          <desc id={descId}>{`${chart.takeaway} Los datos están en la tabla que sigue.`}</desc>
          {r.body}
        </svg>
      </div>
      {r.legend}
      <Text as="figcaption" size="xs" muted>
        {chart.takeaway} Instrumento: {chart.instrument}.{' '}
        <a href={chart.source.url}>{chart.source.label}</a>
        {chart.runs && chart.runs.length > 0 && (
          <>
            {' '}
            Corridas:{' '}
            {chart.runs.map((run, i) => (
              <span key={run.id}>
                {i > 0 && ', '}
                {run.id}
              </span>
            ))}
            .
          </>
        )}
        {chart.notes?.map((n, i) => (
          <span key={i}> {n}</span>
        ))}
      </Text>
      <ChartTable chart={chart} />
    </figure>
  );
}

// Made with my soul - Swately <3
