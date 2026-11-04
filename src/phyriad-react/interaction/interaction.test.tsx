import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Disclosure from './Disclosure';
import Dialog from './Dialog';

// jsdom implements neither details-toggling nor dialog modality; both are
// BROWSER-gate territory. Here: structure, wiring, and the close path — with
// showModal/close polyfilled just enough to drive the component's logic.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

describe('Disclosure', () => {
  it('is a native details/summary with the open attribute passing through', () => {
    render(
      <Disclosure summary="¿Pregunta?" open>
        <p>Respuesta.</p>
      </Disclosure>,
    );
    const details = screen.getByText('¿Pregunta?').closest('details');
    expect(details).toHaveAttribute('open');
    expect(screen.getByText('Respuesta.')).toBeInTheDocument();
  });
});

describe('Dialog', () => {
  it('opens via showModal, is labelled by its title, closes through ONE path', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(
      <Dialog open={false} onClose={onClose} title="Confirmar" closeLabel="Cerrar">
        <p>¿Seguro?</p>
      </Dialog>,
    );
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

    rerender(
      <Dialog open onClose={onClose} title="Confirmar" closeLabel="Cerrar">
        <p>¿Seguro?</p>
      </Dialog>,
    );
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    const dialog = screen.getByText('¿Seguro?').closest('dialog') as HTMLDialogElement;
    expect(dialog.getAttribute('aria-labelledby')).toBe(screen.getByText('Confirmar').id);

    // STATE drives the DOM: the close button asks the parent (onClose), the
    // parent flips `open`, and the effect closes the element and finishes.
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(
      <Dialog open={false} onClose={onClose} title="Confirmar" closeLabel="Cerrar">
        <p>¿Seguro?</p>
      </Dialog>,
    );
    expect(dialog.open).toBe(false);
    // body scroll lock released on close
    expect(document.body.style.overflow).toBe('');
  });

  it('a PLATFORM-initiated close (Escape, method="dialog") reports into onClose too', () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Nativo" closeLabel="Cerrar">
        <p>x</p>
      </Dialog>,
    );
    const dialog = screen.getByText('x').closest('dialog') as HTMLDialogElement;
    expect(document.body.style.overflow).toBe('hidden');
    // the polyfilled close() dispatches the native 'close' event, as the platform does
    dialog.close();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.body.style.overflow).toBe('');
  });
});

// Made with my soul - Swately <3
