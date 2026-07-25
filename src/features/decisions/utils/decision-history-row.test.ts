import { getMomentumColor } from '@/features/decisions/utils/decision-history-row';
import { describe, expect, it } from 'vitest';

describe('getMomentumColor', () => {
	it('returns default when value is undefined', () => {
		expect(getMomentumColor(undefined)).toBe('bg-white/10 text-white/60');
	});

	it('returns default when value is 0', () => {
		expect(getMomentumColor(0)).toBe('bg-white/10 text-white/60');
	});

	it('returns green for value > 0.7', () => {
		expect(getMomentumColor(0.8)).toBe('bg-green-500/20 text-green-300 border-green-500/30');
	});

	it('returns blue for value > 0.3 and <= 0.7', () => {
		expect(getMomentumColor(0.7)).toBe('bg-blue-500/20 text-blue-300 border-blue-500/30');

		expect(getMomentumColor(0.31)).toBe('bg-blue-500/20 text-blue-300 border-blue-500/30');
	});

	it('returns yellow for value > 0 and <= 0.3', () => {
		expect(getMomentumColor(0.3)).toBe('bg-yellow-500/20 text-yellow-300 border-yellow-500/30');

		expect(getMomentumColor(0.01)).toBe('bg-yellow-500/20 text-yellow-300 border-yellow-500/30');
	});

	it('returns red for value < 0', () => {
		expect(getMomentumColor(-0.1)).toBe('bg-red-500/20 text-red-300 border-red-500/30');
	});
});
