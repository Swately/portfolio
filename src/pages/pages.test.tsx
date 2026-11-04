import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import IndexPage from './IndexPage';
import EvidencePage from './EvidencePage';
import ProjectPage from './ProjectPage';
import PhyriadFGPage from './projects/PhyriadFGPage';
import PhyriagerPage from './projects/PhyriagerPage';
import PhynnedPage from './projects/PhynnedPage';
import NotFound from './NotFound';
import { Router } from '../phyriad-react';
import { projects } from '../content';
import { SECTIONS } from '../components/ProjectShell';

// the ten sections of design v3, as heading ids: "En breve" first, "Verificación" last
const SECTION_IDS = Object.keys(SECTIONS).map((id) => `${id}-h`);

beforeAll(() => {
  // jsdom has no ResizeObserver; the site's Figure observes its viewport for the scroll region.
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.history.replaceState(null, '', '/proyecto/' + projects[0]!.slug);
});

const clean = async (container: HTMLElement) => {
  const r = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
  return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`);
};

describe('the index (design v2: the page is the list)', () => {
  it('has one entry per project, no profile, no skills, no cards, and passes axe', async () => {
    const { container } = render(
      <main>
        <IndexPage />
      </main>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(projects.length);
    // the visually hidden "Proyectos" h2 plus one h2 per entry
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(projects.length + 1);
    expect(screen.queryByText(/Herramientas/)).toBeNull();
    // a project shows its own years once the ledger has them; the rest stay visibly pending
    const withoutYears = projects.filter((p) => !p.years).length;
    expect(screen.getAllByText(/año pendiente/)).toHaveLength(withoutYears);
    for (const p of projects.filter((q) => q.years))
      expect(screen.getByText(`(${p.years})`)).toBeInTheDocument();
    expect(await clean(container)).toEqual([]);
  });
});

describe('the dossier (the extensive page, one template)', () => {
  it('numbers its claims as anchors, carries every section, marks the provisional ones', async () => {
    // Through the Router: the dossier reads its slug from the matched route.
    const { container } = render(
      <main>
        <Router routes={[{ path: '/proyecto/:slug', page: ProjectPage }]} fallback={NotFound} />
      </main>,
    );
    const p = projects[0]!;
    for (let n = 1; n <= p.claims.length; n++)
      expect(document.getElementById(`afirmacion-${n}`)).not.toBeNull();
    for (const id of SECTION_IDS) expect(document.getElementById(id)).not.toBeNull();
    // PhyriadFG now has charts and a comparison, so those two sections are no longer provisional
    expect(screen.getAllByText(/Pendiente/)).toHaveLength(5);
    expect(screen.getByRole('link', { name: '← Índice' })).toBeInTheDocument();
    expect(await clean(container)).toEqual([]);
  });
});

describe("PhyriadFG's own page", () => {
  it('is routed before the generic page and is written on the same shell', async () => {
    window.history.replaceState(null, '', '/proyecto/phyriadfg');
    const { container } = render(
      <main>
        <Router
          routes={[
            { path: '/proyecto/phyriadfg', page: PhyriadFGPage },
            { path: '/proyecto/:slug', page: ProjectPage },
          ]}
          fallback={NotFound}
        />
      </main>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('PhyriadFG');
    for (const id of SECTION_IDS) expect(document.getElementById(id)).not.toBeNull();
    const p = projects.find((x) => x.slug === 'phyriadfg')!;
    for (let n = 1; n <= p.claims.length; n++)
      expect(document.getElementById(`afirmacion-${n}`)).not.toBeNull();
    // each figure of the ledger is drawn exactly once (hero in "En breve", the rest in "Cómo funciona")
    const claimFigures = p.claims.filter((c) => c.evidence.kind === 'figure');
    const figures = [...claimFigures, ...(p.diagrams ?? [])];
    expect(container.querySelectorAll('figure[id^="figura-"]')).toHaveLength(figures.length);
    figures.forEach((_, i) => expect(document.getElementById(`figura-${i + 1}`)).not.toBeNull());
    // the claims link to their figure instead of repeating it
    expect(screen.getAllByRole('link', { name: /Ver la figura/ })).toHaveLength(
      claimFigures.length,
    );
    // the text equivalent is there for each diagram (it carries the diagram's text for a screen reader)
    expect(screen.getAllByText('Descripción textual de la figura')).toHaveLength(figures.length);
    // every signpost in "En breve" lands on a heading that exists
    const nav = screen.getByRole('navigation', { name: 'En esta página' });
    for (const a of Array.from(nav.querySelectorAll('a'))) {
      const target = a.getAttribute('href')!.slice(1);
      expect(document.getElementById(target), target).not.toBeNull();
    }
    expect(nav.querySelectorAll('a')).toHaveLength(SECTION_IDS.length - 1);
    // the spine (direction E) carries the same sections plus "En breve", every anchor landing on a heading
    const spine = screen.getByRole('navigation', { name: 'Secciones de la página' });
    for (const a of Array.from(spine.querySelectorAll('a'))) {
      const target = a.getAttribute('href')!.slice(1);
      expect(document.getElementById(target), target).not.toBeNull();
    }
    expect(spine.querySelectorAll('a')).toHaveLength(SECTION_IDS.length);
    expect(await clean(container)).toEqual([]);
  });
});

describe('the three delivered dossiers (design v3 content)', () => {
  const render3 = (slug: string) => {
    window.history.replaceState(null, '', '/proyecto/' + slug);
    return render(
      <main>
        <Router
          routes={[
            { path: '/proyecto/phyriadfg', page: PhyriadFGPage },
            { path: '/proyecto/phyriager', page: PhyriagerPage },
            { path: '/proyecto/phynned', page: PhynnedPage },
            { path: '/proyecto/:slug', page: ProjectPage },
          ]}
          fallback={NotFound}
        />
      </main>,
    );
  };

  it('Phynned: the approach matrix, its sources and quotes, two diagrams in English, two charts; axe clean', async () => {
    const { container } = render3('phynned');
    // the charts and the matrix are loaded on demand: wait for them
    await waitFor(() =>
      expect(container.querySelectorAll('figure[id^="grafica-"]').length).toBe(2),
    );
    await screen.findByRole('columnheader', { name: 'Process Lasso (Bitsum)' });
    // five options as columns, rows typed "Enfoque", the cells in the project's own language
    expect(
      screen.getByRole('columnheader', { name: 'Process Lasso (Bitsum)' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Phynned' })).toBeInTheDocument();
    expect(container.querySelectorAll('td[lang="en"]').length).toBeGreaterThan(10);
    expect(screen.getAllByText('Enfoque').length).toBeGreaterThanOrEqual(5);
    expect(screen.getByText('Citas de las fuentes')).toBeInTheDocument();
    // two diagrams, each with its text equivalent marked as English, and the two charts with their tables
    expect(container.querySelectorAll('figure[id^="figura-"]').length).toBe(2);
    expect(container.querySelectorAll('ol[lang="en"]').length).toBe(2);
    expect(container.querySelectorAll('figure[id^="grafica-"]').length).toBe(2);
    expect(await clean(container)).toEqual([]);
  });

  it('Phyriager: two diagrams and two charts (a slope and a line), each chart with its table', async () => {
    const { container } = render3('phyriager');
    await waitFor(() =>
      expect(container.querySelectorAll('figure[id^="grafica-"] table').length).toBe(2),
    );
    const claimFigures = projects
      .find((p) => p.slug === 'phyriager')!
      .claims.filter((c) => c.evidence.kind === 'figure').length;
    expect(container.querySelectorAll('figure[id^="figura-"]').length).toBe(claimFigures + 2);
    expect(container.querySelectorAll('figure[id^="grafica-"] table').length).toBe(2);
  });

  it('every diagram has a text equivalent, a non-empty alt and a caption', () => {
    for (const p of projects)
      for (const d of p.diagrams ?? []) {
        expect(d.textEquivalent?.length ?? 0, d.file).toBeGreaterThan(2);
        expect(d.alt.length, d.file).toBeGreaterThan(40);
        expect(d.caption.length, d.file).toBeGreaterThan(40);
      }
  });
});

describe('the prose integrated from the three dossiers (2026-10-14)', () => {
  const render4 = (slug: string) => {
    window.history.replaceState(null, '', '/proyecto/' + slug);
    return render(
      <main>
        <Router
          routes={[
            { path: '/proyecto/phyriadfg', page: PhyriadFGPage },
            { path: '/proyecto/phyriager', page: PhyriagerPage },
            { path: '/proyecto/phynned', page: PhynnedPage },
          ]}
          fallback={NotFound}
        />
      </main>,
    );
  };

  it('PhyriadFG: context, mechanism, five decisions, its comparison, reproduction; no provisional section left but charts loaded', async () => {
    const { container } = render4('phyriadfg');
    await screen.findByRole('columnheader', { name: 'NVIDIA DLSS-G' });
    expect(container.querySelectorAll('article').length).toBe(5);
    expect(screen.queryAllByText(/Pendiente:/)).toHaveLength(1); // only the key figures: no number evidence yet
    expect(screen.getByText(/Duración honesta: menos de un año/)).toBeInTheDocument();
    // the private comparison with Lossless Scaling is NOT on the page
    expect(container.textContent).not.toMatch(/\b\d+(?:[.,]\d+)? ?W\b/); // no watts: the power comparison is private
    expect(await clean(container)).toEqual([]);
  });

  it('Phyriager: five decisions, its comparison, the corrected limit, and the status stays verbatim', async () => {
    const { container } = render4('phyriager');
    await screen.findByRole('columnheader', { name: 'Voyager (Wang et al.)' });
    expect(container.querySelectorAll('article').length).toBe(5);
    expect(container.textContent).toContain('a record of runs, not a release');
    expect(container.textContent).not.toContain('no ha sido validado en vivo');
    expect(container.textContent).toContain('0.1.0-experimental');
    expect(await clean(container)).toEqual([]);
  });

  it("Phynned: the project's English is marked lang=en, the Spanish labels are not, and 49 pruebas is gone", async () => {
    const { container } = render4('phynned');
    await screen.findByRole('columnheader', { name: 'Process Lasso (Bitsum)' });
    expect(container.querySelectorAll('article').length).toBe(5);
    expect(container.querySelectorAll('article h3[lang="en"]').length).toBe(5);
    expect(container.querySelectorAll('[lang="en"] strong').length).toBeGreaterThan(5);
    // the labels of a decision stay Spanish and outside the English spans
    expect(screen.getAllByText('Decisión.').length).toBe(5);
    expect(container.textContent).toContain('0.2.2-experimental');
    expect(container.textContent).not.toContain('49 pruebas');
    expect(
      screen.getAllByText(/traducción al español está pendiente/).length,
    ).toBeGreaterThanOrEqual(3);
    expect(await clean(container)).toEqual([]);
  });

  it('every status in the ledger was re-verified on the day the three were corrected', () => {
    for (const slug of ['phyriadfg', 'phyriager', 'phynned']) {
      const p = projects.find((x) => x.slug === slug)!;
      expect(p.statusChecked, slug).toBe('14 de octubre de 2026');
      expect(p.years, slug).toBeTruthy();
    }
  });
});

describe('the ledger', () => {
  it('filters the assertions and reports the count in a status region; carries the skills', () => {
    render(
      <main>
        <EvidencePage />
      </main>,
    );
    expect(document.getElementById('herramientas-h')).not.toBeNull();
    const all = projects.reduce((n, p) => n + p.claims.length, 0);
    const input = screen.getByRole('textbox', { name: 'Filtrar por texto o proyecto' });
    expect(screen.getByRole('status')).toHaveTextContent('');
    fireEvent.change(input, { target: { value: projects[0]!.name } });
    const status = screen.getByRole('status').textContent ?? '';
    const shown = Number(status.split(' ')[0]);
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(all);
    expect(status).toContain(`de ${all} afirmaciones`);
    fireEvent.change(input, { target: { value: 'zzzz-sin-coincidencia' } });
    expect(screen.getByRole('status')).toHaveTextContent(`0 de ${all}`);
  });
});

// Made with my soul - Swately <3
