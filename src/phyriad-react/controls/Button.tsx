import type { ComponentProps } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  /**
   * `secondary` (default): hairline, the everyday action. `primary`: the ink
   * block — the strongest element on the page, so ideally ONE per view.
   */
  variant?: 'primary' | 'secondary';
} & ComponentProps<'button'>;

/**
 * A button acts; a link navigates. Under this design system the two also
 * differ by COLOUR SYSTEM, not just shape: links are oxide, buttons are ink
 * (direction «C · Tinta», chosen from three rendered candidates, 2026-08-29).
 * That is why there is deliberately NO `as`/`href` escape hatch here — a link
 * dressed as a button would un-say what the colour says.
 *
 * `type` defaults to `"button"`, not the platform's `"submit"`: any button
 * inside a form otherwise submits it silently, which is the classic footgun.
 * Submitting is the explicit case (`type="submit"`).
 *
 * Focus ring comes from the base layer's global `:focus-visible`; disabled
 * uses the native attribute (unfocusable, announced as dimmed — the standard
 * trade, accepted).
 */
export default function Button({
  variant = 'secondary',
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

// Made with my soul - Swately <3
