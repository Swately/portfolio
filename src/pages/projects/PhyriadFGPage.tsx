import { Prose } from '../../phyriad-react';
import ProjectShell, {
  ClaimsList,
  LimitsList,
  ProjectFigures,
  ProjectSection,
} from '../../components/ProjectShell';
import ProjectCharts from '../../components/charts/ProjectCharts';
import ProjectComparison from '../../components/ProjectComparison';
import Decision from '../../components/Decision';
import CodeBlock from '../../components/CodeBlock';
import { projects } from '../../content';

/**
 * PhyriadFG — the first project with a page of its own (operator, 2026-09-02: "empezaremos con el más
 * importante"). Written on the shell in the order of design v3 (mechanism before claims). The header, "En breve",
 * the claims and the limits come from the ledger; the prose below is adapted from the project's own dossier
 * (PhyriadFG/docs/PORTFOLIO_DOSSIER.md, 2026-10-10) with the operator's authorisation of 2026-10-14. Public
 * lines are linked; a line from a record the project has not published is said to be unpublished.
 */
const project = projects.find((p) => p.slug === 'phyriadfg')!;
const REPO = 'https://github.com/Swately/PhyriadFG/blob/main/';
const readme = (line: number) => `${REPO}README.md#L${line}`;
const changelog = (line: number) => `${REPO}CHANGELOG.md#L${line}`;
const arch = (line: number) => `${REPO}docs/ARCHITECTURE.md#L${line}`;

export default function PhyriadFGPage() {
  return (
    <ProjectShell project={project}>
      <ProjectSection id="contexto">
        <Prose>
          <p>
            La generación de fotogramas integrada en el motor recibe del juego datos internos: la
            guía de DLSS Frame Generation lista profundidad y vectores de movimiento entre los
            buffers que requiere, y FSR 3 Frame Generation pide vectores de movimiento y profundidad
            a resolución de render (fuentes del proveedor, en la comparativa). Por eso solo existe
            en los juegos que la integran. PhyriadFG aborda el caso contrario: trabaja únicamente
            con la imagen final, del mismo modo que Lossless Scaling Frame Generation (
            <a href={readme(15)}>README</a>: «A frame generator that works on any game because it
            only sees the final image… not an in-engine FG»). Captura la salida ya renderizada,
            estima el movimiento entre fotogramas reales, sintetiza fotogramas intermedios y los
            presenta «with no access to the game engine, its motion vectors, or its depth» (
            <a href={readme(3)}>README</a>). Su rasgo de diseño es repartir el trabajo entre
            dispositivos: captura y conversión en la GPU integrada, flujo óptico en una segunda GPU,
            warp y presentación en la principal, con caída a una sola GPU.
          </p>
          <p>
            El propio proyecto acota su uso: está pensado para fluidez, no para latencia competitiva
            («Use it for fluidity, not for competitive latency.»); no puede superar la frecuencia de
            refresco del monitor; las zonas recién descubiertas se mitigan pero no se resuelven. Es
            un proyecto de estudiante, desarrollado con asistencia de LLM, experimental, solo para
            Windows, y construido y probado en una única máquina con varias GPU (
            <a href={readme(94)}>README, sección de alcance honesto</a>).
          </p>
          <p>
            Duración honesta: menos de un año. El primer registro fechado del proyecto precursor es
            del 2026-06-06; el repositorio y la primera versión etiquetada (v0.1.0-experimental) son
            del 2026-06-28; la versión vigente, 0.6.0-experimental, se publicó el 2026-09-29. Ningún
            registro del proyecto permite hablar de «años».
          </p>
        </Prose>
      </ProjectSection>

      <ProjectSection id="mecanismo">
        <Prose>
          <p>
            Entre cada par de fotogramas reales (prev, cur) se sintetiza el intermedio I_t
            muestreando ambos hacia atrás a lo largo del flujo y mezclándolos: Â = prev[x − t·mv] y
            B̂ = cur[x + (1−t)·mv], mezclados y arbitrados por las capas de calidad (
            <a href={arch(37)}>ARCHITECTURE</a>). La fase t no es fija: la elige un reloj de
            contenido (NCO + PLL), de modo que el multiplicador es variable (
            <a href={arch(39)}>ARCHITECTURE</a>).
          </p>
          <p>
            El reparto de trabajo es contextual, no arbitrario: la GPU integrada convierte y
            empaqueta sin copias (vive en la memoria del sistema), la GTX 1080 Ti es el caballo de
            batalla del flujo óptico y la RTX 4090 hace el warp y la presentación porque posee la
            pantalla (<a href={arch(26)}>ARCHITECTURE</a>). En la versión 0.6.0 solo la ruta de una
            GPU está medida (<a href={changelog(133)}>CHANGELOG</a>). Los dos primeros diagramas son
            los del propio proyecto; los dos siguientes explican por qué captura desde fuera y cómo
            se mide.
          </p>
        </Prose>
        <ProjectFigures project={project} />
      </ProjectSection>

      <ProjectSection id="diseno">
        <Prose>
          <p>
            Cinco decisiones, cada una con la alternativa descartada, el motivo y el coste aceptado.
            Donde la fuente es un registro del proyecto que no se ha publicado, se dice.
          </p>
        </Prose>

        <Decision
          title="1. Capturar la imagen final desde fuera del juego, no engancharse al motor"
          decision={
            <>
              Un proceso aparte captura la salida ya renderizada (DDA o WGC), estima el movimiento y
              genera los intermedios sin acceso al motor.
            </>
          }
          discarded={[
            <>
              <strong>Entrar en el proceso del juego.</strong> El registro de origen reserva la capa
              implícita de Vulkan para aplicaciones sin anti-cheat y rechaza la vía agresiva dentro
              del proceso («AC-flagged AND doesn&apos;t help»); la captura externa es un proceso
              separado que no inyecta en la aplicación.
            </>,
            <>
              <strong>Repartir el render del juego entre GPU.</strong> El viaje de ida y vuelta de
              un G-buffer de 1080p (unos 41 MB) entre la 4090 y la 1080 Ti costaba 17,57 ms frente a
              los 16,67 ms de un fotograma a 60 fps (105 %): una estimación a partir de velocidades
              medidas por tramo. La medición posterior con imágenes reales salió unas 1,7 veces más
              lenta, así que el muro es mayor, y el registro concluye que el único punto de captura
              viable es el fotograma final.
            </>,
          ]}
          cost={
            <>
              No puede superar el refresco de la pantalla; interpolar añade latencia, como en toda
              captura externa; sin datos del motor, la desoclusión es el caso difícil (
              <a href={readme(94)}>README</a>).
            </>
          }
          sources={[
            { text: 'README', href: readme(94) },
            { text: 'ARCHITECTURE', href: arch(3) },
            {
              text: 'registro de origen RENDER_ASSISTANT_PLAN.md y GPU_MULTI_GPU_PRIOR_ART.md (no publicados)',
            },
          ]}
        />

        <Decision
          title="2. Backward warp y mezcla a una fase t elegida por un reloj de contenido"
          decision={
            <>
              Entre cada par real se sintetiza I_t muestreando ambos fotogramas hacia atrás a lo
              largo del flujo y mezclándolos; la fase la decide un reloj de contenido y el
              multiplicador es variable. El reloj es una pieza propia («for every present tick,
              WHICH pair the generated frame depicts and at WHAT phase t»), con una prueba de
              repetición sobre registros fijos.
            </>
          }
          discarded={[
            <>
              <strong>Forward warp o splatting.</strong> El dossier de la base mínima del proyecto
              lo descarta por motivo documental, no por medición propia: dispersa píxeles hacia
              delante y deja huecos que exigen una red de síntesis para llenarse (no publicado).
            </>,
            <>
              <strong>Mezcla pura sin flujo.</strong> «Pure blend / crossfade is a temporal average
              and ghosts on every moving edge» (mismo dossier, no publicado).
            </>,
            <>
              <strong>Construir sobre la base mínima.</strong> Medida el 2026-09-03, interpolaba una
              vez por par a t = 0,5 sin multiplicar fotogramas; con ese resultado y el coste de
              reimplementar captura, reloj y pacing en otro árbol, se eligió reestructurar el
              repositorio de producción y usar la base solo como plano del bucle de presentación
              (plan de convergencia, no publicado).
            </>,
          ]}
          cost={
            <>
              El backward warp no inventa contenido oculto. Un ejemplo en una opción experimental:
              el ancla de fase de <code>--eco</code> se validó solo a 2x, y a 3x «a third of the
              generated frames would sit at t = 0.5, the middle of its blend ramp, which is
              untested» (<a href={changelog(125)}>CHANGELOG</a>).
            </>
          }
          sources={[
            { text: 'ARCHITECTURE', href: arch(37) },
            { text: 'phase_clock.hpp', href: `${REPO}src/clock/phase_clock.hpp#L4` },
            { text: 'dossier de la base mínima y plan de convergencia (no publicados)' },
          ]}
        />

        <Decision
          title="3. Un rol por GPU según dónde rinde su trabajo, con el coste de transferencia medido"
          decision={
            <>
              Captura y conversión en la GPU integrada, flujo óptico en la GTX 1080 Ti, warp y
              presentación en la RTX 4090, dueña del monitor; <code>--force-single-gpu</code> lo
              reduce a una GPU.
            </>
          }
          discarded={[
            <>
              <strong>Flujo óptico en la GPU integrada.</strong> El registro de origen midió el
              flujo a 1080p en 1,94 ms (4090), 6,70 ms (1080 Ti) y 256 ms (integrada), y la descartó
              por inviable (no publicado).
            </>,
            <>
              <strong>Render-split</strong>, por el muro del 105 % de la decisión 1.
            </>,
          ]}
          cost={
            <>
              Sin copia directa entre tarjetas de consumo, el fotograma pasa por el host. Una
              corrida del banco de transferencia de este equipo (1080p, 8,3 MB): 2,905 ms de la 4090
              a la 1080 Ti y 0,799 ms de la 4090 a la GPU integrada; a 4K, 11,618 ms y 3,570 ms. La
              1080 Ti es el tramo caro: su ancho de banda de host a dispositivo mide una mediana de
              3,2 GB/s frente a 23,5 de la integrada y 26,9 de la 4090, un límite que el registro
              atribuye a su enlace x4. Es el coste de mover un fotograma completo en una sola
              máquina, no el tráfico por tick del producto actual (pendiente de medir); las cifras
              están en la gráfica de transferencia de más abajo.
            </>
          }
          sources={[
            { text: 'ARCHITECTURE', href: arch(26) },
            { text: 'corridas del banco de transferencia y de ancho de banda (no publicadas)' },
          ]}
        />

        <Decision
          title="4. Un registro de capas con hash de contrato y oráculo de paridad, en vez de un kernel parcheado a mano"
          decision={
            <>
              Cada capa de calidad es una fila de una tabla (
              <code>src/control/layer_table.def</code>); de esa tabla salen el analizador de
              opciones, la ayuda, el hash, el modelo JSON y, mediante un generador, el GLSL del
              kernel puro. «Nothing else declares a layer.»
            </>
          }
          discarded={[
            <>
              <strong>Seguir parcheando el kernel monolítico</strong>, que sigue en el árbol como{' '}
              <code>--legacy-warp</code>: el generador existe para no repetir sus seis sitios{' '}
              <code>result =</code> sin relación entre sí.
            </>,
            <>
              <strong>Dos diseños alternativos evaluados</strong> (variantes fusionadas, y cada
              etapa como pase separado con imágenes intermedias): el segundo paga su modularidad con
              imágenes intermedias, con un coste estimado por revisores de +10 a +13 % del tick, no
              medido (registro de selección, no publicado).
            </>,
          ]}
          cost={
            <>
              Tres opciones (<code>--residual-ceil</code>, <code>--conf-improv</code>,{' '}
              <code>--agreement</code>) no tienen efecto bajo el valor por defecto y el proyecto las
              documentó en vez de quitarlas (<a href={changelog(200)}>CHANGELOG, 0.5.3</a>). La
              verificación es doble: con la capa nueva compilada pero apagada, la configuración por
              defecto coincidió con el kernel anterior en 0 píxeles sobre 7190 ticks (30 s, 2x,
              ventana sintética de 640x360, build de comparación sin contracción FMA; cifras de la
              build de desarrollo, no del binario de la versión); y para las decisiones de flujo y
              transporte una prueba exhaustiva sustituyó al oráculo en tiempo de ejecución porque
              este solo visita los estados que una corrida alcanza.
            </>
          }
          sources={[
            { text: 'layer_table.def', href: `${REPO}src/control/layer_table.def#L1` },
            { text: 'layer_gen.cpp', href: `${REPO}tools/layer_gen.cpp#L3` },
            { text: 'test_arm_parity.cpp', href: `${REPO}tests/layers/test_arm_parity.cpp#L2` },
            { text: 'CHANGELOG, 0.6.0', href: changelog(13) },
          ]}
        />

        <Decision
          title="5. Opciones nuevas apagadas por defecto, y un cambio de default publicado también donde pierde"
          decision={
            <>
              Una opción nueva entra apagada (<code>--eco</code>, <code>--eco-anchor</code>,{' '}
              <code>--gdump</code>). En 0.5.3 un valor por defecto se cambió con una medición contra
              una renderización analíticamente exacta, a la fase de cada fotograma, con el valor
              anterior accesible por una opción.
            </>
          }
          discarded={[
            <>
              <strong>Cambiarlo sin publicar el caso desfavorable</strong> (inferencia de quien
              redactó el dossier, no una línea del registro). La entrada del CHANGELOG lo dice en
              positivo: «A default moved, and the measurement that moved it is printed below
              including the case where it loses.»
            </>,
          ]}
          cost={
            <>
              El cambio de la rampa de retención (de 1,2/3,0 a 1,0/1,6) mejoró la posición de la
              caja un 24,9 % y la masa alucinada un 43,6 % a 13,4 px por par, pero empeoró la de la
              esfera en +5,4, +10,7 y +11,1 % a 6,7 px por par: «That last one is the price of this
              change and it is real». La fila de 1,7 px por par queda como no medida porque dos
              rondas discrepan en el signo. Se revierte con{' '}
              <code>--st-hold-lo 1.2 --st-hold-hi 3.0</code>. Las cifras son de escenas sintéticas
              contra verdad exacta, no de un juego, y no dicen cómo se ve el cambio a ojo (
              <a href={changelog(156)}>CHANGELOG, 0.5.3</a>).
            </>
          }
          sources={[
            { text: 'CHANGELOG, 0.5.3', href: changelog(149) },
            {
              text: 'Release v0.5.3-experimental',
              href: 'https://github.com/Swately/PhyriadFG/releases/tag/v0.5.3-experimental',
            },
          ]}
        />
      </ProjectSection>

      <ProjectSection id="comparativa">
        <ProjectComparison project={project} />
      </ProjectSection>

      <ProjectSection id="afirmaciones">
        <ClaimsList claims={project.claims} />
      </ProjectSection>

      <ProjectSection id="datos">
        <ProjectCharts project={project} />
      </ProjectSection>

      <ProjectSection id="limites">
        <LimitsList limits={project.limits} />
      </ProjectSection>

      <ProjectSection id="reproducir">
        <Prose>
          <p>
            <strong>Para compilar y pasar la suite no hace falta GPU:</strong> la suite es solo de
            CPU. Se necesita Windows, las herramientas de compilación de MSVC, el Vulkan SDK y
            Ninja, con la variable <code>VULKAN_SDK</code> definida (<a href={readme(26)}>README</a>
            ). Para ejecutar, Windows 10 u 11 x64, el runtime de VC++ 2015 o posterior y un driver
            con Vulkan; el lanzador, además, WebView2. Una GPU integrada no cuenta como segunda GPU.
            En un equipo con varias GPU, la ruta medida en 0.6.0 se fuerza con{' '}
            <code>--force-single-gpu</code>; la ruta multi-GPU de diseño no está medida en esa
            versión.
          </p>
          <CodeBlock label="Comandos para compilar, probar y ejecutar PhyriadFG">{`build-release.bat    ->  build-release\\phyriad_fg.exe   (distribuible, sin DLL de depuración)
build.bat            ->  build\\phyriad_fg.exe            (depuración)
tools\\run_tests.bat            todas las pruebas
tools\\run_tests.bat -R clock   las pruebas cuyo nombre coincide

build\\phyriad_fg.exe --window "Game Title"   captura el monitor de esa ventana (DDA), genera y presenta
build\\phyriad_fg.exe --monitor 0             captura el monitor 0
build\\phyriad_fg.exe --help                  la lista completa de opciones`}</CodeBlock>
          <p>
            <strong>Salida esperada, observada frente a declarada.</strong>{' '}
            <code>build-release.bat</code> compila y ejecuta <code>ctest</code>; si la suite pasa
            imprime «=== tests OK ===» (declarado en el script). Observado: 68 de 68 pruebas en el
            árbol local el 2026-09-29, y 67 de 67 en una copia de la rama pública (observado en una
            transcripción de sesión, sin registro guardado).
          </p>
          <p>
            <strong>Pendiente de ejecución, no corrido para esta página:</strong> un clon limpio de
            la rama pública con <code>build-release.bat</code> y el registro guardado (se espera
            «out of 67»); el estado de LTO con y sin MinGW en el PATH; la latencia de la entrada al
            fotón; un juego real saturando la GPU; y la ruta multi-GPU, con su entrega, su potencia
            y los arreglos de la ruta de presentación, hoy solo medidos en una GPU. El comando para
            compilar el lanzador no está documentado en el repositorio: un clon limpio no arrancaría
            el lanzador tal cual.
          </p>
        </Prose>
      </ProjectSection>
    </ProjectShell>
  );
}

// Made with my soul - Swately <3
