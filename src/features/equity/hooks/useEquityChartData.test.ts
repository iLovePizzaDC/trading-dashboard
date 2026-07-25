import type { EquityCurveMode } from '@/features/equity/constants/equity';
import { useEquityChartData } from '@/features/equity/hooks/useEquityChartData';
import {
	applyRangeAndMode,
	findRebalanceIndexes,
	normalizeToRelative,
} from '@/features/equity/utils/equity-curve';
import type { Range } from '@/shared/constants/date-range';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { EquityPoint } from '@/shared/types/equity';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/equity/utils/equity-curve', () => ({
	normalizeToRelative: vi.fn(),
	applyRangeAndMode: vi.fn(),
	findRebalanceIndexes: vi.fn(),
}));

function buildEquityPoint(overrides: Partial<EquityPoint> = {}): EquityPoint {
	return { date: '2026-01-01', equity: 100, ...overrides } as EquityPoint;
}

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
	return { date: '2026-01-01', candidates: [], ...overrides } as DecisionEntry;
}

describe('useEquityChartData', () => {
	beforeEach(() => {
		vi.mocked(normalizeToRelative).mockReset();
		vi.mocked(applyRangeAndMode).mockReset();
		vi.mocked(findRebalanceIndexes).mockReset();

		vi.mocked(normalizeToRelative).mockReturnValue([buildEquityPoint()]);
		vi.mocked(applyRangeAndMode).mockReturnValue([buildEquityPoint()]);
		vi.mocked(findRebalanceIndexes).mockReturnValue([]);
	});

	it('calls normalizeToRelative with data and relative', () => {
		const data = [buildEquityPoint()];

		renderHook(() => useEquityChartData(data, [], true, 'zoom' as EquityCurveMode, 'all' as Range));

		expect(normalizeToRelative).toHaveBeenCalledWith(data, true);
	});

	it('calls applyRangeAndMode with the normalized data, range, curveMode, relative, and raw data', () => {
		const data = [buildEquityPoint()];
		const normalized = [buildEquityPoint({ equity: 100 })];
		vi.mocked(normalizeToRelative).mockReturnValue(normalized);

		renderHook(() =>
			useEquityChartData(data, [], false, 'period' as EquityCurveMode, '30d' as Range),
		);

		expect(applyRangeAndMode).toHaveBeenCalledWith(normalized, '30d', 'period', false, data);
	});

	it('calls findRebalanceIndexes with the final chartData and decisions', () => {
		const decisions = [buildDecision()];
		const finalChartData = [buildEquityPoint({ equity: 150 })];
		vi.mocked(applyRangeAndMode).mockReturnValue(finalChartData);

		renderHook(() =>
			useEquityChartData(
				[buildEquityPoint()],
				decisions,
				true,
				'zoom' as EquityCurveMode,
				'all' as Range,
			),
		);

		expect(findRebalanceIndexes).toHaveBeenCalledWith(finalChartData, decisions);
	});

	it('returns chartData from applyRangeAndMode and rebalanceIndexes from findRebalanceIndexes', () => {
		const finalChartData = [buildEquityPoint({ equity: 200 })];
		const rebalanceIndexes = [1, 3];
		vi.mocked(applyRangeAndMode).mockReturnValue(finalChartData);
		vi.mocked(findRebalanceIndexes).mockReturnValue(rebalanceIndexes);

		const { result } = renderHook(() =>
			useEquityChartData([buildEquityPoint()], [], true, 'zoom' as EquityCurveMode, 'all' as Range),
		);

		expect(result.current.chartData).toBe(finalChartData);
		expect(result.current.rebalanceIndexes).toBe(rebalanceIndexes);
	});

	it('does not recompute normalizeToRelative when only decisions change', () => {
		const data = [buildEquityPoint()];

		const { rerender } = renderHook(
			({ decisions }) =>
				useEquityChartData(data, decisions, true, 'zoom' as EquityCurveMode, 'all' as Range),
			{ initialProps: { decisions: [buildDecision()] } },
		);

		vi.mocked(normalizeToRelative).mockClear();

		rerender({ decisions: [buildDecision({ date: '2026-02-01' })] });

		expect(normalizeToRelative).not.toHaveBeenCalled();
	});

	it('does not recompute applyRangeAndMode when only decisions change', () => {
		const data = [buildEquityPoint()];

		const { rerender } = renderHook(
			({ decisions }) =>
				useEquityChartData(data, decisions, true, 'zoom' as EquityCurveMode, 'all' as Range),
			{ initialProps: { decisions: [buildDecision()] } },
		);

		vi.mocked(applyRangeAndMode).mockClear();

		rerender({ decisions: [buildDecision({ date: '2026-02-01' })] });

		expect(applyRangeAndMode).not.toHaveBeenCalled();
	});

	it('recomputes findRebalanceIndexes when decisions change', () => {
		const data = [buildEquityPoint()];

		const { rerender } = renderHook(
			({ decisions }) =>
				useEquityChartData(data, decisions, true, 'zoom' as EquityCurveMode, 'all' as Range),
			{ initialProps: { decisions: [buildDecision()] } },
		);

		vi.mocked(findRebalanceIndexes).mockClear();

		rerender({ decisions: [buildDecision({ date: '2026-02-01' })] });

		expect(findRebalanceIndexes).toHaveBeenCalledTimes(1);
	});

	it('recomputes everything when relative changes', () => {
		const data = [buildEquityPoint()];

		const { rerender } = renderHook(
			({ relative }) =>
				useEquityChartData(data, [], relative, 'zoom' as EquityCurveMode, 'all' as Range),
			{ initialProps: { relative: true } },
		);

		vi.mocked(normalizeToRelative).mockClear();
		vi.mocked(applyRangeAndMode).mockClear();

		rerender({ relative: false });

		expect(normalizeToRelative).toHaveBeenCalledTimes(1);
		expect(applyRangeAndMode).toHaveBeenCalledTimes(1);
	});

	it('recomputes applyRangeAndMode but not normalizeToRelative when only range changes', () => {
		const data = [buildEquityPoint()];

		const { rerender } = renderHook(
			({ range }) => useEquityChartData(data, [], true, 'zoom' as EquityCurveMode, range),
			{ initialProps: { range: 'all' as Range } },
		);

		vi.mocked(normalizeToRelative).mockClear();
		vi.mocked(applyRangeAndMode).mockClear();

		rerender({ range: '30d' as Range });

		expect(normalizeToRelative).not.toHaveBeenCalled();
		expect(applyRangeAndMode).toHaveBeenCalledTimes(1);
	});
});
