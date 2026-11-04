import { useSyncExternalStore } from 'react';

/**
 * The type settings, as STATE OUTSIDE REACT (1.4.0, tokens 2.1.0) — the same shape as the colour scheme
 * (`colorScheme.ts`): the truth is on `<html>`, React reads it through `useSyncExternalStore`, nothing to
 * mount.
 *
 * Two settings:
 * - the TYPE THEME, the `data-type` attribute: which family fills each face role and the scale's
 *   numbers. Absent = `editorial` (the substrate's own faces and sizes).
 * - the SCALE, the `--phy-type-scale` custom property: one multiplier for every step. The tokens clamp it
 *   to 0.875 - 1.5; this module clamps too, so what it reports is what the page uses.
 *
 * Both are set on `<html>` because the steps are computed there: a value on a descendant would not
 * reach them. `TYPE_BOOT_SCRIPT` applies the stored choice before the first paint.
 */

/** The type themes the tokens ship (`editorial` is the absent attribute). */
export const TYPE_THEMES = ['editorial', 'neutral', 'technical'] as const;
/** One of `TYPE_THEMES`. */
export type TypeTheme = (typeof TYPE_THEMES)[number];
/** What `useTypeSettings` returns: the type theme and the size multiplier in use. */
export type TypeSettings = { theme: TypeTheme; scale: number };

/** The lower bound the tokens clamp `--phy-type-scale` to. */
export const TYPE_SCALE_MIN = 0.875;
/** The upper bound the tokens clamp `--phy-type-scale` to. */
export const TYPE_SCALE_MAX = 1.5;

/** The `localStorage` key of the type theme — also what `TYPE_BOOT_SCRIPT` reads. */
export const TYPE_THEME_STORAGE_KEY = 'phy-type';
/** The `localStorage` key of the size multiplier — also what `TYPE_BOOT_SCRIPT` reads. */
export const TYPE_SCALE_STORAGE_KEY = 'phy-type-scale';

/** Dispatched on `document` after every change, like `phy-themechange`. */
export const TYPE_CHANGE_EVENT = 'phy-typechange';

/**
 * Paste in `<head>` before the first paint: `<script>` + TYPE_BOOT_SCRIPT + `</script>`. Applies the
 * stored theme and scale; absent choices leave the defaults.
 */
export const TYPE_BOOT_SCRIPT =
  "(function(){try{var d=document.documentElement,t=localStorage.getItem('phy-type'),s=parseFloat(localStorage.getItem('phy-type-scale'));if(t==='neutral'||t==='technical'){d.dataset.type=t;}if(s>=0.875&&s<=1.5){d.style.setProperty('--phy-type-scale',String(s));}}catch(e){}})();";

const clampScale = (n: number): number =>
  Number.isFinite(n) ? Math.min(TYPE_SCALE_MAX, Math.max(TYPE_SCALE_MIN, n)) : 1;

const listeners = new Set<() => void>();
let cache: TypeSettings | null = null;

function compute(): TypeSettings {
  const el = document.documentElement;
  const t = el.dataset.type;
  const theme: TypeTheme = (TYPE_THEMES as readonly string[]).includes(t ?? '')
    ? (t as TypeTheme)
    : 'editorial';
  const raw = parseFloat(el.style.getPropertyValue('--phy-type-scale'));
  return { theme, scale: Number.isNaN(raw) ? 1 : clampScale(raw) };
}

function emit() {
  cache = null;
  for (const l of listeners) l();
  document.dispatchEvent(new Event(TYPE_CHANGE_EVENT));
}

function store(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the setting still applies for this page */
  }
}

/** Select a type theme (`editorial` removes the attribute), persist it, notify. */
export function setTypeTheme(theme: TypeTheme): void {
  const el = document.documentElement;
  if (theme === 'editorial') delete el.dataset.type;
  else el.dataset.type = theme;
  store(TYPE_THEME_STORAGE_KEY, theme === 'editorial' ? null : theme);
  emit();
}

/** Set the size multiplier (clamped to 0.875 - 1.5; 1 removes it), persist it, notify. */
export function setTypeScale(scale: number): void {
  const el = document.documentElement;
  const s = clampScale(scale);
  if (s === 1) el.style.removeProperty('--phy-type-scale');
  else el.style.setProperty('--phy-type-scale', String(s));
  store(TYPE_SCALE_STORAGE_KEY, s === 1 ? null : String(s));
  emit();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

const getSnapshot = (): TypeSettings => (cache ??= compute());
const SERVER: TypeSettings = { theme: 'editorial', scale: 1 };
const getServerSnapshot = () => SERVER;

/** The current type theme and size multiplier. */
export function useTypeSettings(): TypeSettings {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Made with my soul - Swately <3
