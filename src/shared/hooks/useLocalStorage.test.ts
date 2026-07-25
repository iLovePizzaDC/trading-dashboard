import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import {
	getLocalStorageItem,
	removeLocalStorageItem,
	setLocalStorageItem,
} from '@/shared/utils/local-storage';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/local-storage', () => ({
	getLocalStorageItem: vi.fn(),
	setLocalStorageItem: vi.fn(),
	removeLocalStorageItem: vi.fn(),
}));

describe('useLocalStorage', () => {
	beforeEach(() => {
		vi.mocked(getLocalStorageItem).mockReset();
		vi.mocked(setLocalStorageItem).mockReset();
		vi.mocked(removeLocalStorageItem).mockReset();
	});

	it('initializes value using getLocalStorageItem with the key and initialValue', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue('stored');

		renderHook(() => useLocalStorage('my-key', 'default'));

		expect(getLocalStorageItem).toHaveBeenCalledWith('my-key', 'default');
	});

	it('returns the value from getLocalStorageItem as the initial value', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue('stored value');

		const { result } = renderHook(() => useLocalStorage('my-key', 'default'));

		expect(result.current[0]).toBe('stored value');
	});

	it('persists the value to storage on mount', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue('stored');

		renderHook(() => useLocalStorage('my-key', 'default'));

		expect(setLocalStorageItem).toHaveBeenCalledWith('my-key', 'stored');
	});

	it('updates the value and persists it when setStoredValue is called with a plain value', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue('initial');

		const { result } = renderHook(() => useLocalStorage('my-key', 'default'));

		act(() => {
			result.current[1]('updated');
		});

		expect(result.current[0]).toBe('updated');
		expect(setLocalStorageItem).toHaveBeenCalledWith('my-key', 'updated');
	});

	it('updates the value using an updater function when setStoredValue is called with a function', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue(5);

		const { result } = renderHook(() => useLocalStorage('counter', 0));

		act(() => {
			result.current[1]((prev) => prev + 1);
		});

		expect(result.current[0]).toBe(6);
	});

	it('applies multiple updater function calls sequentially based on the previous value', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue(0);

		const { result } = renderHook(() => useLocalStorage('counter', 0));

		act(() => {
			result.current[1]((prev) => prev + 1);
			result.current[1]((prev) => prev + 1);
		});

		expect(result.current[0]).toBe(2);
	});

	it('removes the item from storage and resets to initialValue when remove is called', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue('stored');

		const { result } = renderHook(() => useLocalStorage('my-key', 'default'));

		act(() => {
			result.current[2]();
		});

		expect(removeLocalStorageItem).toHaveBeenCalledWith('my-key');
		expect(result.current[0]).toBe('default');
	});

	it('persists the reset value after calling remove', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue('stored');

		const { result } = renderHook(() => useLocalStorage('my-key', 'default'));

		vi.mocked(setLocalStorageItem).mockClear();

		act(() => {
			result.current[2]();
		});

		expect(setLocalStorageItem).toHaveBeenCalledWith('my-key', 'default');
	});

	it('re-persists to storage when the key changes', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue('value-for-key1');

		const { rerender } = renderHook(({ key }) => useLocalStorage(key, 'default'), {
			initialProps: { key: 'key1' },
		});

		vi.mocked(setLocalStorageItem).mockClear();

		rerender({ key: 'key2' });

		expect(setLocalStorageItem).toHaveBeenCalledWith('key2', 'value-for-key1');
	});

	it('does not re-read from storage when the key changes (value is not re-initialized)', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue('initial value');

		const { rerender } = renderHook(({ key }) => useLocalStorage(key, 'default'), {
			initialProps: { key: 'key1' },
		});

		vi.mocked(getLocalStorageItem).mockClear();

		rerender({ key: 'key2' });

		expect(getLocalStorageItem).not.toHaveBeenCalled();
	});

	it('calls getLocalStorageItem only once, using lazy initial state', () => {
		vi.mocked(getLocalStorageItem).mockReturnValue('value');

		const { result, rerender } = renderHook(() => useLocalStorage('my-key', 'default'));

		act(() => {
			result.current[1]('changed');
		});

		rerender();
		rerender();

		expect(getLocalStorageItem).toHaveBeenCalledTimes(1);
	});
});
