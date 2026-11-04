import { useParams } from '../phyriad-react';
import ProjectShell, {
  ClaimsList,
  LimitsList,
  Pending,
  ProjectFigures,
  ProjectSection,
} from '../components/ProjectShell';
import ProjectCharts from '../components/charts/ProjectCharts';
import ProjectComparison from '../components/ProjectComparison';
import { projects } from '../content';
import NotFound from './NotFound';

/**
 * The generic project page: the blank format filled from the ledger, for every project that does not have
 * a page of its own yet (PhyriadFG has one; see src/pages/projects/). Same sections, in the same order, as
 * _Blank.tsx: mechanism before claims, so a project's own page starts exactly where this one leaves off.
 */
export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return <NotFound />;
  return (
    <ProjectShell project={project}>
      <ProjectSection id="contexto">
        <Pending what="qué problema resuelve el proyecto y por qué existe" />
      </ProjectSection>
      <ProjectSection id="mecanismo">
        <Pending what="cómo funciona el proyecto: su pipeline o arquitectura paso a paso, y qué tiene de interesante su enfoque" />
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
