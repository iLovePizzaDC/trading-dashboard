import { getMonthCellColor } from '@/features/equity/utils/month-cell';
import { describe, expect, it } from 'vitest';

describe('getMonthCellColor', () => {
	it('returns the strongest green at exactly 8', () => {
		expect(getMonthCellColor(8)).toBe('bg-green-500/50');
	});

	it('returns the strongest green above 8', () => {
		expect(getMonthCellColor(15)).toBe('bg-green-500/50');
	});

	it('returns the second green just below 8', () => {
		expect(getMonthCellColor(7.99)).toBe('bg-green-500/40');
	});

	it('returns the second green at exactly 4', () => {
		expect(getMonthCellColor(4)).toBe('bg-green-500/40');
	});

	it('returns the third green just below 4', () => {
		expect(getMonthCellColor(3.99)).toBe('bg-green-500/30');
	});

	it('returns the third green at exactly 2', () => {
		expect(getMonthCellColor(2)).toBe('bg-green-500/30');
	});

	it('returns the weakest green just below 2', () => {
		expect(getMonthCellColor(1.99)).toBe('bg-green-500/20');
	});

	it('returns the weakest green at exactly 0', () => {
		expect(getMonthCellColor(0)).toBe('bg-green-500/20');
	});

	it('returns the weakest red just below 0', () => {
		expect(getMonthCellColor(-0.01)).toBe('bg-red-500/20');
	});

	it('returns the weakest red at exactly -2', () => {
		expect(getMonthCellColor(-2)).toBe('bg-red-500/20');
	});

	it('returns the second red just below -2', () => {
		expect(getMonthCellColor(-2.01)).toBe('bg-red-500/30');
	});

	it('returns the second red at exactly -4', () => {
		expect(getMonthCellColor(-4)).toBe('bg-red-500/30');
	});

	it('returns the third red just below -4', () => {
		expect(getMonthCellColor(-4.01)).toBe('bg-red-500/40');
	});

	it('returns the third red at exactly -8', () => {
		expect(getMonthCellColor(-8)).toBe('bg-red-500/40');
	});

	it('returns the strongest red just below -8', () => {
		expect(getMonthCellColor(-8.01)).toBe('bg-red-500/50');
	});

	it('returns the strongest red far below -8', () => {
		expect(getMonthCellColor(-50)).toBe('bg-red-500/50');
	});
});
