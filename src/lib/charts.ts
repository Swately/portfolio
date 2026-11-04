import type { ChartData } from '../components/charts/chartMath';

/**
 * The chart files the project sessions hand over, one `phyriad-chart/1` JSON each, in
 * `src/content/charts/<project-slug>--<chart-id>.json`, grouped by the slug in their file name.
 *
 * LOADED ON DEMAND, per project page (Vite splits each file into its own chunk): the home page and the
 * ledger do not pay for data they never draw (measured: eager loading took the initial JS from 74.65 to
 * 89.35 kB gzip, over the 85 kB budget). The list of PATHS is known synchronously, so a page knows whether
 * a project has charts without loading them.
 *
 * VALIDATION is not done here, so the validator stays out of the production bundle: `charts.test.ts` loads
 * every file and runs `figure-contract/validate-chart.mjs` over it.
 */
const loaders = import.meta.glob('../content/charts/*.json', { import: 'default' }) as Record<
  string,
  () => Promise<ChartData>
>;

const slugOf = (path: string) => (path.split('/').pop() ?? '').split('--')[0] ?? '';

/** Every chart file path, in order, with the project slug taken from the file name. */
export const chartPaths = Object.keys(loaders)
  .sort()
  .map((path) => ({ path, slug: slugOf(path) }));

/** How many chart files a project has (synchronous: no data is loaded). */
export const chartCount = (slug: string): number =>
  chartPaths.filter((f) => f.slug === slug).length;

/** Loads the charts of one project, in file-name order. */
export const loadCharts = (slug: string): Promise<ChartData[]> =>
  Promise.all(chartPaths.filter((f) => f.slug === slug).map((f) => loaders[f.path]!()));

/** Loads every chart file with its path (for the validating tests). */
export const loadAllCharts = (): Promise<{ path: string; slug: string; data: ChartData }[]> =>
  Promise.all(chartPaths.map(async (f) => ({ ...f, data: await loaders[f.path]!() })));

// Made with my soul - Swately <3
