import { Disclosure, Link, Prose, Stack, Text } from '../phyriad-react';
import { ClaimsList, LimitsList, ProjectSection } from '../components/ProjectShell';
import Decision from '../components/Decision';
import Figure from '../components/Figure';
import SectionNav from '../components/SectionNav';
import SubstrateDemoFrame from '../components/SubstrateDemoFrame';
import {
  EVIDENCE_DOC,
  SUBSTRATE_VERSIONS,
  substrateClaims,
  substrateFigure,
  substrateLimits,
} from '../content/substrate';

/**
 * /sustrato-web — how the web substrate (catalog/web: phyriad-tokens + phyriad-react) works, with a live
 * demonstration and the laboratory. Written on the same pieces as a project page, in the same order
 * (mechanism before claims). Every assertion is a `Claim` in src/content/substrate.ts; the prose below
 * explains and links, it does not add numbers the ledger does not carry. Lazy-loaded: the home page does not
 * pay for it.
 */
const NAV = [
  { id: 'resumen', title: 'En breve' },
  { id: 'contexto', title: 'Qué problema resuelve' },
  { id: 'mecanismo', title: 'Cómo funciona' },
  { id: 'decisiones', title: 'Decisiones de diseño' },
  { id: 'demos', title: 'Demostración en vivo' },
  { id: 'laboratorio', title: 'Laboratorio' },
  { id: 'afirmaciones', title: 'Qué afirma, y cómo se comprueba' },
  { id: 'limites', title: 'Límites declarados' },
  { id: 'verificacion', title: 'Verificación' },
];

export default function SustratoWebPage() {
  return (
    <>
      <title>El sustrato web — Eduardo Ramos Mendoza</title>
      <Stack as="header" gap="xs">
        <nav aria-label="Volver">
          <Link to="/" className="phy-target">
            ← Índice
          </Link>
        </nav>
        <Text as="h1" size="xl">
          El sustrato web{' '}
          <Text as="span" size="sm" mono muted>
            tokens {SUBSTRATE_VERSIONS.tokens} · react {SUBSTRATE_VERSIONS.react}
          </Text>
        </Text>
        <Text muted>
          La base de estilos y componentes de este sitio y de otros proyectos: cómo funciona, una
          demostración que puede tocar y lo que no se ha comprobado.
        </Text>
      </Stack>

      <ProjectSection id="resumen" title="En breve">
        <Text>
          El sustrato web son dos paquetes: <strong>phyriad-tokens</strong>, la capa de CSS con los
          colores, la escala tipográfica y el espacio, y <strong>phyriad-react</strong>, los
          componentes que se apoyan en ellos. Viven en un catálogo y se <em>copian</em> a cada
          sitio; ningún sitio los enlaza. Esta página explica el mecanismo, deja cambiar la paleta y
          la tipografía en una demostración real y dice qué falta por comprobar.
        </Text>
        <SectionNav items={NAV} />
      </ProjectSection>

      <ProjectSection id="contexto" title="Qué problema resuelve">
        <Prose>
          <p>
            Un sitio personal, una herramienta con interfaz web y un panel de administración repiten
            las mismas piezas: una paleta, una escala de tamaños, una tabla, un diálogo. Cuando cada
            uno las escribe por su cuenta se desvían: contrastes distintos, tamaños distintos,
            accesibilidad desigual.
          </p>
          <p>
            El sustrato es una sola copia de esas piezas, con sus pruebas, que cada proyecto lleva
            consigo. La pregunta que lo ordena no es «qué se ve bien» sino «qué se puede comprobar»:
            cada cifra de esta página sale de un comando que se ejecutó y que cualquiera puede
            repetir.
          </p>
        </Prose>
      </ProjectSection>

      <ProjectSection id="mecanismo" title="Cómo funciona">
        <Text size="sm">
          El diagrama sigue un cambio desde el catálogo hasta los sitios y muestra qué lo vigila.
        </Text>
        <Figure figure={substrateFigure} id="figura-1" />
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
            Tres piezas son las que hacen que el sustrato sea algo más que una carpeta con estilos:
            un testbench que <em>calcula</em> (contraste, zoom, que el acento no caiga en la franja
            de color de las plantillas) en lugar de afirmar, un presupuesto de tamaño que suma todos
            los fragmentos de JavaScript y de CSS y falla el build si se pasa, y una revisión de
            accesibilidad en un navegador real, porque la que corre sin navegador no ve defectos de
            maquetación.
          </p>
        </Prose>
      </ProjectSection>

      <ProjectSection id="decisiones" title="Decisiones de diseño">
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
              Una página solo puede mostrar una paleta a la vez. Por eso la demostración de más
              abajo vive en un documento aparte.
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

      <ProjectSection id="demos" title="Demostración en vivo">
        <Text size="sm">
          Cambie la paleta, el tema tipográfico y el tamaño: la caja es un documento aparte con los
          componentes reales, y es lo único que cambia. Sigue el tema claro u oscuro de este sitio.
        </Text>
        <SubstrateDemoFrame />
      </ProjectSection>

      <ProjectSection id="laboratorio" title="Laboratorio">
        <Text size="sm">
          El laboratorio del sustrato reúne todas las secciones, primitivas y escalas en una página
          y mide el DOM en vivo: el ancho real de la medida, los caracteres por línea y el contraste
          contra el fondo. Mide <em>su</em> pantalla, no la mía.{' '}
          <Link to="/sustrato-web/laboratorio" className="phy-target">
            Abrir el laboratorio →
          </Link>
        </Text>
      </ProjectSection>

      <ProjectSection id="afirmaciones" title="Qué afirma, y cómo se comprueba">
        <ClaimsList claims={substrateClaims} />
      </ProjectSection>

      <ProjectSection id="limites" title="Límites declarados">
        <LimitsList limits={substrateLimits} />
      </ProjectSection>

      <Stack as="section" gap="xs" aria-labelledby="verificacion-h">
        <Text as="h2" size="sm" mono muted id="verificacion-h">
          Verificación
        </Text>
        <Disclosure summary="Cómo se comprueba que esta página no dice más de lo que se midió">
          <Text size="sm" muted>
            Cada cifra de la sección anterior está escrita, con el comando que la produjo, en{' '}
            <a href={EVIDENCE_DOC}>docs/SUSTRATO_WEB_EVIDENCE.md</a>. Una prueba falla si una cifra
            de esta página no aparece en ese registro, y otra si las versiones nombradas aquí no son
            las de los archivos copiados. Eso protege contra que la página y su registro se separen;
            no puede saber si una cifra es falsa, y por eso los comandos se ejecutaron primero.
          </Text>
        </Disclosure>
      </Stack>
    </>
  );
}

// Made with my soul - Swately <3
