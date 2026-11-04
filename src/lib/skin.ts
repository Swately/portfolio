/**
 * The palette switch (SHOWCASE_SKIN_SPEC §8, updated for tokens 2.0.0). Since 2.0.0 the substrate's
 * default palette IS showcase and this site's skin applies with no attribute, so the switch now selects
 * the OTHER looks: `?palette=oxide` (the site as it was before the skin) or `?palette=maid`, remembered in
 * this browser; `?palette=showcase` or `?palette=default` returns to the default and forgets. No visible
 * control is added. Storage can throw (private windows, blocked site data): the choice then lasts only for
 * that page load.
 */
const OTHERS = ['oxide', 'maid'] as const;
const KEY = 'portfolio-palette';
const isOther = (v: string | null): v is (typeof OTHERS)[number] =>
  v !== null && (OTHERS as readonly string[]).includes(v);

export function bootSkin(search: string = window.location.search): string | null {
  const asked = new URLSearchParams(search).get('palette');
  let palette: string | null = null;
  try {
    if (asked === 'default' || asked === 'showcase') localStorage.removeItem(KEY);
    else if (isOther(asked)) localStorage.setItem(KEY, asked);
    palette = localStorage.getItem(KEY);
  } catch {
    palette = isOther(asked) ? asked : null;
  }
  if (isOther(palette)) {
    document.documentElement.dataset.palette = palette;
    return palette;
  }
  delete document.documentElement.dataset.palette;
  return null;
}

// Made with my soul - Swately <3
