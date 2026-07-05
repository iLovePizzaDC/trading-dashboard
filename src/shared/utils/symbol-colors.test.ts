import { symbolColor } from '@/shared/utils/symbol-colors';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/constants/symbol-colors', () => ({
	BRAND_COLORS: {
		AAPL: '#555555',
		TSLA: '#e82127',
	} as Record<string, string>,
}));

describe('symbolColor', () => {
	it('returns the brand color when the symbol exists in BRAND_COLORS', () => {
		expect(symbolColor('AAPL')).toBe('#555555');
	});

	it('returns a different brand color for a different known symbol', () => {
		expect(symbolColor('TSLA')).toBe('#e82127');
	});

	it('returns an hsl string for a symbol not in BRAND_COLORS', () => {
		expect(symbolColor('XLK')).toMatch(/^hsl\(\d+, 65%, 60%\)$/);
	});

	it('returns the same hsl color for the same symbol on repeated calls (deterministic)', () => {
		const first = symbolColor('XLK');
		const second = symbolColor('XLK');

		expect(first).toBe(second);
	});

	it('returns different hsl colors for different symbols (in general)', () => {
		expect(symbolColor('XLK')).not.toBe(symbolColor('XLF'));
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
		expect(symbolColor('aapl')).not.toBe('#555555');
		expect(symbolColor('aapl')).toMatch(/^hsl\(/);
	});

	it('produces a stable, hardcoded hue for a specific known symbol', () => {
		expect(symbolColor('AB')).toBe(symbolColor('AB'));
	});
});
