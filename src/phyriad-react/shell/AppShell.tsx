import { useEffect, useRef, type ComponentType, type ReactNode } from 'react';
import { Router, matchPath, usePath, type Route } from '../router/router';

/**
 * How many <title> elements the document carried BEFORE React committed
 * anything — captured at module load, which runs before createRoot().render.
 * The dev audit below needs this baseline: a page's own title is "one more
 * than the static count", and the static count is a consumer choice (keeping
 * one in index.html as the pre-JS fallback is legitimate).
 * Known imprecision, accepted: an HMR re-evaluation of this module can inflate
 * the count until a full reload — a dev-only tool with a dev-only inaccuracy.
 */
const staticTitles =
  typeof document === 'undefined' ? 0 : document.querySelectorAll('title').length;

type AppShellProps = {
  routes: Route[];
  /** Rendered when no route matches. */
  notFound: ComponentType;
  /** Optional site header. */
  header?: ReactNode;
  footer?: ReactNode;
  /**
   * Leading sidebar — navigation, filters. Rendered BEFORE the content in the
   * DOM, which is also the order it stacks in on a narrow screen, and the order
   * a keyboard or screen-reader user meets it.
   */
  sidebarStart?: ReactNode;
  /** Trailing sidebar — table of contents, related links, metadata. */
  sidebarEnd?: ReactNode;
  /** Accessible names for the two sidebars; a page may hold several `aside`s. */
  sidebarStartLabel?: string;
  sidebarEndLabel?: string;
  /** Text of the skip link. Site language, so it is a prop, not a constant. */
  skipLabel?: string;
  /**
   * `page` (default): the twelve-column page — reading blocks at five of the
   * eight content columns, sidebars in the outer tracks. `centered`: for a site
   * WITHOUT sidebars — every reading block at the measure, centred in the
   * content area (measured before this mode existed: 50 characters wide and
   * 122 px left of centre on a 1846 px screen). `.phy-full` and `.phy-wide`
   * keep their width in both.
   */
  layout?: 'page' | 'centered';
  className?: string;
};

/**
 * The page frame every site repeats: a skip link, the twelve-column grid, two
 * optional sidebars, a routed `main` landmark, and optional header/footer.
 *
 * Layout is 2 sidebar + 8 content + 2 sidebar. **With no sidebars passed the
 * outer tracks simply stay empty and the content area is still centred**,
 * because the grid is symmetric — a site without sidebars needs no special case
 * and pays nothing for their existence.
 *
 * Four structural facts, all easy to get wrong:
 *
 * 1. `main` occupies the 8 content columns and re-exposes them via subgrid, so
 *    a section inside places against the content area rather than the page.
 *    A subgrid renumbers the lines it spans, which is exactly why the substrate
 *    has separate page-level and content-level placement classes.
 *
 * 2. A page component should return a FRAGMENT of sections, not a wrapper
 *    element. A fragment creates no DOM node, so those sections become direct
 *    children of `main` and take part in its subgrid. A page that wraps its
 *    content in a `div` becomes one grid item and loses placement for
 *    everything inside it.
 *
 * 3. The sidebars are `aside` landmarks with accessible names. A page can hold
 *    several complementary regions, and "complementary" alone does not tell a
 *    screen-reader user which one they are in.
 *
 * 4. After a route change, FOCUS MOVES to `main`. Measured before the fix:
 *    the old page unmounts, the focused link is destroyed with it, and
 *    `document.activeElement` falls to `<body>` — a keyboard-user defect, not
 *    only a screen-reader one, which is why the fix is focus management and
 *    not a live region (announcing AND moving focus double-announces in
 *    several screen readers; with focus moving, no un-focused status message
 *    exists for WCAG 4.1.3 to demand). `preventScroll` because scrolling is
 *    `navigate()`'s job on push and the browser's on back/forward; programmatic
 *    focus on tabindex="-1" does not match `:focus-visible`, so no ring shows.
 */
export default function AppShell({
  routes,
  notFound,
  header,
  footer,
  sidebarStart,
  sidebarEnd,
  sidebarStartLabel = 'Section navigation',
  sidebarEndLabel = 'On this page',
  skipLabel = 'Skip to content',
  layout = 'page',
  className,
}: AppShellProps) {
  const path = usePath();
  const mainRef = useRef<HTMLElement>(null);
  // A window route owns the viewport: no chrome, no page grid. Matched here
  // with the same matcher the Router uses, so the two never disagree.
  const isWindow = routes.some((r) => r.window && matchPath(r.path, path) !== null);
  const prevPath = useRef(path);

  // Structural fact 4: route change -> focus the routed region. Never on the
  // first render — stealing focus on page load would break the skip link and
  // every "open in new tab" flow. Guarded by COMPARING PATHS, not by a
  // first-render flag: StrictMode runs mount effects twice and a boolean flag
  // survives the double run, so the second pass focused main on a fresh page
  // load — caught in the browser, not by the (non-StrictMode) jsdom suite. A
  // path comparison is idempotent no matter how many times the effect replays.
  useEffect(() => {
    if (prevPath.current === path) return;
    prevPath.current = path;
    mainRef.current?.focus({ preventScroll: true });
  }, [path]);

  // DEV-only page-envelope audit (WCAG 2.4.2 / 3.1.1). React 19 hoists a
  // page's <title> into <head> ahead of the static one (so it wins) and
  // removes it on unmount (so a page that forgets one silently falls back to
  // the generic site title — measured, not assumed). This makes both mistakes
  // loud in the only place they are cheap: development.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const total = document.querySelectorAll('title').length;
    if (total <= staticTitles) {
      console.warn(
        `[AppShell] route "${path}" renders no <title>. The tab shows the ` +
          'generic site title, which fails WCAG 2.4.2 for this route. Render ' +
          '<title>{page} — {site}</title> from the page component.',
      );
    } else if (total > staticTitles + 1) {
      console.warn(
        `[AppShell] ${total - staticTitles} <title> elements rendered at once ` +
          '(React does not deduplicate). Browser behaviour is undefined; ' +
          'exactly one component per route should render <title>.',
      );
    }
    // `.phy-wide` breaks out symmetrically around its PARENT's centre. In the default layout the
    // parent is the prose column, five of eight columns, left-aligned: measured at 1280 px the
    // block started 18 px past the left edge of the viewport (97 px at 1024). `layout="centered"`
    // makes every reading block centred, which is the layout the breakout is correct in.
    if (layout !== 'centered' && document.querySelector('.phy-wide')) {
      console.warn(
        `[AppShell] route "${path}" renders a .phy-wide block in the default layout, where its ` +
          'parent is not centred and the block overflows the left edge. Pass layout="centered" ' +
          'to AppShell, or place the block in a centred parent.',
      );
    }
    if (!document.documentElement.lang) {
      console.warn(
        '[AppShell] <html> has no lang attribute — WCAG 3.1.1 (level A). ' +
          "Set it in the consumer's index.html.",
      );
    }
  }, [path, layout]);

  if (isWindow) {
    return (
      <>
        <a href="#main" className="phy-skip">
          {skipLabel}
        </a>
        <main id="main" ref={mainRef} tabIndex={-1} className="phy-window">
          <Router routes={routes} fallback={notFound} />
        </main>
      </>
    );
  }

  return (
    <>
      <a href="#main" className="phy-skip">
        {skipLabel}
      </a>
      {/* The query container the grid needs: a grid cannot query its own width,
          so the collapse to narrow mode is driven from its parent. */}
      <div
        className={['phy-grid-wrap', className].filter(Boolean).join(' ')}
        data-layout={layout === 'centered' ? 'centered' : undefined}
      >
        <div className="phy-grid">
          {header}

          {sidebarStart && (
            <aside className="phy-side-start" aria-label={sidebarStartLabel}>
              {sidebarStart}
            </aside>
          )}

          <main id="main" ref={mainRef} tabIndex={-1} className="phy-content phy-subgrid">
            <Router routes={routes} fallback={notFound} />
          </main>

          {sidebarEnd && (
            <aside className="phy-side-end" aria-label={sidebarEndLabel}>
              {sidebarEnd}
            </aside>
          )}

          {footer}
        </div>
      </div>
    </>
  );
}

// Made with my soul - Swately <3
