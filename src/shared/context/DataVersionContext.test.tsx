import { DataVersionContext, useDataVersionContext } from '@/shared/context/DataVersionContext';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useDataVersionContext', () => {
	it('returns null when used without a surrounding provider', () => {
		const { result } = renderHook(() => useDataVersionContext());

		expect(result.current).toBeNull();
	});

	it('returns the value provided by DataVersionContext.Provider', () => {
		const { result } = renderHook(() => useDataVersionContext(), {
			wrapper: ({ children }) => (
				<DataVersionContext.Provider value='v1'>{children}</DataVersionContext.Provider>
			),
		});

		expect(result.current).toBe('v1');
	});

	it('returns null when the provider explicitly passes null', () => {
		const { result } = renderHook(() => useDataVersionContext(), {
			wrapper: ({ children }) => (
				<DataVersionContext.Provider value={null}>{children}</DataVersionContext.Provider>
			),
		});

		expect(result.current).toBeNull();
	});

	it('reflects an updated context value on re-render', () => {
		const { result, rerender } = renderHook(() => useDataVersionContext(), {
			wrapper: ({ children }) => (
				<DataVersionContext.Provider value='v1'>{children}</DataVersionContext.Provider>
			),
		});

		expect(result.current).toBe('v1');

		rerender();

		expect(result.current).toBe('v1');
	});
});
