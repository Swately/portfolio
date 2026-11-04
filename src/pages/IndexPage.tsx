import { Text, VisuallyHidden } from '../phyriad-react';
import ProjectEntry from '../components/ProjectEntry';
import { projects } from '../content';
import styles from './IndexPage.module.css';

/**
 * The page IS the list (design v2). No profile, no skills, no cards: the
 * projects, ordered by relevance to the reader, each with its status, its
 * summary, its lead evidence and the way in. Returns a fragment so the list
 * sits in the shell's content columns at the reading measure.
 */
export default function IndexPage() {
  return (
    <>
      <title>Eduardo Ramos Mendoza — Proyectos</title>
      <section aria-labelledby="proyectos-h">
        <VisuallyHidden>
          <Text as="h2" id="proyectos-h">
            Proyectos
          </Text>
        </VisuallyHidden>
        <ol className={`${styles.list} skin-shelf`}>
          {projects.map((project) => (
            <ProjectEntry project={project} key={project.slug} />
          ))}
        </ol>
      </section>
    </>
  );
}

// Made with my soul - Swately <3
