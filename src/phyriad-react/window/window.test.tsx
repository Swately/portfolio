import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WindowFrame from './WindowFrame';
import ScrollRegion from '../layout/ScrollRegion';
import Panel from '../layout/Panel';
import Toolbar from '../interaction/Toolbar';
import AppShell from '../shell/AppShell';

describe('window frame (0.19.0)', () => {
  it('names every scrollable region and makes it focusable', () => {
    // Inside main, as it is mounted in practice: there a header is not a banner.
    render(
      <main>
        <WindowFrame
          contentLabel="Contenido"
          startLabel="Menú"
          endLabel="Detalles"
          start="s"
          end="e"
          top="t"
          bottom="b"
        >
          c
        </WindowFrame>
      </main>,
    );
    for (const name of ['Contenido', 'Menú', 'Detalles']) {
      const region = screen.getByRole(name === 'Contenido' ? 'region' : 'complementary', { name });
      expect(region).toHaveAttribute('tabindex', '0');
    }
    // Inside main a header/footer is NOT a banner/contentinfo landmark (HTML-AAM);
    // the role query library still reports "banner" here, so the landmark claim
    // is verified against the browser's accessibility tree (gate), and this
    // test asserts the structure: one header and one footer, both inside main.
    expect(document.querySelectorAll('main header')).toHaveLength(1);
    expect(document.querySelectorAll('main footer')).toHaveLength(1);
  });

  it('omits the panels that are not given', () => {
    render(<WindowFrame contentLabel="Contenido">c</WindowFrame>);
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('a window route renders no site chrome, only the skip link and main', () => {
    const Page = () => <p>ventana</p>;
    render(
      <AppShell
        routes={[{ path: '/', page: Page, window: true }]}
        notFound={() => null}
        header={<header>site header</header>}
        footer={<footer>site footer</footer>}
        sidebarStart="side"
      />,
    );
    expect(screen.getByRole('main')).toHaveTextContent('ventana');
    expect(screen.queryByText('site header')).toBeNull();
    expect(screen.queryByText('site footer')).toBeNull();
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(screen.getByText(/skip/i)).toBeInTheDocument();
  });
});

describe('ScrollRegion / Panel / Toolbar', () => {
  it('ScrollRegion is a named, focusable region with the base class', () => {
    render(
      <ScrollRegion label="Registro" maxBlockSize="10rem">
        x
      </ScrollRegion>,
    );
    const r = screen.getByRole('region', { name: 'Registro' });
    expect(r).toHaveAttribute('tabindex', '0');
    expect(r.className).toContain('phy-scroll-y');
    expect(r.style.getPropertyValue('--phy-scroll-max')).toBe('10rem');
  });

  it('Panel is a section named by its title, with actions and footer slots', () => {
    render(
      <Panel title={<h3>Tabla</h3>} actions={<button>acción</button>} footer="pie">
        cuerpo
      </Panel>,
    );
    const s = screen.getByRole('region', { name: 'Tabla' });
    expect(s.tagName).toBe('SECTION');
    expect(screen.getByRole('button', { name: 'acción' })).toBeInTheDocument();
    expect(screen.getByText('pie')).toBeInTheDocument();
  });

  it('Toolbar moves focus with the arrow keys and Home/End', () => {
    render(
      <Toolbar label="Acciones">
        <button>uno</button>
        <button>dos</button>
        <button disabled>tres</button>
        <button>cuatro</button>
      </Toolbar>,
    );
    const bar = screen.getByRole('toolbar', { name: 'Acciones' });
    const uno = screen.getByRole('button', { name: 'uno' });
    uno.focus();
    fireEvent.keyDown(bar, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'dos' }));
    fireEvent.keyDown(bar, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'cuatro' }));
    fireEvent.keyDown(bar, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(uno);
    fireEvent.keyDown(bar, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'cuatro' }));
    fireEvent.keyDown(bar, { key: 'Home' });
    expect(document.activeElement).toBe(uno);
  });
});

// Made with my soul - Swately <3
