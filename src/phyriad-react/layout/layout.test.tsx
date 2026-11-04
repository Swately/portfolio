import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import Stack from './Stack';
import Cluster from './Cluster';
import Grid from './Grid';
import Box from './Box';
import Text from '../text/Text';

// The tap-tap anti-checklist: every prop consumed, native props forward, ref is
// real, `as` renders real semantic tags.
describe('primitives', () => {
  it('render the semantic tag the `as` prop asks for', () => {
    render(
      <Stack as="nav" aria-label="n1">
        x
      </Stack>,
    );
    expect(screen.getByRole('navigation', { name: 'n1' }).tagName).toBe('NAV');
    render(<Text as="h2">titulo</Text>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('titulo');
  });

  it('accept a space PAIR as a gap (tokens 0.9.0: fluid across two steps, no breakpoint)', () => {
    render(
      <Stack gap="l-xl" data-testid="pair">
        x
      </Stack>,
    );
    expect(screen.getByTestId('pair').style.getPropertyValue('--stack-gap')).toBe(
      'var(--phy-space-l-xl)',
    );
  });

  it('consume scale props as CSS custom properties (no dead props)', () => {
    render(
      <Stack gap="xl" data-testid="s">
        x
      </Stack>,
    );
    expect(screen.getByTestId('s').style.getPropertyValue('--stack-gap')).toBe(
      'var(--phy-space-xl)',
    );
    render(
      <Grid min="10rem" gap="xs" data-testid="g">
        x
      </Grid>,
    );
    const g = screen.getByTestId('g');
    expect(g.style.getPropertyValue('--grid-min')).toBe('10rem');
    expect(g.style.getPropertyValue('--grid-gap')).toBe('var(--phy-space-xs)');
    render(
      <Cluster justify="space-between" data-testid="c">
        x
      </Cluster>,
    );
    expect(screen.getByTestId('c').style.getPropertyValue('--cluster-justify')).toBe(
      'space-between',
    );
    render(
      <Box padding="3xl" variant="surface" data-testid="b">
        x
      </Box>,
    );
    expect(screen.getByTestId('b').style.getPropertyValue('--box-padding')).toBe(
      'var(--phy-space-3xl)',
    );
    render(
      <Text size="lg" data-testid="t">
        x
      </Text>,
    );
    expect(screen.getByTestId('t').style.getPropertyValue('--text-size')).toBe(
      'var(--phy-text-lg)',
    );
  });

  it('forward native props and merge className', () => {
    render(
      <Box className="extra" data-testid="fw" lang="es">
        x
      </Box>,
    );
    const el = screen.getByTestId('fw');
    expect(el.className).toContain('extra');
    expect(el.getAttribute('lang')).toBe('es');
  });

  it('expose a working ref (React 19 ref-as-prop)', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref}>x</Stack>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

// Made with my soul - Swately <3
