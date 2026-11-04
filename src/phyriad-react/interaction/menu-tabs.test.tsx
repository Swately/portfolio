import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuButton, { MenuItem } from './MenuButton';
import Tabs, { Tab, TabList, TabPanel } from './Tabs';
import { placeMenu } from './placement';

// jsdom has no popover API: the component takes the `hidden` path, which is the
// same state machine without the top layer. The top layer is browser-gated.

function Menu(props: { onA?: () => void; onC?: () => void }) {
  return (
    <MenuButton label="Más">
      <MenuItem onSelect={props.onA}>Abrir</MenuItem>
      <MenuItem disabled>Borrar</MenuItem>
      <MenuItem onSelect={props.onC}>Cerrar sesión</MenuItem>
    </MenuButton>
  );
}

describe('MenuButton (0.21.0)', () => {
  it('ArrowDown opens on the first item, ArrowUp on the last; aria-expanded follows', () => {
    render(<Menu />);
    const btn = screen.getByRole('button', { name: 'Más' });
    expect(btn).toHaveAttribute('aria-haspopup', 'menu');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.keyDown(btn, { key: 'ArrowDown' });
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Abrir' }));
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(btn);
    fireEvent.keyDown(btn, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Cerrar sesión' }));
  });

  it('arrows wrap through disabled items, Home/End jump, a letter jumps to the next match', () => {
    render(<Menu />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Más' }), { key: 'ArrowDown' });
    const menu = screen.getByRole('menu');
    const [a, b, c] = screen.getAllByRole('menuitem');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(b);
    expect(b).toHaveAttribute('aria-disabled', 'true');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(c);
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(a);
    fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(c);
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(document.activeElement).toBe(a);
    fireEvent.keyDown(menu, { key: 'c' });
    expect(document.activeElement).toBe(c);
  });

  it('selecting an item fires onSelect, closes and returns focus; a disabled item does nothing', () => {
    const onA = vi.fn();
    render(<Menu onA={onA} />);
    const btn = screen.getByRole('button', { name: 'Más' });
    fireEvent.click(btn);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Borrar' }));
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Abrir' }));
    expect(onA).toHaveBeenCalledTimes(1);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(btn);
  });

  it('controlled: reports open changes without flipping on its own', () => {
    const onOpenChange = vi.fn();
    render(
      <MenuButton label="Más" open={false} onOpenChange={onOpenChange}>
        <MenuItem>x</MenuItem>
      </MenuButton>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Más' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Más' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('placeMenu', () => {
  const vp = { width: 1000, height: 600 };
  it('sits below the button, aligned to its start edge', () => {
    expect(
      placeMenu({ top: 100, left: 50, width: 80, height: 30 }, { width: 200, height: 120 }, vp),
    ).toEqual({
      top: 134,
      left: 50,
      flippedBlock: false,
      flippedInline: false,
    });
  });
  it('flips above near the bottom edge and to the end edge near the right edge', () => {
    const p = placeMenu(
      { top: 550, left: 900, width: 80, height: 30 },
      { width: 200, height: 120 },
      vp,
    );
    expect(p.flippedBlock).toBe(true);
    expect(p.top).toBe(550 - 4 - 120);
    expect(p.flippedInline).toBe(true);
    expect(p.left).toBe(900 + 80 - 200);
  });
  it('clamps when neither side fits', () => {
    const p = placeMenu(
      { top: 10, left: 10, width: 20, height: 20 },
      { width: 2000, height: 2000 },
      vp,
    );
    expect(p.top).toBe(0);
    expect(p.left).toBe(0);
  });
});

function Demo(props: { activation?: 'automatic' | 'manual'; onChange?: (v: string) => void }) {
  return (
    <Tabs
      label="Secciones"
      defaultValue="a"
      activation={props.activation}
      onValueChange={props.onChange}
    >
      <TabList>
        <Tab value="a">Alfa</Tab>
        <Tab value="b">Beta</Tab>
        <Tab value="c">Gamma</Tab>
      </TabList>
      <TabPanel value="a">
        <input aria-label="nota" />
      </TabPanel>
      <TabPanel value="b">panel b</TabPanel>
      <TabPanel value="c">panel c</TabPanel>
    </Tabs>
  );
}

describe('Tabs (0.21.0)', () => {
  it('has the roles, the ids and one tab stop; panels stay mounted and keep state', () => {
    render(<Demo />);
    const list = screen.getByRole('tablist', { name: 'Secciones' });
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const panelA = screen.getByRole('tabpanel', { name: 'Alfa' });
    expect(panelA).toHaveAttribute('id', tabs[0]!.getAttribute('aria-controls')!);
    const input = screen.getByRole('textbox', { name: 'nota' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hola' } });
    tabs[0]!.focus();
    fireEvent.keyDown(list, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(panelA).not.toBeVisible();
    expect(document.body.contains(input)).toBe(true);
    fireEvent.keyDown(list, { key: 'End' });
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(list, { key: 'ArrowRight' });
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(input.value).toBe('hola');
    expect(input).toBeVisible();
  });

  it('manual activation moves focus without selecting until the tab is activated', () => {
    const onChange = vi.fn();
    render(<Demo activation="manual" onChange={onChange} />);
    const tabs = screen.getAllByRole('tab');
    tabs[0]!.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(tabs[1]!);
    expect(onChange).toHaveBeenCalledWith('b');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('controlled value follows the parent', () => {
    function Ctl() {
      const [v, setV] = useState('b');
      return (
        <Tabs label="L" value={v} onValueChange={setV}>
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">pa</TabPanel>
          <TabPanel value="b">pb</TabPanel>
        </Tabs>
      );
    }
    render(<Ctl />);
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: 'A' }));
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('pa')).toBeVisible();
  });
});

// Made with my soul - Swately <3
