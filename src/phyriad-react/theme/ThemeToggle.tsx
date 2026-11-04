import type { ComponentProps } from 'react';
import Button from '../controls/Button';
import { setColorScheme, useColorScheme, type SchemePreference } from './colorScheme';

type ThemeToggleProps = {
  /** Copy as props — the substrate cannot know the site's language. */
  labels?: Record<SchemePreference, string>;
  /** Leading word, e.g. "Theme" / "Tema". */
  prefix?: string;
  /** Fired after the preference changed (the lab re-measures on it). */
  onChange?: (preference: SchemePreference) => void;
} & Omit<ComponentProps<typeof Button>, 'onClick' | 'children'>;

const ORDER: SchemePreference[] = ['system', 'light', 'dark'];

/**
 * One button that cycles system → light → dark. Its visible text IS its state
 * ("Tema: Sistema (oscuro)"), so no live region is needed: a screen reader
 * reads the new label on the next focus and the change was user-initiated.
 * A three-radio fieldset is the alternative when a settings page has room.
 */
export default function ThemeToggle({
  labels = { system: 'System', light: 'Light', dark: 'Dark' },
  prefix = 'Theme',
  onChange,
  ...rest
}: ThemeToggleProps) {
  const { preference, resolved } = useColorScheme();
  const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length]!;
  const state =
    preference === 'system'
      ? `${labels.system} (${labels[resolved].toLowerCase()})`
      : labels[preference];
  return (
    <Button
      {...rest}
      onClick={() => {
        setColorScheme(next);
        onChange?.(next);
      }}
    >
      {prefix}: {state}
    </Button>
  );
}

// Made with my soul - Swately <3
