import type { Claim, FigureEvidence } from '../content';

/**
 * The "Sustrato web" page's ledger (route /sustrato-web). Same discipline as the projects' ledger: every
 * assertion is a `Claim`, so `evidence` is required and `tsc` fails an assertion with no backing; the numbers
 * are recorded in docs/SUSTRATO_WEB_EVIDENCE.md with the command that produced them, and substrate.test.ts
 * fails when a number printed here is not written in that record (the type gate proofs against OMISSION, this
 * test against DRIFT between the page and its record; neither can know a number is false: the record's
 * commands were run first-hand, 2026-11-04).
 *
 * This is the one ledger that is not a `Project`: the substrate is the site's own foundation, not a work
 * item, so it stays out of the list the home page is.
 */

/** Where the evidence record lives once the site is published (the repository is public). */
export const REPO_BLOB = 'https://github.com/Swately/portfolio/blob/main/';
export const EVIDENCE_DOC = `${REPO_BLOB}docs/SUSTRATO_WEB_EVIDENCE.md`;
export const PAGES_ROOT = 'https://swately.github.io/portfolio/';

/** The versions the page names; substrate.test.ts compares them with the vendored files' own `@version`. */
export const SUBSTRATE_VERSIONS = { tokens: '2.1.1', react: '1.4.0' } as const;

/** The architecture diagram, from figure-sources/sustrato_flujo.tex (TikZ, figure contract). */
export const substrateFigure: FigureEvidence = {
  kind: 'figure',
  file: 'img/sustrato_flujo.svg',
  alt:
    'Diagrama del flujo del sustrato: el catálogo, con phyriad-tokens y phyriad-react, se copia mediante ' +
    'sync.mjs a cuatro consumidores; debajo, las compuertas que lo vigilan.',
  caption:
    'Un cambio nace en el catálogo, se copia a cada sitio con un hash por archivo y lo vigilan las ' +
    'compuertas; fleet-check recorre las copias y dice cuáles van atrasadas.',
  width: 584,
  height: 249,
  textEquivalent: [
    'El catálogo contiene dos paquetes: phyriad-tokens 2.1.1 (roles de color, paletas y escala tipográfica) y phyriad-react 1.4.0 (componentes y estado).',
    'sync.mjs copia el catálogo a cada consumidor y guarda un hash por archivo; así distingue si cambió el consumidor o cambió el catálogo.',
    'Los consumidores son el laboratorio (test-page), el portafolio, un panel de monitoreo y PhyriadFG; cada uno tiene su propia copia.',
    'Las compuertas vigilan el conjunto: el testbench de tokens, el de react, API.md generado, el presupuesto de tamaño y axe, además de fleet-check, que recorre las copias y dice cuáles van atrasadas.',
  ],
};

/**
 * Values the claims print. Kept in ONE place so the test can check each against the evidence record.
 * `portfolio*` are the site's own gates at the last measurement (the record lists the commands).
 */
export const measured = {
  fleet: '5 copias, 1 atrasada',
  tokensChecks: '237 de 237 comprobaciones',
  reactChecks: '108 exportaciones · 16 comprobaciones',
  scaleDelta: '0,001 px en Chromium · 0,031 px en Firefox 157',
  synced: '120 archivos coinciden',
  budget: 'JS 129,7 de 135 kB · CSS 8,7 de 9 kB',
  axe: '0 violaciones',
} as const;

export const substrateClaims: Claim[] = [
  {
    text:
      'Un sitio no enlaza el sustrato: lleva su copia, y una copia dice qué versión es y si está al día. ' +
      'El revisor de copias recorrió los proyectos del contenedor y encontró cuántas van atrasadas.',
    evidence: {
      kind: 'number',
      value: measured.fleet,
      instrument: 'node catalog/web/fleet-check.mjs',
      source: 'docs/SUSTRATO_WEB_EVIDENCE.md, «fleet-check»',
      url: `${EVIDENCE_DOC}#fleet-check`,
    },
  },
  {
    text:
      'Los tokens se comprueban en lugar de confiar en ellos: el testbench calcula el contraste WCAG de cada par ' +
      'de colores en cada paleta y cada esquema, y la tipografía fluida debe seguir respetando el zoom del lector.',
    evidence: {
      kind: 'number',
      value: measured.tokensChecks,
      instrument: 'node catalog/web/tokens/testbench.mjs',
      source: 'docs/SUSTRATO_WEB_EVIDENCE.md, «Testbench de tokens»',
      url: `${EVIDENCE_DOC}#testbench-de-tokens`,
    },
  },
  {
    text:
      'Los componentes tienen una referencia generada del propio código, no escrita a mano, y un testbench de ' +
      'invariantes: por ejemplo, ningún CSS de componente usa un umbral de ancho que no esté en el vocabulario único.',
    evidence: {
      kind: 'number',
      value: measured.reactChecks,
      instrument:
        'node catalog/web/react/gen-api.mjs --check · node catalog/web/react/testbench.mjs',
      source: 'docs/SUSTRATO_WEB_EVIDENCE.md, «Testbench de react»',
      url: `${EVIDENCE_DOC}#testbench-de-react`,
    },
  },
  {
    text:
      'Tres paletas (Vitrina, Óxido y Maid) y tres temas tipográficos (Editorial, Neutral y Técnica) se eligen ' +
      'con un atributo en el elemento raíz de la página; ningún componente nombra un color o una familia literal.',
    evidence: {
      kind: 'doc',
      label: 'docs/SUSTRATO_WEB_EVIDENCE.md, «Paletas y temas»',
      url: `${EVIDENCE_DOC}#paletas-y-temas`,
    },
  },
  {
    text:
      'La escala tipográfica se calcula a partir de unos pocos números y reproduce los tamaños fijos de siempre: ' +
      'la mayor diferencia entre el tamaño calculado y el fijo de cada paso fue la que sigue (Firefox redondea ' +
      'los tamaños de letra a 1/64 de píxel).',
    evidence: {
      kind: 'number',
      value: measured.scaleDelta,
      instrument:
        'una página de prueba que lee, en cada motor, el tamaño calculado y el fijo de cada paso',
      source: 'docs/SUSTRATO_WEB_EVIDENCE.md, «Escala tipográfica»',
      url: `${EVIDENCE_DOC}#escala-tipográfica`,
    },
  },
  {
    text:
      'Este sitio usa el sustrato copiado y no se ha desviado de él: cada archivo coincide con el catálogo, ' +
      'comprobado con la herramienta que la propia copia lleva.',
    evidence: {
      kind: 'number',
      value: measured.synced,
      instrument: 'npm run substrate:check (node sync.mjs src --check)',
      source: 'docs/SUSTRATO_WEB_EVIDENCE.md, «Copia de este sitio»',
      url: `${EVIDENCE_DOC}#copia-de-este-sitio`,
    },
  },
  {
    text:
      'El tamaño es una compuerta, no una intención: el build falla si el JavaScript o el CSS pasan de su ' +
      'presupuesto (suma de todos los fragmentos, comprimidos con gzip).',
    evidence: {
      kind: 'number',
      value: measured.budget,
      instrument: 'npm run size:budget',
      source: 'docs/SUSTRATO_WEB_EVIDENCE.md, «Presupuesto de tamaño»',
      url: `${EVIDENCE_DOC}#presupuesto-de-tamaño`,
    },
  },
  {
    text:
      'Las páginas de esta sección se comprobaron con axe-core en tema claro y oscuro, con la comprobación de ' +
      'contraste activa y en un navegador de verdad: el motor de pruebas sin navegador no ve defectos de maquetación.',
    evidence: {
      kind: 'number',
      value: measured.axe,
      instrument: 'axe-core 4.13.0 en el navegador, tema claro y oscuro, a 1280 y a 390 px',
      source: 'docs/SUSTRATO_WEB_EVIDENCE.md, «Accesibilidad»',
      url: `${EVIDENCE_DOC}#accesibilidad`,
    },
  },
  {
    text: 'El camino completo de un cambio, desde el catálogo hasta los sitios y las compuertas que lo vigilan.',
    evidence: substrateFigure,
  },
  {
    text:
      'Las demostraciones son los componentes reales ejecutándose en un documento aparte, no capturas: ' +
      'abra la demostración sola y compruebe que responde a los mismos controles.',
    evidence: {
      kind: 'live',
      url: `${PAGES_ROOT}sustrato-web/demo`,
      label: 'La demostración, abierta sola, sin esta página',
    },
  },
];

/** What this page does not establish. Plain statements: each is a limit, not a claim, so none carries evidence. */
export const substrateLimits: string[] = [
  'Safari no se ha probado (necesita un Mac o un iPhone). La escala tipográfica calculada se verificó en Chromium y en Firefox 157.',
  'Los colores forzados (el alto contraste de Windows) no se midieron: los bordes transparentes de las superficies están pensados para ese caso, pero no se comprobaron en él.',
  'Una copia del sustrato puede quedarse atrás: el revisor de copias lo dice, pero actualizar sigue siendo una decisión de cada proyecto. PhyriadFG va atrasado.',
  'Una página solo puede mostrar una paleta a la vez, porque la paleta es un atributo del elemento raíz; por eso las demostraciones viven en un documento aparte.',
  'El laboratorio mide el dispositivo y la ventana de quien lo abre: sus cifras describen su pantalla, no una garantía sobre otras.',
];

// Made with my soul - Swately <3
