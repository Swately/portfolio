import { useSyncExternalStore, type ReactNode } from 'react';

/**
 * Notifications as STATE OUTSIDE REACT (the substrate's store pattern): any
 * code — an effect, a fetch callback, a keyboard handler — calls `toast()`;
 * one `Toaster` renders the stack. Contract (WINDOW_ROSTER S9.2): a dismiss
 * button always; NO auto-dismiss unless the caller opts in with `timeout`
 * (WCAG 2.2.1 timing); a timeout pauses while the pointer or focus is on the
 * stack; at most CAP toasts — the oldest goes silently, it was announced when
 * it arrived.
 */
export type ToastKind = 'info' | 'success' | 'error';
export type ToastInput = {
  title: ReactNode;
  body?: ReactNode;
  kind?: ToastKind;
  /** Milliseconds until auto-dismiss. Omit for a toast that waits to be dismissed. */
  timeout?: number;
  /** An optional control rendered beside the text (a Button, a Link). */
  action?: ReactNode;
};
export type Toast = Omit<ToastInput, 'kind'> & { id: number; kind: ToastKind };

/**
 * The most toasts shown at once; the oldest is dropped silently past it.
 */
export const TOAST_CAP = 5;

let seq = 0;
let list: Toast[] = [];
const listeners = new Set<() => void>();
type Timer = { remaining: number; startedAt: number; handle: ReturnType<typeof setTimeout> | null };
const timers = new Map<number, Timer>();

function emit() {
  for (const l of listeners) l();
}

function clearTimer(id: number) {
  const t = timers.get(id);
  if (t?.handle) clearTimeout(t.handle);
  timers.delete(id);
}

function startTimer(id: number, ms: number) {
  const handle = setTimeout(() => dismiss(id), ms);
  timers.set(id, { remaining: ms, startedAt: Date.now(), handle });
}

/** Show a toast; returns its id (for `dismiss`). */
export function toast(input: ToastInput): number {
  const id = ++seq;
  const t: Toast = { ...input, id, kind: input.kind ?? 'info' };
  list = [...list, t];
  while (list.length > TOAST_CAP) {
    clearTimer(list[0]!.id);
    list = list.slice(1);
  }
  if (t.timeout && t.timeout > 0) startTimer(id, t.timeout);
  emit();
  return id;
}

/**
 * Remove one toast by the id `toast()` returned. A no-op for an unknown id.
 */
export function dismiss(id: number): void {
  clearTimer(id);
  const next = list.filter((t) => t.id !== id);
  if (next.length !== list.length) {
    list = next;
    emit();
  }
}

/**
 * Remove every toast and clear every timeout (tests and route changes use it).
 */
export function dismissAll(): void {
  for (const t of list) clearTimer(t.id);
  if (list.length) {
    list = [];
    emit();
  }
}

/** Pause every running timeout (pointer or focus on the stack). */
export function pauseTimers(): void {
  for (const t of timers.values()) {
    if (t.handle) {
      clearTimeout(t.handle);
      t.remaining -= Date.now() - t.startedAt;
      t.handle = null;
    }
  }
}

/** Resume paused timeouts with the time they had left. */
export function resumeTimers(): void {
  for (const [id, t] of timers) {
    if (!t.handle) {
      t.startedAt = Date.now();
      t.handle = setTimeout(() => dismiss(id), Math.max(0, t.remaining));
    }
  }
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
const getSnapshot = () => list;
const EMPTY: Toast[] = [];
const getServerSnapshot = () => EMPTY;

/** The current stack, oldest first. */
export function useToasts(): Toast[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Made with my soul - Swately <3
