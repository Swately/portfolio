import { describe, it, expect, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import {
  setTypeScale,
  setTypeTheme,
  useTypeSettings,
  TYPE_BOOT_SCRIPT,
  TYPE_CHANGE_EVENT,
} from './typeSettings';
import Text from '../text/Text';

const html = document.documentElement;

function Probe() {
  const { theme, scale } = useTypeSettings();
  return (
    <p>
      {theme}:{scale}
    </p>
  );
}

describe('type settings (1.4.0)', () => {
  beforeEach(() => {
    localStorage.clear();
    delete html.dataset.type;
    html.style.removeProperty('--phy-type-scale');
  });

  it('defaults to editorial at 1, with no attribute and no property', () => {
    render(<Probe />);
    expect(screen.getByText('editorial:1')).toBeInTheDocument();
    expect(html.dataset.type).toBeUndefined();
  });

  it('a theme writes the attribute and storage; editorial removes both', () => {
    render(<Probe />);
    act(() => setTypeTheme('technical'));
    expect(html.dataset.type).toBe('technical');
    expect(localStorage.getItem('phy-type')).toBe('technical');
    expect(screen.getByText('technical:1')).toBeInTheDocument();
    act(() => setTypeTheme('editorial'));
    expect(html.dataset.type).toBeUndefined();
    expect(localStorage.getItem('phy-type')).toBeNull();
  });

  it('the scale is clamped to 0.875 - 1.5 and written on <html>; 1 removes it', () => {
    render(<Probe />);
    act(() => setTypeScale(3));
    expect(html.style.getPropertyValue('--phy-type-scale')).toBe('1.5');
    expect(screen.getByText('editorial:1.5')).toBeInTheDocument();
    act(() => setTypeScale(0.5));
    expect(html.style.getPropertyValue('--phy-type-scale')).toBe('0.875');
    act(() => setTypeScale(1));
    expect(html.style.getPropertyValue('--phy-type-scale')).toBe('');
    expect(localStorage.getItem('phy-type-scale')).toBeNull();
  });

  it('the boot script restores stored choices and ignores unknown or out-of-range ones', () => {
    localStorage.setItem('phy-type', 'neutral');
    localStorage.setItem('phy-type-scale', '1.25');
    new Function(TYPE_BOOT_SCRIPT)();
    expect(html.dataset.type).toBe('neutral');
    expect(html.style.getPropertyValue('--phy-type-scale')).toBe('1.25');
    delete html.dataset.type;
    html.style.removeProperty('--phy-type-scale');
    localStorage.setItem('phy-type', 'comic');
    localStorage.setItem('phy-type-scale', '9');
    new Function(TYPE_BOOT_SCRIPT)();
    expect(html.dataset.type).toBeUndefined();
    expect(html.style.getPropertyValue('--phy-type-scale')).toBe('');
  });

  it('announces every change on document', () => {
    let n = 0;
    const on = () => n++;
    document.addEventListener(TYPE_CHANGE_EVENT, on);
    setTypeTheme('neutral');
    setTypeScale(1.25);
    document.removeEventListener(TYPE_CHANGE_EVENT, on);
    expect(n).toBe(2);
  });
});

describe('Text face (1.4.0)', () => {
  it('sets the role on the element only when asked; mono is face="mono"', () => {
    render(
      <>
        <Text>cuerpo</Text>
        <Text face="display" size="4xl">
          portada
        </Text>
        <Text mono>código</Text>
      </>,
    );
    expect(screen.getByText('cuerpo').style.getPropertyValue('--text-face')).toBe('');
    expect(screen.getByText('portada').style.getPropertyValue('--text-face')).toBe(
      'var(--phy-font-display)',
    );
    expect(screen.getByText('portada').style.getPropertyValue('--text-size')).toBe(
      'var(--phy-text-4xl)',
    );
    expect(screen.getByText('código').style.getPropertyValue('--text-face')).toBe(
      'var(--phy-font-mono)',
    );
  });
});

// Made with my soul - Swately <3
