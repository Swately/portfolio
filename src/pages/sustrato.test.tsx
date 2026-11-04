import { describe, it, expect, beforeAll, beforeEach, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import SustratoWebPage from './SustratoWebPage';
import SustratoLabPage from './SustratoLabPage';
import SustratoDemo, { applySettings, readSettings } from './SustratoDemo';
import SubstrateDemoFrame from '../components/SubstrateDemoFrame';
import { substrateClaims, substrateLimits } from '../content/substrate';

beforeAll(() => {
  // jsdom has no ResizeObserver; Figure and the lab observe their boxes.
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  // …nor matchMedia, which the lab's metrics read.
  if (!window.matchMedia)
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      onchange: null,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
});

// An iframe is another document: jsdom cannot load it and axe cannot message it, so the page is analysed WITHOUT
// the box (the demonstration document has its own axe test below, and the real page with its box was measured
// in a browser; see docs/SUSTRATO_WEB_EVIDENCE.md, "Accesibilidad").
const cleanWithoutFrames = async (container: HTMLElement) => {
  const r = await axe.run(
    { include: [container], exclude: [['iframe']] },
    { rules: { 'color-contrast': { enabled: false } } },
  );
  return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`);
};

const clean = async (container: HTMLElement) => {
  const r = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
  return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`);
};

describe('the substrate page (/sustrato-web)', () => {
  it('carries its nine sections in order, every signpost lands on a heading, and passes axe', async () => {
    const { container } = render(
      <main>
        <SustratoWebPage />
      </main>,
    );
    const ids = [
      'resumen',
      'contexto',
      'mecanismo',
      'decisiones',
      'demos',
      'laboratorio',
      'afirmaciones',
      'limites',
      'verificacion',
    ].map((s) => `${s}-h`);
    const found = ids.map((id) => document.getElementById(id));
    for (const [i, el] of found.entries()) expect(el, ids[i]).not.toBeNull();
    // document order = the order the page promises
    for (let i = 1; i < found.length; i++)
      expect(
        found[i - 1]!.compareDocumentPosition(found[i]!) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    const nav = screen.getByRole('navigation', { name: 'En esta página' });
    for (const a of Array.from(nav.querySelectorAll('a')))
      expect(
        document.getElementById(a.getAttribute('href')!.slice(1)),
        a.textContent!,
      ).not.toBeNull();
    expect(await cleanWithoutFrames(container)).toEqual([]);
  });

  it('prints every claim of its ledger as an anchor with its evidence, and links the figure claim to its figure', () => {
    render(
      <main>
        <SustratoWebPage />
      </main>,
    );
    for (let n = 1; n <= substrateClaims.length; n++)
      expect(document.getElementById(`afirmacion-${n}`), `afirmacion-${n}`).not.toBeNull();
    expect(document.getElementById('figura-1')).not.toBeNull();
    expect(screen.getAllByRole('link', { name: /Ver la figura 1/ })).toHaveLength(1);
    expect(screen.getByText('Descripción textual de la figura')).toBeInTheDocument();
  });

  it('declares its limits and the way the claims are checked', () => {
    render(
      <main>
        <SustratoWebPage />
      </main>,
    );
    for (const l of substrateLimits) expect(screen.getByText(l)).toBeInTheDocument();
    expect(screen.getByText(/Cómo se comprueba que esta página no dice más/)).toBeInTheDocument();
  });

  it('offers the laboratory and the demonstration without leaving the page', () => {
    render(
      <main>
        <SustratoWebPage />
      </main>,
    );
    expect(screen.getByRole('link', { name: /Abrir el laboratorio/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/\/sustrato-web\/laboratorio$/),
    );
    expect(screen.getByTitle(/Demostración del sustrato web/)).toBeInTheDocument();
  });
});

describe('the laboratory route', () => {
  it('has its own h1 and a way back, over the substrate lab, and passes axe', async () => {
    const { container } = render(
      <main>
        <SustratoLabPage />
      </main>,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Laboratorio del sustrato' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /El sustrato web/ })).toBeInTheDocument();
    // the laboratory is a lazy chunk: wait for it, then analyse
    expect(await screen.findByText('Laboratorio del estándar')).toBeInTheDocument();
    expect(await clean(container)).toEqual([]);
  });
});

describe('the demonstration settings', () => {
  const root = () => {
    const el = document.createElement('html');
    return el as unknown as HTMLElement;
  };

  it('parse with defaults, ignore unknown values and clamp the size to 0.875 - 1.5', () => {
    expect(readSettings({})).toEqual({
      palette: 'showcase',
      type: 'editorial',
      scale: 1,
      scheme: undefined,
    });
    expect(readSettings({ palette: 'launcher', type: 'comic', scale: 'x' })).toMatchObject({
      palette: 'showcase',
      type: 'editorial',
      scale: 1,
    });
    expect(readSettings({ scale: '9' }).scale).toBe(1.5);
    expect(readSettings({ scale: '0.1' }).scale).toBe(0.875);
    expect(readSettings({ scheme: 'dark' }).scheme).toBe('dark');
    expect(readSettings({ scheme: 'sepia' }).scheme).toBeUndefined();
  });

  it('write the attributes on the given root only, remove them for the defaults, and never touch storage', () => {
    localStorage.clear();
    const r = root();
    applySettings({ palette: 'maid', type: 'technical', scale: 1.25, scheme: 'dark' }, r);
    expect(r.dataset.palette).toBe('maid');
    expect(r.dataset.type).toBe('technical');
    expect(r.dataset.theme).toBe('dark');
    expect(r.style.getPropertyValue('--phy-type-scale')).toBe('1.25');
    applySettings({ palette: 'showcase', type: 'editorial', scale: 1 }, r);
    expect(r.dataset.palette).toBeUndefined();
    expect(r.dataset.type).toBeUndefined();
    expect(r.dataset.theme).toBeUndefined();
    expect(r.style.getPropertyValue('--phy-type-scale')).toBe('');
    // the page that offers the demonstration is untouched, and so is the visitor's storage
    expect(document.documentElement.dataset.palette).toBeUndefined();
    expect(localStorage.length).toBe(0);
  });
});

describe('the demonstration document', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.palette;
    delete document.documentElement.dataset.type;
    document.documentElement.style.removeProperty('--phy-type-scale');
    localStorage.clear();
  });
  afterEach(() => {
    delete document.documentElement.dataset.palette;
    delete document.documentElement.dataset.type;
    document.documentElement.style.removeProperty('--phy-type-scale');
  });

  it('shows real components, names its landmark, and passes axe', async () => {
    const { container } = render(
      <main>
        <SustratoDemo />
      </main>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Demostración' })).toBeInTheDocument();
    // two unnamed `main` landmarks collide when the page is analysed together with its box (axe: landmark-unique)
    expect(screen.getByRole('main', { name: 'Demostración del sustrato' })).toBeInTheDocument();
    expect(
      screen.getByRole('table', { name: /Tabla con width, columns y surface/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Un campo de texto' })).toBeInTheDocument();
    // all nine steps of the scale are on show
    for (const s of ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'])
      expect(screen.getByText(`${s} · Aa 0123`)).toBeInTheDocument();
    expect(await clean(container)).toEqual([]);
  });

  it('applies a message from the same origin and ignores one from another origin', async () => {
    render(
      <main>
        <SustratoDemo />
      </main>,
    );
    const send = (origin: string, settings: object) =>
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', { origin, data: { type: 'phy-demo-settings', settings } }),
        );
      });
    send('https://evil.example', { palette: 'maid' });
    expect(document.documentElement.dataset.palette).toBeUndefined();
    send(window.location.origin, { palette: 'maid', type: 'neutral', scale: 1.5 });
    await waitFor(() => expect(document.documentElement.dataset.palette).toBe('maid'));
    expect(document.documentElement.dataset.type).toBe('neutral');
    expect(document.documentElement.style.getPropertyValue('--phy-type-scale')).toBe('1.5');
    expect(localStorage.length).toBe(0);
  });
});

describe('the demonstration controls', () => {
  it('offer three palettes, three type themes and a bounded size, and send each change to the box', () => {
    render(<SubstrateDemoFrame />);
    const frame = screen.getByTitle(/Demostración del sustrato web/) as HTMLIFrameElement;
    const post = vi.fn();
    Object.defineProperty(frame, 'contentWindow', {
      value: { postMessage: post },
      configurable: true,
    });
    const palette = screen.getByLabelText('Paleta') as HTMLSelectElement;
    const type = screen.getByLabelText('Tema tipográfico') as HTMLSelectElement;
    const size = screen.getByLabelText('Tamaño del texto') as HTMLInputElement;
    expect(Array.from(palette.options).map((o) => o.value)).toEqual(['showcase', 'oxide', 'maid']);
    expect(Array.from(type.options).map((o) => o.value)).toEqual([
      'editorial',
      'neutral',
      'technical',
    ]);
    expect([size.min, size.max]).toEqual(['0.875', '1.5']);
    fireEvent.change(palette, { target: { value: 'maid' } });
    fireEvent.change(type, { target: { value: 'technical' } });
    fireEvent.change(size, { target: { value: '1.25' } });
    const last = post.mock.calls.at(-1)!;
    expect(last[0]).toMatchObject({
      type: 'phy-demo-settings',
      settings: { palette: 'maid', type: 'technical', scale: 1.25 },
    });
    expect(last[1]).toBe(window.location.origin);
    expect(screen.getByText('125 %')).toBeInTheDocument();
  });
});

// Made with my soul - Swately <3
