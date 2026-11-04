import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { matchPath, stripBase, Router, Link, useParams, navigate } from './router';

// jsdom does not implement window.scrollTo; navigate() calls it on push.
beforeAll(() => {
  window.scrollTo = () => {};
});

describe('matchPath', () => {
  it('matches literal paths', () => {
    expect(matchPath('/', '/')).toEqual({});
    expect(matchPath('/about', '/about')).toEqual({});
    expect(matchPath('/about', '/otro')).toBeNull();
  });

  it('extracts :params', () => {
    expect(matchPath('/item/:id', '/item/42')).toEqual({ id: '42' });
  });

  it('rejects length mismatches', () => {
    expect(matchPath('/item/:id', '/item/42/extra')).toBeNull();
    expect(matchPath('/item/:id', '/item')).toBeNull();
  });

  it('decodes URI segments', () => {
    expect(matchPath('/x/:name', '/x/San%20Salvador')).toEqual({ name: 'San Salvador' });
  });

  // Kept verbatim from climx (graft G10): it guards a real defect climx hit —
  // an unguarded decodeURIComponent here blanked the whole app at render.
  it('treats a malformed percent-escape as no-match instead of throwing', () => {
    expect(() => matchPath('/x/:name', '/x/%E0%A4%A')).not.toThrow();
    expect(matchPath('/x/:name', '/x/%E0%A4%A')).toBeNull();
    expect(matchPath('/item/:id', '/item/%')).toBeNull();
  });
});

describe('stripBase', () => {
  it('strips the configured base and normalizes empty to /', () => {
    // In tests BASE_URL is '/', so stripping is the identity.
    expect(stripBase('/about')).toBe('/about');
    expect(stripBase('/')).toBe('/');
  });
});

function Home() {
  return <h1>home</h1>;
}
function About() {
  return <h1>about</h1>;
}
function Item() {
  const { id } = useParams<{ id: string }>();
  return <h1>item {id}</h1>;
}
function NotFound() {
  return <h1>404</h1>;
}

const routes = [
  { path: '/', page: Home },
  { path: '/about', page: About },
  { path: '/item/:id', page: Item },
];

describe('Router', () => {
  it('renders the matching route and navigates via Link', async () => {
    window.history.replaceState(null, '', '/');
    render(
      <>
        <Link to="/about">go to about</Link>
        <Router routes={routes} fallback={NotFound} />
      </>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('home');
    await userEvent.click(screen.getByRole('link', { name: 'go to about' }));
    expect(screen.getByRole('heading')).toHaveTextContent('about');
  });

  it('provides params to the page', () => {
    window.history.replaceState(null, '', '/item/42');
    render(<Router routes={routes} fallback={NotFound} />);
    expect(screen.getByRole('heading')).toHaveTextContent('item 42');
  });

  it('responds to popstate (back button)', async () => {
    window.history.replaceState(null, '', '/');
    render(<Router routes={routes} fallback={NotFound} />);
    navigate('/about');
    expect(await screen.findByText('about')).toBeInTheDocument();
    window.history.back();
    // jsdom fires popstate asynchronously
    expect(await screen.findByText('home')).toBeInTheDocument();
  });

  it('falls back on unknown paths', () => {
    window.history.replaceState(null, '', '/no-existe');
    render(<Router routes={routes} fallback={NotFound} />);
    expect(screen.getByRole('heading')).toHaveTextContent('404');
  });
});

// Made with my soul - Swately <3
