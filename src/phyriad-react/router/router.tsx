// Hand-rolled client router — ported verbatim from climx (src/router/router.tsx),
// which built it as an M1 learning item. Zero dependencies beyond react.
// PUBLIC CONTRACT: pages may import ONLY Router, Link, useParams, usePath,
// navigate. Everything else is internal, so a swap to react-router behind this
// interface stays contained.
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type ComponentType,
  type ReactNode,
} from 'react';

export type Route = {
  path: string;
  page: ComponentType;
  /**
   * A WINDOW route: AppShell renders only the skip link and the routed `main`
   * — no site header, footer, sidebars or page grid — so the page can be an
   * application frame (`WindowFrame`) that owns the viewport and the scroll.
   */
  window?: boolean;
};

type Params = Record<string, string>;

// BASE_URL: GH Pages serves the app under a project path; routes are matched
// against the path with that prefix stripped.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function stripBase(pathname: string): string {
  const p = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return p === '' ? '/' : p;
}

// Matches a pattern of literal and :param segments against a pathname.
// Exported for unit tests; not part of the page-facing contract.
export function matchPath(pattern: string, pathname: string): Params | null {
  const pat = pattern.split('/').filter(Boolean);
  const path = pathname.split('/').filter(Boolean);
  if (pat.length !== path.length) return null;
  const params: Params = {};
  for (let i = 0; i < pat.length; i++) {
    const p = pat[i] as string;
    // A malformed percent-escape (e.g. "%E0%A4%A" from a truncated shared link
    // or a crawler) makes decodeURIComponent THROW. Unguarded, that exception
    // escapes matchPath during render and blanks the whole app; treated as
    // "no match" it falls through to the 404 page, which is the honest answer.
    let s: string;
    try {
      s = decodeURIComponent(path[i] as string);
    } catch {
      return null;
    }
    if (p.startsWith(':')) params[p.slice(1)] = s;
    else if (p !== s) return null;
  }
  return params;
}

const listeners = new Set<() => void>();

function currentPath(): string {
  return stripBase(window.location.pathname);
}

function subscribeToPath(fn: () => void): () => void {
  listeners.add(fn);
  window.addEventListener('popstate', fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('popstate', fn);
  };
}

/**
 * The current route path. One source of truth: `Router` renders from it, and a
 * consumer can read it too — `aria-current` nav highlighting is the usual
 * reason. Subscribes to both this module's own navigations and `popstate`.
 */
export function usePath(): string {
  return useSyncExternalStore(subscribeToPath, currentPath);
}

/**
 * Push a new path (or replace the current one) and scroll to the top; AppShell moves focus to
 * `main` on the change. Prefer `Link` for anything a user clicks.
 */
export function navigate(to: string, opts?: { replace?: boolean }): void {
  const url = BASE + to;
  if (opts?.replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
  // A push is a NEW page, and a native page load starts at the top — so this
  // does too, BEFORE notifying, so the new page renders already at the top.
  // popstate is deliberately not touched: back/forward keeps the browser's own
  // scroll restoration, which this line would otherwise fight.
  window.scrollTo(0, 0);
  listeners.forEach((fn) => fn());
}

const ParamsContext = createContext<Params>({});

/**
 * Renders the first route whose pattern matches the current path (`:param` segments
 * supported), or `fallback`. Mounted by AppShell; a consumer rarely renders it directly.
 */
export function Router({ routes, fallback }: { routes: Route[]; fallback: ComponentType }) {
  const path = usePath();
  for (const r of routes) {
    const params = matchPath(r.path, path);
    if (params) {
      const Page = r.page;
      return (
        <ParamsContext.Provider value={params}>
          <Page />
        </ParamsContext.Provider>
      );
    }
  }
  const Fallback = fallback;
  return <Fallback />;
}

/**
 * The `:param` values of the matched route, as a string map.
 */
export function useParams<T extends Params = Params>(): T {
  return useContext(ParamsContext) as T;
}

type LinkProps = { to: string; children: ReactNode } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>;

/**
 * An anchor that navigates in-app on a plain left click and behaves natively otherwise
 * (modified clicks, middle click, external). Always a real `href`, so it works before JavaScript.
 */
export function Link({ to, children, onClick, ...rest }: LinkProps) {
  return (
    <a
      href={BASE + to}
      onClick={(e) => {
        onClick?.(e);
        // Only intercept plain left-clicks; modified clicks keep native behavior.
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        )
          return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

// Made with my soul - Swately <3
