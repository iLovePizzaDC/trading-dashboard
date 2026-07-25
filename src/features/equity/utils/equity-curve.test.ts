import type { ChartPoint } from '@/features/equity/types/equity';
import {
	applyRangeAndMode,
	findRebalanceIndexes,
	normalizeToRelative,
} from '@/features/equity/utils/equity-curve';
import type { Range } from '@/shared/constants/date-range';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { EquityPoint } from '@/shared/types/equity';
import { cutoffDate } from '@/shared/utils/date-range';
import { DateTime } from 'luxon';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/date-range', () => ({
	cutoffDate: vi.fn(),
}));

function buildEquityPoint(overrides: Partial<EquityPoint> = {}): EquityPoint {
	return { date: '2026-01-01', equity: 100, spy: null, ...overrides } as EquityPoint;
}

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
	return { date: '2026-01-01', candidates: [], ...overrides } as DecisionEntry;
}

describe('normalizeToRelative', () => {
	it('returns an empty array when data is empty', () => {
		expect(normalizeToRelative([], true)).toEqual([]);
	});

	it('keeps raw equity values when relative is false', () => {
		const data = [buildEquityPoint({ equity: 100 }), buildEquityPoint({ equity: 150 })];

		const result = normalizeToRelative(data, false);

		expect(result.map((d) => d.equity)).toEqual([100, 150]);
	});

	it('normalizes equity to a base of 100 when relative is true', () => {
		const data = [
			buildEquityPoint({ equity: 200 }),
			buildEquityPoint({ equity: 250 }),
			buildEquityPoint({ equity: 100 }),
		];

		const result = normalizeToRelative(data, true);

		expect(result.map((d) => d.equity)).toEqual([100, 125, 50]);
	});

	it('normalizes spy to a base of 100 using the first non-null spy value when relative is true', () => {
		const data = [
			buildEquityPoint({ equity: 100, spy: null }),
			buildEquityPoint({ equity: 100, spy: 200 }),
			buildEquityPoint({ equity: 100, spy: 250 }),
		];

		const result = normalizeToRelative(data, true);

		expect(result.map((d) => d.spy)).toEqual([null, 100, 125]);
	});

	it('keeps spy as null for points with no spy value', () => {
		const data = [buildEquityPoint({ spy: 200 }), buildEquityPoint({ spy: null })];

		const result = normalizeToRelative(data, true);

		expect(result[1].spy).toBeNull();
	});

	it('passes through the raw spy value when relative is false', () => {
		const data = [buildEquityPoint({ spy: 200 }), buildEquityPoint({ spy: 210 })];

		const result = normalizeToRelative(data, false);

		expect(result.map((d) => d.spy)).toEqual([200, 210]);
	});

	it('falls back to the raw spy value when relative is true but no spy data exists anywhere', () => {
		const data = [buildEquityPoint({ spy: null }), buildEquityPoint({ spy: null })];

		const result = normalizeToRelative(data, true);

		expect(result.map((d) => d.spy)).toEqual([null, null]);
	});

	it('preserves the date for each point', () => {
		const data = [buildEquityPoint({ date: '2026-03-01' })];

		const result = normalizeToRelative(data, true);

		expect(result[0].date).toBe('2026-03-01');
	});
});

describe('applyRangeAndMode', () => {
	beforeEach(() => {
		vi.mocked(cutoffDate).mockReset();
	});

	describe('range filtering (shared by both modes)', () => {
		it('returns all chart data unfiltered when cutoffDate returns null', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const chartData: ChartPoint[] = [
				{ date: '2020-01-01', equity: 100, spy: null },
				{ date: '2026-01-01', equity: 150, spy: null },
			];

			const result = applyRangeAndMode(chartData, 'ALL' as Range, 'zoom', true, []);

			expect(result).toHaveLength(2);
		});

		it('excludes points before the cutoff date', () => {
			vi.mocked(cutoffDate).mockReturnValue(DateTime.fromISO('2026-06-01'));

			const chartData: ChartPoint[] = [
				{ date: '2026-05-31', equity: 100, spy: null },
				{ date: '2026-06-01', equity: 110, spy: null },
			];

			const result = applyRangeAndMode(chartData, '1M' as Range, 'zoom', true, []);

			expect(result.map((d) => d.date)).toEqual(['2026-06-01']);
		});

		it('includes points exactly on the cutoff date', () => {
			vi.mocked(cutoffDate).mockReturnValue(DateTime.fromISO('2026-06-01'));

			const chartData: ChartPoint[] = [{ date: '2026-06-01', equity: 100, spy: null }];

			const result = applyRangeAndMode(chartData, '1M' as Range, 'zoom', true, []);

			expect(result).toHaveLength(1);
		});

		it('compares dates at day granularity, ignoring time-of-day', () => {
			vi.mocked(cutoffDate).mockReturnValue(DateTime.fromISO('2026-06-01T18:00:00'));

			const chartData: ChartPoint[] = [{ date: '2026-06-01T02:00:00', equity: 100, spy: null }];

			const result = applyRangeAndMode(chartData, '1M' as Range, 'zoom', true, []);

			expect(result).toHaveLength(1);
		});
	});

	describe('zoom mode', () => {
		it('returns the filtered data unchanged, without rebasing', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const chartData: ChartPoint[] = [
				{ date: '2026-01-01', equity: 150, spy: 120 },
				{ date: '2026-01-02', equity: 160, spy: 125 },
			];

			const result = applyRangeAndMode(chartData, 'ALL' as Range, 'zoom', true, []);

			expect(result).toEqual(chartData);
		});
	});

	describe('period mode', () => {
		it('returns an empty array when the filtered range has no data', () => {
			vi.mocked(cutoffDate).mockReturnValue(DateTime.fromISO('2026-06-01'));

			const chartData: ChartPoint[] = [{ date: '2020-01-01', equity: 100, spy: null }];

			const result = applyRangeAndMode(chartData, '1M' as Range, 'period', true, []);

			expect(result).toEqual([]);
		});

		it('rebases equity so the first filtered point becomes 100 when relative is true', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const chartData: ChartPoint[] = [
				{ date: '2026-01-01', equity: 150, spy: null },
				{ date: '2026-01-02', equity: 165, spy: null },
			];

			const result = applyRangeAndMode(chartData, 'ALL' as Range, 'period', true, []);

			expect(result.map((d) => d.equity)).toEqual([100, 115]);
		});

		it('rebases equity relative to the original data start value when relative is false', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const chartData: ChartPoint[] = [
				{ date: '2026-01-01', equity: 150, spy: null },
				{ date: '2026-01-02', equity: 165, spy: null },
			];
			const originalData = [buildEquityPoint({ equity: 10000 })];

			const result = applyRangeAndMode(chartData, 'ALL' as Range, 'period', false, originalData);

			expect(result.map((d) => d.equity)).toEqual([10000, 10015]);
		});

		it('defaults the fallback bot value to 0 when originalData is empty', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const chartData: ChartPoint[] = [{ date: '2026-01-01', equity: 150, spy: null }];

			const result = applyRangeAndMode(chartData, 'ALL' as Range, 'period', false, []);

			expect(result[0].equity).toBe(0);
		});

		it('rebases spy so the first filtered point becomes 100 when relative is true', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const chartData: ChartPoint[] = [
				{ date: '2026-01-01', equity: 150, spy: 120 },
				{ date: '2026-01-02', equity: 165, spy: 132 },
			];

			const result = applyRangeAndMode(chartData, 'ALL' as Range, 'period', true, []);

			expect(result.map((d) => d.spy)).toEqual([100, 112]);
		});

		it('rebases spy relative to the original data fallback spy value when relative is false', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const chartData: ChartPoint[] = [
				{ date: '2026-01-01', equity: 150, spy: 120 },
				{ date: '2026-01-02', equity: 165, spy: 132 },
			];
			const originalData = [buildEquityPoint({ spy: 1000 })];

			const result = applyRangeAndMode(chartData, 'ALL' as Range, 'period', false, originalData);

			expect(result.map((d) => d.spy)).toEqual([1000, 1012]);
		});

		it('keeps spy null when the point itself has no spy value', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const chartData: ChartPoint[] = [
				{ date: '2026-01-01', equity: 150, spy: 120 },
				{ date: '2026-01-02', equity: 165, spy: null },
			];

			const result = applyRangeAndMode(chartData, 'ALL' as Range, 'period', true, []);

			expect(result[1].spy).toBeNull();
		});

		it('rebases spy using the first non-null spy value in the filtered window, even if the very first point has no spy data', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const chartData: ChartPoint[] = [
				{ date: '2026-01-01', equity: 150, spy: null },
				{ date: '2026-01-02', equity: 165, spy: 132 },
				{ date: '2026-01-03', equity: 170, spy: 138 },
			];

			const result = applyRangeAndMode(chartData, 'ALL' as Range, 'period', true, []);

			expect(result.map((d) => d.spy)).toEqual([null, 100, 106]);
		});
	});
});

describe('findRebalanceIndexes', () => {
	it('returns an empty array when chartData is empty', () => {
		expect(findRebalanceIndexes([], [buildDecision()])).toEqual([]);
	});

	it('returns an empty array when there are no decisions', () => {
		const chartData: ChartPoint[] = [{ date: '2026-01-01', equity: 100, spy: null }];

		expect(findRebalanceIndexes(chartData, [])).toEqual([]);
	});

	it('returns the indexes of chart points whose date matches a decision date', () => {
		const chartData: ChartPoint[] = [
			{ date: '2026-01-01', equity: 100, spy: null },
			{ date: '2026-01-02', equity: 105, spy: null },
			{ date: '2026-01-03', equity: 110, spy: null },
		];
		const decisions = [buildDecision({ date: '2026-01-02' })];

		expect(findRebalanceIndexes(chartData, decisions)).toEqual([1]);
	});

	it('returns multiple indexes when multiple decision dates match', () => {
		const chartData: ChartPoint[] = [
			{ date: '2026-01-01', equity: 100, spy: null },
			{ date: '2026-01-02', equity: 105, spy: null },
			{ date: '2026-01-03', equity: 110, spy: null },
		];
		const decisions = [
			buildDecision({ date: '2026-01-01' }),
			buildDecision({ date: '2026-01-03' }),
		];

		expect(findRebalanceIndexes(chartData, decisions)).toEqual([0, 2]);
	});

	it('ignores decision dates that do not appear in chartData', () => {
		const chartData: ChartPoint[] = [{ date: '2026-01-01', equity: 100, spy: null }];
		const decisions = [buildDecision({ date: '2099-01-01' })];

		expect(findRebalanceIndexes(chartData, decisions)).toEqual([]);
	});

	it('deduplicates repeated decision dates without producing duplicate indexes', () => {
		const chartData: ChartPoint[] = [{ date: '2026-01-01', equity: 100, spy: null }];
		const decisions = [
			buildDecision({ date: '2026-01-01' }),
			buildDecision({ date: '2026-01-01' }),
		];

		expect(findRebalanceIndexes(chartData, decisions)).toEqual([0]);
	});
});
