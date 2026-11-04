import Stack from '../layout/Stack';
import Cluster from '../layout/Cluster';
import Grid from '../layout/Grid';
import Box from '../layout/Box';
import Container from '../layout/Container';
import DescList from '../layout/DescList';
import Text from '../text/Text';
import Sidebar from '../shell/Sidebar';
import GridOverlay from './GridOverlay';
import { useLiveMetrics, PROBE_ATTR, type Metric } from './useLiveMetrics';
import ThemeToggle from '../theme/ThemeToggle';
import { useWebVitals } from './useWebVitals';
import { Link, usePath } from '../router/router';

import styles from './StandardsLab.module.css';

const SPACE = ['3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'] as const;
const SPACE_PAIRS = ['s-m', 'm-l', 'l-xl', 'xl-2xl', '2xl-3xl'] as const;
const TEXT = ['xs', 'sm', 'base', 'md', 'lg', 'xl'] as const;
const COLOR = [
  ['--phy-paper', 'fondo'],
  ['--phy-paper-2', 'superficie elevada'],
  ['--phy-ink', 'texto'],
  ['--phy-ink-muted', 'texto atenuado'],
  ['--phy-rule', 'filete'],
  ['--phy-accent', 'acento'],
] as const;

function Section({
  id,
  title,
  blurb,
  children,
}: {
  id: string;
  title: string;
  blurb?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="phy-full phy-subgrid" aria-labelledby={id}>
      <Text as="h2" size="md" id={id}>
        {title}
      </Text>
      {blurb && (
        <Text size="sm" muted>
          {blurb}
        </Text>
      )}
      <div className="phy-full">{children}</div>
    </section>
  );
}

function MetricRow({ m }: { m: Metric }) {
  return (
    <div className={styles.metric}>
      <Text as="span" size="xs" mono muted>
        {m.label}
      </Text>
      <Text
        as="span"
        size="sm"
        mono
        className={m.ok === false ? styles.bad : m.ok ? styles.good : undefined}
      >
        {m.value}
      </Text>
      <Text as="span" size="xs" muted>
        {m.note ?? ''}
      </Text>
    </div>
  );
}

/**
 * The standards lab: every section, primitive and scale of the design system on
 * one page, with the page's own measurements taken live from the DOM.
 *
 * It is a debugging instrument first. The numbers at the top are MEASURED, not
 * restated from the token file — a token can say the measure is 60ch while the
 * font that actually loaded puts 90 characters on a line, and only the DOM
 * knows which happened. Resize the window and every figure re-reads.
 *
 * Mount it on a route in development only. It is not public-facing furniture.
 */
export default function StandardsLab() {
  const metrics = useLiveMetrics();
  const vitals = useWebVitals();

  return (
    <>
      {/* The lab is a page too: the title discipline applies to the instrument. */}
      <title>Laboratorio de estándares</title>
      <Stack as="section" gap="xs" aria-labelledby="lab-h">
        <Text as="h2" size="lg" id="lab-h">
          Laboratorio del estándar
        </Text>
        <Text muted>
          Todas las secciones, primitivas y escalas del sistema en una página, con las medidas
          tomadas del DOM en vivo. Cambie el tamaño de la ventana y los números se recalculan.
        </Text>
        {/* The probe. The metrics store finds it by attribute rather than by
            ref, so nothing reads the DOM during render. */}
        <Text size="base" {...{ [PROBE_ATTR]: 'true' }}>
          Este párrafo es la sonda: de él se miden el ancho de la medida, el tamaño de cuerpo
          efectivo, los caracteres por línea y el contraste real contra el fondo. Es texto normal a
          propósito, porque medir sobre un caso especial no dice nada del caso común.
        </Text>
      </Stack>

      <Section
        id="lab-metrics"
        title="Métricas en vivo"
        blurb="Medido en el navegador, no copiado de los tokens. Verde = dentro del umbral; rojo = fuera."
      >
        <Stack gap="3xs">
          {metrics
            .filter((m) => !m.group)
            .map((m) => (
              <MetricRow m={m} key={m.label} />
            ))}
        </Stack>
      </Section>

      <Section
        id="lab-grid"
        title="La rejilla de 12 columnas"
        blurb="Doce columnas fluidas que dividen la página: 2 barra lateral + 8 contenido + 2 barra lateral. La prosa se coloca en la columna 3 y se corta a la medida; lo que no es prosa toma las 8."
      >
        <Text size="sm">
          La superposición dibuja las columnas <em>reales</em> sobre la página, no una maqueta:
          repite las mismas declaraciones que la rejilla (mismo número de pistas, mismo espaciado,
          mismo margen). Si el contenido no cae sobre esas líneas, la maquetación está mal — para
          eso se mira. Actívela con el botón o con la tecla <kbd>g</kbd>.
        </Text>
      </Section>

      <Section
        id="lab-container"
        title="Container: dividirse o heredar"
        blurb="Un Container llena el espacio que recibe. `span` dice cuánto toma del padre; `cols` lo divide en columnas propias; `subgrid` hereda las del padre. Elegir mal no da síntoma: simplemente deja de alinear."
      >
        <Stack gap="m">
          <Stack gap="2xs">
            <Text as="span" size="xs" mono muted>
              subgrid — hereda las líneas del padre, alinea con la página
            </Text>
            <Container cols={12} gap="s">
              <Container span={2} className={styles.demoCell}>
                <Text as="span" size="xs" mono>
                  span 2
                </Text>
              </Container>
              <Container span={8} subgrid gap="s">
                <Container span={3} className={styles.demoCell}>
                  <Text as="span" size="xs" mono>
                    3
                  </Text>
                </Container>
                <Container span={5} className={styles.demoCell}>
                  <Text as="span" size="xs" mono>
                    5 — sus bordes caen en columnas reales
                  </Text>
                </Container>
              </Container>
              <Container span={2} className={styles.demoCell}>
                <Text as="span" size="xs" mono>
                  span 2
                </Text>
              </Container>
            </Container>
          </Stack>

          <Stack gap="2xs">
            <Text as="span" size="xs" mono muted>
              cols — rejilla propia; correcto dentro de una tarjeta, engañoso para una región de
              página
            </Text>
            <Container cols={12} gap="s">
              <Container span={8} cols={8} gap="s" className={styles.demoNested}>
                <Container span={3} className={styles.demoCell}>
                  <Text as="span" size="xs" mono>
                    3 de 8 locales
                  </Text>
                </Container>
                <Container span={5} className={styles.demoCell}>
                  <Text as="span" size="xs" mono>
                    5 — el borde NO coincide con la página
                  </Text>
                </Container>
              </Container>
            </Container>
            <Text size="sm" muted>
              Active la superposición (<kbd>g</kbd>) y compare los dos bloques: en el primero los
              cortes caen sobre las líneas rojas; en el segundo caen donde toque.
            </Text>
          </Stack>
        </Stack>
      </Section>

      <Section
        id="lab-type"
        title="Escala tipográfica"
        blurb="Razón 1.2, fluida entre 320 y 1280px."
      >
        <Stack gap="2xs" align="start">
          {TEXT.map((step) => (
            <Cluster gap="m" key={step} align="baseline">
              <Text as="span" size="xs" mono muted className={styles.stepName}>
                {step}
              </Text>
              <Text as="span" size={step}>
                Generación de cuadros
              </Text>
            </Cluster>
          ))}
        </Stack>
      </Section>

      <Section
        id="lab-space"
        title="Escala de espaciado"
        blurb="Multiplicativa, razón 1.5, y fluida desde tokens 0.9.0: cada paso vale lo de siempre a 320px y ×1.125 a 1280px. La percepción del espacio es logarítmica: 4 y 8 se distinguen, 24 y 28 no."
      >
        <Stack gap="2xs">
          {SPACE.map((step) => (
            <Cluster gap="m" key={step} align="center">
              <Text as="span" size="xs" mono muted className={styles.stepName}>
                {step}
              </Text>
              <span
                className={styles.spaceBar}
                data-phy-space={step}
                style={{ inlineSize: `var(--phy-space-${step})` }}
              />
            </Cluster>
          ))}
        </Stack>
      </Section>

      {/* S8.1 — pairs and the proximity rule, measured. The bars ARE the source:
          the metrics store reads their boxes, so the number is the token as the
          engine resolved it at this viewport, not the formula restated. */}
      <Section
        id="lab-space-fluid"
        title="Espacio fluido y pares (S8.1)"
        blurb="Un par es el paso inferior a 320px y el superior a 1280px, sin breakpoint. Las barras son la fuente de la medida (los nueve pasos se leen de las barras de la sección anterior); cambie el ancho y vuelva a leer."
      >
        <Stack gap="s">
          <Stack gap="2xs">
            {SPACE_PAIRS.map((pair) => (
              <Cluster gap="m" key={pair} align="center">
                <Text as="span" size="xs" mono muted className={styles.pairName}>
                  {pair}
                </Text>
                <span
                  className={styles.spaceBar}
                  data-phy-space={pair}
                  style={{ inlineSize: `var(--phy-space-${pair})` }}
                />
              </Cluster>
            ))}
            <Cluster gap="m" align="center">
              <Text as="span" size="xs" mono muted className={styles.pairName}>
                entre
              </Text>
              <span
                className={styles.spaceBar}
                data-phy-space="flow-between"
                style={{ inlineSize: 'var(--phy-flow-between)' }}
              />
            </Cluster>
            <Cluster gap="m" align="center">
              <Text as="span" size="xs" mono muted className={styles.pairName}>
                dentro
              </Text>
              <span
                className={styles.spaceBar}
                data-phy-space="flow-within"
                style={{ inlineSize: 'var(--phy-flow-within)' }}
              />
            </Cluster>
          </Stack>
          <Stack gap="3xs">
            {metrics
              .filter((m) => m.group === 'space')
              .map((m) => (
                <MetricRow m={m} key={m.label} />
              ))}
          </Stack>
          <Text size="sm" muted>
            Sólo xl-2xl y 2xl-3xl mantienen «entre ≥ 2 × dentro» en el extremo angosto; los pares
            menores son ritmo dentro de un grupo, no entre grupos.
          </Text>
        </Stack>
      </Section>

      <Section
        id="lab-color"
        title="Color"
        blurb="Roles semánticos, nunca literales. Un rol por fila, con su valor computado."
      >
        <Stack gap="3xs">
          {COLOR.map(([token, role]) => (
            <div className={styles.metric} key={token}>
              <Text as="span" size="xs" mono muted>
                {token}
              </Text>
              <Cluster gap="xs" align="center">
                <span className={styles.swatch} style={{ background: `var(${token})` }} />
                <Text as="span" size="xs" mono>
                  {role}
                </Text>
              </Cluster>
              <Text as="span" size="xs" muted />
            </div>
          ))}
        </Stack>
      </Section>

      <Section
        id="lab-prims"
        title="Primitivas de maquetación"
        blurb="Stack (columna), Cluster (fila que envuelve), Grid (columnas intrínsecas), Box (superficie), DescList (término/descripción)."
      >
        <Stack gap="m">
          <Box variant="surface" padding="m">
            <Stack gap="xs">
              <Text as="span" size="xs" mono muted>
                Stack gap=&quot;xs&quot;
              </Text>
              <Text as="span" size="sm">
                primer elemento
              </Text>
              <Text as="span" size="sm" muted>
                segundo elemento
              </Text>
            </Stack>
          </Box>

          <Box variant="surface" padding="m">
            <Stack gap="xs">
              <Text as="span" size="xs" mono muted>
                Cluster gap=&quot;s&quot; — envuelve solo
              </Text>
              <Cluster gap="s">
                {['C++23', 'CUDA', 'Vulkan', 'VHDL', 'React', 'TypeScript'].map((t) => (
                  <Box key={t} variant="surface" padding="2xs">
                    <Text as="span" size="xs" mono>
                      {t}
                    </Text>
                  </Box>
                ))}
              </Cluster>
            </Stack>
          </Box>

          <Stack gap="xs">
            <Text as="span" size="xs" mono muted>
              Grid min=&quot;12rem&quot; — columnas derivadas del espacio, sin breakpoint
            </Text>
            <Grid min="12rem" gap="s">
              {[1, 2, 3, 4].map((n) => (
                <Box key={n} variant="surface" padding="s">
                  <Text as="span" size="sm">
                    celda {n}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Stack>

          <Stack gap="xs">
            <Text as="span" size="xs" mono muted>
              DescList — dos columnas cuando SU contenedor tiene sitio (container query)
            </Text>
            <DescList
              termWidth="8rem"
              items={[
                {
                  key: 'a',
                  term: (
                    <Text as="span" size="sm" mono muted>
                      término
                    </Text>
                  ),
                  desc: (
                    <Text as="span" size="sm">
                      La descripción ocupa el resto de la línea cuando hay espacio, y se apila
                      cuando no.
                    </Text>
                  ),
                },
                {
                  key: 'b',
                  term: (
                    <Text as="span" size="sm" mono muted>
                      otro
                    </Text>
                  ),
                  desc: (
                    <Text as="span" size="sm">
                      Estréche la ventana y esta lista cambia sola, sin consultar el tamaño de
                      pantalla.
                    </Text>
                  ),
                },
              ]}
            />
          </Stack>
        </Stack>
      </Section>

      <Section
        id="lab-shell"
        title="Estructura de página"
        blurb="El encabezado y el pie de esta misma página son los del sistema. Abajo, la barra lateral, que se apila sin breakpoint."
      >
        <Box variant="surface" padding="m">
          <Sidebar
            sideWidth="12rem"
            contentMin="55%"
            gap="m"
            sidebar={
              <Stack gap="2xs">
                <Text as="span" size="xs" mono muted>
                  barra lateral
                </Text>
                <Text as="span" size="sm">
                  navegación, filtros o índice
                </Text>
              </Stack>
            }
          >
            <Stack gap="2xs">
              <Text as="span" size="xs" mono muted>
                contenido
              </Text>
              <Text size="sm">
                Se ponen lado a lado mientras el contenido conserve su porción mínima de la línea;
                cuando deja de caber, la línea se rompe y se apilan. No hay consulta de ancho de
                pantalla en ninguna parte de esto.
              </Text>
            </Stack>
          </Sidebar>
        </Box>
      </Section>

      <Section
        id="lab-states"
        title="Regiones y objetivos"
        blurb="Región desplazable con su afordancia en CSS puro, y el área táctil mínima."
      >
        <Stack gap="m">
          <div
            className="phy-scroll-x"
            tabIndex={0}
            role="region"
            aria-label="Demostración de región desplazable"
          >
            <div className={styles.wideStrip}>
              contenido más ancho que su contenedor — la sombra aparece solo del lado que aún tiene
              contenido fuera de pantalla, y desaparece cuando ya no desborda
            </div>
          </div>
          <Cluster gap="m">
            <a href="#lab-h" className="phy-target">
              enlace de acción (área ≥ 24px)
            </a>
            <Text as="span" size="sm">
              frente a un <a href="#lab-h">enlace dentro de una frase</a>, que la norma exime a
              propósito.
            </Text>
          </Cluster>
        </Stack>
      </Section>

      {/* S1.3 — route correctness, watchable. The live title and path come
          straight from the DOM/router; the links let you watch the S1
          behaviour happen: title swap in the tab, focus landing on main. */}
      <Section id="lab-ruta" title="Correctitud de ruta (S1)">
        <Stack gap="s">
          <DescList
            termWidth="12rem"
            items={[
              {
                key: 'title',
                term: 'document.title vivo',
                desc: document.title,
              },
              { key: 'path', term: 'ruta actual (usePath)', desc: usePath() },
            ]}
          />
          <Text size="sm">
            Al navegar: el título de la pestaña cambia (React 19 eleva el <code>&lt;title&gt;</code>{' '}
            de cada página), el foco aterriza en <code>main</code> — eso ES el anuncio — y en push
            se vuelve al tope; atrás/adelante conserva el scroll del navegador.
          </Text>
          <Cluster gap="m">
            <Link to="/" className="phy-target">
              Ir al índice (mira pestaña y foco)
            </Link>
            <Link to="/lab-viaje-404" className="phy-target">
              Ir a una ruta inexistente (el 404 también titula)
            </Link>
          </Cluster>
        </Stack>
      </Section>

      {/* S8.2 — the scheme is a palette (light-dark() in the tokens); this
          section only flips the override attribute and re-reads what the engine
          resolved. The body-contrast metric at the top re-measures with it. */}
      <Section
        id="lab-scheme"
        title="Esquema de color (S8.2)"
        blurb="Sin atributo, la página sigue la preferencia del sistema sin JavaScript. El botón fija data-theme en <html> y lo persiste; cada color es light-dark() en los tokens, así que todo elemento ya es oscuro por construcción."
      >
        <Stack gap="s" align="start">
          <ThemeToggle
            prefix="Tema"
            labels={{ system: 'Sistema', light: 'Claro', dark: 'Oscuro' }}
          />
          <Stack gap="3xs">
            {metrics
              .filter((m) => m.group === 'scheme')
              .map((m) => (
                <MetricRow m={m} key={m.label} />
              ))}
          </Stack>
        </Stack>
      </Section>

      <GridOverlay />
      {/* S8.0 — the perceived-performance instrument. Approximations of the
          official algorithms, labelled per cell; thresholds [V1] from
          web.dev/articles/vitals (2026-08-30). A hidden tab suppresses paints:
          read this with the tab in front. */}
      <Section id="lab-vitals" title="Rendimiento percibido (S8.0)">
        <Stack gap="s">
          <DescList
            termWidth="6rem"
            items={vitals.map((v) => ({
              key: v.name,
              term: v.name,
              desc:
                v.value === null
                  ? '— (sin entradas todavía)'
                  : `${v.unit === 'ms' ? Math.round(v.value) + ' ms' : v.value.toFixed(3)}` +
                    (v.good === null
                      ? ' · contexto'
                      : v.value <= v.good
                        ? ` · bueno (≤ ${v.good}${v.unit === 'ms' ? ' ms' : ''})`
                        : ` · por encima de ${v.good}${v.unit === 'ms' ? ' ms' : ''}`) +
                    ` · ${v.approximation}`,
            }))}
          />
          <Text size="sm" muted>
            Umbrales «bueno» al percentil 75: LCP 2.5 s · INP 200 ms · CLS 0.1. Aproximaciones
            declaradas por celda; la medición oficial es la librería web-vitals de Google.
          </Text>
        </Stack>
      </Section>
    </>
  );
}

// Made with my soul - Swately <3
