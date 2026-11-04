import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import Skeletonize from './Skeletonize';
import Empty from './Empty';
import ErrorBoundary from './ErrorBoundary';

afterEach(() => vi.restoreAllMocks());

describe('Skeleton', () => {
  it('is aria-hidden ALWAYS — the accessible loading state is aria-busy + Status', () => {
    const { container } = render(<Skeleton width={120} height={16} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.style.inlineSize).toBe('120px');
    expect(el.style.blockSize).toBe('16px');
  });
});

describe('Empty', () => {
  it('renders title, hint and the action slot', () => {
    render(
      <Empty
        title="Sin resultados"
        hint="Prueba otro término."
        action={<a href="/x">Ver todo</a>}
      />,
    );
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    expect(screen.getByText('Prueba otro término.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todo' })).toBeInTheDocument();
  });
});

function Bomb({ armed }: { armed: boolean }) {
  if (armed) throw new Error('boom');
  return <p>contenido vivo</p>;
}

describe('ErrorBoundary', () => {
  it('catches a render error, announces via role=alert, and retry re-renders', async () => {
    // React logs caught errors loudly; silence for this deliberate crash.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    const onError = vi.fn();

    function Harness() {
      return (
        <ErrorBoundary
          title="Falló"
          message="Esta sección falló."
          retryLabel="Reintentar"
          onError={onError}
        >
          <Bomb armed={armCount === 0} />
        </ErrorBoundary>
      );
    }
    // first mount crashes; after retry, the bomb is disarmed
    let armCount = 0;
    const { rerender } = render(<Harness />);
    expect(screen.getByRole('alert')).toHaveTextContent('Falló');
    expect(onError).toHaveBeenCalledTimes(1);

    armCount = 1;
    rerender(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(screen.getByText('contenido vivo')).toBeInTheDocument();
  });
});

describe('SkeletonText / Skeletonize (the skeleton system)', () => {
  it('SkeletonText renders N em-height lines, last one short', () => {
    const { container } = render(<SkeletonText lines={4} lastLine="40%" />);
    const wrap = container.firstElementChild as HTMLElement;
    expect(wrap).toHaveAttribute('aria-hidden', 'true');
    const rows = wrap.querySelectorAll('span[aria-hidden]');
    expect(rows).toHaveLength(4);
    expect((rows[3] as HTMLElement).style.inlineSize).toBe('40%');
    expect((rows[0] as HTMLElement).style.blockSize).toBe('1em');
  });

  it('Skeletonize owns the contract: aria-busy while loading, hidden placeholder, atomic swap', () => {
    const { container, rerender } = render(
      <Skeletonize loading placeholder={<SkeletonText lines={2} />}>
        <p>contenido real</p>
      </Skeletonize>,
    );
    const region = container.firstElementChild as HTMLElement;
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('contenido real')).toBeNull();
    expect(region.querySelector('[aria-hidden="true"]')).not.toBeNull();

    rerender(
      <Skeletonize loading={false} placeholder={<SkeletonText lines={2} />}>
        <p>contenido real</p>
      </Skeletonize>,
    );
    expect(region).not.toHaveAttribute('aria-busy');
    expect(screen.getByText('contenido real')).toBeInTheDocument();
    expect(region.querySelector('span[aria-hidden="true"]')).toBeNull();
  });
});

// Made with my soul - Swately <3
