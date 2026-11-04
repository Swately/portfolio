import { useSyncExternalStore } from 'react';

/**
 * The colour scheme, as STATE OUTSIDE REACT.
 *
 * The theme itself lives in the tokens: every colour is `light-dark()` and the
 * root declares `color-scheme: light dark`, so the OS preference is honoured
 * with no JavaScript at all and native controls follow. What this module owns is
 * the explicit OVERRIDE — the `data-theme` attribute on `<html>` that flips
 * `color-scheme` — plus its persistence. That attribute is the source of truth;
 * React reads it through `useSyncExternalStore` (the substrate's pattern for the
 * router, the live metrics and the vitals), so there is no provider to mount and
 * nothing to pass down: a component that needs the resolved scheme asks the DOM.
 *
 * Why not a context (the operator's first idea): CSS cannot read a context, so
 * an attribute would be set anyway; a provider forces a root; and it runs after
 * React does, which is exactly when the flash of the wrong theme happens. The
 * flash is prevented by `THEME_BOOT_SCRIPT`, one line the consumer pastes in
 * `index.html` before any paint.
 */

export type SchemePreference = 'system' | 'light' | 'dark';
export type Scheme = 'light' | 'dark';
export type ColorSchemeState = { preference: SchemePreference; resolved: Scheme };

/**
 * The `localStorage` key the preference lives under — also what `THEME_BOOT_SCRIPT` reads.
 */
export const THEME_STORAGE_KEY = 'phy-theme';

/**
 * Dispatched on `document` after every change (user toggle or OS switch), so
 * instruments that read the DOM — the lab's live metrics — can re-measure
 * without importing this module. A DOM event, not a callback prop: the
 * header's toggle and the lab's readout must not know about each other.
 */
export const THEME_CHANGE_EVENT = 'phy-themechange';

/**
 * Paste in `<head>`, before the stylesheet-dependent first paint:
 * `<script>` + THEME_BOOT_SCRIPT + `</script>`. Sets the attribute from storage so
 * the first paint already has the user's choice. Absent choice = follow the OS.
 */
export const THEME_BOOT_SCRIPT =
  "(function(){try{var t=localStorage.getItem('phy-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}})();";

const MQ = '(prefers-color-scheme: dark)';
const listeners = new Set<() => void>();
let cache: ColorSchemeState | null = null;

function readPreference(): SchemePreference {
  const t = document.documentElement.dataset.theme;
  return t === 'light' || t === 'dark' ? t : 'system';
}

function osScheme(): Scheme {
  return typeof matchMedia === 'function' && matchMedia(MQ).matches ? 'dark' : 'light';
}

function compute(): ColorSchemeState {
  const preference = readPreference();
  return { preference, resolved: preference === 'system' ? osScheme() : preference };
}

function emit() {
  cache = null;
  for (const l of listeners) l();
  document.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/** Set the override (or 'system' to remove it) — attribute + storage, then notify. */
export function setColorScheme(preference: SchemePreference): void {
  const el = document.documentElement;
  try {
    if (preference === 'system') {
      delete el.dataset.theme;
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      el.dataset.theme = preference;
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    /* storage unavailable (private mode, blocked): the attribute still applies for this page */
  }
  emit();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const mq = typeof matchMedia === 'function' ? matchMedia(MQ) : null;
  const onChange = () => emit();
  mq?.addEventListener('change', onChange);
  return () => {
    listeners.delete(fn);
    mq?.removeEventListener('change', onChange);
  };
}

// The snapshot must be referentially stable while nothing changed, or
// useSyncExternalStore loops; it is rebuilt only after emit().
const getSnapshot = (): ColorSchemeState => (cache ??= compute());
const SERVER: ColorSchemeState = { preference: 'system', resolved: 'light' };
const getServerSnapshot = () => SERVER;

/** The preference (system | light | dark) and what it resolves to right now. */
export function useColorScheme(): ColorSchemeState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Made with my soul - Swately <3
