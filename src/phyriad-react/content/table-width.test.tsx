import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Table from './Table';

const Matrix = (props: Partial<Parameters<typeof Table>[0]>) => (
  <Table caption="Matriz" {...props}>
    <thead>
      <tr>
        <th scope="col">Atributo</th>
        <th scope="col" colSpan={2}>
          Dos opciones
        </th>
        <th scope="col">Otra</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Fila</th>
        <td>a</td>
        <td>b</td>
        <td>c</td>
      </tr>
    </tbody>
  </Table>
);

const region = () => screen.getByRole('region', { name: 'Matriz' });

describe('Table widths (1.2.0)', () => {
  it('is unchanged by default: no width class, no column count', () => {
    render(<Matrix />);
    expect(region().className).not.toMatch(/content|even|sticky/);
    expect(region().style.getPropertyValue('--phy-cols')).toBe('');
  });

  it('width="content" counts the header columns, colSpan included, before paint', () => {
    render(<Matrix width="content" />);
    expect(region().className).toMatch(/content/);
    expect(region().style.getPropertyValue('--phy-cols')).toBe('4');
  });

  it('columns="even" and stickyFirst are opt-in classes on the region, and also count the columns', () => {
    render(<Matrix columns="even" stickyFirst />);
    expect(region().className).toMatch(/even/);
    expect(region().className).toMatch(/sticky/);
    expect(region().style.getPropertyValue('--phy-cols')).toBe('4');
  });

  it('surface (1.3.0) puts the region on a .phy-surface with its tone rows; off by default', () => {
    const { unmount } = render(<Matrix />);
    expect(region().className).not.toMatch(/phy-surface|surfaced/);
    unmount();
    render(<Matrix surface />);
    expect(region().className).toMatch(/\bphy-surface\b/);
    expect(region().className).toMatch(/surfaced/);
  });

  it('keeps the consumer className beside its own classes', () => {
    render(<Matrix width="content" className="mine" />);
    expect(region().className).toMatch(/\bmine\b/);
    expect(region().className).toMatch(/phy-scroll-x/);
  });
});

// Made with my soul - Swately <3
