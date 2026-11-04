import { Box, DescList, Link, Prose, Stack, Text } from '../phyriad-react';
import EvidenceChip from '../components/EvidenceChip';
import { LimitsList } from '../components/ProjectShell';
import {
  PAPERS_FILES,
  PAPERS_RECORD,
  funnel,
  methodClaims,
  paperLimits,
  pages,
  papers,
  protocols,
} from '../content/papers';
import styles from './PapersPage.module.css';

/**
 * /papers: the four papers of the series and, below them, how a paper is worked and which of the author's
 * protocols that rests on. Every assertion is a claim with evidence (src/content/papers.ts); the prose here
 * explains and links and adds no number the ledger does not carry.
 */
export default function PapersPage() {
  return (
    <>
      <title>Papers — Eduardo Ramos Mendoza</title>
      <Stack as="header" gap="xs">
        <nav aria-label="Volver">
          <Link to="/" className="phy-target">
            ← Índice
          </Link>
        </nav>
        <Text as="h1" size="xl">
          Papers
        </Text>
        <Text muted>
          Cuatro papers de 2026 sobre cuándo una tesis sistémica dice algo que puede ser falso, y el
          método con el que se escribieron. Cada uno existe en español y en inglés, escrito en cada
          idioma por separado, no traducido.
        </Text>
        <Box variant="surface" padding="m">
          <Text size="sm">
            <strong>Estado:</strong> análisis del autor, sin revisión por pares ni revista. Lo que
            cada paper afirma como argumentado o conjeturado lo dice él mismo, y se repite aquí.
          </Text>
        </Box>
      </Stack>

      <Stack as="section" gap="l" aria-labelledby="series-h">
        <Text as="h2" size="md" id="series-h">
          La serie
        </Text>
        {papers.map((p, i) => (
          <Stack as="article" gap="xs" key={p.slug} aria-labelledby={`paper-${p.slug}-h`}>
            <Text as="h3" size="base" id={`paper-${p.slug}-h`}>
              {p.title}
            </Text>
            <Text size="xs" mono muted>
              <span lang="en">{p.titleEn}</span>
            </Text>
            <Text size="sm" muted>
              {p.role}
            </Text>
            <Text size="sm">{p.result}</Text>
            <Text size="sm" className={styles.files}>
              <a href={`${PAPERS_FILES}${p.slug}-es.pdf`} className="phy-target">
                PDF en español ({pages[p.slug].es})
              </a>
              {' · '}
              <a href={`${PAPERS_FILES}${p.slug}-en.pdf`} className="phy-target" lang="en">
                PDF in English ({pages[p.slug].en})
              </a>
              {p.spine && (
                <>
                  {' · '}
                  <a href={`${PAPERS_FILES}${p.slug}-SPINE.md`} className="phy-target">
                    Identidad congelada
                  </a>
                </>
              )}
            </Text>
            <ol className={styles.claims}>
              {p.claims.map((claim, j) => (
                <Stack as="li" gap="xs" key={j} id={`paper-${i + 1}-afirmacion-${j + 1}`}>
                  <Text size="sm">{claim.text}</Text>
                  <EvidenceChip evidence={claim.evidence} />
                </Stack>
              ))}
            </ol>
          </Stack>
        ))}
      </Stack>

      <Stack as="section" gap="m" aria-labelledby="metodo-h">
        <Text as="h2" size="md" id="metodo-h">
          Cómo se trabaja un paper
        </Text>
        <Prose>
          <p>
            Un paper no se escribe de corrido. Se barre lo que ya se sabe, se fija en un documento
            corto qué afirma el paper y dónde termina, y desde ese momento cada pasada pregunta una
            sola cosa: «¿esto se ajusta a lo congelado?». No se pregunta si lo congelado era lo
            mejor. El proceso se llama KAP y está en los protocolos del contenedor de desarrollo del
            autor.
          </p>
          <p>
            Hay un segundo rasgo: quien produce una pasada no la certifica. La certifica otro
            contexto de LLM, <em>limpio</em>, que solo recibe el artefacto, la identidad congelada y
            una lista de invariantes, y al que se le prohíbe proponer o mejorar. Si pudiera sugerir,
            tendría una apuesta en el resultado y razonaría como quien lo escribió. Un LLM ejecuta y
            otro audita; el criterio final es del autor.
          </p>
        </Prose>

        <Text as="h3" size="base">
          El embudo de siete pasadas
        </Text>
        <DescList
          termWidth="12rem"
          items={funnel.map((f) => ({
            key: f.pass,
            term: (
              <Text as="span" size="sm">
                {f.pass}
              </Text>
            ),
            desc: (
              <Text as="span" size="sm">
                {f.produces}. <span className={styles.frozen}>Congelado: {f.frozen}.</span>
              </Text>
            ),
          }))}
        />

        <ol className={styles.claims}>
          {methodClaims.map((claim, j) => (
            <Stack as="li" gap="xs" key={j} id={`metodo-afirmacion-${j + 1}`}>
              <Text size="sm">{claim.text}</Text>
              <EvidenceChip evidence={claim.evidence} />
            </Stack>
          ))}
        </ol>

        <Text as="h3" size="base">
          Protocolos clave
        </Text>
        <DescList
          termWidth="12rem"
          items={protocols.map((pr) => ({
            key: pr.name,
            term: (
              <Text as="span" size="sm">
                {pr.name}
              </Text>
            ),
            desc: (
              <Text as="span" size="sm">
                {pr.what}{' '}
                <a href={`${PAPERS_RECORD}#${pr.anchor}`} className="phy-target">
                  Cita en el registro →
                </a>
              </Text>
            ),
          }))}
        />
      </Stack>

      <Stack as="section" gap="s" aria-labelledby="limites-h">
        <Text as="h2" size="md" id="limites-h">
          Límites declarados
        </Text>
        <LimitsList limits={paperLimits} />
        <Text size="sm">
          <a href={PAPERS_RECORD} className="phy-target">
            El registro de evidencia, con cada comando y cita →
          </a>
        </Text>
      </Stack>
    </>
  );
}

// Made with my soul - Swately <3
