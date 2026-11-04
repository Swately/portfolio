import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Cluster, Field, Select, Stack, Text, THEME_CHANGE_EVENT } from '../phyriad-react';
import { readSettings, type DemoSettings } from '../pages/SustratoDemo';
import styles from './SubstrateDemoFrame.module.css';

/**
 * The controls of the demonstration and the iframe that shows the result (the operator chose, 2026-11-04, the
 * recommendation that the demonstration changes ONE box, never the page the visitor is reading). The settings travel to
 * the demonstration document by `postMessage` of the same origin; the visitor's own colour scheme is forwarded
 * so the box keeps following the site's toggle.
 */
const PALETTES: { value: DemoSettings['palette']; label: string }[] = [
  { value: 'showcase', label: 'Vitrina' },
  { value: 'oxide', label: 'Óxido' },
  { value: 'maid', label: 'Maid' },
];
const TYPES: { value: DemoSettings['type']; label: string }[] = [
  { value: 'editorial', label: 'Editorial (serif)' },
  { value: 'neutral', label: 'Neutral (sans)' },
  { value: 'technical', label: 'Técnica (títulos en mono)' },
];

/** The page's colour scheme override as the demonstration understands it; absent = follow the system. */
const currentScheme = (): DemoSettings['scheme'] => {
  const t = document.documentElement.dataset.theme;
  return t === 'light' || t === 'dark' ? t : undefined;
};

export default function SubstrateDemoFrame() {
  const [palette, setPalette] = useState<DemoSettings['palette']>('showcase');
  const [type, setType] = useState<DemoSettings['type']>('editorial');
  const [scale, setScale] = useState(1);
  const frame = useRef<HTMLIFrameElement>(null);
  const scaleId = useId();
  const src = `${import.meta.env.BASE_URL}sustrato-web/demo`;

  const send = useCallback(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    target.postMessage(
      {
        type: 'phy-demo-settings',
        settings: readSettings({ palette, type, scale, scheme: currentScheme() }),
      },
      window.location.origin,
    );
  }, [palette, type, scale]);

  // every change of the controls, and every change of the page's own colour scheme
  useEffect(() => {
    send();
    document.addEventListener(THEME_CHANGE_EVENT, send);
    return () => document.removeEventListener(THEME_CHANGE_EVENT, send);
  }, [send]);

  return (
    <Stack gap="s" className={`phy-wide ${styles.box}`}>
      <Cluster gap="s" align="end">
        <Field label="Paleta">
          <Select
            value={palette}
            onChange={(e) => setPalette(e.currentTarget.value as typeof palette)}
          >
            {PALETTES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tema tipográfico">
          <Select value={type} onChange={(e) => setType(e.currentTarget.value as typeof type)}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
        <span className={styles.scale}>
          <label htmlFor={scaleId}>
            <Text as="span" size="sm">
              Tamaño del texto
            </Text>
          </label>
          <input
            id={scaleId}
            type="range"
            min={0.875}
            max={1.5}
            step={0.125}
            value={scale}
            onChange={(e) => setScale(Number(e.currentTarget.value))}
            aria-valuetext={`${Math.round(scale * 100)} %`}
          />
          <output htmlFor={scaleId} className={styles.value}>
            {Math.round(scale * 100)} %
          </output>
        </span>
      </Cluster>
      <iframe
        ref={frame}
        src={src}
        title="Demostración del sustrato web en un documento aislado"
        loading="lazy"
        className={styles.frame}
        onLoad={send}
      />
      <Text size="sm" muted>
        Los controles cambian solo esta caja: la paleta y la tipografía son atributos del elemento
        raíz de un documento, y la caja es otro documento.
      </Text>
    </Stack>
  );
}

// Made with my soul - Swately <3
