import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Figure from './Figure';

describe('Figure ratio (0.18.0)', () => {
  it('reserves an aspect-ratio box around the media when ratio is given', () => {
    render(
      <Figure caption="c" ratio="16 / 9" data-testid="f">
        <img alt="" src="x.png" />
      </Figure>,
    );
    const img = screen.getByRole('presentation');
    const box = img.parentElement as HTMLElement;
    expect(box.tagName).toBe('DIV');
    expect(box.style.aspectRatio).toBe('16 / 9');
    expect(screen.getByTestId('f').tagName).toBe('FIGURE');
  });

  it("adds no wrapper without ratio (the media is the figure's direct child)", () => {
    render(
      <Figure caption="c">
        <img alt="" src="x.png" />
      </Figure>,
    );
    expect(screen.getByRole('presentation').parentElement?.tagName).toBe('FIGURE');
  });
});

// Made with my soul - Swately <3
