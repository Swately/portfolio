import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { placeMenu } from './placement';
import styles from './Tooltip.module.css';

const POPOVER = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
const ANCHOR =
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('anchor-name: --phy-probe');

type TooltipProps = {
  /** The tip. NEVER essential information: touch has no hover and a tooltip is not a label. */
  content: ReactNode;
  /** Hover delay in ms; focus opens at once. */
  delay?: number;
  /** The trigger: ONE focusable element (a Button, a link). */
  children: ReactElement<Record<string, unknown>>;
};

type Handlers = { className?: string; 'aria-describedby'?: string };

/**
 * APG tooltip: opens on hover (after `delay`) and on focus (at once), closes on
 * leave, blur and Escape; the trigger gets `aria-describedby`. The tip is a
 * `popover="manual"` in the top layer — the trigger owns its lifecycle, no
 * light dismiss — positioned ABOVE the trigger by anchor CSS or by `placeMenu`
 * with `prefer: 'block-start'`. The child IS the trigger and must be focusable:
 * a hover-only tooltip is invisible to keyboards and touch (DEV warns).
 */
export default function Tooltip({ content, delay = 300, children }: TooltipProps) {
  const id = useId();
  const tipId = `${id}-tip`;
  const anchorName = `--phy-anchor-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setOpen(true);
  };
  const showSoon = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(show, delay);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setOpen(false);
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    const tip = tipRef.current;
    const host = hostRef.current;
    if (!tip || !host) return;
    if (open) {
      if (POPOVER) {
        if (!tip.matches(':popover-open')) tip.showPopover();
      } else tip.hidden = false;
      if (!ANCHOR) {
        const trigger = (host.firstElementChild ?? host).getBoundingClientRect();
        const m = tip.getBoundingClientRect();
        const p = placeMenu(
          trigger,
          { width: m.width, height: m.height },
          { width: window.innerWidth, height: window.innerHeight },
          6,
          'block-start',
        );
        tip.style.top = `${p.top}px`;
        tip.style.left = `${p.left}px`;
      }
    } else if (POPOVER) {
      if (tip.matches(':popover-open')) tip.hidePopover();
    } else tip.hidden = true;
  }, [open]);

  const child = Children.only(children);
  if (!isValidElement(child)) return null;
  const props = child.props as Handlers;
  if (
    import.meta.env.DEV &&
    typeof child.type === 'string' &&
    !['button', 'a', 'input', 'select', 'textarea'].includes(child.type)
  ) {
    console.warn(
      '[Tooltip] the trigger should be a focusable element; a hover-only tooltip is invisible to keyboards and touch.',
    );
  }
  // The child gets only static props (its description and the anchor class).
  // The listeners live on the host span, where hover, focus and keys from the
  // trigger arrive by bubbling — and where react-hooks/refs is content, because
  // no ref-closing function is passed to a call during render.
  const trigger = cloneElement(child, {
    className: [props.className, styles.trigger].filter(Boolean).join(' '),
    'aria-describedby': [props['aria-describedby'], tipId].filter(Boolean).join(' '),
  } as Handlers);

  return (
    // The host is a passive wrapper: the interactive element is the CHILD, whose
    // hover, focus and keys reach these listeners by bubbling. The rule cannot
    // see delegation.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      ref={hostRef}
      className={styles.host}
      style={{ '--phy-anchor': anchorName }}
      onMouseEnter={showSoon}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      {trigger}
      <div
        ref={tipRef}
        id={tipId}
        role="tooltip"
        popover={POPOVER ? 'manual' : undefined}
        hidden={POPOVER ? undefined : !open}
        className={styles.tip}
      >
        {content}
      </div>
    </span>
  );
}

// Made with my soul - Swately <3
