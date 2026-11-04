// The page's content, as a typed ledger.
//
// THE MECHANISM (AAP-selected design D1): `evidence` is a REQUIRED field of
// `Claim`, so an assertion about a project with no backing fails `tsc --noEmit`
// — M1 is enforced by the M4 gate that already runs, not by the author's memory.
//
// THE HONEST LIMIT: the type gate proofs against OMISSION, not against
// FALSEHOOD. TypeScript cannot know a number is stale. Every figure below was
// verified first-hand against its source on 2026-08-27; that obligation stays
// with the author (CONDUCT §2) and is not delegated to the compiler.
//
// Page copy is Spanish (operator decision O2). Status strings are quoted
// VERBATIM from each project's README, which is written in English — so the
// evidence rows read bilingual by construction. That is declared, not accidental.

/** How a claim can be backed, ordered by how independently a reader can check it. */
export type Evidence =
  /** Open the running thing yourself. The strongest kind. */
  | { kind: 'live'; url: string; label: string }
  /** A value, the instrument that produced it, and where that is recorded. */
  | { kind: 'number'; value: string; instrument: string; source: string; url: string }
  /** An artifact the project itself produced, rendered on the page. */
  | {
      kind: 'figure';
      file: string;
      alt: string;
      caption: string;
      width: number;
      height: number;
      /**
       * The figure's text equivalent: its stages or parts in order, what each consumes and produces.
       * A diagram from TikZ carries its text as paths, so this is what a screen reader, a search and
       * a reader who cannot see it get (concept §6; WAI "complex images", approach 3).
       */
      textEquivalent?: string[];
      /** Language of the caption and the text equivalent when it is not the page's (the project's own words are kept). */
      lang?: string;
      /** Show on a light plate in the dark theme: for a figure that is not made of contract colours. */
      plate?: boolean;
    }
  /** A specific document in the project's own repository. */
  | { kind: 'doc'; label: string; url: string }
  /** The project's OWN published statement that a result is not yet validated. */
  | { kind: 'provisional'; statement: string; source: string; url: string };

export type FigureEvidence = Extract<Evidence, { kind: 'figure' }>;

export type Claim = { text: string; evidence: Evidence };

export type Project = {
  slug: string;
  name: string;
  tag: string;
  /** Verbatim from the project's README. Frozen by content.test.ts. */
  status: string;
  /** Where the status string was copied from. */
  statusSource: string;
  /** When the status was last compared with its source by hand (the Verificación note prints it). */
  statusChecked?: string;
  /** The span of the work in words, e.g. "desde junio de 2026"; absent = visibly pending. */
  years?: string;
  repoUrl: string;
  /** One sentence, Spanish. */
  summary: string;
  claims: Claim[];
  /**
   * Diagrams the project handed over (design v3) that are not the evidence of a claim: they explain how it works.
   * They are drawn once, after the figures of the claims, in "Cómo funciona"; each carries its text equivalent.
   */
  diagrams?: FigureEvidence[];
  /** The project's OWN declared limits, quoted rather than composed (graft G8). */
  limits: string[];
};

export const profile =
  'Ingeniero en sistemas computacionales enfocado en infraestructura de alto rendimiento y ' +
  'agentes LLM, con trabajo en arquitectura de procesadores, diseño en FPGA, programación de ' +
  'redes y desarrollo full-stack.';

/**
 * Ordered by relevance to the named reader (an engineer screening for a remote
 * systems role), NOT by how checkable each one is — the supervisor's repair of
 * D1's own declared weakest point. Every card carries its evidence, so a reader
 * still sees at a glance what is verifiable.
 */
export const projects: Project[] = [
  {
    slug: 'phyriadfg',
    name: 'PhyriadFG',
    tag: 'Generación de cuadros',
    status: '0.6.0-experimental',
    statusSource: 'PhyriadFG/README.md',
    statusChecked: '14 de octubre de 2026',
    years: 'desde junio de 2026',
    repoUrl: 'https://github.com/Swately/PhyriadFG',
    summary:
      'Generación de cuadros por captura externa: corre fuera del juego, estima el movimiento ' +
      'entre cuadros reales y sintetiza los intermedios, sin acceso al motor, sus vectores de ' +
      'movimiento ni su profundidad.',
    claims: [
      {
        text:
          'Reparte el trabajo entre varias GPU por rol: captura y conversión en la GPU integrada, ' +
          'flujo óptico en una segunda GPU, warp y presentación en la principal.',
        evidence: {
          kind: 'figure',
          file: 'img/phyriadfg_multigpu.svg',
          alt:
            'Diagrama del pipeline de PhyriadFG: el juego entrega cuadros a la captura (hilo C, ' +
            'GPU integrada), que pasa a flujo óptico (hilo F, GTX 1080 Ti), y de ahí a warp, ' +
            'mezcla y presentación (hilo P, RTX 4090) hacia la pantalla.',
          caption:
            'Tres hilos encadenados (C/F/P), cada uno en la GPU donde su trabajo rinde. Las ' +
            'aristas c_seq y f_seq son los relevos entre hilos; p_presenting es la ' +
            'contrapresión que impide que la captura se adelante al presentador.',
          width: 909,
          height: 287,
          textEquivalent: [
            'El juego, un proceso externo, entrega cuadros a la captura.',
            'Hilo C, captura, en la GPU integrada: toma el cuadro con DDA o WGC y lo convierte y empaqueta sin copias ni VRAM, en memoria del sistema. Pasa pares de cuadros reales al hilo F por c_seq.',
            'Hilo F, flujo óptico, en la GTX 1080 Ti: calcula vectores de movimiento, una pirámide SAD y un modelo global (gme). Pasa MV, SAD y los cuadros reales al hilo P por f_seq.',
            'Hilo P, warp, mezcla y presentación, en la RTX 4090 que posee la pantalla: hace backward-warp al instante t, arbitra la calidad y marca el ritmo. Entrega a la pantalla, por ejemplo a 240 Hz, a ritmo constante.',
            'Contrapresión: P informa a F con p_presenting para que la captura no se adelante al presentador.',
          ],
        },
      },
      {
        text:
          'Sintetiza cada cuadro intermedio con warp hacia atrás y mezcla, y decide el instante ' +
          't con un reloj de contenido en vez de un multiplicador fijo.',
        evidence: {
          kind: 'figure',
          file: 'img/phyriadfg_pipeline.svg',
          alt:
            'Diagrama de cómo se sintetiza un cuadro intermedio: de los cuadros previo y actual ' +
            'se estima flujo óptico, se hace warp hacia atrás, se mezclan los dos candidatos y ' +
            'una etapa de arbitraje de calidad decide el resultado.',
          caption:
            'Â = prev[x − t·mv] y B̂ = cur[x + (1−t)·mv], mezclados como (1−t)Â + tB̂, con una ' +
            'etapa de arbitraje (oclusión bidireccional, modelo global, bordes). El multiplicador ' +
            'es variable: el reloj de contenido elige cada t en (0,1).',
          width: 964,
          height: 208,
          textEquivalent: [
            'Entradas: dos cuadros reales, el previo (t = 0) y el actual (t = 1).',
            'Flujo óptico: de los dos cuadros se estiman vectores de movimiento hacia delante y hacia atrás (MV).',
            'Backward-warp: con MV y el instante t se calculan Â = prev[x − t·mv] y B̂ = cur[x + (1 − t)·mv].',
            'Mezcla: (1 − t)·Â + t·B̂.',
            'Arbitraje de calidad: oclusión bidireccional, matte del modelo global, bg-snap, band-xfade y edge hard-pick.',
            'Salida: el cuadro intermedio I_t sintetizado, por commit o crossfade.',
            'Línea de tiempo: el multiplicador es variable; el reloj de contenido (NCO más PLL) elige cada t en (0, 1) entre el cuadro previo y el actual.',
          ],
        },
      },
      {
        text: 'Un solo ejecutable, con LTO en la compilación de release.',
        evidence: {
          kind: 'doc',
          label: 'README — sección Build',
          url: 'https://github.com/Swately/PhyriadFG',
        },
      },
    ],
    diagrams: [
      {
        kind: 'figure',
        file: 'img/phyriadfg_por_que_captura_externa.svg',
        width: 746,
        height: 358,
        alt: 'Comparación en dos filas: un generador de cuadros dentro del motor recibe del juego color, profundidad, vectores de movimiento y datos de cámara y además calcula su propio flujo óptico, mientras que PhyriadFG recibe solo los píxeles finales de la pantalla y estima todo el movimiento (flujo óptico y modelo global) a partir de ellos antes de sintetizar el cuadro intermedio.',
        caption:
          'Leer cada fila de izquierda a derecha, de la fuente al cuadro intermedio I_t; las columnas se corresponden etapa a etapa. Las dos filas calculan flujo óptico; la diferencia es lo que llega: la línea discontinua tachada entre las filas marca que a PhyriadFG no llegan la profundidad ni los vectores del motor, de modo que la caja resaltada (flujo óptico y modelo global, hilo F) es lo que PhyriadFG estima por sí mismo, solo de la imagen.',
        textEquivalent: [
          'Fila superior, un generador de cuadros dentro del motor (por ejemplo FSR 3 Frame Interpolation). Paso 1, motor del juego: produce, además del cuadro, sus datos internos.',
          'Fila superior, paso 2, entradas del motor (caja discontinua): color del cuadro, profundidad, vectores de movimiento del motor y cámara (near/far, FOV, Δt).',
          'Fila superior, paso 3, flujo óptico propio (FfxOpticalFlow): consume las entradas y produce un campo de flujo.',
          'Fila superior, paso 4, interpolador dentro del motor: consume el flujo y, por una flecha directa desde las entradas, la profundidad, los vectores y la cámara; produce el cuadro intermedio.',
          'Fila superior, paso 5: I_t, el cuadro intermedio.',
          'Fila inferior, PhyriadFG con captura externa. Paso 1, juego (caja cerrada): no entrega nada salvo su imagen en pantalla.',
          'Fila inferior, paso 2, solo los píxeles finales de la pantalla (caja discontinua; captura DDA o WGC): el hilo C captura y la GPU integrada convierte y empaqueta; produce cuadros reales en un anillo.',
          'Fila inferior, paso 3, flujo óptico estimado de los píxeles (MV y SAD) más modelo global (caja resaltada; hilo F, segunda GPU): consume pares de cuadros reales y produce vectores de movimiento sobre una pirámide y el modelo global de movimiento.',
          'Fila inferior, paso 4, warp hacia atrás, mezcla y capas de calidad por oclusión (hilo P, GPU principal): consume el par real y los vectores, y produce el cuadro a la fase t.',
          'Fila inferior, paso 5: I_t, presentado.',
          'Entre las filas, una línea discontinua tachada va de las entradas del motor a los píxeles de PhyriadFG, con el rótulo: no llegan profundidad ni vectores del motor, PhyriadFG estima todo el movimiento solo de la imagen.',
        ],
      },
      {
        kind: 'figure',
        file: 'img/phyriadfg_bucle_verdad_exacta.svg',
        width: 765,
        height: 286,
        alt: 'Ocho pasos en serpentina que muestran cómo se mide PhyriadFG: una escena 3-D analítica genera la entrada que el FG captura de una ventana, y cada cuadro generado se compara con la misma escena evaluada en la fase exacta que eligió el FG.',
        caption:
          'La fila de arriba va de izquierda a derecha (pasos 1-4) y la de abajo vuelve de derecha a izquierda (pasos 5-8); el paso 8 no regresa al 1. La flecha discontinua del paso 1 al 7 indica que entrada y verdad salen del mismo render; solo cambia el tiempo. La caja resaltada (paso 8) es la comparación contra la verdad exacta. Con --qdump se mide un subconjunto muestreado en la ruta síncrona, no la ruta asíncrona que se distribuye; mide escenas sintéticas a 640x360, no juegos.',
        textEquivalent: [
          'Paso 1, escena 3-D analítica: una función cerrada del tiempo; produce cuadros base a cualquier instante.',
          'Paso 2, corpus: consume la escena y produce cada k-ésimo cuadro base con su índice codificado en un código de barras.',
          'Paso 3, reproductor: consume el corpus y lo presenta en su propia ventana.',
          'Paso 4, PhyriadFG, el mismo ejecutable con un flag de volcado: consume los píxeles de esa ventana y produce cuadros intermedios I_t.',
          'Paso 5, volcado: por cada cuadro generado guarda el cuadro previo, el siguiente, el generado y la fase t del FG. Con --qdump es un muestreo en la ruta síncrona; con --gdump, cada tick en la ruta asíncrona.',
          'Paso 6, alineación: consume los códigos de barras y produce el par real (N, N1). Si N1 − N no es k (costura del bucle), el par se aparta y se puntúa como corte.',
          'Paso 7, verdad exacta: consume la fase propia del FG y produce la escena evaluada en tA + t_FG·(tB − tA).',
          'Paso 8, comparación (caja resaltada, con su flecha de entrada desde el paso 7): consume el cuadro generado y la verdad, y produce errores de posición, forma, masa inventada y nitidez, por objeto y por fase. La nota centrada bajo la caja dice que se mide frente a dos reglas: el cuadro real más cercano y un warp con flujo exacto (oráculo).',
          'Notas secundarias: junto a la flecha del paso 4 al 5, los dos modos de volcado; bajo el paso 6, la nota de cortes, con flecha discontinua.',
        ],
      },
    ],
    limits: [
      'Su propio README lo declara «student-built, LLM-assisted» y en versión 0.6.0-experimental.',
      'Requiere Windows, MSVC Build Tools y el Vulkan SDK; no es multiplataforma.',
    ],
  },
  {
    slug: 'phyriager',
    name: 'Phyriager',
    tag: 'Agentes LLM',
    status: '0.1.0-experimental',
    statusSource: 'Phyriager/README.md',
    statusChecked: '14 de octubre de 2026',
    years: '2026, en pausa desde agosto',
    repoUrl: 'https://github.com/Swately/Phyriager',
    summary:
      'Un agente LLM que juega Minecraft como un jugador más: se conecta a un servidor Fabric ' +
      'como cualquier cliente, sobrevive por su cuenta y acepta encargos por chat.',
    claims: [
      {
        text:
          'Percibe sólo lo que un cliente conectado recibe legítimamente y actúa sólo por el canal ' +
          'normal de entrada del jugador: sin setblock, sin teletransporte, sin leer la lista de ' +
          'entidades del servidor.',
        evidence: {
          kind: 'doc',
          label: 'docs/VISION.md — el contrato que fija esos límites',
          url: 'https://github.com/Swately/Phyriager',
        },
      },
      {
        text:
          'Percibe y planifica sobre el cuadro que realmente ve: trayectoria proyectada y objetivo ' +
          'activo, a 3 Hz y 384×216 de resolución sensorial.',
        evidence: {
          kind: 'figure',
          file: 'img/phyriager_trazado.png',
          alt:
            'Cuadro del agente dentro de Minecraft con una trayectoria proyectada dibujada en ' +
            'rojo, una etiqueta de objetivo «have stone_pickaxe (1/1)» y un pie de metadatos.',
          caption:
            'Cuadro real del agente. Arriba, el objetivo activo; en rojo, la trayectoria ' +
            'proyectada; abajo, los metadatos que el propio sistema estampa: ' +
            'frame.v1 · sensor-true · 384×216 · FOV 110 fijo · 3.0 Hz.',
          width: 1275,
          height: 721,
        },
      },
      {
        text:
          'La competencia momento a momento no depende del LLM: una sesión con todos los ' +
          'endpoints de LLM caídos siguió explorando, excavando, minando y fabricando.',
        evidence: {
          kind: 'doc',
          label: 'README — «The LLM is not in the motor loop, on purpose»',
          url: 'https://github.com/Swately/Phyriager',
        },
      },
      {
        text:
          'Tres procesos separados a propósito: el mod en Java/Fabric, el cerebro en C++23 y el ' +
          'router de LLM; los dos primeros hablan por memoria compartida con una ABI versionada ' +
          'que se niega a conectarse si detecta deriva.',
        evidence: {
          kind: 'doc',
          label: 'README — «How it is put together»',
          url: 'https://github.com/Swately/Phyriager',
        },
      },
    ],
    diagrams: [
      {
        kind: 'figure',
        file: 'img/phyriager_arquitectura.svg',
        width: 885,
        height: 355,
        alt: 'Diagrama de arquitectura: el mod de Java dentro de la frontera de honestidad con el servidor Fabric; por memoria compartida (ABI v6) habla con el cerebro en C++23; este conecta con las superficies HTTP, donde juega un LLM, y con un router de LLM que solo delibera.',
        caption:
          'Cómo está armado y dónde está la frontera de honestidad. Tres procesos (mod, cerebro, superficies HTTP), un LLM jugador y un router fuera del bucle motor, y una línea punteada en el color de acento que encierra lo único que toca el juego. Un ingeniero encuentra el nombre de la ABI y la regla «se niega a conectar si hay deriva».',
        textEquivalent: [
          'Servidor Fabric (mundo compartido con otros jugadores): entrega al mod el mundo por el protocolo de cliente normal y recibe de él la entrada de jugador.',
          'Mod (Java/Fabric), dentro de la misma frontera de honestidad que el servidor: consume lo que un cliente conectado recibe; produce una percepción filtrada y aplica la orden del cerebro como entrada real de jugador. No tiene lógica de decisión.',
          'Memoria compartida con ABI v6 entre mod y cerebro: lleva magia y versión, y se niega a conectar si hay deriva. Es el único canal entre ambos.',
          'Cerebro (C++23): consume la percepción y produce la orden. Percibe, planifica y actúa con solvers a 20 Hz y reflejos, y verifica cada resultado. No hay LLM en su bucle motor.',
          'Router de LLM, conectado al cerebro: solo delibera; tiene un tope de gasto por hora.',
          'Superficies HTTP, conectadas al cerebro: observar, actuar, crear rutinas, leer resultados y lecciones heredables.',
          'LLM jugador (cualquier modelo), conectado a las superficies: lee el estado, decide y escribe rutinas, sin acceso al código.',
          'La frontera de honestidad, en el color de acento, encierra solo el servidor y el mod: lo único que toca el juego.',
        ],
      },
      {
        kind: 'figure',
        file: 'img/phyriager_ciclo.svg',
        width: 630,
        height: 212,
        alt: 'Ciclo de entrenamiento del entorno: un LLM juega una ronda, el supervisor la audita, se construyen los arreglos de mayor palanca; lo aprendido (rutinas, autómatas, lecciones) vive en el entorno y la ronda siguiente lo hereda.',
        caption:
          'Dónde aprende realmente. Un ciclo de tres pasos (ronda, auditoría, arreglos) que desemboca en «el entorno» (la caja en acento), no en un modelo; la ronda siguiente hereda desde su primer GET.',
        textEquivalent: [
          'Etapa 1, ronda: un LLM juega por HTTP y narra lo que hace; produce un informe y una lista de fricciones.',
          'Etapa 2, auditoría: el supervisor verifica ese informe contra el registro (no contra el relato del propio jugador); produce una lista priorizada.',
          'Etapa 3, arreglos: se construyen los de mayor palanca; producen rutinas, autómatas compuestos, lecciones y superficies nuevas, que se instalan en el entorno.',
          'El entorno (caja en acento): guarda rutinas, autómatas compuestos y lecciones; lo aprendido vive aquí y no en los pesos de ningún modelo. La ronda siguiente hereda el entorno desde su primer GET y vuelve a la etapa 1.',
        ],
      },
    ],
    limits: [
      'Su README (versión local, sin publicar) dice que el mod y el cerebro se ejecutaron en vivo contra un ' +
        'servidor Fabric 26.2, pero que eso es «a record of runs, not a release»: siguen abiertos defectos ' +
        '(casos sin camino del buscador de rutas, la política de expulsión del SeenMap), los proveedores de ' +
        'LLM alojados nunca se probaron contra un endpoint real, un «git clone» hoy no entrega un bot ' +
        'funcionando y la actividad se detuvo el 2026-08-09.',
      'El puerto a Minecraft 26.2 y la arquitectura de cliente de red están en curso.',
    ],
  },
  {
    slug: 'pharvard',
    name: 'PHarvard',
    tag: 'Hardware',
    status: 'runs on silicon',
    statusSource: 'PHarvard/README.md',
    repoUrl: 'https://github.com/Swately/PHarvard',
    summary:
      'Un procesador de 32 bits, Harvard modificado, escrito en VHDL estructural para una FPGA ' +
      'Lattice MachXO2-7000HE. Corre en la placa: el conjunto de instrucciones completo está ' +
      'verificado en silicio.',
    claims: [
      {
        text: 'Ocupa 1,409 LUT4 de 6,864 disponibles (21 %) y 625 registros (9 %).',
        evidence: {
          kind: 'number',
          value: '1,409 LUT4 de 6,864 (21 %); 625 registros (9 %)',
          instrument: 'toolchain del fabricante (python syn/build_vendor.py), no una estimación',
          source: 'README — tabla de estado',
          url: 'https://github.com/Swately/PHarvard',
        },
      },
      {
        text: 'Cierra tiempos con Fmax 20.4 MHz post-route y cero errores; el diseño corre a 2.08 MHz.',
        evidence: {
          kind: 'number',
          value: 'Fmax 20.4 MHz post-route, cero errores de tiempo',
          instrument: 'toolchain del fabricante (post-route)',
          source: 'README — tabla de estado',
          url: 'https://github.com/Swately/PHarvard',
        },
      },
      {
        text:
          'Se verifica a sí mismo en la placa: un programa corre el conjunto de instrucciones y ' +
          'muestra un veredicto que calcula sobre sí mismo, 7 de 7 comprobaciones.',
        evidence: {
          kind: 'number',
          value: '0007 — siete de siete comprobaciones, en la placa, 2026-08-01',
          instrument: 'sw/hwcheck.s ejecutándose en la FPGA',
          source: 'README — «What "verified on silicon" means here»',
          url: 'https://github.com/Swately/PHarvard',
        },
      },
      {
        text:
          'No tiene circuito multiplicador ni instrucción de división: son rutinas de sumas y ' +
          'desplazamientos, y los cuatro dígitos del display se producen con cuatro llamadas a su ' +
          'propia división por software.',
        evidence: {
          kind: 'doc',
          label: 'sw/hwcheck.s y la explicación del display en el README',
          url: 'https://github.com/Swately/PHarvard',
        },
      },
    ],
    limits: [
      'Su README lo dice de frente: «el objetivo de este proyecto no es la velocidad», sino ' +
        'construir un procesador como se construye de verdad, estructuralmente.',
      'Corre a 2.08 MHz. Es una máquina didáctica sobre silicio real, no una CPU competitiva.',
    ],
  },
  {
    slug: 'phynned',
    name: 'Phynned',
    tag: 'Ajuste en tiempo de ejecución',
    status: '0.2.2-experimental',
    statusSource: 'Phynned/README.md (copia local, aún sin commit; coincide con version.hpp)',
    statusChecked: '14 de octubre de 2026',
    years: 'desde mayo de 2026',
    repoUrl: 'https://github.com/Swately/Phynned',
    summary:
      'Optimizador no invasivo para CPU asimétricas e híbridas: fija los hilos del juego en los ' +
      'núcleos más rápidos disponibles (el CCD con V-Cache en AMD X3D, los P-cores en Intel) para ' +
      'eliminar el rebote del planificador entre clusters.',
    claims: [
      {
        text:
          'Mide con un protocolo de alternancia A/B/A/B/A en vez de una comparación única, y su ' +
          'colocación viene desactivada por defecto, detrás de una lista de permitidos.',
        evidence: {
          kind: 'doc',
          label: 'README — protocolo de medición y compuerta de seguridad',
          url: 'https://github.com/Swately/Phynned',
        },
      },
      {
        text: 'Su catálogo exploratorio de 14 pruebas sobre AMD X3D es provisional, y así lo publica.',
        evidence: {
          kind: 'provisional',
          statement:
            'El propio README marca el catálogo como «provisional — see the evidence status ' +
            'below»: los números existen pero no están revalidados, y el proyecto pide que no se ' +
            'citen como definitivos.',
          source: 'README — encabezado y estado de la evidencia',
          url: 'https://github.com/Swately/Phynned',
        },
      },
    ],
    diagrams: [
      {
        kind: 'figure',
        file: 'img/phynned_architecture.svg',
        width: 937,
        height: 433,
        lang: 'en',
        alt: 'Diagrama de la arquitectura de Phynned: dos fuentes de datos de Windows alimentan un agente que observa, clasifica, admite, decide y actúa sobre procesos; debajo, un diario que se escribe antes de cada cambio, un guardián que deshace si empeoran los cuadros por segundo, un registro de auditoría y un ejecutable de rescate; a un lado, la interfaz que solo lee el estado por memoria compartida.',
        caption:
          'That Phynned is three programs around one loop (observe, classify, admit, decide, act), that a default-deny gate sits before any change, and that every change is journaled and has a rescue path.',
        textEquivalent: [
          "Sources: the kernel's ETW session (read-only; produces process-birth events) and one bulk snapshot of the process table (produces the list of running processes with their metrics).",
          'Observar: consumes both sources; produces the set of processes running now.',
          'Clasificar: consumes that set; produces a class per process: game, background, or protected.',
          'Admitir (the highlighted stage): consumes the classified processes; produces only those positively admitted. It denies by default.',
          'Decidir: consumes the admitted processes plus the rules, the active profile and the user\'s "never" list; produces a decision (a mask or a priority) or none.',
          'Actuar: consumes decisions; makes up to three Win32 calls (set process affinity, set priority class, set thread affinity) on the target processes.',
          "Around the loop: before each change Actuar writes to the diario de escritura previa (PENDING, then APPLIED, with the previous mask); the guardián de reversión undoes an applied change if frame times worsen; the registro de auditoría gets one readable reason per action; phynned-revert is a separate program that restores the journaled masks after a forced kill. phynned-ui reads the agent's state over shared memory and never touches a game; phynned-cli and the bench runner drive the same controls.",
        ],
      },
      {
        kind: 'figure',
        file: 'img/phynned_decision_path.svg',
        width: 530,
        height: 579,
        lang: 'en',
        alt: 'Diagrama de flujo vertical: un proceso pasa por ocho preguntas de exclusión (lista de sistema, proceso protegido, anti-cheat, máscara propia, lanzador o ventana en primer plano, regla de usuario, sin coincidencia positiva, otro optimizador); un sí en cualquiera lo deja sin tocar; si todas son no, se anota en disco, se aplica el cambio y se registra, con reversión posterior.',
        caption:
          'The safety idea in one glance: eight questions, and a "yes" at any of them leaves the process alone; only then is the previous state written to disk, the change made, and the line logged.',
        textEquivalent: [
          'Top to bottom, a process is asked eight questions in order: (1) on the system denylist; (2) a protected process; (3) a known anti-cheat title or its driver running; (4) manages its own CPU mask; (5) a launcher, audio, or the foreground window; (6) has a user rule "never optimize"; (7) matches no game or active background process; (8) another optimizer is already placing it.',
          'A "yes" to any question ends the path at Sin tocar (no change is applied).',
          'If all eight answers are "no", three steps follow: write PENDING to disk and flush; apply the affinity or priority change while capturing the previous mask; mark APPLIED and write the audit line.',
          'A later Reversión (on exit, on a regression, or after a forced kill) restores the captured mask.',
          "The eight questions condense master plan §2's chain and the use-modes precedence; the picture is not a trace of the code.",
        ],
      },
    ],
    limits: [
      'El catálogo empírico está declarado provisional por el propio proyecto y en revalidación.',
      'Sólo Windows. Renombrado desde «Ayama» el 2026-07-16, con ruptura limpia y sin migración ' +
        'de configuraciones anteriores.',
    ],
  },
  {
    slug: 'climx',
    name: 'climx',
    tag: 'Frontend web',
    status: 'en línea',
    statusSource: 'climx/README.md',
    repoUrl: 'https://github.com/Swately/climx',
    summary:
      'Pronóstico municipal para todo México con datos oficiales del SMN/CONAGUA. Es el único de ' +
      'estos proyectos que se puede abrir y usar ahora mismo — y es del que está hecha esta página.',
    claims: [
      {
        text: 'Está en línea y cubre los 2,463 municipios del país.',
        evidence: {
          kind: 'live',
          url: 'https://swately.github.io/climx/',
          label: 'swately.github.io/climx',
        },
      },
      {
        text:
          'La trampa del conjunto de datos, resuelta: idmun no es una clave nacional (el ' +
          'numerado del INEGI se reinicia por estado), así que toda ruta y toda búsqueda usan la ' +
          'clave compuesta (ides, idmun), con una prueba de regresión que lo mantiene así.',
        evidence: {
          kind: 'doc',
          label: 'docs/ARCHITECTURE.md — «The one dataset fact everything depends on»',
          url: 'https://github.com/Swately/climx',
        },
      },
      {
        text:
          'Sin backend y sin claves: una acción programada de GitHub descarga y valida el ' +
          'paquete nacional y lo reparte en archivos estáticos, 9,852 registros hacia 2,463 ' +
          'archivos por municipio.',
        evidence: {
          kind: 'number',
          value: '9,852 registros → 2,463 archivos (32 estados)',
          instrument: 'registro de ejecución de fetch-smn.mjs + partition-data.mjs',
          source: 'docs/planning/MEASUREMENTS.md',
          url: 'https://github.com/Swately/climx',
        },
      },
      {
        text: 'El bundle de la página pesa 66.66 KB comprimidos.',
        evidence: {
          kind: 'number',
          value: '66.66 KB gzip',
          instrument: 'salida de vite build',
          source: 'docs/planning/MEASUREMENTS.md (2026-07-29)',
          url: 'https://github.com/Swately/climx',
        },
      },
    ],
    limits: [
      'Si la fuente del SMN cae, el sitio sigue sirviendo el último dato bueno y lo dice; no ' +
        'inventa un pronóstico.',
      'Reconstruido en 2026 a partir de un proyecto escolar de 2023, conservado en la etiqueta ' +
        'v0-school.',
    ],
  },
];

export type SkillGroup = { label: string; items: string; evidencedBy: string };

/**
 * Every row names the project that evidences it (graft from D3): a tools list is
 * where an unsourced capability claim normally hides.
 */
export const skills: SkillGroup[] = [
  {
    label: 'Sistemas y alto rendimiento',
    items:
      'C++23, C, CUDA, cómputo con Vulkan, sockets TCP/UDP, CMake/Ninja, metodología de benchmarking',
    evidencedBy: 'phyriadfg',
  },
  {
    label: 'Sistemas con LLM',
    items: 'Orquestación de agentes, planificación con LLM local, visión por modelo multimodal',
    evidencedBy: 'phyriager',
  },
  {
    label: 'Hardware',
    items:
      'VHDL y Verilog, diseño lógico digital, análisis de circuitos, programación de microprocesadores',
    evidencedBy: 'pharvard',
  },
  {
    label: 'Medición y sistemas operativos',
    items: 'Afinidad y topología de CPU, ETW, memoria compartida, protocolos de medición A/B',
    evidencedBy: 'phynned',
  },
  {
    label: 'Frontend',
    items:
      'React, TypeScript estricto, Vite, Vitest, accesibilidad, CSS Modules sobre design tokens',
    evidencedBy: 'climx',
  },
];

export const languages = 'Español (nativo) · Inglés (intermedio, B1) · Ruso (principiante, A1)';

// Made with my soul - Swately <3
