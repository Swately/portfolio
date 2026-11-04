import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import styles from './Tabs.module.css';

type Activation = 'automatic' | 'manual';
type Orientation = 'horizontal' | 'vertical';
type Ctx = {
  value: string;
  select: (v: string) => void;
  activation: Activation;
  orientation: Orientation;
  overflow: 'wrap' | 'scroll';
  label: string;
  baseId: string;
};
const TabsContext = createContext<Ctx | null>(null);
const useTabs = () => {
  const c = useContext(TabsContext);
  if (!c) throw new Error('Tab, TabList and TabPanel must be inside <Tabs>');
  return c;
};
const slug = (v: string) => v.replace(/[^a-zA-Z0-9_-]/g, '-');

type TabsProps = {
  /** Accessible name of the tab list (site language). */
  label: string;
  /** C3 pair. One of them is needed: a tab list with nothing selected has no tab stop. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `automatic` (default): arrows move AND select. `manual`: arrows move, Enter/Space selects. */
  activation?: Activation;
  orientation?: Orientation;
  /** `wrap` (default): every tab visible. `scroll`: one row on `.phy-scroll-x` for dense windows. */
  overflow?: 'wrap' | 'scroll';
  children: ReactNode;
} & Omit<ComponentProps<'div'>, 'children'>;

/**
 * APG tabs as a family sharing state through a context scoped to it: `Tabs`
 * (state), `TabList` (roving tabindex + keyboard), `Tab`, `TabPanel`. Panels
 * are ALWAYS mounted and merely `hidden` when inactive, so what a user typed
 * in one survives a switch (WINDOW_ROSTER C3). Every panel is `tabindex="0"`
 * (the APG nuance "only when it has no focusable content" simplified, stated).
 * Deep-linking (URL hash ↔ tab) is the consumer's: drive `value` from the router.
 */
export default function Tabs({
  label,
  value,
  defaultValue,
  onValueChange,
  activation = 'automatic',
  orientation = 'horizontal',
  overflow = 'wrap',
  children,
  className,
  ...rest
}: TabsProps) {
  const [own, setOwn] = useState(defaultValue ?? '');
  const current = value ?? own;
  if (import.meta.env.DEV && current === '') {
    console.warn(
      '[Tabs] no value and no defaultValue: no tab is selected, so the tab list has no tab stop.',
    );
  }
  const select = (v: string) => {
    if (value === undefined) setOwn(v);
    onValueChange?.(v);
  };
  const baseId = useId();
  return (
    <TabsContext.Provider
      value={{ value: current, select, activation, orientation, overflow, label, baseId }}
    >
      <div
        className={[styles.tabs, className].filter(Boolean).join(' ')}
        data-orientation={orientation}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * The `tablist`: roving tabindex and the arrow / Home / End keys over its `Tab`s; named by
 * the `label` of the enclosing `Tabs`. `overflow="scroll"` on `Tabs` puts it on `.phy-scroll-x`.
 */
export function TabList({ children, className, ...rest }: ComponentProps<'div'>) {
  const { label, orientation, overflow, activation, select } = useTabs();
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = [...e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')];
    const i = tabs.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const prev = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    let n = -1;
    if (e.key === next) n = (i + 1) % tabs.length;
    else if (e.key === prev) n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault();
    const target = tabs[n]!;
    target.focus();
    if (activation === 'automatic') select(target.dataset.value ?? '');
  };
  return (
    <div
      role="tablist"
      tabIndex={-1}
      aria-label={label}
      aria-orientation={orientation}
      className={[styles.list, overflow === 'scroll' ? 'phy-scroll-x' : '', className]
        .filter(Boolean)
        .join(' ')}
      data-overflow={overflow}
      onKeyDown={onKey}
      {...rest}
    >
      {children}
    </div>
  );
}

type TabProps = { value: string; children: ReactNode } & Omit<
  ComponentProps<'button'>,
  'value' | 'children'
>;

/**
 * One tab: `role="tab"`, selected when its `value` is the current one, ids bound to its panel.
 */
export function Tab({ value, children, className, ...rest }: TabProps) {
  const { value: current, select, baseId } = useTabs();
  const selected = current === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${slug(value)}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${slug(value)}`}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      className={[styles.tab, className].filter(Boolean).join(' ')}
      onClick={() => select(value)}
      {...rest}
    >
      {children}
    </button>
  );
}

type TabPanelProps = { value: string; children: ReactNode } & Omit<
  ComponentProps<'div'>,
  'children'
>;

/**
 * One panel: `role="tabpanel"`, ALWAYS mounted, `hidden` unless its `value` is current, so
 * what a user typed inside survives a switch.
 */
export function TabPanel({ value, children, className, ...rest }: TabPanelProps) {
  const { value: current, baseId } = useTabs();
  const selected = current === value;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${slug(value)}`}
      aria-labelledby={`${baseId}-tab-${slug(value)}`}
      tabIndex={0}
      hidden={!selected}
      className={[styles.panel, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

// Made with my soul - Swately <3
