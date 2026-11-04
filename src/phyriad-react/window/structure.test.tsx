import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Splitter from './Splitter';
import WindowFrame from './WindowFrame';
import TreeView from '../nav/TreeView';
import Tooltip from '../interaction/Tooltip';
import { placeMenu } from '../interaction/placement';

describe('Splitter (0.22.0)', () => {
  it('is a separator with values; arrows step, Home/End bound, Enter toggles to min and back', () => {
    const onChange = vi.fn();
    render(
      <Splitter
        label="Ancho"
        defaultValue={200}
        min={100}
        max={400}
        step={10}
        onValueChange={onChange}
      />,
    );
    const s = screen.getByRole('separator', { name: 'Ancho' });
    expect(s).toHaveAttribute('aria-valuenow', '200');
    expect(s).toHaveAttribute('aria-valuemin', '100');
    expect(s).toHaveAttribute('aria-valuemax', '400');
    expect(s).toHaveAttribute('aria-orientation', 'vertical');
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    expect(s).toHaveAttribute('aria-valuenow', '210');
    expect(onChange).toHaveBeenLastCalledWith(210);
    fireEvent.keyDown(s, { key: 'ArrowLeft' });
    fireEvent.keyDown(s, { key: 'ArrowLeft' });
    expect(s).toHaveAttribute('aria-valuenow', '190');
    fireEvent.keyDown(s, { key: 'End' });
    expect(s).toHaveAttribute('aria-valuenow', '400');
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    expect(s).toHaveAttribute('aria-valuenow', '400');
    fireEvent.keyDown(s, { key: 'Home' });
    expect(s).toHaveAttribute('aria-valuenow', '100');
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    fireEvent.keyDown(s, { key: 'Enter' });
    expect(s).toHaveAttribute('aria-valuenow', '100');
    fireEvent.keyDown(s, { key: 'Enter' });
    expect(s).toHaveAttribute('aria-valuenow', '110');
  });

  it('drags with the pointer (clamped) and resets on double click', () => {
    render(<Splitter label="Ancho" defaultValue={200} min={100} max={300} />);
    const s = screen.getByRole('separator', { name: 'Ancho' });
    fireEvent.pointerDown(s, { clientX: 50, pointerId: 1 });
    fireEvent.pointerMove(s, { clientX: 90, pointerId: 1 });
    expect(s).toHaveAttribute('aria-valuenow', '240');
    fireEvent.pointerMove(s, { clientX: 900, pointerId: 1 });
    expect(s).toHaveAttribute('aria-valuenow', '300');
    fireEvent.pointerUp(s, { clientX: 900, pointerId: 1 });
    expect(document.body.classList.contains('phy-dragging')).toBe(false);
    fireEvent.doubleClick(s);
    expect(s).toHaveAttribute('aria-valuenow', '200');
  });

  it('controlled: reports without moving; side="end" inverts the direction', () => {
    const onChange = vi.fn();
    render(<Splitter label="A" value={200} onValueChange={onChange} side="end" />);
    const s = screen.getByRole('separator', { name: 'A' });
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(184);
    expect(s).toHaveAttribute('aria-valuenow', '200');
  });

  it('WindowFrame renders splitters that control the panels', () => {
    const onStart = vi.fn();
    render(
      <main>
        <WindowFrame
          contentLabel="C"
          start="s"
          end="e"
          resizableStart
          resizableEnd
          startWidth="200px"
          onStartResize={onStart}
          startSplitterLabel="Ancho del menú"
          endSplitterLabel="Ancho de detalles"
        >
          c
        </WindowFrame>
      </main>,
    );
    const s = screen.getByRole('separator', { name: 'Ancho del menú' });
    expect(s).toHaveAttribute('aria-valuenow', '200');
    expect(document.getElementById(s.getAttribute('aria-controls')!)).toHaveAttribute(
      'aria-label',
      'Start panel',
    );
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    expect(onStart).toHaveBeenCalledWith(216);
    expect(screen.getByRole('separator', { name: 'Ancho de detalles' })).toBeInTheDocument();
  });
});

const ITEMS = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'a', label: 'app.tsx' },
      { id: 'b', label: 'boot.ts' },
    ],
  },
  { id: 'docs', label: 'docs', children: [{ id: 'r', label: 'README.md' }] },
  { id: 'lic', label: 'LICENSE' },
];

describe('TreeView (0.22.0)', () => {
  it('has tree roles, levels and one tab stop; arrows move over VISIBLE items only', () => {
    render(<TreeView label="Archivos" items={ITEMS} />);
    screen.getByRole('tree', { name: 'Archivos' });
    const items = screen.getAllByRole('treeitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveAttribute('aria-level', '1');
    expect(items[0]).toHaveAttribute('aria-expanded', 'false');
    expect(items.map((i) => i.tabIndex)).toEqual([0, -1, -1]);
    items[0]!.focus();
    fireEvent.keyDown(screen.getByRole('tree'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('treeitem', { name: /docs/ }));
  });

  it('Right expands then enters; Left collapses then goes to the parent; Enter selects', () => {
    const onSel = vi.fn();
    render(<TreeView label="A" items={ITEMS} onSelectedChange={onSel} />);
    const tree = screen.getByRole('tree');
    const src = screen.getByRole('treeitem', { name: /src/ });
    src.focus();
    fireEvent.keyDown(tree, { key: 'ArrowRight' });
    expect(src).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('treeitem')).toHaveLength(5);
    fireEvent.keyDown(tree, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByRole('treeitem', { name: 'app.tsx' }));
    expect(document.activeElement).toHaveAttribute('aria-level', '2');
    fireEvent.keyDown(tree, { key: 'Enter' });
    expect(onSel).toHaveBeenCalledWith('a');
    expect(document.activeElement).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tree, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(src);
    fireEvent.keyDown(tree, { key: 'ArrowLeft' });
    expect(src).toHaveAttribute('aria-expanded', 'false');
    fireEvent.keyDown(tree, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('treeitem', { name: 'LICENSE' }));
    fireEvent.keyDown(tree, { key: 'Home' });
    expect(document.activeElement).toBe(src);
    fireEvent.keyDown(tree, { key: '*' });
    expect(src).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: /docs/ })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(tree, { key: 'l' });
    expect(document.activeElement).toBe(screen.getByRole('treeitem', { name: 'LICENSE' }));
  });

  it('controlled expanded reports and does not flip on its own', () => {
    const onExp = vi.fn();
    render(<TreeView label="A" items={ITEMS} expanded={[]} onExpandedChange={onExp} />);
    const src = screen.getByRole('treeitem', { name: /src/ });
    fireEvent.click(src);
    expect(onExp).toHaveBeenCalledWith(['src']);
    expect(src).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Tooltip (0.22.0)', () => {
  it('describes its trigger; opens on focus, closes on blur and Escape; hover waits for the delay', () => {
    vi.useFakeTimers();
    try {
      render(
        <Tooltip content="Explica el botón" delay={300}>
          <button>Acción</button>
        </Tooltip>,
      );
      const btn = screen.getByRole('button', { name: 'Acción' });
      const tip = document.getElementById(btn.getAttribute('aria-describedby')!)!;
      expect(tip).toHaveAttribute('role', 'tooltip');
      expect(tip).not.toBeVisible();
      fireEvent.focus(btn);
      expect(tip).toBeVisible();
      fireEvent.keyDown(btn, { key: 'Escape' });
      expect(tip).not.toBeVisible();
      fireEvent.mouseEnter(btn);
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(tip).not.toBeVisible();
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(tip).toBeVisible();
      fireEvent.mouseLeave(btn);
      expect(tip).not.toBeVisible();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('placeMenu prefer block-start', () => {
  it('goes above by default when asked, falls below when above does not fit', () => {
    const vp = { width: 800, height: 600 };
    const above = placeMenu(
      { top: 300, left: 10, width: 50, height: 20 },
      { width: 100, height: 40 },
      vp,
      6,
      'block-start',
    );
    expect(above.top).toBe(300 - 6 - 40);
    expect(above.flippedBlock).toBe(false);
    const forced = placeMenu(
      { top: 10, left: 10, width: 50, height: 20 },
      { width: 100, height: 40 },
      vp,
      6,
      'block-start',
    );
    expect(forced.top).toBe(10 + 20 + 6);
    expect(forced.flippedBlock).toBe(true);
  });
});

// Made with my soul - Swately <3
