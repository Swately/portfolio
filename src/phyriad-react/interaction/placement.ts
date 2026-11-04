export type Rect = { top: number; left: number; width: number; height: number };
export type Size = { width: number; height: number };
/** Which side of the anchor to try first: below (menus) or above (tooltips). */
export type Prefer = 'block-end' | 'block-start';

export type Placement = {
  top: number;
  left: number;
  flippedBlock: boolean;
  flippedInline: boolean;
};

/**
 * Where a menu goes relative to its button, in viewport pixels — the JS twin
 * of the CSS anchor rule (`anchor(bottom)` / `anchor(left)` with
 * `position-try-fallbacks: flip-block, flip-inline`): below the button and
 * aligned to its start edge; above it when below would overflow; aligned to
 * the end edge when the start would overflow; clamped to the viewport as the
 * last resort. Pure, so the flip rule is unit-tested with fake rectangles.
 */
export function placeMenu(
  anchor: Rect,
  menu: Size,
  viewport: Size,
  gap = 4,
  prefer: Prefer = 'block-end',
): Placement {
  const below = anchor.top + anchor.height + gap;
  const above = anchor.top - gap - menu.height;
  const fitsBelow = below + menu.height <= viewport.height;
  const fitsAbove = above >= 0;
  let top: number;
  let flippedBlock = false;
  if (prefer === 'block-end') {
    top = below;
    if (!fitsBelow && fitsAbove) {
      top = above;
      flippedBlock = true;
    }
  } else {
    top = above;
    if (!fitsAbove && fitsBelow) {
      top = below;
      flippedBlock = true;
    }
  }
  let left = anchor.left;
  let flippedInline = false;
  if (left + menu.width > viewport.width && anchor.left + anchor.width - menu.width >= 0) {
    left = anchor.left + anchor.width - menu.width;
    flippedInline = true;
  }
  top = Math.max(0, Math.min(top, viewport.height - menu.height));
  left = Math.max(0, Math.min(left, viewport.width - menu.width));
  return { top, left, flippedBlock, flippedInline };
}

// Made with my soul - Swately <3
