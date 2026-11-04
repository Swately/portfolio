import { useCallback, useEffect, useId, useRef, type ComponentProps, type ReactNode } from 'react';
import { mergeRefs } from '../mergeRefs';
import Button from '../controls/Button';
import styles from './Dialog.module.css';

type DialogProps = {
  open: boolean;
  /**
   * Fired by the native `close` event — so Escape, the close button and any
   * form with `method="dialog"` all converge on ONE path. The parent sets
   * `open` to false here; the component never owns the state.
   */
  onClose: () => void;
  /** Labels the dialog (aria-labelledby). */
  title: ReactNode;
  /** Copy as props — the substrate cannot know the site's language. */
  closeLabel?: string;
  /** Footer slot, typically Buttons. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<'dialog'>, 'open' | 'title' | 'children' | 'onClose' | 'className'>;

/**
 * A modal over the native `<dialog>` + `showModal()` — the platform ships
 * what used to be the tar pit: modality (the page goes inert), Escape, and
 * initial focus (first focusable; override with `autoFocus` on the control
 * you mean). What the author still owes, this component pays:
 *
 * - **focus restore on close** — saved before `showModal`, restored after,
 *   because MDN does not guarantee the browser does it;
 * - **an explicit close button** — devices without a keyboard have no Escape;
 * - **body scroll lock** while open — native dialog does not lock it;
 * - **labelling** — `aria-labelledby` to the title;
 * - the **backdrop**: an ink veil (`--phy-ink` at 35%), no blur — the frosted
 *   glass is the template signature. Custom properties reach `::backdrop`
 *   only in modern engines (~2024+); verified live, noted as the boundary.
 */
export default function Dialog({
  open,
  onClose,
  title,
  closeLabel = 'Close',
  actions,
  children,
  className,
  ref: userRef,
  ...rest
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const restoreTo = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  // The latest onClose, kept in a ref for the native listener — written in an
  // effect, never during render (react-hooks/refs; 0.14.0 shipped this
  // assignment inline and its lint failure went unread — corrected here).
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Everything a close must leave behind, idempotent so two paths can both
  // call it: the scroll lock released, focus back where it came from — but
  // only if focus is still on the dialog or has fallen to <body>; a user who
  // already moved on is not yanked back. Reads refs only when CALLED (from
  // effects and the listener), which is the rule's line.
  const finishClose = useCallback(() => {
    document.body.style.overflow = '';
    const target = restoreTo.current;
    const active = document.activeElement;
    const focusIsAdrift = !active || active === document.body || ref.current?.contains(active);
    if (focusIsAdrift && target instanceof HTMLElement && document.contains(target)) target.focus();
  }, []);

  // STATE drives the DOM, never the reverse. The close button calls `onClose`
  // directly (below); the parent flips `open`; this effect closes the element
  // and finishes. The native `close` listener covers PLATFORM-initiated closes
  // (Escape, a method="dialog" form) by reporting them into the same `onClose`.
  // Measured before this shape: a model that only learned about closes from
  // the event desynced (state open, DOM closed, scroll locked) the moment the
  // event did not arrive — a hidden document defers it.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      restoreTo.current = document.activeElement;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!open) {
      if (dialog.open) dialog.close();
      finishClose();
    }
  }, [open, finishClose]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onNativeClose = () => {
      finishClose();
      onCloseRef.current();
    };
    dialog.addEventListener('close', onNativeClose);
    return () => dialog.removeEventListener('close', onNativeClose);
  }, [finishClose]);

  // Unmounting while open (route change under a modal) must not leave the
  // page unscrollable forever.
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <dialog
      ref={mergeRefs(ref, userRef)}
      {...rest}
      aria-labelledby={titleId}
      className={[styles.dialog, className].filter(Boolean).join(' ')}
    >
      <div className={styles.frame}>
        <header className={styles.header}>
          <p id={titleId} className={styles.title}>
            {title}
          </p>
          <Button onClick={() => onClose()}>{closeLabel}</Button>
        </header>
        <div className={styles.body}>{children}</div>
        {actions && <footer className={styles.actions}>{actions}</footer>}
      </div>
    </dialog>
  );
}

// Made with my soul - Swately <3
