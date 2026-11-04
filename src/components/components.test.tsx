import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import Chart, { ChartTable } from './charts/Chart';
import type { ChartData } from './charts/chartMath';
import { categories, niceScale, spreadLabels } from './charts/chartMath';
import ComparisonMatrix from './ComparisonMatrix';
import CodeBlock from './CodeBlock';
import Figure from './Figure';
import KeyFigure, { KeyFigures, keyFiguresOf } from './KeyFigure';
import SectionNav from './SectionNav';
import SectionSpine from './SectionSpine';
import { LAB_CHARTS } from '../pages/FiguresLab';
import { projects } from '../content';

beforeAll(() => {
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const clean = async (container: HTMLElement) => {
  const r = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
  return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`);
};

describe('chart arithmetic', () => {
  it('niceScale covers the data with 1, 2 or 5 steps and survives a flat series', () => {
    const s = niceScale(0, 7.2, 5);
    expect(s.lo).toBeLessThanOrEqual(0);
    expect(s.hi).toBeGreaterThanOrEqual(7.2);
    expect(s.ticks.length).toBeGreaterThanOrEqual(3);
    const flat = niceScale(3, 3, 5);
    expect(flat.hi).toBeGreaterThan(flat.lo);
  });
  it('spreadLabels never leaves two labels closer than the gap, and keeps the order', () => {
    const out = spreadLabels([10, 11, 12, 50], 16);
    const sorted = [...out].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++)
      expect(sorted[i]! - sorted[i - 1]!).toBeGreaterThanOrEqual(16);
    expect(out[0]!).toBeLessThan(out[1]!);
    expect(out[1]!).toBeLessThan(out[2]!);
  });
  it('categories keeps first-seen order', () => {
    expect(
      categories([
        {
          name: 'a',
          points: [
            { x: 'u', y: 1 },
            { x: 'v', y: 2 },
          ],
        },
        {
          name: 'b',
          points: [
            { x: 'w', y: 3 },
            { x: 'u', y: 1 },
          ],
        },
      ]),
    ).toEqual(['u', 'v', 'w']);
  });
});

describe('every chart kind (the exhibit data, invented)', () => {
  for (const chart of LAB_CHARTS) {
    it(`${chart.kind}: an SVG image with its name and description, its data as a table, no NaN, axe clean`, async () => {
      const { container } = render(<Chart chart={chart} />);
      const svg = container.querySelector('svg[role="img"]')!;
      expect(svg).not.toBeNull();
      for (const id of svg.getAttribute('aria-labelledby')!.split(' ')) {
        expect(container.querySelector(`#${id}`), id).not.toBeNull();
      }
      // the table repeats every category of the data, directly beneath the chart
      const rows = container.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(categories(chart.series).length);
      // the figure is a figure: caption with the takeaway and the instrument
      expect(container.querySelector('figcaption')?.textContent).toContain(chart.takeaway);
      expect(container.querySelector('figcaption')?.textContent).toContain('Instrumento');
      expect(container.innerHTML).not.toContain('NaN');
      expect(container.innerHTML).not.toContain('undefined');
      expect(await clean(container)).toEqual([]);
    });
  }

  it('a chart with a spread names its runs in the caption and the table carries n', () => {
    const range = LAB_CHARTS.find((c) => c.kind === 'range')!;
    const { container } = render(<Chart chart={range} />);
    expect(container.querySelector('figcaption')?.textContent).toContain('Corridas: r1, r2');
    expect(screen.getByRole('columnheader', { name: 'n' })).toBeInTheDocument();
  });

  it('a stack chart adds the total to its table and a legend of its parts', () => {
    const stack = LAB_CHARTS.find((c) => c.kind === 'stack')!;
    render(<Chart chart={stack} />);
    expect(screen.getByRole('columnheader', { name: /Total/ })).toBeInTheDocument();
    expect(screen.getAllByText('presentación').length).toBeGreaterThan(0);
  });

  it('a table longer than 12 rows sits in a disclosure; a short one stays visible', () => {
    const long: ChartData = {
      ...LAB_CHARTS[0]!,
      id: 'largo',
      series: [
        { name: 's', points: Array.from({ length: 14 }, (_, i) => ({ x: `c${i}`, y: i + 1 })) },
      ],
    };
    const { container, rerender } = render(<ChartTable chart={long} />);
    expect(container.querySelector('details')).not.toBeNull();
    expect(screen.getByText('Tabla de datos (14 filas)')).toBeInTheDocument();
    rerender(<ChartTable chart={LAB_CHARTS[0]!} />);
    expect(container.querySelector('details')).toBeNull();
  });
});

describe('KeyFigure', () => {
  it('renders the value, the instrument and the source, and links the label to the claim', () => {
    const ev = {
      kind: 'number' as const,
      value: '49 pruebas',
      instrument: 'testbench.ps1',
      source: 'README',
      url: 'https://example.invalid/r',
    };
    render(<KeyFigure evidence={ev} label="Tiene pruebas" href="#afirmacion-4" />);
    expect(screen.getByText('49 pruebas')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tiene pruebas' })).toHaveAttribute(
      'href',
      '#afirmacion-4',
    );
    expect(screen.getByRole('link', { name: 'README' })).toHaveAttribute(
      'href',
      'https://example.invalid/r',
    );
  });
  it('keyFiguresOf takes only measured numbers, in ledger order, at most three', () => {
    for (const p of projects) {
      const k = keyFiguresOf(p, 3);
      expect(k.length).toBeLessThanOrEqual(3);
      for (const item of k) expect(p.claims[item.index]!.evidence.kind).toBe('number');
    }
    const withNumbers = projects.find(
      (p) => p.claims.filter((c) => c.evidence.kind === 'number').length >= 2,
    )!;
    const { container } = render(<KeyFigures items={keyFiguresOf(withNumbers, 3)} />);
    expect(container.querySelectorAll('li').length).toBeGreaterThanOrEqual(2);
  });
});

describe('ComparisonMatrix', () => {
  it('writes a missing cell out, types every row and passes axe', async () => {
    const { container } = render(
      <ComparisonMatrix
        caption="Matriz de prueba"
        options={['Propio', 'Otra']}
        rows={[
          { attribute: 'Dónde corre', kind: 'enfoque', cells: ['fuera', 'dentro'] },
          { attribute: 'Latencia', kind: 'medido', cells: ['1 ms', null] },
        ]}
      />,
    );
    expect(screen.getByText('sin dato')).toBeInTheDocument();
    // sized by the substrate Table (D-30): width from its columns, even columns, row labels kept in view
    const region = screen.getByRole('region', { name: 'Matriz de prueba' });
    expect(region.className).toMatch(/content/);
    expect(region.className).toMatch(/even/);
    expect(region.className).toMatch(/sticky/);
    expect(region.style.getPropertyValue('--phy-cols')).toBe('4');
    expect(screen.getByText('Enfoque')).toBeInTheDocument();
    expect(screen.getByText('Medido')).toBeInTheDocument();
    expect(await clean(container)).toEqual([]);
  });
});

describe('SectionNav', () => {
  it('lists its items as anchors to the section headings', () => {
    render(
      <SectionNav
        items={[
          { id: 'contexto', title: 'Contexto' },
          { id: 'datos', title: 'Datos' },
        ]}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'En esta página' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Datos' })).toHaveAttribute('href', '#datos-h');
  });
});

describe('SectionSpine (direction E, D-29)', () => {
  it('is a named navigation of anchors, marks exactly one section as the current location, and passes axe', async () => {
    const { container } = render(
      <>
        <SectionSpine
          items={[
            { id: 'contexto', title: 'Contexto' },
            { id: 'datos', title: 'Datos' },
          ]}
        />
        <h2 id="contexto-h">Contexto</h2>
        <h2 id="datos-h">Datos</h2>
      </>,
    );
    const nav = screen.getByRole('navigation', { name: 'Secciones de la página' });
    const links = nav.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[1]).toHaveAttribute('href', '#datos-h');
    // jsdom lays nothing out: every heading's top is 0, above the line, so the last one is current
    expect(nav.querySelectorAll('[aria-current="location"]')).toHaveLength(1);
    expect(await clean(container)).toEqual([]);
  });
});

describe('Figure (design v3)', () => {
  const figure = {
    kind: 'figure' as const,
    file: 'img/x.svg',
    alt: 'Un diagrama de prueba',
    caption: 'Pie de prueba.',
    width: 742,
    height: 182,
    textEquivalent: ['Primero A.', 'Luego B.'],
  };
  it('keeps the legibility floor at the figure natural width and carries its text equivalent', () => {
    const { container } = render(<Figure figure={figure} id="figura-1" />);
    expect(container.querySelector('figure')).toHaveAttribute('id', 'figura-1');
    expect(container.querySelector('img')).toHaveStyle({ minInlineSize: '742px' });
    expect(screen.getByText('Descripción textual de la figura')).toBeInTheDocument();
    expect(container.querySelectorAll('ol li')).toHaveLength(2);
  });
  it('keeps the natural-width floor for diagrams only: a raster photograph may shrink (D-31)', () => {
    const { container } = render(<Figure figure={{ ...figure, file: 'img/x.png' }} />);
    expect(container.querySelector('img')!.style.minInlineSize).toBe('');
  });
  it('shows a figure without a text equivalent without a disclosure, and marks a plate figure', () => {
    const { container } = render(
      <Figure figure={{ ...figure, textEquivalent: undefined, plate: true }} />,
    );
    expect(container.querySelector('details')).toBeNull();
    expect(container.querySelector('[class*="plate"]')).not.toBeNull();
  });
});

describe('CodeBlock', () => {
  it('is a focusable, named region (a long command line scrolls, and a scroll region needs the keyboard)', () => {
    render(<CodeBlock label="Comandos de prueba">{'cmake --build build --parallel'}</CodeBlock>);
    const region = screen.getByRole('region', { name: 'Comandos de prueba' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region.querySelector('code')?.textContent).toBe('cmake --build build --parallel');
  });
});
