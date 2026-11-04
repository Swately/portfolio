/**
 * The approach matrices the project sessions hand over ("phyriad-matrix/1", validated by
 * figure-contract/validate-matrix.mjs in tables.test.ts), one JSON per comparison in
 * `src/content/tables/<project-slug>--<id>.json`, grouped by the slug in the file name like the charts, and
 * LOADED ON DEMAND for the same reason (see charts.ts).
 */
export type MatrixData = {
  schema: 'phyriad-matrix/1';
  id: string;
  title: string;
  note?: string;
  /** Language of the cells when it is not the page's (the project's own words are kept verbatim). */
  cellsLang?: string;
  status?: string;
  options: string[];
  rows: {
    attribute: string;
    kind: 'medido' | 'declarado' | 'enfoque';
    instrument?: string;
    cells: (string | null)[];
  }[];
  sources?: { text: string; href: string }[][];
  quotes?: string[][];
  origin?: { label: string; note?: string };
};

const loaders = import.meta.glob('../content/tables/*.json', { import: 'default' }) as Record<
  string,
  () => Promise<MatrixData>
>;

const slugOf = (path: string) => (path.split('/').pop() ?? '').split('--')[0] ?? '';

export const tablePaths = Object.keys(loaders)
  .sort()
  .map((path) => ({ path, slug: slugOf(path) }));

/** How many matrices a project has (synchronous: no data is loaded). */
export const matrixCount = (slug: string): number =>
  tablePaths.filter((f) => f.slug === slug).length;

/** Loads the matrices of one project, in file-name order. */
export const loadMatrices = (slug: string): Promise<MatrixData[]> =>
  Promise.all(tablePaths.filter((f) => f.slug === slug).map((f) => loaders[f.path]!()));

/** Loads every matrix file with its path (for the validating tests). */
export const loadAllTables = (): Promise<{ path: string; slug: string; data: MatrixData }[]> =>
  Promise.all(tablePaths.map(async (f) => ({ ...f, data: await loaders[f.path]!() })));

// Made with my soul - Swately <3
