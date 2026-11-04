import { useEffect } from 'react';
import { Button, Cluster, Field, Input, Stack, Table, Text, type TextStep } from '../phyriad-react';
import styles from './SustratoDemo.module.css';

/**
 * The demonstration document of /sustrato-web: REAL substrate components running in a document of their own.
 * It is a window route (no site chrome) shown in an iframe, because a palette and a type theme are attributes
 * of the root element: a page can show one at a time, so the only way to show a choice without changing the
 * page that offers it is a second document.
 *
 * It takes its settings from the URL (`?palette=&type=&scale=`) and, afterwards, from `postMessage` of the
 * same origin. It sets the ATTRIBUTES directly and never goes through the substrate's type store, so nothing
 * here writes to the visitor's storage: a demo must not change the site's own look on the next visit.
 */

export const PALETTE_VALUES = ['showcase', 'oxide', 'maid'] as const;
export const TYPE_VALUES = ['editorial', 'neutral', 'technical'] as const;
export type DemoSettings = {
  palette: (typeof PALETTE_VALUES)[number];
  type: (typeof TYPE_VALUES)[number];
  scale: number;
  /** The visitor's colour scheme override, forwarded from the page; absent = follow the system. */
  scheme?: 'light' | 'dark';
};

const SCALE_MIN = 0.875;
const SCALE_MAX = 1.5;

/** Parse and clamp settings from a query string or a message; anything unknown falls back to the default. */
export function readSettings(input: Record<string, unknown>): DemoSettings {
  const palette = (PALETTE_VALUES as readonly unknown[]).includes(input.palette)
    ? (input.palette as DemoSettings['palette'])
    : 'showcase';
  const type = (TYPE_VALUES as readonly unknown[]).includes(input.type)
    ? (input.type as DemoSettings['type'])
    : 'editorial';
  const n = Number(input.scale);
  const scale = Number.isFinite(n) && n > 0 ? Math.min(SCALE_MAX, Math.max(SCALE_MIN, n)) : 1;
  const scheme = input.scheme === 'light' || input.scheme === 'dark' ? input.scheme : undefined;
  return { palette, type, scale, scheme };
}

/** Write the settings on THIS document's root, and nowhere else (no storage). */
export function applySettings(s: DemoSettings, root: HTMLElement = document.documentElement): void {
  if (s.palette === 'showcase') delete root.dataset.palette;
  else root.dataset.palette = s.palette;
  if (s.type === 'editorial') delete root.dataset.type;
  else root.dataset.type = s.type;
  if (s.scale === 1) root.style.removeProperty('--phy-type-scale');
  else root.style.setProperty('--phy-type-scale', String(s.scale));
  if (s.scheme) root.dataset.theme = s.scheme;
  else delete root.dataset.theme;
}

const STEPS: TextStep[] = ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

export default function SustratoDemo() {
  useEffect(() => {
    // This document is shown inside another page that has its own <main>; two unnamed `main` landmarks collide
    // (axe: landmark-unique, measured 2026-11-04 when the page was analysed together with its box). The shell
    // renders this <main>, so it is named here, which also says to a screen reader what it has entered.
    document.querySelector('main')?.setAttribute('aria-label', 'Demostración del sustrato');
    applySettings(readSettings(Object.fromEntries(new URLSearchParams(window.location.search))));
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data as { type?: string; settings?: Record<string, unknown> } | null;
      if (d?.type === 'phy-demo-settings' && d.settings) applySettings(readSettings(d.settings));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className={styles.demo}>
      <title>Demostración del sustrato</title>
      <Stack gap="m">
        <Text as="h1" size="xl" face="heading">
          Demostración
        </Text>
        <Text>
          Esto es phyriad-react ejecutándose, no una captura. El texto de cuerpo usa el papel de
          familia «cuerpo» y los títulos el de «títulos»: el tema tipográfico decide cuál es cada
          una.
        </Text>

        <Stack as="section" gap="3xs" aria-labelledby="demo-escala">
          <Text as="h2" size="md" face="heading" id="demo-escala">
            La escala, de xs a 4xl
          </Text>
          {STEPS.map((s) => (
            <Text key={s} size={s}>
              {s} · Aa 0123
            </Text>
          ))}
        </Stack>

        <Stack as="section" gap="xs" aria-labelledby="demo-tabla">
          <Text as="h2" size="md" face="heading" id="demo-tabla">
            Una tabla que pide el ancho de sus columnas
          </Text>
          <Table
            caption="Tabla con width, columns y surface"
            width="content"
            columns="even"
            stickyFirst
            surface
          >
            <thead>
              <tr>
                <th scope="col">Pieza</th>
                <th scope="col">Qué hace</th>
                <th scope="col">Dónde vive</th>
                <th scope="col">Cómo se comprueba</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Tokens', 'Colores, escala y espacio', 'phyriad-tokens', 'Testbench que calcula'],
                [
                  'Componentes',
                  'Texto, tablas, formularios',
                  'phyriad-react',
                  'Referencia generada',
                ],
                ['Copia', 'Lleva el sustrato a un sitio', 'sync.mjs', 'Hash por archivo'],
              ].map((row) => (
                <tr key={row[0]}>
                  <th scope="row">{row[0]}</th>
                  {row.slice(1).map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>

        <Stack as="section" gap="xs" aria-labelledby="demo-controles">
          <Text as="h2" size="md" face="heading" id="demo-controles">
            Controles
          </Text>
          <Cluster gap="xs">
            <Button type="button">Acción</Button>
            <Button type="button">Otra acción</Button>
          </Cluster>
          <Field label="Un campo de texto">
            <Input placeholder="Escriba aquí" />
          </Field>
        </Stack>

        <div className={`phy-surface ${styles.card}`}>
          <Text as="h2" size="md" face="heading">
            Una superficie
          </Text>
          <Text size="sm" muted>
            Una zona separada por tono, sin línea ni sombra. Su borde es transparente: en alto
            contraste el navegador lo dibuja.
          </Text>
        </div>
      </Stack>
    </div>
  );
}

// Made with my soul - Swately <3
