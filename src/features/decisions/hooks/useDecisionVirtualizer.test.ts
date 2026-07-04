import { useVirtualizer } from '@tanstack/react-virtual';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDecisionVirtualizer } from './useDecisionVirtualizer';

vi.mock('@tanstack/react-virtual', () => ({
	useVirtualizer: vi.fn(() => ({
		getTotalSize: vi.fn(),
		getVirtualItems: vi.fn(() => []),
	})),
}));

describe('useDecisionVirtualizer', () => {
	beforeEach(() => {
		vi.mocked(useVirtualizer).mockClear();
	});

	it('calls useVirtualizer with the given count', () => {
		const parentRef = { current: null };

		renderHook(() => useDecisionVirtualizer(10, parentRef, 107));

		expect(useVirtualizer).toHaveBeenCalledWith(expect.objectContaining({ count: 10 }));
	});

	it('sets overscan to 6', () => {
		const parentRef = { current: null };

		renderHook(() => useDecisionVirtualizer(10, parentRef, 107));

		expect(useVirtualizer).toHaveBeenCalledWith(expect.objectContaining({ overscan: 6 }));
	});

	it('estimateSize returns the given rowHeight', () => {
		const parentRef = { current: null };

		renderHook(() => useDecisionVirtualizer(10, parentRef, 107));

		const config = vi.mocked(useVirtualizer).mock.calls[0][0];
		expect(config.estimateSize(0)).toBe(107);
	});

	it('getScrollElement returns the current value of parentRef', () => {
		const el = document.createElement('div');
		const parentRef = { current: el };

		renderHook(() => useDecisionVirtualizer(10, parentRef, 107));

		const config = vi.mocked(useVirtualizer).mock.calls[0][0];
		expect(config.getScrollElement()).toBe(el);
	});

	it('getScrollElement returns null when parentRef.current is null', () => {
		const parentRef = { current: null };

		renderHook(() => useDecisionVirtualizer(10, parentRef, 107));

		const config = vi.mocked(useVirtualizer).mock.calls[0][0];
		expect(config.getScrollElement()).toBeNull();
	});

	it('returns the value produced by useVirtualizer', () => {
		const parentRef = { current: null };

		const { result } = renderHook(() => useDecisionVirtualizer(10, parentRef, 107));

		expect(result.current.getTotalSize).toBeInstanceOf(Function);
		expect(result.current.getVirtualItems).toBeInstanceOf(Function);
	});
});
