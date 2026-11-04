import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import Button from '../controls/Button';
import { mergeRefs } from '../mergeRefs';
import { placeMenu } from './placement';
import styles from './MenuButton.module.css';

// Platform probes, evaluated once. jsdom has neither; the pane's engine has both.
const POPOVER = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
const ANCHOR =
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('anchor-name: --phy-probe');

type MenuContextValue = { close: (returnFocus: boolean) => void };
const MenuContext = createContext<MenuContextValue | null>(null);

const ITEMS = '[role="menuitem"]';
const items = (menu: HTMLElement) => [...menu.querySelectorAll<HTMLElement>(ITEMS)];

type MenuButtonProps = {
  /** The button's visible text — also the menu's accessible name. */
  label: ReactNode;
  variant?: 'primary' | 'secondary';
  /** C3 pair. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `MenuItem`s. */
  children: ReactNode;
} & Omit<ComponentProps<'button'>, 'children' | 'onClick'>;

/**
 * APG menu button. The menu is a `popover="auto"`: the platform owns the top
 * layer (never clipped by the scroll region it opens from), light dismiss and
 * Escape; the `toggle` event reports a native close so React's state follows
 * and focus returns to the button. Positioned by CSS anchor positioning where
 * the engine has it, by `placeMenu` otherwise — the same flip rule.
 * Keyboard: Enter / Space / ArrowDown open on the first item, ArrowUp on the
 * last; Up / Down wrap; Home / End; a printable character jumps to the next
 * item starting with it; Escape closes and returns focus; Tab closes.
 * Items that are links belong in a `nav`, not a menu (role conflict).
 */
export default function MenuButton({
  label,
  variant,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  ref: userRef,
  ...rest
}: MenuButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<'first' | 'last' | null>(null);
  const [own, setOwn] = useState(defaultOpen);
  const isOpen = open ?? own;
  const id = useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const anchorName = `--phy-anchor-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const setOpen = (next: boolean) => {
    if (open === undefined) setOwn(next);
    onOpenChange?.(next);
  };
  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) btnRef.current?.focus();
  };
  const openWith = (where: 'first' | 'last') => {
    pendingFocus.current = where;
    setOpen(true);
  };

  // STATE drives the DOM (the Dialog's rule): show/hide, position on the JS
  // path, then focus the requested item.
  useEffect(() => {
    const menu = menuRef.current;
    const btn = btnRef.current;
    if (!menu || !btn) return;
    if (isOpen) {
      if (POPOVER) {
        if (!menu.matches(':popover-open')) menu.showPopover();
      } else {
        menu.hidden = false;
      }
      if (!ANCHOR) {
        const a = btn.getBoundingClientRect();
        const m = menu.getBoundingClientRect();
        const p = placeMenu(
          a,
          { width: m.width, height: m.height },
          { width: window.innerWidth, height: window.innerHeight },
        );
        menu.style.top = `${p.top}px`;
        menu.style.left = `${p.left}px`;
      }
      const list = items(menu);
      const target = pendingFocus.current === 'last' ? list[list.length - 1] : list[0];
      target?.focus();
      pendingFocus.current = null;
    } else if (POPOVER) {
      if (menu.matches(':popover-open')) menu.hidePopover();
    } else {
      menu.hidden = true;
    }
  }, [isOpen]);

  // The popover attribute is set only where the API exists: on the fallback path
  // (jsdom, old engines) the element is a plain div toggled by `hidden`, so a UA
  // popover stylesheet cannot keep it display:none. tabIndex -1 on the container
  // is the APG shape (items carry the roving focus) and what the a11y lint asks.
  // A native close (light dismiss, Escape) is reported by the platform.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !POPOVER) return;
    const onToggle = (e: Event) => {
      const state = (e as ToggleEvent).newState;
      if (state === 'closed' && isOpen) {
        const active = document.activeElement;
        const adrift = !active || active === document.body || menu.contains(active);
        close(adrift);
      }
    };
    menu.addEventListener('toggle', onToggle);
    return () => menu.removeEventListener('toggle', onToggle);
  });

  const onButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openWith('first');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openWith('last');
    }
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const menu = e.currentTarget;
    const list = items(menu);
    const i = list.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => {
      e.preventDefault();
      list[(n + list.length) % list.length]?.focus();
    };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(list.length - 1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') {
      close(false);
    } else if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      const ch = e.key.toLowerCase();
      const order = [...list.slice(i + 1), ...list.slice(0, i + 1)];
      const hit = order.find((el) => (el.textContent ?? '').trim().toLowerCase().startsWith(ch));
      if (hit) {
        e.preventDefault();
        hit.focus();
      }
    }
  };

  return (
    <span className={styles.host} style={{ '--phy-anchor': anchorName }}>
      <Button
        {...rest}
        ref={mergeRefs(btnRef, userRef)}
        id={buttonId}
        variant={variant}
        className={[styles.trigger, className].filter(Boolean).join(' ')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => (isOpen ? close(false) : openWith('first'))}
        onKeyDown={onButtonKey}
      >
        {label}
      </Button>
      <MenuContext.Provider value={{ close }}>
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          tabIndex={-1}
          aria-labelledby={buttonId}
          popover={POPOVER ? 'auto' : undefined}
          hidden={POPOVER ? undefined : !isOpen}
          className={styles.menu}
          onKeyDown={onMenuKey}
        >
          {children}
        </div>
      </MenuContext.Provider>
    </span>
  );
}

type MenuItemProps = {
  onSelect?: () => void;
  disabled?: boolean;
  children: ReactNode;
} & Omit<ComponentProps<'button'>, 'onClick' | 'disabled' | 'children'>;

/** One action in a menu. Disabled items stay focusable (`aria-disabled`), as the APG asks. */
export function MenuItem({
  onSelect,
  disabled = false,
  children,
  className,
  ...rest
}: MenuItemProps) {
  const ctx = useContext(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      className={[styles.item, className].filter(Boolean).join(' ')}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        ctx?.close(true);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

// Made with my soul - Swately <3
