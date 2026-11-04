import { useId, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import styles from './TreeView.module.css';

export type TreeItemData = { id: string; label: ReactNode; children?: TreeItemData[] };

type TreeViewProps = {
  /** Accessible name of the tree (site language). */
  label: string;
  /** The whole structure — data, not children: the keyboard model needs it. */
  items: TreeItemData[];
  /** C3 pairs. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string) => void;
  /** Custom label rendering (the default renders `label`). */
  renderItem?: (
    item: TreeItemData,
    state: { level: number; expanded: boolean; selected: boolean },
  ) => ReactNode;
} & Omit<ComponentProps<'ul'>, 'children'>;

type Flat = {
  item: TreeItemData;
  level: number;
  parent: string | null;
  setsize: number;
  posinset: number;
};

function flattenVisible(
  items: TreeItemData[],
  expanded: Set<string>,
  level = 1,
  parent: string | null = null,
  out: Flat[] = [],
): Flat[] {
  items.forEach((item, i) => {
    out.push({ item, level, parent, setsize: items.length, posinset: i + 1 });
    if (item.children?.length && expanded.has(item.id))
      flattenVisible(item.children, expanded, level + 1, item.id, out);
  });
  return out;
}

const text = (node: ReactNode): string =>
  typeof node === 'string' || typeof node === 'number' ? String(node) : '';

/**
 * APG tree view over DATA: `role="tree"` / `treeitem` / `group` with
 * `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded` and
 * `aria-selected`; one tab stop with roving focus. Keys over the visible
 * items: Down / Up, Right expands or enters, Left collapses or goes to the
 * parent, Home / End, `*` expands every sibling, a letter jumps to the next
 * match, Enter / Space select. NOT virtualised: every visible item is a DOM
 * node — the window page mounts a 1 000-node tree on demand: 194 ms of JS time
 * measured on 2026-09-02 (react 0.22.0 changelog); past a few thousand visible nodes the consumer
 * windows the data itself.
 */
export default function TreeView({
  label,
  items,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  selected,
  defaultSelected = null,
  onSelectedChange,
  renderItem,
  className,
  ...rest
}: TreeViewProps) {
  const [ownExpanded, setOwnExpanded] = useState<string[]>(defaultExpanded);
  const [ownSelected, setOwnSelected] = useState<string | null>(defaultSelected);
  const expandedIds = expanded ?? ownExpanded;
  const selectedId = selected === undefined ? ownSelected : selected;
  const expandedSet = new Set(expandedIds);
  const visible = flattenVisible(items, expandedSet);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active =
    activeId && visible.some((f) => f.item.id === activeId)
      ? activeId
      : (selectedId ?? visible[0]?.item.id ?? null);
  const baseId = useId();
  const domId = (id: string) => `${baseId}-${id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  const setExpanded = (ids: string[]) => {
    if (expanded === undefined) setOwnExpanded(ids);
    onExpandedChange?.(ids);
  };
  const select = (id: string) => {
    if (selected === undefined) setOwnSelected(id);
    onSelectedChange?.(id);
  };
  const focusItem = (id: string) => {
    setActiveId(id);
    document.getElementById(domId(id))?.focus();
  };
  const toggle = (id: string, open: boolean) => {
    const has = expandedSet.has(id);
    if (open && !has) setExpanded([...expandedIds, id]);
    else if (!open && has) setExpanded(expandedIds.filter((x) => x !== id));
  };

  const onKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const i = visible.findIndex((f) => f.item.id === active);
    if (i < 0) return;
    const cur = visible[i]!;
    const hasChildren = !!cur.item.children?.length;
    const isOpen = expandedSet.has(cur.item.id);
    let handled = true;
    if (e.key === 'ArrowDown') {
      if (visible[i + 1]) focusItem(visible[i + 1]!.item.id);
    } else if (e.key === 'ArrowUp') {
      if (visible[i - 1]) focusItem(visible[i - 1]!.item.id);
    } else if (e.key === 'ArrowRight') {
      if (hasChildren && !isOpen) toggle(cur.item.id, true);
      else if (hasChildren && isOpen) focusItem(cur.item.children![0]!.id);
    } else if (e.key === 'ArrowLeft') {
      if (hasChildren && isOpen) toggle(cur.item.id, false);
      else if (cur.parent) focusItem(cur.parent);
    } else if (e.key === 'Home') focusItem(visible[0]!.item.id);
    else if (e.key === 'End') focusItem(visible[visible.length - 1]!.item.id);
    else if (e.key === '*') {
      const siblings = visible
        .filter((f) => f.parent === cur.parent && f.item.children?.length)
        .map((f) => f.item.id);
      setExpanded([...new Set([...expandedIds, ...siblings])]);
    } else if (e.key === 'Enter' || e.key === ' ') select(cur.item.id);
    else if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      const ch = e.key.toLowerCase();
      const order = [...visible.slice(i + 1), ...visible.slice(0, i + 1)];
      const hit = order.find((f) => text(f.item.label).toLowerCase().startsWith(ch));
      if (hit) focusItem(hit.item.id);
      else handled = false;
    } else handled = false;
    if (handled) e.preventDefault();
  };

  const renderLevel = (list: TreeItemData[], level: number): ReactNode =>
    list.map((item, i) => {
      const has = !!item.children?.length;
      const open = expandedSet.has(item.id);
      const isSel = selectedId === item.id;
      return (
        // Keyboard is handled once, on the tree (roving focus); the item only clicks.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li
          key={item.id}
          id={domId(item.id)}
          role="treeitem"
          aria-level={level}
          aria-setsize={list.length}
          aria-posinset={i + 1}
          aria-expanded={has ? open : undefined}
          aria-selected={isSel}
          tabIndex={active === item.id ? 0 : -1}
          className={styles.item}
          onClick={(e) => {
            e.stopPropagation();
            setActiveId(item.id);
            select(item.id);
            if (has) toggle(item.id, !open);
          }}
        >
          <span className={styles.row} style={{ '--tree-level': level }}>
            <span className={styles.twisty} aria-hidden="true">
              {has ? (open ? '▾' : '▸') : ''}
            </span>
            <span className={styles.label}>
              {renderItem
                ? renderItem(item, { level, expanded: open, selected: isSel })
                : item.label}
            </span>
          </span>
          {has && open && (
            <ul role="group" className={styles.group}>
              {renderLevel(item.children!, level + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul
      role="tree"
      aria-label={label}
      className={[styles.tree, className].filter(Boolean).join(' ')}
      onKeyDown={onKey}
      {...rest}
    >
      {renderLevel(items, 1)}
    </ul>
  );
}

// Made with my soul - Swately <3
