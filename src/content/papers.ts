import type { Claim } from '../content';
import { PAGES_ROOT, REPO_BLOB } from './substrate';

/**
 * The /papers ledger: four papers written by the author in 2026, and how they were worked. Same discipline as the
 * projects' ledger: every assertion is a `Claim`, so `evidence` is required and `tsc` fails an assertion with no
 * backing. The numbers are recorded in docs/PAPERS_EVIDENCE.md with the command that produced them, and
 * papers.test.ts fails when a number printed here is not written in that record (the type gate proofs against
 * OMISSION, the test against DRIFT between the page and its record; neither can know a number is false: the
 * record's commands were run first-hand, 2026-11-04). The protocols the method comes from are in a development
 * container that is not published, so the record quotes them with file and line.
 */

export const PAPERS_RECORD = `${REPO_BLOB}docs/PAPERS_EVIDENCE.md`;
export const PAPERS_FILES = `${PAGES_ROOT}papers/`;

/** Printed by the page; the test compares each with the record. */
export const pages = {
  holonico: { es: '27 páginas', en: '25 páginas' },
  desconexion: { es: '15 páginas', en: '14 páginas' },
  convergencia: { es: '11 páginas', en: '11 páginas' },
  grano: { es: '7 páginas', en: '7 páginas' },
} as const;

export type Paper = {
  slug: keyof typeof pages;
  /** The Spanish title; the English one is the title of the other edition. */
  title: string;
  titleEn: string;
  /** Its place in the series, in one clause. */
  role: string;
  /** The result, as the paper's own abstract states it. */
  result: string;
  /** Present only where the paper has a frozen spine in the folder. */
  spine: boolean;
  claims: Claim[];
};

const pdf = (slug: Paper['slug'], lang: 'es' | 'en') => `${PAPERS_FILES}${slug}-${lang}.pdf`;
const spine = (slug: Paper['slug']) => `${PAPERS_FILES}${slug}-SPINE.md`;

export const papers: Paper[] = [
  {
    slug: 'holonico',
    title: '¿Cuándo tiene contenido empírico una afirmación holónica?',
    titleEn: 'When Does a Holonic Claim Have Empirical Content?',
    role: 'Primero de la serie: la tesis «todo es relacional», llevada hasta donde da.',
    result:
      'Un marco constitutivo mínimo, fijado antes de los datos: una partición en módulos declarada, una escala de ' +
      'tiempo declarada y un contrafactual de contracción. Se afirma como necesario, no como suficiente.',
    spine: false,
    claims: [
      {
        text:
          'Llamar «holón» a un sistema dice algo que puede ser falso solo si se declaran de antemano tres compromisos ' +
          'inseparables; la demarcación (qué sistemas quedan sin contenido holónico) sale de ahí como consecuencia.',
        evidence: {
          kind: 'doc',
          label: 'Paper holónico (español), resumen y secciones 2 a 5',
          url: pdf('holonico', 'es'),
        },
      },
      {
        text:
          'La frase «el universo es el holón principal» se muestra como un error de categoría con la propia ' +
          'definición del holón, y un apéndice informa una autofalsificación de un sistema holónico construido.',
        evidence: {
          kind: 'doc',
          label: 'Holonic paper (English), abstract and appendix',
          url: pdf('holonico', 'en'),
        },
      },
    ],
  },
  {
    slug: 'desconexion',
    title: '¿Cuándo tiene contenido empírico la desconexión?',
    titleEn: 'When Does Disconnection Have Empirical Content?',
    role: 'Su espejo deliberado: la tesis opuesta, «nada está relacionado», con la misma arquitectura.',
    result:
      'Un marco mínimo de separabilidad con tres compromisos: una descomposición declarada, una base de ' +
      'superveniencia humeana y un contrafactual de no-todo-no-separable. La tesis solo tiene contenido como ' +
      'afirmación de separabilidad, y esa choca con la no-separabilidad cuántica.',
    spine: true,
    claims: [
      {
        text:
          'El mecanismo positivo de la tesis («la conexión es la reacción de la cosa a las señales») vuelve a ' +
          'introducir la relación que niega, porque una señal recibida es una relación: es la pared de ' +
          'autorrefutación del paper.',
        evidence: {
          kind: 'doc',
          label: 'Paper de la desconexión (español), sección de consecuencias',
          url: pdf('desconexion', 'es'),
        },
      },
      {
        text:
          'En sus lecturas fuertes, holismo y desconexión son gemelos empíricos: ninguno prohíbe una observación ' +
          'que el otro permita. El paper lo establece por argumento, no por experimento.',
        evidence: {
          kind: 'doc',
          label: 'Frozen spine, «The empirical-twin theorem»',
          url: spine('desconexion'),
        },
      },
    ],
  },
  {
    slug: 'convergencia',
    title: 'Los gemelos empíricos',
    titleEn: 'The Empirical Twins',
    role: 'Tercero: pone las dos tesis opuestas una al lado de la otra y compara.',
    result:
      'Tres movimientos a prueba de comparación (isomorfismo estructural, equivalencia empírica y una colisión ' +
      'compartida con la física). El eje todo-relacionado ↔ nada-relacionado es una lente, no un hecho; el ' +
      'único dato del mundo que gana la comparación es que el entrelazamiento dice «no» a ambos extremos.',
    spine: true,
    claims: [
      {
        text:
          'Las dos tesis, llevadas a su forma más fuerte, son el mismo argumento: las mismas tres lecturas, el ' +
          'mismo riesgo de vacuidad, el mismo marco mínimo y el mismo veredicto deflacionario.',
        evidence: {
          kind: 'doc',
          label:
            'Paper de la convergencia (español), sección del espejo y apéndice de correspondencias',
          url: pdf('convergencia', 'es'),
        },
      },
      {
        text:
          'El teorema de los gemelos empíricos es un resultado analítico, argumentado, no una medición; el ' +
          'dato sobre el entrelazamiento sí descansa en resultados experimentales.',
        evidence: {
          kind: 'provisional',
          statement:
            'The empirical-twin theorem is an analytical result (`conjectured`, argued), not a measurement.',
          source: 'convergence_paper/SPINE.md, «Honesty buckets»',
          url: spine('convergencia'),
        },
      },
    ],
  },
  {
    slug: 'grano',
    title: 'El grano no está dado',
    titleEn: 'The Grain Is Not Given',
    role: 'Coda empírica: pregunta si la física fija la descomposición preferida del mundo.',
    result:
      'La decoherencia fija la base de la estructura relacional del mundo, pero no su descomposición: el ' +
      'grano que maximiza la información efectiva es un funcional de la dinámica, puede estar anti-alineado con ' +
      'la base y no es único.',
    spine: true,
    claims: [
      {
        text:
          'En un sistema cuántico abierto pequeño, el motor de información efectiva se validó contra su forma KL ' +
          'y contra un oráculo publicado antes de usarlo. La cifra viene del SPINE del paper y no la volví a ' +
          'ejecutar al publicar esta página.',
        evidence: {
          kind: 'number',
          value: 'CE +0.3774',
          instrument:
            'validación del motor de información efectiva (registrada en el SPINE del paper)',
          source: 'docs/PAPERS_EVIDENCE.md, «Estado y limites declarados por los propios papers»',
          url: `${PAPERS_RECORD}#estado-y-limites-declarados-por-los-propios-papers`,
        },
      },
      {
        text:
          'El resultado vale para las clases de modelos tratables que se simularon; la generalización fuera de ' +
          'ellas está declarada como conjetura, y no hubo un físico humano externo que lo revisara.',
        evidence: {
          kind: 'provisional',
          statement:
            'An external human physicist was not viable, so the corrector is reality/computation + a clean checker ' +
            '+ the self-veto.',
          source: 'grain_paper/SPINE.md, «The honest ceiling»',
          url: spine('grano'),
        },
      },
    ],
  },
];

/** Where the PDFs come from, printed in the record and checked by the test. */
export const paperFiles = papers.flatMap((p) => [`${p.slug}-es.pdf`, `${p.slug}-en.pdf`]);

/** The funnel of seven passes (KAP §3), as the page lists it. */
export const funnel: { pass: string; produces: string; frozen: string }[] = [
  {
    pass: '0 · Barrido del estado del arte',
    produces: 'Tabla de anclas: cada afirmación con su fuente y su nivel V1/V2/V3',
    frozen: 'Nada: todo puede cambiar',
  },
  {
    pass: '1 · Congelar la identidad',
    produces: 'Un SPINE.md con la tesis y su frontera, escrito una vez',
    frozen: 'La identidad, desde aquí',
  },
  {
    pass: '2 · Andamio',
    produces: 'Las secciones y su orden, sin contenido',
    frozen: 'La identidad',
  },
  {
    pass: '3 · Contenido',
    produces: 'El cuerpo del paper, sección por sección',
    frozen: 'La identidad y la estructura',
  },
  {
    pass: '4 · Estructural',
    produces: 'El cuerpo reordenado y equilibrado',
    frozen: 'La identidad y lo que afirma',
  },
  {
    pass: '5 · Editorial (revisor hostil)',
    produces: 'Una lista de defectos CRÍTICO / MAYOR / MENOR',
    frozen: 'Todo: solo registra',
  },
  {
    pass: '6 · Correcciones',
    produces: 'El cuerpo corregido y la lista cerrada',
    frozen: 'Todo salvo los defectos nombrados',
  },
];

/** The key protocols, one clause each; the record quotes them with file and line. */
export const protocols: { name: string; what: string; anchor: string }[] = [
  {
    name: 'KAP · Protocolo de análisis de conocimiento',
    what: 'El proceso: barrido, identidad congelada, pasadas cada vez más específicas y un auditor de contexto limpio que certifica cada una.',
    anchor: 'kap-knowledge-analysis-protocol',
  },
  {
    name: 'FDP · Protocolo de documentos formales',
    what: 'Toda referencia debe ser real y verificable, con nivel V1 (fuente primaria leída), V2 (parcial) o V3 (secundaria); lo no verificado se declara.',
    anchor: 'fdp-formal-document-protocol',
  },
  {
    name: 'CONDUCT · Honestidad',
    what: 'Se verifica antes de afirmar, los verbos son calibrados («compilado» no es «validado»), y un número viene de una ejecución o se dice «no medí».',
    anchor: 'conduct-honestidad-y-anti-recompensa',
  },
  {
    name: 'Metacognición',
    what: 'Un marco heredado no dirige por linaje: tiene que volver a ganarse ese derecho, y cada corrección queda en un registro de aprendizaje.',
    anchor: 'metacognicion-lo-que-dirige-debe-ganarselo',
  },
  {
    name: 'Delegación a subordinados',
    what: 'Un agente subordinado es opcional; lo que devuelve es una afirmación por reverificar, no un hecho.',
    anchor: 'delegacion-a-subordinados',
  },
];

export const methodClaims: Claim[] = [
  {
    text:
      'El método se llama KAP y es un embudo de siete pasadas: cada una toca menos que la anterior, y la ' +
      'identidad del paper se congela en la pasada 1 y no se reabre.',
    evidence: {
      kind: 'doc',
      label: 'KAP, secciones 1 y 3 (citadas en el registro)',
      url: `${PAPERS_RECORD}#kap-knowledge-analysis-protocol`,
    },
  },
  {
    text:
      'Quien produce una pasada no la certifica: un auditor de contexto limpio (VISTA) solo ve el artefacto, la ' +
      'identidad congelada y los invariantes, y tiene prohibido proponer o mejorar. Son 16 invariantes en ' +
      'cuatro familias.',
    evidence: {
      kind: 'number',
      value: '16 invariantes',
      instrument: 'lectura de INV-1 a INV-16 en KAP §5',
      source: 'docs/PAPERS_EVIDENCE.md, «KAP: Knowledge-Analysis Protocol»',
      url: `${PAPERS_RECORD}#kap-knowledge-analysis-protocol`,
    },
  },
  {
    text:
      'Cada referencia externa lleva un nivel de verificación, y una fuente especulativa (V3) no se presenta ' +
      'como hecho; los papers se escriben cada uno en español y en inglés de forma nativa, no traducidos.',
    evidence: {
      kind: 'doc',
      label: 'FDP §2 e INV-10 e INV-15 de KAP (citados en el registro)',
      url: `${PAPERS_RECORD}#fdp-formal-document-protocol`,
    },
  },
  {
    text:
      'El propio protocolo dice que describe un proceso que se ejecutó dos veces completo, con el paper ' +
      'holónico y con su espejo, y que si produce mejor análisis que uno más simple es una pregunta abierta.',
    evidence: {
      kind: 'provisional',
      statement:
        'The protocol-as-written is `designed`; the practice it records is `exercised`. Whether the loop produces ' +
        '*better* analysis than a simpler process is a separate, open question (`value-indeterminate`).',
      source: 'protocols/analysis/KNOWLEDGE_ANALYSIS_PROTOCOL.md, líneas 20 a 28',
      url: `${PAPERS_RECORD}#kap-knowledge-analysis-protocol`,
    },
  },
];

export const paperLimits: string[] = [
  'Son análisis del autor, de 2026, sin revisión por pares ni publicación en una revista; varias de sus piezas están declaradas por ellos mismos como argumentadas o conjeturadas.',
  'No volví a comprobar los argumentos de los papers ni que sus referencias conserven los niveles de verificación que declaran; esta página resume lo que los PDF y sus SPINE dicen de sí mismos.',
  'KAP registra que se ejecutó completo con el paper holónico y el de la desconexión. Los SPINE de la convergencia y del grano ordenan correr el gate antes de darlos por terminados, pero no encontré el registro de esas auditorías, así que no afirmo que se hayan completado.',
  'No hay historial de versiones: las carpetas no tienen git y solo queda la fecha de los PDF (22 de junio de 2026).',
  'Los protocolos no están publicados; el registro cita fragmentos con su archivo y su línea, y quien quiera comprobarlos tendría que pedírmelos.',
];
