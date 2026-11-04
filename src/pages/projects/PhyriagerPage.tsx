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
 * Phyriager's own page. Written on the shell in the order of design v3 (mechanism before claims). The header,
 * "En breve", the claims and the limits come from the ledger; the prose below is adapted from the project's own
 * dossier (Phyriager/docs/PORTFOLIO_DOSSIER.md, 2026-10-09 and 2026-10-10) with the operator's authorisation of
 * 2026-10-14. Every decision below is from the project's PUBLISHED records (logbook and VISION), so each source
 * is a link.
 */
const project = projects.find((p) => p.slug === 'phyriager')!;
const REPO = 'https://github.com/Swately/Phyriager/blob/main/';
const LOGBOOK = `${REPO}docs/PHYRIAGER_LOGBOOK.md`;
const VISION = `${REPO}docs/VISION.md`;

export default function PhyriagerPage() {
  return (
    <ProjectShell project={project}>
      <ProjectSection id="contexto">
        <Prose>
          <p>
            Los agentes LLM que juegan Minecraft suelen hablar con el juego por un canal de ventaja:
            leen la lista de entidades del servidor, escriben bloques o se teletransportan.
            Phyriager se impuso lo contrario como contrato (<a href={VISION}>VISION.md</a>, sección
            4): percibe solo lo que recibe un cliente conectado y actúa solo por la entrada normal
            de jugador, y esos dos límites son mecánicos (un mod de cliente fijo y un canal de
            memoria compartida con versión que se niega a conectar si hay deriva), no una promesa.
          </p>
          <p>
            Lo segundo que lo distingue es dónde aprende: desde el 2026-08-09 se define como un{' '}
            <em>entorno entrenado</em> (VISION.md, sección 1). Cuando un LLM que juega corrige una
            suposición (por ejemplo, «la madera se corta a mano»), la corrección se guarda en el
            entorno (biblioteca de rutinas, autómatas, canal de lecciones) y la hereda cualquier
            modelo futuro desde su primera petición, sin tocar pesos. El LLM no está en el bucle
            motor (VISION.md, sección 6): la competencia de cada tick es C++ determinista, y el
            modelo decide <em>qué</em> hacer, no cómo caminar.
          </p>
          <p>
            Cronología: el primer registro de trabajo es del 2026-05-31 y el primer commit del
            repositorio, del 2026-07-08. El último commit es del 2026-08-09; no hay actividad
            registrada desde entonces. El operador detuvo el ciclo de rondas tras la ronda 3 y pasó
            a pruebas unitarias en un mundo superplano. Si el trabajo continuó en otra máquina sin
            llegar al repositorio, no consta.
          </p>
        </Prose>
      </ProjectSection>

      <ProjectSection id="mecanismo">
        <Prose>
          <p>
            Tres procesos y un LLM. Un mod de cliente (Java/Fabric) vive dentro de la frontera de
            honestidad con el servidor: consume lo que un cliente conectado recibe, produce una
            percepción filtrada y aplica la orden del cerebro como entrada real de jugador; no tiene
            lógica de decisión. Entre mod y cerebro hay una memoria compartida con ABI v6 que lleva
            magia y versión y se niega a conectar si hay deriva: es el único canal entre ambos. El
            cerebro (C++23) percibe, planifica y actúa con solvers a 20 Hz y reflejos, y verifica
            cada resultado; un router de LLM, conectado a él, solo delibera y tiene un tope de gasto
            por hora. Las superficies HTTP exponen observar, actuar, crear rutinas y leer resultados
            y lecciones heredables, y un LLM jugador, de cualquier modelo, juega por ellas sin
            acceso al código.
          </p>
          <p>
            El segundo diagrama muestra dónde aprende: un ciclo de tres pasos (ronda, auditoría,
            arreglos) que desemboca en el entorno y no en un modelo; la ronda siguiente hereda el
            entorno desde su primer GET.
          </p>
        </Prose>
        <ProjectFigures project={project} />
      </ProjectSection>

      <ProjectSection id="diseno">
        <Prose>
          <p>
            Cinco decisiones del registro publicado del proyecto, cada una con lo que descartó y por
            qué.
          </p>
        </Prose>

        <Decision
          title="1. Cliente de red en vez de servidor integrado o jugador falso"
          decision={
            <>
              El bot es un cliente conectado a un servidor, no parte de él. Así lo que recibe es lo
              mismo que recibe un humano: el protocolo hace cumplir la frontera que antes el mod
              tenía que simular.
            </>
          }
          discarded={[
            <>
              <strong>Mantener el servidor integrado de un solo jugador.</strong> El cliente leía
              estáticas de la JVM (<code>active</code>, <code>cmdSeq</code>, <code>cmdSneak</code>
              …), así que cliente y lógica de servidor no se podían separar entre máquinas.
            </>,
            <>
              <strong>Un «jugador falso» del lado del servidor, al estilo Carpet.</strong> Saca la
              actuación del canal de entrada real y rompe la compuerta de honestidad.
            </>,
          ]}
          sources={[{ text: 'PHYRIAGER_LOGBOOK, D·5 (2026-08-02)', href: LOGBOOK }]}
        />

        <Decision
          title="2. Arreglar la numeración, no los números"
          decision={
            <>
              Un registro (<code>brain/data/id_registry.v1.json</code>) hace que un nombre conocido
              conserve su identificador para siempre y que los nuevos se anexen.
            </>
          }
          discarded={[
            <>
              <strong>Renumerar por versión</strong> y convertir unos 274 literales en 37 archivos
              en búsquedas por nombre.
            </>,
            <>
              <strong>Confiar solo en una comprobación de versión al arrancar.</strong> Los números
              sueltos dentro de arreglos y lógica son invisibles a cualquier escaneo y no se
              distinguen de cantidades, y una comprobación de versión no ve constantes compiladas
              (G-12: 18 de 21 identificadores eran erróneos en 26.2).
            </>,
          ]}
          cost={
            <>
              La primera reescritura del registro ordenó las claves del JSON y rompió el lector
              manual de C++; lo atrapó la suite de pruebas, no la revisión.
            </>
          }
          sources={[{ text: 'PHYRIAGER_LOGBOOK, D·9 (2026-08-03)', href: LOGBOOK }]}
        />

        <Decision
          title="3. Una compuerta de honestidad antes que un modelo más brillante"
          decision={
            <>
              La compuerta mira la luminancia real del cuadro (no el indicador <code>is_day</code>,
              que se vio discrepar) y, por debajo de 40, responde «demasiado oscuro» sin consultar
              al modelo: un jugador sin antorcha tampoco ve.
            </>
          }
          discarded={[
            <>
              <strong>Subir la resolución o el modelo para «ver» de noche.</strong> El modelo de 3b,
              con luminancia media de unos 37 sobre 255, inventó «aldea nevada / jugador en una
              cama» en un desierto; con 164 a 170 sobre 255 acertó.
            </>,
          ]}
          sources={[{ text: 'PHYRIAGER_LOGBOOK, D·3 y E-3 (2026-05-31)', href: LOGBOOK }]}
        />

        <Decision
          title="4. El LLM fuera del bucle motor; dos niveles en lugar de tres"
          decision={
            <>
              El nivel 0, reflejos en C++, lleva la competencia de cada tick; el LLM delibera por un
              router con tope de gasto por hora.
            </>
          }
          discarded={[
            <>
              <strong>Un modelo táctico siempre caliente</strong> (el plan de 2026-07-08). Los
              modelos medidos ocupaban unos 10 GB residentes cada uno (E-2) y no había una GPU libre
              para uno permanente; y con un LLM medido y con latencia, «an LLM in the motor loop is
              a defect, not a feature».
            </>,
          ]}
          sources={[
            { text: 'VISION.md, sección 6', href: VISION },
            { text: 'PHYRIAGER_LOGBOOK, E-2', href: LOGBOOK },
          ]}
        />

        <Decision
          title="5. Observar, decidir y comprometer en vez de deriva continua"
          decision={
            <>
              El agente se detiene, mira, decide sobre la vista fresca, avanza un tramo acotado y
              repite hasta llegar al objetivo. Validado en vivo (C-4).
            </>
          }
          discarded={[
            <>
              <strong>Percibir mientras se mueve.</strong> El agente se movía todo el tiempo, así
              que un análisis de varios segundos llegaba siempre obsoleto; el ritmo de percepción
              debe igualar su latencia o la percepción es decorativa.
            </>,
          ]}
          sources={[{ text: 'PHYRIAGER_LOGBOOK, D·4 y G-5 (2026-06-01)', href: LOGBOOK }]}
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
            Requisitos (README y <code>mod/README.md</code>): JDK 25, CMake, Ninja y un compilador
            C++23 (MinGW-w64 g++ o MSVC), Python 3 y un endpoint de LLM. Para jugar en vivo además
            hace falta un servidor Fabric 26.2 y un cliente.{' '}
            <strong>Nada de esto se ejecutó para esta página:</strong> los resultados esperados
            vienen de los mensajes de commit y de los registros publicados, y cada uno está
            pendiente de ejecución.
          </p>
          <CodeBlock label="Comandos para compilar y probar Phyriager">{`# Cerebro y pruebas, sin juego (desde la raíz del repositorio)
cmake -S . -B build-ninja -G Ninja -DCMAKE_CXX_COMPILER=g++ -DBUILD_TESTING=ON
cmake --build build-ninja -j
ctest --test-dir build-ninja

# Compuerta de inyección de chat
python tools/prompt_guard.py --selftest

# Mod (necesita JDK 25), desde mod/
JAVA_HOME=/ruta/a/jdk-25 ./gradlew build        # -> build/libs/phyriager-1.0.0.jar`}</CodeBlock>
          <p>
            Esperado según el mensaje del commit <code>ff30ed9</code>: «Fleet: 88/89
            (voyager_obtain_test pre-existing)», con un único fallo conocido (G-11), y «Selftest
            9/9». Son cifras citadas, no verificadas hoy. En vivo, el cerebro y la superficie HTTP
            arrancan como tareas de la sesión interactiva del cliente: la memoria compartida de
            Windows es por sesión, y un proceso lanzado por SSH nunca ve la del juego, según el
            registro del proyecto.
          </p>
        </Prose>
      </ProjectSection>
    </ProjectShell>
  );
}

// Made with my soul - Swately <3
