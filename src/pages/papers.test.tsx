import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import PapersPage from './PapersPage';
import { Router } from '../phyriad-react';
import { papers } from '../content/papers';

beforeAll(() => {
  window.history.replaceState(null, '', '/papers');
});

describe('the papers page (/papers)', () => {
  it('shows the four papers with both editions, the method and the limits, and passes axe', async () => {
    const { container } = render(
      <Router
        routes={[
          {
            path: '/papers',
            page: () => (
              <main>
                <PapersPage />
              </main>
            ),
          },
        ]}
        fallback={() => null}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Papers' })).toBeTruthy();
    for (const p of papers) {
      expect(screen.getByRole('heading', { level: 3, name: p.title })).toBeTruthy();
    }
    expect(screen.getAllByRole('link', { name: /PDF en español/ })).toHaveLength(papers.length);
    expect(screen.getAllByRole('link', { name: /PDF in English/ })).toHaveLength(papers.length);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Cómo se trabaja un paper' }),
    ).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Límites declarados' })).toBeTruthy();
    // ids are unique: several claim lists share the page
    const ids = [...container.querySelectorAll('[id]')].map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    const r = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual(
      [],
    );
  });
});
