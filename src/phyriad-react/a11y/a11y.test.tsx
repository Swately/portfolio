import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import VisuallyHidden from './VisuallyHidden';
import Status from './Status';

afterEach(() => vi.restoreAllMocks());

// What jsdom CAN prove: the content is in the accessibility tree and the class
// is applied. What it CANNOT prove: the visual hiding itself — the vendored
// stylesheet is not loaded here. That half is covered by the tokens testbench
// (which verifies the recipe mechanically) and by the in-browser check at the
// element's gate. The split is stated so nobody mistakes this file for the
// whole proof.
describe('VisuallyHidden', () => {
  it('keeps its content in the accessibility tree', () => {
    render(<VisuallyHidden>solo para lectores</VisuallyHidden>);
    expect(screen.getByText('solo para lectores')).toBeInTheDocument();
  });

  it('applies the tokens hiding class and merges custom ones', () => {
    render(
      <VisuallyHidden as="div" className="extra">
        x
      </VisuallyHidden>,
    );
    const el = screen.getByText('x');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toBe('phy-visually-hidden extra');
  });
});

// jsdom proves: roles, the class, and that injected text reaches the region.
// It does NOT prove a screen reader announces it — no SR is wired into this
// verification loop; that claim rests on the ARIA contract and stays open to
// a live NVDA/Narrator pass by the operator. Stated, not glossed.
describe('Status', () => {
  it('is a status region by default, an alert when assertive', () => {
    const { rerender } = render(<Status />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(<Status assertive />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('receives a message injected AFTER mounting empty (the discipline)', () => {
    const { rerender } = render(<Status visuallyHidden />);
    const region = screen.getByRole('status');
    expect(region).toHaveTextContent('');
    expect(region.className).toBe('phy-visually-hidden');
    rerender(<Status visuallyHidden>Guardado.</Status>);
    expect(region).toHaveTextContent('Guardado.');
  });

  it('warns in DEV when mounted already filled — the silent-failure case', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Status>ya venía lleno</Status>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('mounted WITH content'));
    warn.mockClear();
    render(<Status />);
    expect(warn).not.toHaveBeenCalled();
  });
});

// Made with my soul - Swately <3
