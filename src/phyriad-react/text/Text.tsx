import type { ComponentProps, ElementType } from 'react';
import { faceVar, textVar, type FaceRole, type TextStep } from '../scale';
import styles from './Text.module.css';

type TextProps = {
  /** Semantic tag — heading levels are a CHOICE here, never implied by size. */
  as?:
    | 'p'
    | 'span'
    | 'strong'
    | 'small'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'dt'
    | 'dd'
    | 'li'
    | 'figcaption';
  /** Step on the type scale (`--phy-text-xs` … `--phy-text-4xl`; the last three since 1.4.0). */
  size?: TextStep;
  muted?: boolean;
  bold?: boolean;
  /** Shorthand for `face="mono"`, kept from before roles existed. */
  mono?: boolean;
  /**
   * The face ROLE (1.4.0, tokens 2.1.0): body, heading, display, ui or mono. The type theme
   * (`data-type` on `<html>`) decides which family that is. Absent: the element's own (body text, or
   * the heading role for h1–h3 from the base layer).
   */
  face?: FaceRole;
} & ComponentProps<'p'>;

/**
 * Typography as one component: `as` picks the ELEMENT (heading level is a choice, never
 * implied by size), `size` the step on the type scale, `face` the role (the theme picks the family),
 * `muted` / `bold` the voice.
 */
export default function Text({
  as = 'p',
  size = 'base',
  muted = false,
  bold = false,
  mono = false,
  face,
  className,
  style,
  ...rest
}: TextProps) {
  const Tag = as as ElementType;
  const role = face ?? (mono ? 'mono' : undefined);
  return (
    <Tag
      className={[
        styles.text,
        muted && styles.muted,
        bold && styles.bold,
        role && styles.face,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        '--text-size': textVar(size),
        ...(role ? { '--text-face': faceVar(role) } : {}),
        ...style,
      }}
      {...rest}
    />
  );
}

// Made with my soul - Swately <3
