import { describe, it, expect } from 'vitest';
import { summarizeLcp, summarizeCls, summarizeInp } from './useWebVitals';

// jsdom has no PerformanceObserver for these entry types: what can be proven
// here is the AGGREGATION, on synthetic entries shaped like the real ones. The
// observers themselves are the browser gate's job (S8.0 record in the changelog).
describe('web-vitals summarizers (the instrument, aggregation half)', () => {
  it('LCP takes the latest candidate, and is null with none', () => {
    expect(summarizeLcp([])).toBeNull();
    expect(summarizeLcp([{ startTime: 400 }, { startTime: 1200 }])).toBe(1200);
  });

  it('CLS sums shifts but ignores those with recent input', () => {
    expect(summarizeCls([])).toBe(0);
    expect(
      summarizeCls([
        { value: 0.05 },
        { value: 0.3, hadRecentInput: true },
        { value: 0.02, hadRecentInput: false },
      ]),
    ).toBeCloseTo(0.07, 6);
  });

  it('INP is the longest interaction and ignores non-interaction events', () => {
    expect(summarizeInp([{ duration: 900 }])).toBeNull();
    expect(
      summarizeInp([
        { interactionId: 1, duration: 40 },
        { duration: 500 },
        { interactionId: 2, duration: 120 },
      ]),
    ).toBe(120);
  });
});

// Made with my soul - Swately <3
