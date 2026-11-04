/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex --
   APG window splitter: a FOCUSABLE separator with a value is the pattern; the
   lint treats every separator as decorative. */
import {
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import styles from './Splitter.module.css';

type SplitterProps = {
  /** Accessible name, e.g. "Ancho del menú" (site language). */
  label: string;
  /** Id of the panel whose size this separator controls. */
  controls?: string;
  /** A vertical bar resizes widths (default); a horizontal bar resizes heights. */
  orientation?: 'vertical' | 'horizontal';
  /** C3 pair, in PIXELS — the one unit a drag can compute. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (px: number) => void;
  min?: number;
  max?: number;
  /** Keyboard step in pixels. */
  step?: number;
  /**
   * Which side grows when the pointer moves towards the end: `start` (the
   * panel before the bar — dragging right widens it) or `end` (the panel after
   * it — dragging right narrows it).
   */
  side?: 'start' | 'end';
} & Omit<ComponentProps<'div'>, 'children'>;

/**
 * APG window splitter: `role="separator"` with a value, keyboard-resizable
 * (arrows by step, Home / End to the bounds, Enter toggles between the
 * minimum and the last size) and pointer-draggable (pointer capture; double
 * click resets). A hairline with a 24 px hit area (WCAG 2.5.8) that changes
 * nothing about layout: the consumer applies `value` wherever the size lives.
 * `WindowFrame` does that for its panels (`resizableStart` / `resizableEnd`).
 */
export default function Splitter({
  label,
  controls,
  orientation = 'vertical',
  value,
  defaultValue = 256,
  onValueChange,
  min = 120,
  max = 640,
  step = 16,
  side = 'start',
  className,
  ...rest
}: SplitterProps) {
  const [own, setOwn] = useState(defaultValue);
  const current = value ?? own;
  const last = useRef(current);
  const drag = useRef<{ start: number; origin: number } | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  const set = (n: number) => {
    const next = clamp(n);
    if (next === current) return;
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const grow = orientation === 'vertical' ? 'ArrowRight' : 'ArrowDown';
    const shrink = orientation === 'vertical' ? 'ArrowLeft' : 'ArrowUp';
    const dir = side === 'start' ? 1 : -1;
    if (e.key === grow) set(current + step * dir);
    else if (e.key === shrink) set(current - step * dir);
    else if (e.key === 'Home') set(min);
    else if (e.key === 'End') set(max);
    else if (e.key === 'Enter') {
      if (current > min) {
        last.current = current;
        set(min);
      } else set(last.current > min ? last.current : defaultValue);
    } else return;
    e.preventDefault();
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { start: orientation === 'vertical' ? e.clientX : e.clientY, origin: current };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    document.body.classList.add('phy-dragging');
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const pos = orientation === 'vertical' ? e.clientX : e.clientY;
    const delta = (pos - drag.current.start) * (side === 'start' ? 1 : -1);
    set(drag.current.origin + delta);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    document.body.classList.remove('phy-dragging');
  };

  return (
    <div
      role="separator"
      aria-label={label}
      aria-controls={controls}
      aria-orientation={orientation}
      aria-valuenow={current}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      className={[styles.splitter, styles[orientation], className].filter(Boolean).join(' ')}
      onKeyDown={onKey}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => set(defaultValue)}
      {...rest}
    />
  );
}

// Made with my soul - Swately <3
