import { Link, Prose, Text } from '../../phyriad-react';
import ProjectShell, {
  ClaimsList,
  LimitsList,
  ProjectSection,
} from '../../components/ProjectShell';
import ProjectCharts from '../../components/charts/ProjectCharts';
import ProjectComparison from '../../components/ProjectComparison';
import Decision from '../../components/Decision';
import CodeBlock from '../../components/CodeBlock';
import SubstrateDemoFrame from '../../components/SubstrateDemoFrame';
import { projects } from '../../content';
import { EVIDENCE_DOC } from '../../content/substrate';

/**
 * The web substrate's own dossier (/proyecto/sustrato-web), written on the shell in the order of design v3
 * (mechanism before claims). It replaces the standalone /sustrato-web page of the same day: that route now
 * redirects here, so there is one page, not two. The header, "En breve" (with the diagram as its figure), the
 * claims and the limits come from the ledger (src/content/substrate.ts, through content.ts); the prose below
 * explains and links, and adds no number the ledger does not carry. The live demonstration and the laboratory
 * sit in "Cómo funciona".
 */
const project = projects.find((p) => p.slug === 'sustrato-web')!;

export default function SustratoWebPage() {
  return (
    <ProjectShell project={project}>
      <ProjectSection id="contexto">
        <Prose>
          <p>
            Un sitio personal, una herramienta con interfaz web y un panel de administración repiten
            las mismas piezas: una paleta, una escala de tamaños, una tabla, un diálogo. Cuando cada
            uno las escribe por su cuenta se desvían: contrastes distintos, tamaños distintos,
            accesibilidad desigual.
          </p>
          <p>
            El sustrato web son dos paquetes: <strong>phyriad-tokens</strong>, la capa de CSS con
            los colores, la escala tipográfica y el espacio, y <strong>phyriad-react</strong>, los
            componentes que se apoyan en ellos. Viven en un catálogo y se <em>copian</em> a cada
            sitio; ningún sitio los enlaza. La pregunta que lo ordena no es «qué se ve bien» sino
            «qué se puede comprobar»: cada cifra de esta página sale de un comando que se ejecutó.
          </p>
          <p>
            Cronología: la primera versión del catálogo es del 2026-08-27 (0.1.0, en su registro de
            cambios) y la actual es la de la cabecera. El catálogo vive en el contenedor de
            desarrollo del autor y no está publicado; este sitio, el que está leyendo, lleva una
            copia.
          </p>
        </Prose>
      </ProjectSection>

      <ProjectSection id="mecanismo">
        <Text size="sm">
          El diagrama de arriba sigue un cambio desde el catálogo hasta los sitios y muestra qué lo
          vigila. A continuación, cada pieza, y debajo una demostración que puede tocar.
        </Text>
        <Prose>
          <h3>Los tokens</h3>
          <p>
            Son variables de CSS, no código: diez <em>roles</em> de color (papel, dos superficies
            más, tinta, tinta atenuada, línea, acento, texto sobre el acento, error, éxito), que
            cada paleta rellena con sus valores, y una escala tipográfica fluida de nueve pasos, de{' '}
            <code>xs</code> a <code>4xl</code>. Las paletas y los temas tipográficos se eligen con
            un atributo en el elemento raíz (<code>data-palette</code>, <code>data-type</code>):
            ningún componente nombra un color ni una familia literal, así que todos siguen el cambio
            sin saberlo.
          </p>
          <h3>Los componentes</h3>
          <p>
            phyriad-react ofrece texto, tablas, formularios, diálogos, navegación y el estado de la
            interfaz. Las tablas, por ejemplo, piden el ancho que necesitan sus columnas en vez de
            ajustarse a un umbral de pantalla. Su referencia (<code>API.md</code>) no se escribe a
            mano: la genera una herramienta leyendo el código, y una comprobación falla si algo
            exportado queda sin documentar.
          </p>
          <h3>Copiar, no enlazar</h3>
          <p>
            <code>sync.mjs</code> copia el sustrato al sitio y guarda un hash por archivo. Con él
            distingue dos cosas que una simple comparación confunde: que el sitio editó el archivo
            (hay que protegerlo) o que el catálogo avanzó (se puede actualizar).{' '}
            <code>--check</code> informa de la desviación sin tocar nada; <code>fleet-check</code>{' '}
            hace lo mismo con todos los proyectos del contenedor a la vez.
          </p>
          <h3>Las compuertas</h3>
          <p>
            Tres piezas hacen que el sustrato sea algo más que una carpeta con estilos: un testbench
            que <em>calcula</em> (contraste, zoom, que el acento no caiga en la franja de color de
            las plantillas) en lugar de afirmar, un presupuesto de tamaño que suma todos los
            fragmentos de JavaScript y de CSS y falla el build si se pasa, y una revisión de
            accesibilidad en un navegador real, porque la que corre sin navegador no ve defectos de
            maquetación.
          </p>
        </Prose>

        <Text as="h3" size="md">
          Demostración en vivo
        </Text>
        <Text size="sm">
          Cambie la paleta, el tema tipográfico y el tamaño: la caja es un documento aparte con los
          componentes reales, y es lo único que cambia. Sigue el tema claro u oscuro de este sitio.
        </Text>
        <SubstrateDemoFrame />

        <Text as="h3" size="md">
          Laboratorio
        </Text>
        <Text size="sm">
          El laboratorio del sustrato reúne todas las secciones, primitivas y escalas en una página
          y mide el DOM en vivo: el ancho real de la medida, los caracteres por línea y el contraste
          contra el fondo. Mide <em>su</em> pantalla, no la mía.{' '}
          <Link to="/sustrato-web/laboratorio" className="phy-target">
            Abrir el laboratorio →
          </Link>
        </Text>
      </ProjectSection>

      <ProjectSection id="diseno">
        <Text size="sm" muted>
          Cada decisión dice qué descartó y qué le costó, con su fuente.
        </Text>
        <Decision
          title="1. Copiar el sustrato, no publicarlo como paquete"
          decision={
            <>Cada proyecto lleva su copia y un registro de hashes; el catálogo nunca se enlaza.</>
          }
          discarded={[
            <>
              <strong>Un paquete versionado que cada sitio instala.</strong> Una actualización
              podría cambiar un sitio sin que nadie la pidiera, y una interfaz de escritorio (Tauri)
              solo puede cargar archivos que estén dentro de su propia carpeta.
            </>,
          ]}
          cost={
            <>
              Una copia puede quedarse atrás. El revisor lo dice, pero no lo evita: en la medición
              de esta página una de cinco copias iba atrasada.
            </>
          }
          sources={[
            {
              text: 'Copia y fleet-check, en el registro de evidencia',
              href: `${EVIDENCE_DOC}#fleet-check`,
            },
          ]}
        />
        <Decision
          title="2. Paletas y temas como atributo de la página, no como componentes"
          decision={
            <>
              Un atributo en el elemento raíz redefine los roles; el CSS lo lee sin JavaScript y sin
              parpadeo al cargar.
            </>
          }
          discarded={[
            <>
              <strong>Un proveedor de tema en React.</strong> El CSS no puede leer un contexto, así
              que habría que escribir igualmente un atributo, y un proveedor actúa después de que la
              página ya pintó: justo cuando aparece el parpadeo del tema equivocado.
            </>,
          ]}
          cost={
            <>
              Una página solo puede mostrar una paleta a la vez. Por eso la demostración vive en un
              documento aparte.
            </>
          }
          sources={[
            {
              text: 'Paletas y temas, en el registro de evidencia',
              href: `${EVIDENCE_DOC}#paletas-y-temas`,
            },
          ]}
        />
        <Decision
          title="3. Calcular la escala tipográfica, con tamaños fijos de respaldo"
          decision={
            <>
              Un navegador con soporte calcula cada tamaño desde unos pocos números; uno sin él usa
              los valores fijos de siempre.
            </>
          }
          discarded={[
            <>
              <strong>Escribir cada tamaño a mano.</strong> Cambiar la proporción obligaba a
              recalcular seis valores, y no había forma de ofrecer varios temas tipográficos.
            </>,
          ]}
          cost={
            <>
              La fórmula usa una función de CSS reciente. Se verificó en Chromium y en Firefox;
              Safari queda sin probar.
            </>
          }
          sources={[
            {
              text: 'Escala tipográfica, en el registro de evidencia',
              href: `${EVIDENCE_DOC}#escala-tipográfica`,
            },
          ]}
        />
      </ProjectSection>

      <ProjectSection id="comparativa">
        <ProjectComparison project={project} />
        <Prose>
          <p>
            Lectura honesta: shadcn/ui y Material UI son conjuntos completos de componentes y el
            sustrato no pretende serlo; son dos paquetes pequeños para los proyectos de una sola
            persona. Lo que la tabla distingue es una decisión de distribución, cómo llega el código
            a un proyecto, y ninguna fila mide una ventaja. Las dos fuentes externas se leyeron con
            una herramienta que devuelve un resumen, no el texto literal: por eso van marcadas [V2].
          </p>
        </Prose>
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
            <strong>Qué se puede repetir desde este repositorio.</strong> Con Node y nada más: las
            comprobaciones del contenido, de las páginas y de la accesibilidad en un entorno de
            pruebas, la construcción del sitio y la comprobación de las figuras. Son las que corre
            la integración continua de este repositorio.
          </p>
          <CodeBlock label="Comandos para repetir las comprobaciones de este sitio">{`git clone https://github.com/Swately/portfolio
cd portfolio
npm ci
npm test
npm run build
npm run figures:check`}</CodeBlock>
          <p>
            <strong>Qué no.</strong> Los testbenches de tokens y de react, <code>fleet-check</code>,{' '}
            <code>npm run substrate:check</code> y <code>npm run size:budget</code> miran el
            catálogo, que vive en el contenedor de desarrollo del autor y no está publicado. No se
            pueden repetir desde el repositorio público; por eso sus salidas están copiadas, con
            fecha, en <a href={EVIDENCE_DOC}>docs/SUSTRATO_WEB_EVIDENCE.md</a>, y la página no dice
            nada que ese registro no diga.
          </p>
        </Prose>
      </ProjectSection>
    </ProjectShell>
  );
}

// Made with my soul - Swately <3
