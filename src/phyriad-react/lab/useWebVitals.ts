import { useSyncExternalStore } from 'react';

/**
 * Core Web Vitals, read live from the page — the instrument S8.0 owes before
 * any UX change claims to be "cheap" (EMPIRICAL_TEST §1: every metric has a
 * baseline).
 *
 * Thresholds are the "good" bars from web.dev/articles/vitals, read first-hand
 * 2026-08-30 ([V1]): LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1, assessed at the
 * 75th percentile of page loads. FCP and TTFB are shown as context only and
 * carry no gate here.
 *
 * HONEST SCOPE — these are APPROXIMATIONS of the official algorithms, and the
 * lab says so beside each number:
 * - LCP: the latest `largest-contentful-paint` candidate. Official LCP also
 *   stops on first input / tab hide; this reads whatever is latest.
 * - CLS: the plain sum of `layout-shift` values without recent input. The
 *   official metric uses session windows (5 s, 1 s gaps); a plain sum only
 *   OVERSTATES on long-lived pages, so a good reading here is conservative.
 * - INP: the longest `event` duration carrying an interactionId. Official INP
 *   is the ~98th percentile of interactions; with few interactions the max
 *   and the p98 coincide, so this is exact until a page has ~50 interactions.
 * The correct commodity for production measurement is Google's `web-vitals`
 * library; this substrate builds from zero (operator doctrine) and keeps the
 * lab dependency-free, labelling the approximation instead.
 *
 * A HIDDEN document suppresses paint entries (measured on this rig): read the
 * lab with the tab in front, or the LCP/FCP cells stay "—".
 */

export type VitalName = 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';

export type Vital = {
  name: VitalName;
  value: number | null;
  unit: 'ms' | 'score';
  /** The "good" bar, or null when the metric is context-only here. */
  good: number | null;
  approximation: string;
};

/** Pure: the latest LCP candidate wins. */
export function summarizeLcp(entries: { startTime: number }[]): number | null {
  if (entries.length === 0) return null;
  return entries[entries.length - 1]!.startTime;
}

/** Pure: plain sum of shifts not caused by recent input (conservative vs the official windows). */
export function summarizeCls(entries: { value: number; hadRecentInput?: boolean }[]): number {
  return entries.filter((e) => !e.hadRecentInput).reduce((sum, e) => sum + e.value, 0);
}

/** Pure: the longest interaction (exact ≈ p98 while interactions are few). */
export function summarizeInp(
  entries: { interactionId?: number; duration: number }[],
): number | null {
  const interactions = entries.filter((e) => (e.interactionId ?? 0) > 0);
  if (interactions.length === 0) return null;
  return Math.max(...interactions.map((e) => e.duration));
}

// ---- the live store (module-level, observers started once) --------------------
type Snapshot = Vital[];

const lcp: { startTime: number }[] = [];
const cls: { value: number; hadRecentInput?: boolean }[] = [];
const inp: { interactionId?: number; duration: number }[] = [];
let fcp: number | null = null;
let ttfb: number | null = null;

const listeners = new Set<() => void>();
// Lazily built: a module-level `build()` call is a top-level side effect, and
// measured on 2026-08-30 it kept this whole store in the PRODUCTION bundle
// (+0.26 kB, the strings 'plain sum' / 'latest candidate' found in dist) even
// though nothing in production renders the lab. With no top-level call the
// bundler can drop the module when the lab is dead code.
let snapshot: Snapshot | null = null;
let started = false;

function build(): Snapshot {
  return [
    {
      name: 'LCP',
      value: summarizeLcp(lcp),
      unit: 'ms',
      good: 2500,
      approximation: 'latest candidate',
    },
    {
      name: 'INP',
      value: summarizeInp(inp),
      unit: 'ms',
      good: 200,
      approximation: 'longest interaction',
    },
    {
      name: 'CLS',
      value: summarizeCls(cls),
      unit: 'score',
      good: 0.1,
      approximation: 'plain sum, no session windows',
    },
    { name: 'FCP', value: fcp, unit: 'ms', good: null, approximation: 'context only' },
    { name: 'TTFB', value: ttfb, unit: 'ms', good: null, approximation: 'context only' },
  ];
}

function publish() {
  snapshot = build();
  listeners.forEach((fn) => fn());
}

function start() {
  if (started || typeof PerformanceObserver === 'undefined') return;
  started = true;
  const observe = (
    type: string,
    cb: (list: PerformanceObserverEntryList) => void,
    extra: object = {},
  ) => {
    try {
      new PerformanceObserver(cb).observe({
        type,
        buffered: true,
        ...extra,
      } as PerformanceObserverInit);
    } catch {
      /* an engine without this entry type: the cell stays "—", honestly */
    }
  };
  observe('largest-contentful-paint', (list) => {
    for (const e of list.getEntries()) lcp.push({ startTime: e.startTime });
    publish();
  });
  observe('layout-shift', (list) => {
    for (const e of list.getEntries() as (PerformanceEntry & {
      value: number;
      hadRecentInput: boolean;
    })[])
      cls.push({ value: e.value, hadRecentInput: e.hadRecentInput });
    publish();
  });
  observe(
    'event',
    (list) => {
      for (const e of list.getEntries() as (PerformanceEntry & { interactionId?: number })[])
        inp.push({ interactionId: e.interactionId, duration: e.duration });
      publish();
    },
    { durationThreshold: 16 },
  );
  observe('paint', (list) => {
    for (const e of list.getEntries()) if (e.name === 'first-contentful-paint') fcp = e.startTime;
    publish();
  });
  const nav = performance.getEntriesByType('navigation')[0] as
    PerformanceNavigationTiming | undefined;
  if (nav) ttfb = nav.responseStart;
  publish();
}

function subscribe(fn: () => void) {
  start();
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const getSnapshot = () => (snapshot ??= build());
const getServerSnapshot = getSnapshot;

/** The live vitals; renders nothing itself — the lab's section does. */
export function useWebVitals(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Made with my soul - Swately <3
