import { describe, it, expect } from 'vitest';
import { createRef, type ReactElement, type Ref } from 'react';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import * as S from './index';

/**
 * WINDOW_ROSTER C5, made mechanical (S10.0): every exported component takes
 * `className`, `style`, arbitrary rest props and a `ref`, and puts them on its
 * ROOT — or on the one documented element when the root is a host. A component
 * that lands here as an exception says why beside its entry; a component that
 * is not here at all is a gap.
 *
 * The probe: className "probe", style outline-color rgb(1, 2, 3), data-probe="1",
 * and a ref that must resolve to the same element that received the rest prop.
 */
type Probe = {
  className: string;
  style: { outlineColor: string };
  'data-probe': string;
  /** `never` is assignable to every element ref type; the assertion reads it as an element. */
  ref: Ref<never>;
};
type Entry = {
  name: string;
  render: (p: Probe) => ReactElement;
  /** Where className / style / data-probe / ref must land. Default: the first element rendered. */
  root?: (container: HTMLElement) => HTMLElement | null;
  /** Where className lands when it differs from the root (the wrapper that takes space). */
  classRoot?: (container: HTMLElement) => HTMLElement | null;
  /** Where style lands when it differs from classRoot / root (documented exceptions). */
  styleRoot?: (container: HTMLElement) => HTMLElement | null;
  /** Skip the ref assertion with a reason (a function component that forwards no ref). */
  noRef?: string;
};

// jsdom lacks these platform APIs; the components take their fallback paths.
window.matchMedia ??= (() => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
})) as unknown as typeof window.matchMedia;
HTMLDialogElement.prototype.showModal ??= function () {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close ??= function () {
  this.removeAttribute('open');
};

const items = [{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B' }] }];

const REGISTRY: Entry[] = [
  { name: 'Box', render: (p) => <S.Box {...p}>x</S.Box> },
  { name: 'Container', render: (p) => <S.Container {...p}>x</S.Container> },
  { name: 'Stack', render: (p) => <S.Stack {...p}>x</S.Stack> },
  { name: 'Cluster', render: (p) => <S.Cluster {...p}>x</S.Cluster> },
  { name: 'Grid', render: (p) => <S.Grid {...p}>x</S.Grid> },
  {
    name: 'DescList',
    render: (p) => <S.DescList {...p} items={[{ key: 'k', term: 't', desc: 'd' }]} />,
  },
  { name: 'VisuallyHidden', render: (p) => <S.VisuallyHidden {...p}>x</S.VisuallyHidden> },
  { name: 'Status', render: (p) => <S.Status {...p} /> },
  { name: 'Button', render: (p) => <S.Button {...p}>x</S.Button> },
  {
    name: 'Field',
    render: (p) => (
      <S.Field {...p} label="L">
        <S.Input />
      </S.Field>
    ),
  },
  { name: 'Input', render: (p) => <S.Input {...p} aria-label="i" /> },
  { name: 'TextArea', render: (p) => <S.TextArea {...p} aria-label="t" /> },
  {
    name: 'Select',
    render: (p) => (
      <S.Select {...p} aria-label="s">
        <option>o</option>
      </S.Select>
    ),
    root: (c) => c.querySelector('select'),
  },
  {
    name: 'Checkbox',
    // The wrapper label takes className + style (it is what takes space); rest + ref reach the input.
    render: (p) => <S.Checkbox {...p} label="c" />,
    root: (c) => c.querySelector('input'),
    classRoot: (c) => c.firstElementChild as HTMLElement,
  },
  {
    name: 'Radio',
    render: (p) => <S.Radio {...p} label="r" name="n" />,
    root: (c) => c.querySelector('input'),
    classRoot: (c) => c.firstElementChild as HTMLElement,
  },
  {
    name: 'Fieldset',
    render: (p) => (
      <S.Fieldset {...p} legend="L">
        x
      </S.Fieldset>
    ),
  },
  {
    name: 'ErrorSummary',
    render: (p) => <S.ErrorSummary {...p} title="T" errors={[{ controlId: 'x', message: 'm' }]} />,
  },
  { name: 'Skeleton', render: (p) => <S.Skeleton {...p} /> },
  { name: 'SkeletonText', render: (p) => <S.SkeletonText {...p} /> },
  {
    name: 'Skeletonize',
    render: (p) => (
      <S.Skeletonize {...p} loading placeholder="p">
        c
      </S.Skeletonize>
    ),
  },
  { name: 'Empty', render: (p) => <S.Empty {...p} title="T" /> },
  {
    name: 'Prose',
    render: (p) => (
      <S.Prose {...p}>
        <p>x</p>
      </S.Prose>
    ),
  },
  {
    name: 'Figure',
    render: (p) => (
      <S.Figure {...p} caption="c">
        <svg role="img" aria-label="i" />
      </S.Figure>
    ),
  },
  {
    name: 'Table',
    render: (p) => (
      <S.Table {...p} caption="c">
        <tbody>
          <tr>
            <td>x</td>
          </tr>
        </tbody>
      </S.Table>
    ),
    // The scroll region takes className + style; rest + ref reach the table element.
    root: (c) => c.querySelector('table'),
    classRoot: (c) => c.firstElementChild as HTMLElement,
  },
  { name: 'Breadcrumbs', render: (p) => <S.Breadcrumbs {...p} items={[{ label: 'a' }]} /> },
  {
    name: 'Pagination',
    render: (p) => <S.Pagination {...p} current={1} total={3} href={(n) => `#${n}`} />,
  },
  {
    name: 'TableOfContents',
    render: (p) => <S.TableOfContents {...p} items={[{ id: 'x', label: 'x' }]} />,
  },
  {
    name: 'Search',
    render: (p) => (
      <S.Search {...p}>
        <S.Input aria-label="q" />
      </S.Search>
    ),
  },
  {
    name: 'Disclosure',
    render: (p) => (
      <S.Disclosure {...p} summary="s">
        x
      </S.Disclosure>
    ),
  },
  {
    name: 'Dialog',
    render: (p) => (
      <S.Dialog {...p} open={false} onClose={() => {}} title="t">
        x
      </S.Dialog>
    ),
  },
  { name: 'Text', render: (p) => <S.Text {...p}>x</S.Text> },
  {
    name: 'Link',
    render: (p) => (
      <S.Link {...p} to="/x">
        l
      </S.Link>
    ),
  },
  { name: 'ThemeToggle', render: (p) => <S.ThemeToggle {...p} /> },
  { name: 'Splitter', render: (p) => <S.Splitter {...p} label="w" /> },
  { name: 'TreeView', render: (p) => <S.TreeView {...p} label="t" items={items} /> },
  {
    name: 'MenuButton',
    // The host span is layout glue; the BUTTON is the documented root for props.
    render: (p) => (
      <S.MenuButton {...p} label="m">
        <S.MenuItem>i</S.MenuItem>
      </S.MenuButton>
    ),
    root: (c) => c.querySelector('button'),
  },
  {
    name: 'MenuItem',
    render: (p) => (
      <S.MenuButton label="m">
        <S.MenuItem {...p}>i</S.MenuItem>
      </S.MenuButton>
    ),
    root: (c) => c.querySelector('[role="menuitem"]'),
  },
  {
    name: 'Tabs',
    render: (p) => (
      <S.Tabs {...p} label="t" defaultValue="a">
        <S.TabList>
          <S.Tab value="a">a</S.Tab>
        </S.TabList>
        <S.TabPanel value="a">p</S.TabPanel>
      </S.Tabs>
    ),
  },
  {
    name: 'TabList',
    render: (p) => (
      <S.Tabs label="t" defaultValue="a">
        <S.TabList {...p}>
          <S.Tab value="a">a</S.Tab>
        </S.TabList>
        <S.TabPanel value="a">p</S.TabPanel>
      </S.Tabs>
    ),
    root: (c) => c.querySelector('[role="tablist"]'),
  },
  {
    name: 'Tab',
    render: (p) => (
      <S.Tabs label="t" defaultValue="a">
        <S.TabList>
          <S.Tab {...p} value="a">
            a
          </S.Tab>
        </S.TabList>
        <S.TabPanel value="a">p</S.TabPanel>
      </S.Tabs>
    ),
    root: (c) => c.querySelector('[role="tab"]'),
  },
  {
    name: 'TabPanel',
    render: (p) => (
      <S.Tabs label="t" defaultValue="a">
        <S.TabList>
          <S.Tab value="a">a</S.Tab>
        </S.TabList>
        <S.TabPanel {...p} value="a">
          p
        </S.TabPanel>
      </S.Tabs>
    ),
    root: (c) => c.querySelector('[role="tabpanel"]'),
  },
  { name: 'Toaster', render: (p) => <S.Toaster {...p} /> },
  {
    name: 'Progress',
    // className and style dress the wrapper (the thing that takes space); rest and ref reach the native element.
    render: (p) => <S.Progress {...p} label="l" value={1} max={2} />,
    root: (c) => c.querySelector('progress'),
    classRoot: (c) => c.firstElementChild as HTMLElement,
  },
  {
    name: 'WindowFrame',
    // className and rest on the query wrapper; style on the grid (it carries the width variables).
    render: (p) => (
      <S.WindowFrame {...p} contentLabel="c">
        x
      </S.WindowFrame>
    ),
    styleRoot: (c) => c.firstElementChild!.firstElementChild as HTMLElement,
  },
  {
    name: 'ScrollRegion',
    render: (p) => (
      <S.ScrollRegion {...p} label="s">
        x
      </S.ScrollRegion>
    ),
  },
  {
    name: 'Panel',
    render: (p) => (
      <S.Panel {...p} title={<h3>t</h3>}>
        x
      </S.Panel>
    ),
  },
  {
    name: 'Toolbar',
    render: (p) => (
      <S.Toolbar {...p} label="t">
        <S.Button>b</S.Button>
      </S.Toolbar>
    ),
  },
  { name: 'SiteHeader', render: (p) => <S.SiteHeader {...p} brand="b" /> },
  { name: 'SiteFooter', render: (p) => <S.SiteFooter {...p}>f</S.SiteFooter> },
  {
    name: 'Sidebar',
    render: (p) => (
      <S.Sidebar {...p} sidebar="s">
        m
      </S.Sidebar>
    ),
  },
  { name: 'NotFoundView', render: (p) => <S.NotFoundView {...p} /> },
];

// Exported components deliberately absent from the registry, with the reason:
// - AppShell, Router: render fragments — there is no root to dress.
// - ErrorBoundary: renders its children untouched until an error; the fallback is its own.
// - Tooltip: the CHILD is the trigger and the root; Tooltip itself takes no dress props.
// - StandardsLab, GridOverlay: development instruments, not furniture.
const EXCEPTIONS = [
  'AppShell',
  'Router',
  'ErrorBoundary',
  'Tooltip',
  'StandardsLab',
  'GridOverlay',
];

const probe = (): Probe => ({
  className: 'probe',
  style: { outlineColor: 'rgb(1, 2, 3)' },
  'data-probe': '1',
  ref: createRef<never>(),
});

describe('C5 — every exported component forwards className, style, rest and ref to its root', () => {
  for (const entry of REGISTRY) {
    it(entry.name, () => {
      const p = probe();
      const { container } = render(entry.render(p));
      const root = entry.root
        ? entry.root(container)
        : (container.firstElementChild as HTMLElement);
      expect(root, `${entry.name}: root not found`).not.toBeNull();
      const classEl = entry.classRoot ? entry.classRoot(container) : root;
      expect(
        classEl!.classList.contains('probe'),
        `${entry.name}: className did not reach its element`,
      ).toBe(true);
      expect(
        root!.getAttribute('data-probe'),
        `${entry.name}: rest props did not reach the root`,
      ).toBe('1');
      const styleEl = entry.styleRoot ? entry.styleRoot(container) : classEl;
      expect(styleEl!.style.outlineColor, `${entry.name}: style did not reach its element`).toBe(
        'rgb(1, 2, 3)',
      );
      if (!entry.noRef) {
        expect(
          (p.ref as { current: HTMLElement | null }).current,
          `${entry.name}: ref did not resolve to the root`,
        ).toBe(root);
      }
    });
  }

  it('every exported component is either in the registry or a listed exception', () => {
    const exported = Object.keys(S).filter(
      (k) => /^[A-Z]/.test(k) && typeof (S as Record<string, unknown>)[k] === 'function',
    );
    const covered = new Set([...REGISTRY.map((e) => e.name), ...EXCEPTIONS]);
    const missing = exported.filter((k) => !covered.has(k));
    expect(missing, `components without a contract entry: ${missing.join(', ')}`).toEqual([]);
  });
});

describe('axe over the minimal render of every component (contrast is browser-gated)', () => {
  for (const entry of REGISTRY) {
    it(entry.name, async () => {
      const { container } = render(<main>{entry.render(probe())}</main>);
      const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
      expect(
        results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`),
      ).toEqual([]);
    });
  }
});

// Made with my soul - Swately <3
