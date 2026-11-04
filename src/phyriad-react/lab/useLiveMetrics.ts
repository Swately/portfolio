import { useEffect, useSyncExternalStore } from 'react';

export type Metric = {
  label: string;
  value: string;
  note?: string;
  ok?: boolean;
  /** Metrics that belong to a section of the lab rather than the top list. */
  group?: 'space' | 'scheme';
};

const srgb = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

/** Parse any computed colour the browser hands back (always `rgb()`/`rgba()`). */
function luminance(color: string): number | null {
  const m = color.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return null;
  const [r, g, b] = m.slice(0, 3).map(Number) as [number, number, number];
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}

/**
 * WCAG contrast ratio between two computed colours (`rgb()` strings), or null if unparsable.
 */
export function contrast(fg: string, bg: string): number | null {
  const a = luminance(fg);
  const b = luminance(bg);
  if (a === null || b === null) return null;
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Average advance width of running text in the element's own font. */
function avgGlyph(el: Element): number | null {
  const st = getComputedStyle(el);
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return null;
  ctx.font = `${st.fontSize} ${st.fontFamily}`;
  const sample = 'la generación de cuadros intermedios se calcula fuera del motor gráfico';
  return ctx.measureText(sample).width / sample.length;
}

/*
 * Viewport size is state that lives OUTSIDE React, so it is read with
 * `useSyncExternalStore` rather than mirrored into `useState` from an effect.
 * The mirror version works, but it makes every resize a render-then-measure-
 * then-render-again round trip and it trips `react-hooks/set-state-in-effect`
 * for exactly that reason. This store is the idiomatic form: subscribe, return
 * a version number, recompute during render.
 */
let version = 0;
const listeners = new Set<() => void>();

function bump() {
  version += 1;
  for (const l of listeners) l();
}

// The theme event name is duplicated here on purpose (not imported): the
// metrics store must not depend on the theme module, and the string is the
// contract (THEME_CHANGE_EVENT in theme/colorScheme.ts).
const THEME_EVENT = 'phy-themechange';

function subscribe(onChange: () => void) {
  if (listeners.size === 0) {
    window.addEventListener('resize', bump);
    document.addEventListener(THEME_EVENT, bump);
  }
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      window.removeEventListener('resize', bump);
      document.removeEventListener(THEME_EVENT, bump);
    }
  };
}

/**
 * The snapshot IS the measurement, cached per version.
 *
 * This is the shape the hook has to take. Measuring the DOM belongs after the
 * commit, not during render — so a ref read inside a `useMemo` is wrong, and
 * mirroring the result into `useState` from an effect is the round trip
 * `set-state-in-effect` exists to stop. Letting the external store do the
 * reading resolves both: the DOM is the external system, and the probe is found
 * by selector, which is exactly what an inspector does.
 */
let cache: Metric[] = [];
let cachedAt = -1;

const getSnapshot = (): Metric[] => {
  if (cachedAt !== version) {
    cache = measureDom();
    cachedAt = version;
  }
  return cache;
};

const getServerSnapshot = (): Metric[] => [];

/** Attribute the lab puts on its sample paragraph. */
export const PROBE_ATTR = 'data-phy-probe';

/**
 * Measures the page as it actually renders, rather than restating what the CSS
 * was supposed to do. That distinction is the whole point of a debugging view:
 * a token file says the measure is 60ch, and only the DOM can say whether that
 * landed inside 45-75 characters in the font that actually loaded.
 */
function measureDom(): Metric[] {
  {
    if (typeof document === 'undefined') return [];
    const root = getComputedStyle(document.documentElement);
    const token = (n: string) => root.getPropertyValue(n).trim();
    const out: Metric[] = [];

    const vw = window.innerWidth;
    out.push({ label: 'viewport', value: `${vw} × ${window.innerHeight} px` });

    const de = document.documentElement;
    const overflow = de.scrollWidth > de.clientWidth;
    out.push({
      label: 'desbordamiento horizontal',
      value: overflow ? `sí — ${de.scrollWidth}px en ${de.clientWidth}px` : 'no',
      ok: !overflow,
      note: 'la falla móvil clásica; a 320px no debe aparecer nunca',
    });

    const grid = document.querySelector('.phy-grid');
    if (grid) {
      const cols = getComputedStyle(grid)
        .gridTemplateColumns.split(' ')
        .filter((c) => c.endsWith('px'));
      // The narrow branch is a CONTAINER query, so it is the wrapper's width
      // that decides — not the viewport. Measuring the wrapper is the honest
      // reading; using innerWidth would be right only while they coincide.
      const wrap = grid.closest('.phy-grid-wrap');
      const wrapW = wrap ? wrap.getBoundingClientRect().width : vw;
      const narrow = wrapW < 52 * 16;
      out.push({
        label: 'modo de rejilla',
        value: narrow
          ? 'angosto — todo abarca las 12'
          : 'ancho — 12 columnas (2 lateral + 8 contenido + 2 lateral)',
        note: `container query sobre ${Math.round(wrapW)}px, umbral 52rem`,
      });
      if (cols.length) out.push({ label: 'pistas de la rejilla', value: cols.join('  ') });
    }

    // S8.5 — distribution on a wide screen: how far the grid's centre sits from
    // the viewport's, and how much of the viewport the grid occupies.
    const wrap = document.querySelector('.phy-grid-wrap');
    if (wrap) {
      const w = wrap.getBoundingClientRect();
      const off = Math.round(w.left + w.width / 2 - vw / 2);
      out.push({
        label: 'centro de la página',
        value: `${off >= 0 ? '+' : ''}${off} px del centro del viewport`,
        ok: Math.abs(off) <= 8,
        note: `rejilla de ${Math.round(w.width)} px en ${vw}; tope --phy-page-max`,
      });
    }

    const probe = document.querySelector(`[${PROBE_ATTR}]`);
    if (probe) {
      const w = probe.getBoundingClientRect().width;
      const per = avgGlyph(probe);
      const st = getComputedStyle(probe);
      out.push({ label: 'ancho de la medida', value: `${Math.round(w)} px` });
      out.push({
        label: 'tamaño de cuerpo',
        value: st.fontSize,
        note: 'fluido: clamp() con término rem',
      });
      if (per) {
        const chars = Math.round(w / per);
        out.push({
          label: 'caracteres por línea',
          value: `${chars}`,
          ok: chars >= 45 && chars <= 75,
          note: 'Bringhurst: 45–75, óptimo 66',
        });
      }
      const ratio = contrast(st.color, getComputedStyle(document.body).backgroundColor);
      if (ratio) {
        out.push({
          label: 'contraste del cuerpo',
          value: `${ratio.toFixed(2)}:1`,
          ok: ratio >= 4.5,
          note: 'WCAG AA pide 4.5:1',
        });
      }
    }

    // S8.1 — the ruler bars in the lab carry data-phy-space="<step|pair|flow-*>"
    // and their inline-size IS the token; reading their box reads the token as
    // the engine resolved it at THIS viewport. The between/within ratio is the
    // proximity rule evaluated live, the same rule the tokens testbench gates
    // at 320 and 1280 px.
    const bars = document.querySelectorAll<HTMLElement>('[data-phy-space]');
    const px: Record<string, number> = {};
    bars.forEach((b) => {
      const name = b.dataset.phySpace;
      if (name) px[name] = b.getBoundingClientRect().width;
    });
    for (const [name, w] of Object.entries(px)) {
      if (name.startsWith('flow-')) continue;
      out.push({
        group: 'space',
        label: `espacio ${name}`,
        value: `${w.toFixed(2)} px`,
        note: name.includes('-')
          ? 'par: paso inferior a 320px, superior a 1280px'
          : '×1.125 de 320 a 1280px',
      });
    }
    if (px['flow-between'] && px['flow-within']) {
      const r = px['flow-between'] / px['flow-within'];
      out.push({
        group: 'space',
        label: 'entre / dentro',
        value: r.toFixed(2),
        ok: r >= 2,
        note: 'proximidad Gestalt: ≥ 2 en ambos extremos del rango',
      });
    }

    // S8.2 — what the engine actually resolved for the scheme: the used
    // color-scheme on the root and the body background it produced.
    const html = getComputedStyle(document.documentElement);
    out.push({ group: 'scheme', label: 'color-scheme (raíz)', value: html.colorScheme || '—' });
    out.push({
      group: 'scheme',
      label: 'atributo data-theme',
      value: document.documentElement.dataset.theme ?? '(ausente: sigue al sistema)',
    });
    out.push({
      group: 'scheme',
      label: 'fondo del cuerpo',
      value: getComputedStyle(document.body).backgroundColor,
      note: 'light-dark() resuelto por el motor, no leído del token',
    });

    out.push({
      label: 'medida declarada',
      value: token('--phy-measure') || '—',
    });
    out.push({
      label: 'columnas',
      value: '12 fluidas (2 lateral + 8 contenido + 2 lateral)',
    });
    return out;
  }
}

/**
 * The lab's live measurements of the page (viewport, overflow, grid mode, measure, contrast,
 * space tokens, colour scheme), re-read on resize and on a theme change. Development-only.
 */
export function useLiveMetrics(): Metric[] {
  // One bump after mount so the first paint measures a DOM that exists.
  useEffect(bump, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Made with my soul - Swately <3
