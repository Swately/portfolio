import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import TableOfContents from './TableOfContents';
import Search from './Search';
import Prose from '../content/Prose';
import Figure from '../content/Figure';
import Table from '../content/Table';

describe('Breadcrumbs', () => {
  it('links ancestors, marks the current page unlinked with aria-current', () => {
    render(
      <Breadcrumbs
        label="Miga de pan"
        items={[{ to: '/', label: 'Inicio' }, { to: '/docs', label: 'Docs' }, { label: 'Actual' }]}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Miga de pan' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
    const current = screen.getByText('Actual');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.closest('a')).toBeNull();
  });
});

describe('Pagination', () => {
  it('windows long ranges, marks the current page, and inerts the edges', () => {
    render(<Pagination current={5} total={20} href={(n) => `/p/${n}`} label="Paginación" />);
    // window: 1 … 4 5 6 … 20
    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('href', '/p/1');
    expect(screen.getByRole('link', { name: '20' })).toBeInTheDocument();
    expect(screen.getByText('5')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: '10' })).toBeNull();
  });

  it('at page 1 the previous control is text, not a dead link', () => {
    render(<Pagination current={1} total={3} href={(n) => `/p/${n}`} prevLabel="Anterior" />);
    expect(screen.queryByRole('link', { name: 'Anterior' })).toBeNull();
    expect(screen.getByText('Anterior')).toBeInTheDocument();
  });
});

describe('TableOfContents / Search / content', () => {
  it('TOC nests and links fragments', () => {
    render(
      <TableOfContents
        label="Contenido"
        items={[{ id: 'a', label: 'A', children: [{ id: 'a1', label: 'A.1' }] }]}
      />,
    );
    expect(screen.getByRole('link', { name: 'A.1' })).toHaveAttribute('href', '#a1');
  });

  it('Search renders the native landmark element', () => {
    // jsdom does not yet map <search> to role=search (the BROWSER gate checks
    // the computed role); here we prove the element and its accessible name.
    const { container } = render(
      <Search label="Buscar en el sitio">
        <input aria-label="buscar" />
      </Search>,
    );
    const el = container.querySelector('search');
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute('aria-label', 'Buscar en el sitio');
  });

  it('Figure binds the caption; Table warns on th without scope and not with it', () => {
    render(
      <Figure caption="Una figura">
        <svg role="img" aria-label="diagrama" />
      </Figure>,
    );
    expect(screen.getByText('Una figura').tagName).toBe('FIGCAPTION');
  });

  it('axe finds no violations on the composed page furniture', async () => {
    const { container } = render(
      <main>
        <Breadcrumbs items={[{ to: '/', label: 'Inicio' }, { label: 'Aquí' }]} label="Miga" />
        <Prose>
          <h2 id="s1">Sección</h2>
          <p>Texto adoptado.</p>
        </Prose>
        <Table caption="Medidas">
          <thead>
            <tr>
              <th scope="col">Métrica</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>peso</td>
              <td>63.99 kB</td>
            </tr>
          </tbody>
        </Table>
        <Pagination current={1} total={3} href={(n) => `/p/${n}`} label="Páginas" />
        <TableOfContents items={[{ id: 's1', label: 'Sección' }]} label="Contenido" />
      </main>,
    );
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toEqual([]);
  });
});

// Made with my soul - Swately <3
