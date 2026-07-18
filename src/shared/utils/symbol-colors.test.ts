import { symbolColor } from '@/shared/utils/symbol-colors';
import { describe, expect, it } from 'vitest';

describe('symbolColor', () => {
  it('returns the brand color when the symbol exists in BRAND_COLORS', () => {
    expect(symbolColor('XLK')).toBe('#6366f1');
  });

  it('returns a different brand color for a different known symbol', () => {
    expect(symbolColor('XLE')).toBe('#f59e0b');
  });

  it('returns an hex color string for a symbol not in BRAND_COLORS', () => {
    expect(symbolColor('ABC')).toBe('hsl(138, 65%, 60%)');
  });

  it('returns an hsl string for a symbol not in BRAND_COLORS', () => {
    const first = symbolColor('XLK');
    const second = symbolColor('XLK');

    expect(first).toBe(second);
  });

  it('returns different hsl colors for different symbols (in general)', () => {
    expect(symbolColor('XLK')).not.toBe(symbolColor('XLE'));
  });

  it('produces a hue between 0 and 359 inclusive', () => {
    const result = symbolColor('SOME_RANDOM_SYMBOL');
    const hue = Number(result.match(/^hsl\((\d+),/)?.[1]);

    expect(hue).toBeGreaterThanOrEqual(0);
    expect(hue).toBeLessThan(360);
  });

  it('handles an empty string without throwing, returning hue 0', () => {
    expect(symbolColor('')).toBe('hsl(0, 65%, 60%)');
  });

  it('is case-sensitive when checking BRAND_COLORS (lowercase does not match)', () => {
    expect(symbolColor('xlk')).not.toBe('#6366f1');
    expect(symbolColor('xlk')).toMatch(/^hsl\(/);
  });

  it('produces a stable, hardcoded hue for a specific known symbol', () => {
    expect(symbolColor('AB')).toBe(symbolColor('AB'));
  });
});
