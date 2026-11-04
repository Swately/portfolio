import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Toaster from './Toaster';
import Progress from './Progress';
import Panel from '../layout/Panel';
import { toast, dismiss, dismissAll, TOAST_CAP } from './toasts';

beforeEach(() => {
  dismissAll();
});

describe('toasts (0.20.0)', () => {
  it('renders status for info/success and alert for error, with a dismiss button each', () => {
    render(<Toaster label="Notificaciones" dismissLabel="Cerrar" />);
    act(() => {
      toast({ title: 'Guardado', kind: 'success' });
      toast({ title: 'Falló', kind: 'error' });
    });
    expect(screen.getByRole('region', { name: 'Notificaciones' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Guardado');
    expect(screen.getByRole('alert')).toHaveTextContent('Falló');
    const closes = screen.getAllByRole('button', { name: 'Cerrar' });
    expect(closes).toHaveLength(2);
    fireEvent.click(closes[0]!);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('caps the stack at TOAST_CAP, dropping the oldest', () => {
    render(<Toaster />);
    act(() => {
      for (let i = 1; i <= TOAST_CAP + 2; i++) toast({ title: `t${i}` });
    });
    const items = screen.getAllByRole('status');
    expect(items).toHaveLength(TOAST_CAP);
    expect(items[0]).toHaveTextContent('t3');
  });

  it('does not auto-dismiss without a timeout; a timeout pauses on hover', () => {
    vi.useFakeTimers();
    try {
      render(<Toaster label="N" />);
      let timed = 0;
      act(() => {
        toast({ title: 'sticky' });
        timed = toast({ title: 'timed', timeout: 1000 });
      });
      expect(timed).toBeGreaterThan(0);
      act(() => {
        vi.advanceTimersByTime(600);
      });
      fireEvent.mouseEnter(screen.getByRole('region', { name: 'N' }));
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText('timed')).toBeInTheDocument();
      fireEvent.mouseLeave(screen.getByRole('region', { name: 'N' }));
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.queryByText('timed')).toBeNull();
      expect(screen.getByText('sticky')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      expect(screen.getByText('sticky')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('dismiss(id) removes exactly that toast', () => {
    render(<Toaster />);
    let a = 0;
    act(() => {
      a = toast({ title: 'a' });
      toast({ title: 'b' });
    });
    act(() => dismiss(a));
    expect(screen.queryByText('a')).toBeNull();
    expect(screen.getByText('b')).toBeInTheDocument();
  });
});

describe('Progress (0.20.0)', () => {
  it('is a native progressbar named by its label, with value and max', () => {
    render(<Progress label="Carga" value={3} max={9} valueText="3 de 9" />);
    const bar = screen.getByRole('progressbar', { name: 'Carga' }) as HTMLProgressElement;
    expect(bar.tagName).toBe('PROGRESS');
    expect(bar.value).toBe(3);
    expect(bar.max).toBe(9);
    expect(screen.getByText('3 de 9')).toBeInTheDocument();
  });

  it('is indeterminate without a value and can hide its label visually', () => {
    render(<Progress label="Espere" labelHidden />);
    const bar = screen.getByRole('progressbar', { name: 'Espere' }) as HTMLProgressElement;
    expect(bar.hasAttribute('value')).toBe(false);
    expect(bar.position).toBe(-1);
  });
});

describe('Panel collapsible (0.20.0)', () => {
  it('hides the body but keeps it mounted (typed value survives), flips aria-expanded', () => {
    render(
      <Panel title={<h3>Filtros</h3>} collapsible collapseLabel="Plegar" expandLabel="Desplegar">
        <input aria-label="campo" />
      </Panel>,
    );
    const input = screen.getByRole('textbox', { name: 'campo' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hola' } });
    const toggle = screen.getByRole('button', { name: 'Plegar' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Desplegar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(input).not.toBeVisible();
    expect(document.body.contains(input)).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Desplegar' }));
    expect(input).toBeVisible();
    expect(input.value).toBe('hola');
  });

  it('controlled: reports the change and does not flip on its own', () => {
    const onChange = vi.fn();
    render(
      <Panel
        title={<h3>P</h3>}
        collapsible
        collapsed={false}
        onCollapsedChange={onChange}
        collapseLabel="Plegar"
      >
        cuerpo
      </Panel>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Plegar' }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('cuerpo')).toBeVisible();
  });
});

// Made with my soul - Swately <3
