import { ROTATE_INTERVAL_MS } from '@/features/trades/constants/scatter-tooltip';
import { useRotateSectorName } from '@/shared/hooks/useRotateSymbolName';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/trades/constants/scatter-tooltip', () => ({
	ROTATE_INTERVAL_MS: 2000,
}));

vi.mock('@/shared/constants/sectors', () => ({
	SECTOR_MAP: {
		XLK: 'Technology',
		XLF: 'Financials',
	} as Record<string, string>,
}));

describe('useRotateSectorName', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns undefined displayName when symbol is undefined', () => {
		const { result } = renderHook(() => useRotateSectorName(undefined));

		expect(result.current.displayName).toBeUndefined();
	});

	it('returns visible as true initially regardless of symbol', () => {
		const { result } = renderHook(() => useRotateSectorName('XLK'));

		expect(result.current.visible).toBe(true);
	});

	it('returns just the symbol as displayName when there is no matching sector name', () => {
		const { result } = renderHook(() => useRotateSectorName('ZZZ'));

		expect(result.current.displayName).toBe('ZZZ');
	});

	it('returns the sector name first when a matching sector exists', () => {
		const { result } = renderHook(() => useRotateSectorName('XLK'));

		expect(result.current.displayName).toBe('Technology');
	});

	it('does not rotate when there is no sector name (single label)', () => {
		const { result } = renderHook(() => useRotateSectorName('ZZZ'));

		act(() => {
			vi.advanceTimersByTime(ROTATE_INTERVAL_MS + 250);
		});

		expect(result.current.displayName).toBe('ZZZ');
		expect(result.current.visible).toBe(true);
	});

	it('does not rotate when symbol is undefined', () => {
		const { result } = renderHook(() => useRotateSectorName(undefined));

		act(() => {
			vi.advanceTimersByTime(ROTATE_INTERVAL_MS + 250);
		});

		expect(result.current.displayName).toBeUndefined();
		expect(result.current.visible).toBe(true);
	});

	it('hides the label after ROTATE_INTERVAL_MS when there are two labels to rotate', () => {
		const { result } = renderHook(() => useRotateSectorName('XLK'));

		act(() => {
			vi.advanceTimersByTime(ROTATE_INTERVAL_MS);
		});

		expect(result.current.visible).toBe(false);
	});

	it('switches to the next label and becomes visible again after the 250ms fade', () => {
		const { result } = renderHook(() => useRotateSectorName('XLK'));

		act(() => {
			vi.advanceTimersByTime(ROTATE_INTERVAL_MS + 250);
		});

		expect(result.current.displayName).toBe('XLK');
		expect(result.current.visible).toBe(true);
	});

	it('cycles back to the sector name after a full rotation of both labels', () => {
		const { result } = renderHook(() => useRotateSectorName('XLK'));

		act(() => {
			vi.advanceTimersByTime(ROTATE_INTERVAL_MS + 250);
		});
		expect(result.current.displayName).toBe('XLK');

		act(() => {
			vi.advanceTimersByTime(ROTATE_INTERVAL_MS + 250);
		});
		expect(result.current.displayName).toBe('Technology');
	});

	it('resets index and visibility to the start when the symbol changes', () => {
		const { result, rerender } = renderHook(({ symbol }) => useRotateSectorName(symbol), {
			initialProps: { symbol: 'XLK' as string | undefined },
		});

		act(() => {
			vi.advanceTimersByTime(ROTATE_INTERVAL_MS + 250);
		});
		expect(result.current.displayName).toBe('XLK');

		rerender({ symbol: 'XLF' });

		expect(result.current.displayName).toBe('Financials');
		expect(result.current.visible).toBe(true);
	});

	it('restarts rotation timing from scratch after the symbol changes', () => {
		const { result, rerender } = renderHook(({ symbol }) => useRotateSectorName(symbol), {
			initialProps: { symbol: 'XLK' as string | undefined },
		});

		act(() => {
			vi.advanceTimersByTime(ROTATE_INTERVAL_MS - 500);
		});

		rerender({ symbol: 'XLF' });

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(result.current.visible).toBe(true);
		expect(result.current.displayName).toBe('Financials');
	});

	it('stops rotating (single label) when switching from a symbol with a sector to one without', () => {
		const { result, rerender } = renderHook(({ symbol }) => useRotateSectorName(symbol), {
			initialProps: { symbol: 'XLK' as string | undefined },
		});

		rerender({ symbol: 'ZZZ' });

		act(() => {
			vi.advanceTimersByTime(ROTATE_INTERVAL_MS + 250);
		});

		expect(result.current.displayName).toBe('ZZZ');
		expect(result.current.visible).toBe(true);
	});

	it('clears the interval and timeout on unmount', () => {
		const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

		const { unmount } = renderHook(() => useRotateSectorName('XLK'));

		unmount();

		expect(clearIntervalSpy).toHaveBeenCalled();
		expect(clearTimeoutSpy).toHaveBeenCalled();

		clearIntervalSpy.mockRestore();
		clearTimeoutSpy.mockRestore();
	});

	it('does not continue rotating after unmount', () => {
		const { unmount } = renderHook(() => useRotateSectorName('XLK'));

		unmount();

		expect(() => {
			act(() => {
				vi.advanceTimersByTime(ROTATE_INTERVAL_MS + 250);
			});
		}).not.toThrow();
	});
});
