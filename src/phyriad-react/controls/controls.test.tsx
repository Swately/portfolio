import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';
import Field from './Field';
import Input from './Input';
import TextArea from './TextArea';
import Select from './Select';
import Checkbox from './Checkbox';
import Radio from './Radio';
import Fieldset from './Fieldset';
import ErrorSummary from './ErrorSummary';
import axe from 'axe-core';

// axe-core against rendered fixtures. color-contrast is disabled IN JSDOM ONLY
// and that is stated, not hidden: jsdom does no layout, and contrast is already
// COMPUTED by the tokens testbench (the numbers, gated).
async function expectNoAxeViolations(node: HTMLElement) {
  const results = await axe.run(node, {
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(results.violations).toEqual([]);
}

describe('Button', () => {
  it('defaults to type="button" — a button inside a form must not silently submit', () => {
    render(<Button>Acción</Button>);
    expect(screen.getByRole('button', { name: 'Acción' })).toHaveAttribute('type', 'button');
  });

  it('submit stays available, but only explicitly', () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('is secondary unless a primary is deliberately asked for', () => {
    const { rerender } = render(<Button>x</Button>);
    expect(screen.getByRole('button').className).toMatch(/secondary/);
    rerender(<Button variant="primary">x</Button>);
    expect(screen.getByRole('button').className).toMatch(/primary/);
  });

  it('fires onClick, and disabled really blocks it', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>x</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <Button onClick={onClick} disabled>
        x
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Field association (the invisible WCAG core)', () => {
  it('wires label, description and error to the control BY IDS', () => {
    render(
      <Field label="Nombre" description="Como en tu identificación" error="Es obligatorio.">
        <Input name="nombre" />
      </Field>,
    );
    const input = screen.getByLabelText('Nombre');
    expect(input).toHaveAccessibleDescription('Como en tu identificación Es obligatorio.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    // the ids resolve to REAL nodes, not to nothing
    for (const id of (input.getAttribute('aria-describedby') ?? '').split(' ')) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it('drops aria-invalid and the error id when there is no error', () => {
    render(
      <Field label="Nota" description="Opcional">
        <TextArea name="nota" />
      </Field>,
    );
    const area = screen.getByLabelText('Nota');
    expect(area).not.toHaveAttribute('aria-invalid');
    expect(area).toHaveAccessibleDescription('Opcional');
  });

  it('explicit props on the control win over the context', () => {
    render(
      <Field label="X">
        <Input id="mio" aria-describedby="otra-cosa" />
      </Field>,
    );
    const input = document.getElementById('mio');
    expect(input).not.toBeNull();
    expect(input).toHaveAttribute('aria-describedby', 'otra-cosa');
  });

  it('controls work standalone — context degrades, never breaks', () => {
    render(<Input aria-label="suelto" />);
    expect(screen.getByLabelText('suelto')).not.toHaveAttribute('aria-invalid');
  });

  it('axe finds no violations, valid or invalid', async () => {
    const { container } = render(
      <form aria-label="prueba">
        <Field label="Correo" description="Nunca se comparte">
          <Input type="email" name="correo" />
        </Field>
        <Field label="Motivo" error="Elige un motivo.">
          <TextArea name="motivo" />
        </Field>
        <Button type="submit" variant="primary">
          Enviar
        </Button>
      </form>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Select / Checkbox / Radio / Fieldset', () => {
  it('Select is context-wired like Input', () => {
    render(
      <Field label="Tema" error="Elige un tema.">
        <Select name="tema">
          <option value="">Elegir…</option>
          <option value="s">Sustrato</option>
        </Select>
      </Field>,
    );
    const sel = screen.getByLabelText('Tema');
    expect(sel.tagName).toBe('SELECT');
    expect(sel).toHaveAttribute('aria-invalid', 'true');
    expect(sel).toHaveAccessibleDescription('Elige un tema.');
  });

  it('Checkbox: the whole row is the label, and clicking it toggles', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Acepto" name="acepto" />);
    const box = screen.getByRole('checkbox', { name: 'Acepto' });
    await user.click(screen.getByText('Acepto'));
    expect(box).toBeChecked();
  });

  it('Radios sharing a name are exclusive, and the Fieldset legend names the group', async () => {
    const user = userEvent.setup();
    render(
      <Fieldset legend="Medio de contacto" error="Elige un medio.">
        <Radio name="medio" value="correo" label="Correo" />
        <Radio name="medio" value="tel" label="Teléfono" />
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Medio de contacto' });
    expect(group).toHaveAccessibleDescription('Elige un medio.');
    await user.click(screen.getByRole('radio', { name: 'Correo' }));
    await user.click(screen.getByRole('radio', { name: 'Teléfono' }));
    expect(screen.getByRole('radio', { name: 'Correo' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Teléfono' })).toBeChecked();
  });
});

describe('ErrorSummary (the loud path)', () => {
  it('focuses itself on mount — the focus move IS the announcement', () => {
    render(<ErrorSummary title="Hay 1 error" errors={[{ controlId: 'x', message: 'X falta' }]} />);
    const region = screen.getByRole('region', { name: 'Hay 1 error' });
    expect(document.activeElement).toBe(region);
    // no role=alert and no live region: either would double-announce
    expect(region).not.toHaveAttribute('role', 'alert');
  });

  it('re-focuses when it receives a NEW errors array (repeat failed submit)', () => {
    const { rerender } = render(
      <ErrorSummary title="Errores" errors={[{ controlId: 'x', message: 'X' }]} />,
    );
    (document.activeElement as HTMLElement).blur();
    rerender(<ErrorSummary title="Errores" errors={[{ controlId: 'x', message: 'X' }]} />);
    expect(document.activeElement).toBe(screen.getByRole('region', { name: 'Errores' }));
  });

  it('an item link focuses its control by id', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ErrorSummary
          title="Errores"
          errors={[{ controlId: 'campo-nombre', message: 'El nombre falta' }]}
        />
        <Field label="Nombre" controlId="campo-nombre" error="Falta.">
          <Input name="nombre" />
        </Field>
      </>,
    );
    await user.click(screen.getByRole('link', { name: 'El nombre falta' }));
    expect(document.activeElement).toBe(screen.getByLabelText('Nombre'));
  });

  it('renders nothing at all without errors', () => {
    const { container } = render(<ErrorSummary title="x" errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('axe finds no violations on the full composite form', async () => {
    const { container } = render(
      <form aria-label="completa">
        <ErrorSummary
          title="Hay 2 errores"
          errors={[
            { controlId: 'f-nombre', message: 'El nombre es obligatorio' },
            { controlId: 'f-tema', message: 'Elige un tema' },
          ]}
        />
        <Field label="Nombre" controlId="f-nombre" error="Obligatorio.">
          <Input name="nombre" />
        </Field>
        <Field label="Tema" controlId="f-tema">
          <Select name="tema">
            <option value="">Elegir…</option>
          </Select>
        </Field>
        <Fieldset legend="Medio">
          <Radio name="m" value="a" label="Correo" />
          <Radio name="m" value="b" label="Teléfono" />
        </Fieldset>
        <Checkbox label="Acepto" name="ok" />
        <Button type="submit" variant="primary">
          Enviar
        </Button>
      </form>,
    );
    await expectNoAxeViolations(container);
  });
});

// Made with my soul - Swately <3
