import type { EquityCurveMode } from '@/features/equity/constants/equity';
import { useEquitySettings } from '@/features/equity/hooks/useEquitySettings';
import { RANGES, type Range } from '@/shared/constants/date-range';
import { useFilterWithStorage } from '@/shared/hooks/useFilterWithStorage';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { EquityPoint } from '@/shared/types/equity';
import { cutoffDate } from '@/shared/utils/date-range';
import { renderHook } from '@testing-library/react';
import { DateTime } from 'luxon';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/useLocalStorage', () => ({
	useLocalStorage: vi.fn(),
}));

vi.mock('@/shared/hooks/useFilterWithStorage', () => ({
	useFilterWithStorage: vi.fn(),
}));

vi.mock('@/shared/utils/date-range', () => ({
	cutoffDate: vi.fn(),
}));

function buildEquityPoint(overrides: Partial<EquityPoint> = {}): EquityPoint {
	return { date: '2026-01-01', equity: 100, ...overrides } as EquityPoint;
}

function mockLocalStorage({
	showSpy = true,
	relative = true,
	curveMode = 'zoom' as EquityCurveMode,
}: {
	showSpy?: boolean;
	relative?: boolean;
	curveMode?: EquityCurveMode;
} = {}) {
	const setShowSpy = vi.fn();
	const setRelative = vi.fn();
	const setCurveMode = vi.fn();
	const resetShowSpy = vi.fn();
	const resetRelative = vi.fn();
	const resetCurveMode = vi.fn();

	vi.mocked(useLocalStorage).mockImplementation((key: string) => {
		if (key === 'equity-curve-spy') return [showSpy, setShowSpy, resetShowSpy];
		if (key === 'equity-curve-relative') return [relative, setRelative, resetRelative];
		if (key === 'equity-curve-mode') return [curveMode, setCurveMode, resetCurveMode];
		throw new Error(`useLocalStorage called with unexpected key: ${key}`);
	});

	return { setShowSpy, setRelative, setCurveMode };
}

function mockFilterWithStorage(range: Range = '3M') {
	const setValue = vi.fn();

	vi.mocked(useFilterWithStorage).mockReturnValue({
		value: range,
		setValue,
		filteredData: [],
	} as ReturnType<typeof useFilterWithStorage>);

	return { setValue };
}

describe('useEquitySettings', () => {
	beforeEach(() => {
		vi.mocked(useLocalStorage).mockReset();
		vi.mocked(useFilterWithStorage).mockReset();
		vi.mocked(cutoffDate).mockReset();
	});

	it('reads showSpy, relative, and curveMode from useLocalStorage with the correct keys and defaults', () => {
		mockLocalStorage();
		mockFilterWithStorage();

		renderHook(() => useEquitySettings([]));

		expect(useLocalStorage).toHaveBeenCalledWith('equity-curve-spy', true);
		expect(useLocalStorage).toHaveBeenCalledWith('equity-curve-relative', true);
		expect(useLocalStorage).toHaveBeenCalledWith('equity-curve-mode', 'zoom');
	});

	it('calls useFilterWithStorage with the correct storageKey, data, defaultValue, and allValues', () => {
		mockLocalStorage();
		mockFilterWithStorage();

		const data = [buildEquityPoint()];

		renderHook(() => useEquitySettings(data));

		expect(useFilterWithStorage).toHaveBeenCalledWith(
			expect.objectContaining({
				storageKey: 'equity-curve-range',
				data,
				defaultValue: '3M',
				allValues: RANGES,
			}),
		);
	});

	it('returns the values and setters from useLocalStorage and useFilterWithStorage', () => {
		const { setShowSpy, setRelative, setCurveMode } = mockLocalStorage({
			showSpy: false,
			relative: false,
			curveMode: 'period' as EquityCurveMode,
		});
		const { setValue } = mockFilterWithStorage('YTD' as Range);

		const { result } = renderHook(() => useEquitySettings([]));

		expect(result.current.showSpy).toBe(false);
		expect(result.current.setShowSpy).toBe(setShowSpy);
		expect(result.current.relative).toBe(false);
		expect(result.current.setRelative).toBe(setRelative);
		expect(result.current.curveMode).toBe('period');
		expect(result.current.setCurveMode).toBe(setCurveMode);
		expect(result.current.range).toBe('YTD');
		expect(result.current.setRange).toBe(setValue);
	});

	it('initializes hoveredValue as null', () => {
		mockLocalStorage();
		mockFilterWithStorage();

		const { result } = renderHook(() => useEquitySettings([]));

		expect(result.current.hoveredValue).toBeNull();
	});

	it('updates hoveredValue when setHoveredValue is called', () => {
		mockLocalStorage();
		mockFilterWithStorage();

		const { result } = renderHook(() => useEquitySettings([]));

		act(() => {
			result.current.setHoveredValue(150);
		});

		expect(result.current.hoveredValue).toBe(150);
	});

	it('resets hoveredValue back to null', () => {
		mockLocalStorage();
		mockFilterWithStorage();

		const { result } = renderHook(() => useEquitySettings([]));

		act(() => {
			result.current.setHoveredValue(150);
		});
		act(() => {
			result.current.setHoveredValue(null);
		});

		expect(result.current.hoveredValue).toBeNull();
	});

	describe('filterFn passed to useFilterWithStorage', () => {
		function getFilterFn() {
			mockLocalStorage();
			mockFilterWithStorage();

			renderHook(() => useEquitySettings([]));

			const config = vi.mocked(useFilterWithStorage).mock.calls[0][0];
			return config.filterFn!;
		}

		it('returns true for every point when cutoffDate returns null (e.g. "ALL")', () => {
			vi.mocked(cutoffDate).mockReturnValue(null);

			const filterFn = getFilterFn();
			const point = buildEquityPoint({ date: '2020-01-01' });

			expect(filterFn(point, 'ALL' as Range)).toBe(true);
		});

		it('includes points on the cutoff date', () => {
			vi.mocked(cutoffDate).mockReturnValue(DateTime.fromISO('2026-06-01'));

			const filterFn = getFilterFn();
			const point = buildEquityPoint({ date: '2026-06-01' });

			expect(filterFn(point, '1M' as Range)).toBe(true);
		});

		it('includes points after the cutoff date', () => {
			vi.mocked(cutoffDate).mockReturnValue(DateTime.fromISO('2026-06-01'));

			const filterFn = getFilterFn();
			const point = buildEquityPoint({ date: '2026-07-04' });

			expect(filterFn(point, '1M' as Range)).toBe(true);
		});

		it('excludes points before the cutoff date', () => {
			vi.mocked(cutoffDate).mockReturnValue(DateTime.fromISO('2026-06-01'));

			const filterFn = getFilterFn();
			const point = buildEquityPoint({ date: '2026-05-31' });

			expect(filterFn(point, '1M' as Range)).toBe(false);
		});

		it('compares dates at day granularity, ignoring time-of-day differences', () => {
			vi.mocked(cutoffDate).mockReturnValue(DateTime.fromISO('2026-06-01T18:00:00'));

			const filterFn = getFilterFn();
			const point = buildEquityPoint({ date: '2026-06-01T02:00:00' });

			expect(filterFn(point, '1M' as Range)).toBe(true);
		});
	});
});
