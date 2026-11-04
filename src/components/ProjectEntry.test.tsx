import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectEntry, { PENDING_YEAR, plateOf } from './ProjectEntry';
import type { Project } from '../content';

const base: Project = {
  slug: 'testium',
  name: 'Testium',
  tag: 'Pruebas',
  status: '9.9.9-experimental',
  statusSource: 'Testium/README.md',
  repoUrl: 'https://github.com/Swately/Testium',
  summary: 'Un proyecto que sólo existe en esta prueba.',
  claims: [
    {
      text: 'Hace algo comprobable.',
      evidence: { kind: 'doc', label: 'README', url: 'https://github.com/Swately/Testium' },
    },
  ],
  limits: ['No existe.'],
};

describe('ProjectEntry', () => {
  it('names the project in an h2 with its verbatim status and the pending year beside it', () => {
    render(
      <ul>
        <ProjectEntry project={base} />
      </ul>,
    );
    const h = screen.getByRole('heading', { level: 2 });
    expect(h).toHaveTextContent('Testium');
    expect(h).toHaveTextContent('9.9.9-experimental');
    expect(h).toHaveTextContent(`(${PENDING_YEAR})`);
  });

  it('links to the dossier twice (name and the way in) and shows the lead evidence', () => {
    render(
      <ul>
        <ProjectEntry project={base} />
      </ul>,
    );
    const links = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.endsWith('/proyecto/testium'));
    expect(links).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'README' })).toBeInTheDocument();
  });
});

describe('ProjectEntry plate (direction B, D-28)', () => {
  const figure = {
    kind: 'figure' as const,
    file: 'img/x.svg',
    alt: 'Un diagrama de prueba',
    caption: 'Pie.',
    width: 742,
    height: 182,
  };
  it('shows the opening figure with its real alt, fitted to the column (no natural-width floor)', () => {
    const p: Project = { ...base, diagrams: [figure] };
    render(
      <ul>
        <ProjectEntry project={p} />
      </ul>,
    );
    const img = screen.getByRole('img', { name: 'Un diagrama de prueba' });
    expect(img).toHaveStyle({ maxInlineSize: '742px' });
    expect(img.style.minInlineSize).toBe('');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
  it('prefers a claim figure over a diagram, and shows nothing without a figure', () => {
    const claimFigure = { ...figure, file: 'img/claim.svg' };
    const p: Project = {
      ...base,
      claims: [...base.claims, { text: 'Se ve.', evidence: claimFigure }],
      diagrams: [figure],
    };
    expect(plateOf(p)?.file).toBe('img/claim.svg');
    const { container } = render(
      <ul>
        <ProjectEntry project={base} />
      </ul>,
    );
    expect(container.querySelector('img')).toBeNull();
  });
});

// Made with my soul - Swately <3
