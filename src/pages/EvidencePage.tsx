import { useState } from 'react';
import { DescList, Input, Link, Search, Stack, Status, Box, Text } from '../phyriad-react';
import { projects, skills } from '../content';
import SkillsTable from '../components/SkillsTable';
import EvidenceChip from '../components/EvidenceChip';
import styles from './EvidencePage.module.css';

const KINDS: { kind: string; label: string; meaning: string }[] = [
  {
    kind: 'En vivo',
    label: 'live',
    meaning: 'Puedes abrirlo y usarlo tú mismo. Es la prueba más fuerte que hay aquí.',
  },
  {
    kind: 'Medido',
    label: 'number',
    meaning:
      'Un valor, el instrumento que lo produjo y el documento del proyecto donde queda ' +
      'registrado. Sin instrumento no se publica el número.',
  },
  {
    kind: 'Figura',
    label: 'figure',
    meaning:
      'Un artefacto que el propio proyecto generó: un diagrama o un cuadro real de ejecución.',
  },
  {
    kind: 'Documento',
    label: 'doc',
    meaning: 'Un documento concreto dentro del repositorio del proyecto.',
  },
  {
    kind: 'Provisional',
    label: 'provisional',
    meaning:
      'El propio proyecto declara que ese resultado todavía no está validado. Se muestra esa ' +
      'declaración como la evidencia, en vez de callar el dato o de presentarlo como firme.',
  },
];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function EvidencePage() {
  const total = projects.reduce((n, p) => n + p.claims.length + 2, 0);
  // A small engine of the page's own: the substrate ships the Search surface,
  // the filter is the consumer's (accent-insensitive substring over the claim
  // text and the project name).
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());
  const visible = projects
    .map((p) => ({
      project: p,
      claims: q
        ? p.claims.filter((c) => normalize(c.text).includes(q) || normalize(p.name).includes(q))
        : p.claims,
    }))
    .filter((v) => v.claims.length > 0);
  const shown = visible.reduce((n, v) => n + v.claims.length, 0);
  const allClaims = projects.reduce((n, p) => n + p.claims.length, 0);

  return (
    <>
      <title>Cómo se verifica — Eduardo Ramos Mendoza</title>
      <Stack as="header" gap="xs">
        <nav aria-label="Volver">
          <Link to="/" className="phy-target">
            ← Índice
          </Link>
        </nav>
        <Text as="h1" size="xl">
          Cómo se verifica esta página
        </Text>
        <Text muted>
          Cada afirmación sobre un proyecto lleva su respaldo. Esta sección explica qué cuenta como
          prueba, enumera todo lo que la página afirma y dice qué falta.
        </Text>
      </Stack>

      <Stack as="section" gap="s" aria-labelledby="tipos-h">
        <Text as="h2" size="md" id="tipos-h">
          Qué cuenta como prueba
        </Text>
        <DescList
          termWidth="7rem"
          items={KINDS.map((k) => ({
            key: k.label,
            term: (
              <Text as="span" size="xs" mono className={styles.kindName}>
                {k.kind}
              </Text>
            ),
            desc: (
              <Text as="span" size="sm">
                {k.meaning}
              </Text>
            ),
          }))}
        />
      </Stack>

      <Stack as="section" gap="s" aria-labelledby="mecanismo-h">
        <Text as="h2" size="md" id="mecanismo-h">
          El mecanismo, y hasta dónde llega
        </Text>
        <Text size="sm">
          La evidencia es un campo <strong>obligatorio</strong> del tipo que describe cada
          afirmación. Una afirmación sin respaldo no compila: <code>tsc --noEmit</code> ya forma
          parte de la integración continua, así que la cobertura no depende de que el autor se
          acuerde.
        </Text>
        <Box variant="surface" padding="m">
          <Text size="sm">
            <strong>El límite honesto:</strong> el compilador garantiza que la evidencia{' '}
            <em>exista</em>, no que sea <em>cierta</em>. TypeScript no puede saber que un número
            quedó obsoleto. Comprobar cada dato contra su fuente sigue siendo trabajo humano, y se
            hizo a mano el 27 de agosto de 2026.
          </Text>
        </Box>
      </Stack>

      <Stack as="section" gap="m" aria-labelledby="todas-h">
        <Text as="h2" size="md" id="todas-h">
          Todas las afirmaciones del sitio
        </Text>
        <Text size="sm" muted>
          {total} afirmaciones sobre {projects.length} proyectos. El nombre y el estado de cada
          proyecto cuentan como afirmaciones y llevan su propio respaldo.
        </Text>
        <Search label="Filtrar afirmaciones">
          <Input
            aria-label="Filtrar por texto o proyecto"
            placeholder="Filtrar por texto o proyecto…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Search>
        <Status>{q ? `${shown} de ${allClaims} afirmaciones` : ''}</Status>
        {visible.map(({ project: p, claims }) => (
          <Stack gap="xs" key={p.slug}>
            <Text as="h3" size="base">
              <Link to={`/proyecto/${p.slug}`}>{p.name}</Link>{' '}
              <Text as="span" size="xs" mono muted>
                {p.status}
              </Text>
            </Text>
            <Text size="xs" muted>
              Estado copiado literalmente de {p.statusSource} · nombre respaldado por{' '}
              <a href={p.repoUrl}>el repositorio</a>
            </Text>
            <Stack as="ul" gap="s">
              {claims.map((c) => {
                const n = p.claims.indexOf(c) + 1;
                return (
                  <Stack as="li" gap="3xs" key={n} className={styles.claimRow}>
                    <Text size="sm">
                      {c.text}{' '}
                      <Link to={`/proyecto/${p.slug}#afirmacion-${n}`}>
                        <Text as="span" size="xs" muted>
                          ver en el dossier
                        </Text>
                      </Link>
                    </Text>
                    <EvidenceChip evidence={c.evidence} />
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Stack as="section" gap="s" aria-labelledby="falta-h">
        <Text as="h2" size="md" id="falta-h">
          Lo que falta, y por qué
        </Text>
        <Stack as="ul" gap="xs">
          <Text as="li" size="sm" className={styles.gap}>
            No hay captura de Phynned funcionando ni del display de PHarvard. Existen y son
            fotografiables, pero hoy no están en disco, así que esos dos proyectos aparecen sin
            figura en vez de con una imagen prestada.
          </Text>
          <Text as="li" size="sm" className={styles.gap}>
            No se publica el número de pruebas de climx: su README dice 41 y su bitácora de medición
            registra 41, 50 y 51 en tres fechas distintas. Cualquiera de los dos contradiría a la
            otra fuente, así que no va ninguno.
          </Text>
          <Text as="li" size="sm" className={styles.gap}>
            No se publican las cifras de Lighthouse de climx: se midieron contra la dirección
            anterior al cambio de nombre del repositorio, y no hay Lighthouse instalado aquí para
            volver a medirlas.
          </Text>
          <Text as="li" size="sm" className={styles.gap}>
            Los estados y los documentos citados están en inglés porque así están escritos en su
            origen. Se citan tal cual antes que traducirlos, para que el cotejo sea exacto.
          </Text>
        </Stack>
      </Stack>

      <Stack as="section" gap="s" aria-labelledby="herramientas-h">
        <Text as="h2" size="md" id="herramientas-h">
          Herramientas, con su evidencia
        </Text>
        <Text size="sm" muted>
          Cada fila nombra el proyecto que la comprueba: una lista de capacidades es donde suele
          esconderse una afirmación sin respaldo, así que vive aquí y no en el índice.
        </Text>
        <SkillsTable
          groups={skills}
          nameOf={(slug) => projects.find((p) => p.slug === slug)?.name ?? slug}
        />
      </Stack>

      <Stack as="section" gap="xs" aria-labelledby="hecha-h">
        <Text as="h2" size="md" id="hecha-h">
          Cómo está hecha
        </Text>
        <Text size="sm">
          React 19 y TypeScript en modo estricto sobre Vite, sin dependencias de ejecución más allá
          de React. El enrutado, los primitivos de maquetación, los design tokens y los dos esquemas
          de color vienen del sustrato web del contenedor (phyriad-tokens y phyriad-react 1.0.0),
          copiado en este repositorio para que se construya por su cuenta; el puente para enlaces
          profundos en GitHub Pages es el mismo que usa{' '}
          <a href="https://github.com/Swately/climx">climx</a>, el proyecto de abajo en el índice.
        </Text>
      </Stack>
    </>
  );
}

// Made with my soul - Swately <3
