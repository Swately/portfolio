import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { StrictMode } from 'react';
import { render, screen, act } from '@testing-library/react';
import AppShell from './AppShell';
import { navigate } from '../router/router';

// jsdom does not implement window.scrollTo; navigate() calls it on push.
beforeAll(() => {
  window.scrollTo = () => {};
});
beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

// Two pages that follow the title discipline, one that violates it (none).
function PageA() {
  return (
    <>
      <title>Alpha — Site</title>
      <h2>Alpha</h2>
    </>
  );
}
function PageB() {
  return (
    <>
      <title>Beta — Site</title>
      <h2>Beta</h2>
    </>
  );
}
function Lost() {
  return <h2>lost</h2>;
}

const routes = [
  { path: '/', page: PageA },
  { path: '/b', page: PageB },
];

describe('AppShell route correctness (S1)', () => {
  it('does NOT steal focus on the initial render', () => {
    render(<AppShell routes={routes} notFound={Lost} />);
    // Stealing focus on load would break the skip link and new-tab flows.
    expect(document.activeElement).toBe(document.body);
  });

  it('does NOT steal focus on the initial render under StrictMode', () => {
    // StrictMode replays mount effects; a first-render boolean flag survives
    // the replay and focused main on every fresh page load. Caught in the
    // browser; pinned here so it cannot come back.
    render(
      <StrictMode>
        <AppShell routes={routes} notFound={Lost} />
      </StrictMode>,
    );
    expect(document.activeElement).toBe(document.body);
  });

  it('moves focus to main after a route change (F-2)', () => {
    render(<AppShell routes={routes} notFound={Lost} />);
    act(() => navigate('/b'));
    expect(screen.getByRole('heading', { name: 'Beta' })).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it("document.title follows the mounted page's <title> (F-1)", () => {
    render(<AppShell routes={routes} notFound={Lost} />);
    expect(document.title).toBe('Alpha — Site');
    act(() => navigate('/b'));
    expect(document.title).toBe('Beta — Site');
    // React removes the unmounted page's title: exactly one remains.
    expect(document.querySelectorAll('title')).toHaveLength(1);
  });
});

describe('layout mode (1.1.0)', () => {
  it('marks the grid wrapper only in centred mode', () => {
    const Page = () => <p>x</p>;
    const { unmount } = render(
      <AppShell routes={[{ path: '/', page: Page }]} notFound={() => null} layout="centered" />,
    );
    expect(document.querySelector('.phy-grid-wrap')).toHaveAttribute('data-layout', 'centered');
    unmount();
    render(<AppShell routes={[{ path: '/', page: Page }]} notFound={() => null} />);
    expect(document.querySelector('.phy-grid-wrap')).not.toHaveAttribute('data-layout');
  });

  it('warns in development about a .phy-wide block outside the centred layout, and only there', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const Wide = () => (
      <>
        <title>Wide — Site</title>
        <div className="phy-wide">figure</div>
      </>
    );
    const routes = [{ path: '/', page: Wide }];
    const { unmount } = render(<AppShell routes={routes} notFound={() => null} />);
    expect(warn.mock.calls.some((c) => String(c[0]).includes('.phy-wide'))).toBe(true);
    unmount();
    warn.mockClear();
    render(<AppShell routes={routes} notFound={() => null} layout="centered" />);
    expect(warn.mock.calls.some((c) => String(c[0]).includes('.phy-wide'))).toBe(false);
    warn.mockRestore();
  });
});

// Made with my soul - Swately <3
