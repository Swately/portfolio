import ProjectShell, {
  ClaimsList,
  LimitsList,
  Pending,
  ProjectFigures,
  ProjectSection,
} from '../../components/ProjectShell';
import ProjectCharts from '../../components/charts/ProjectCharts';
import ProjectComparison from '../../components/ProjectComparison';
import { projects } from '../../content';

/**
 * THE BLANK PAGE. To write a project's own page:
 *   1. copy this file to  src/pages/projects/<Name>Page.tsx  and rename the component;
 *   2. set SLUG to the project's slug in src/content.ts (the header, "En breve", the claims and the
 *      limits come from there — that is what keeps every claim inside the evidence gate);
 *   3. route it in src/app.tsx BEFORE the generic '/proyecto/:slug' route;
 *   4. write the sections in this order (mechanism before claims): keep the ids (they are the anchors
 *      and the signposts), replace each <Pending> with real paragraphs, a chart (`<Chart chart=… />`,
 *      data validated by figure-contract/validate-chart.mjs) or an approach matrix (`<ComparisonMatrix>`).
 * This file itself is not routed; it is the format, kept blank on purpose.
 */
const SLUG = 'cambiar-por-el-slug';

export default function BlankProjectPage() {
  const project = projects.find((p) => p.slug === SLUG);
  if (!project) return null;
  return (
    <ProjectShell project={project}>
      <ProjectSection id="contexto">
        <Pending what="qué problema resuelve el proyecto y por qué existe" />
      </ProjectSection>

      <ProjectSection id="mecanismo">
        <Pending what="cómo funciona: el pipeline o la arquitectura paso a paso, y qué tiene de interesante el enfoque" />
        <ProjectFigures project={project} />
      </ProjectSection>

      <ProjectSection id="diseno">
        <Pending what="las decisiones técnicas que dan forma al proyecto y las alternativas descartadas, con lo que costó cada una" />
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
        <Pending what="los pasos para construirlo y ejecutarlo, y qué máquina hace falta" />
      </ProjectSection>
    </ProjectShell>
  );
}

// Made with my soul - Swately <3
