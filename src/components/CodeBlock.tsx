/**
 * A block of commands or output. A long line makes it a horizontally scrollable region, and a scrollable region
 * must be reachable by keyboard (axe: scrollable-region-focusable; WCAG 2.1.1), which the browser showed on the
 * project pages and jsdom did not. It is therefore always focusable and named, like the figures' scroll regions
 * but without the measurement: a code block is a fair place for a tab stop.
 */
export default function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <pre tabIndex={0} role="region" aria-label={label} className="phy-scroll-x">
      <code>{children}</code>
    </pre>
  );
}

// Made with my soul - Swately <3
