// The scale vocabulary, shared by every primitive.
//
// These names ARE the substrate's token names. Until now the primitives took a
// numeric step (gap="m") that a project-level alias layer translated into the
// substrate's named scale — two vocabularies for one scale, which is why the
// values in components ended up chosen by eye (14 uses of `2`, 8 of `3`, and
// stray 6s and 7s with no pattern) instead of by what they mean.
//
// A name carries its relationship; a number does not.

export type SpaceStep = '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';

/**
 * A space PAIR interpolates across two steps (tokens 0.9.0): `l-xl` is `l` at 320 px
 * and `xl` at 1280 px, with no breakpoint in between. Only `xl-2xl` and `2xl-3xl`
 * keep the between/within rule (≥ 2 × m) at the narrow end — the smaller pairs are
 * for rhythm WITHIN a group, not between groups.
 */
export type SpacePair = 's-m' | 'm-l' | 'l-xl' | 'xl-2xl' | '2xl-3xl';

export type TextStep = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

/**
 * A face ROLE (tokens 2.1.0): which family a type theme puts there is the theme's business —
 * `editorial` (the default) fills body, heading and display with the serif.
 */
export type FaceRole = 'body' | 'heading' | 'display' | 'ui' | 'mono';

/**
 * The CSS custom property for a space step or pair: `spaceVar('m')` → `var(--phy-space-m)`.
 * The one place the token naming is spelled; primitives call it, consumers may too.
 */
export const spaceVar = (step: SpaceStep | SpacePair): string => `var(--phy-space-${step})`;

/**
 * The CSS custom property for a type step: `textVar('lg')` → `var(--phy-text-lg)`.
 */
export const textVar = (step: TextStep): string => `var(--phy-text-${step})`;

/**
 * The CSS custom property for a face role: `faceVar('heading')` → `var(--phy-font-heading)`.
 */
export const faceVar = (role: FaceRole): string => `var(--phy-font-${role})`;

// Made with my soul - Swately <3
