import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import {
  THEME_BOOT_SCRIPT,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  setColorScheme,
} from './colorScheme';

// jsdom has no matchMedia; a minimal one that reports "light" is enough here.
beforeEach(() => {
  window.matchMedia = (() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});

const labels = { system: 'Sistema', light: 'Claro', dark: 'Oscuro' };

describe('colour scheme', () => {
  it('cycles system -> light -> dark -> system, writing the attribute and storage', () => {
    render(<ThemeToggle labels={labels} prefix="Tema" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('Tema: Sistema (claro)');
    fireEvent.click(btn);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(btn).toHaveTextContent('Tema: Claro');
    fireEvent.click(btn);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(btn).toHaveTextContent('Tema: Oscuro');
    fireEvent.click(btn);
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('boot script restores the stored choice before React runs', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    new Function(THEME_BOOT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe('dark');
    localStorage.setItem(THEME_STORAGE_KEY, 'junk');
    delete document.documentElement.dataset.theme;
    new Function(THEME_BOOT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it('announces every change on document (instruments re-measure without coupling)', () => {
    let fired = 0;
    const on = () => fired++;
    document.addEventListener(THEME_CHANGE_EVENT, on);
    setColorScheme('light');
    setColorScheme('system');
    document.removeEventListener(THEME_CHANGE_EVENT, on);
    expect(fired).toBe(2);
  });

  it('setColorScheme is the single write path (attribute + storage together)', () => {
    setColorScheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    setColorScheme('system');
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});

// Made with my soul - Swately <3
