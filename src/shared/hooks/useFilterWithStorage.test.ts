import { useFilterWithStorage } from '@/shared/hooks/useFilterWithStorage';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { getValidKey } from '@/shared/utils/local-storage';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

vi.mock('@/shared/utils/local-storage', () => ({
  getValidKey: vi.fn(),
}));

type Item = { id: number; category: string };

function buildItems(): Item[] {
  return [
    { id: 1, category: 'A' },
    { id: 2, category: 'B' },
    { id: 3, category: 'A' },
  ];
}

function mockLocalStorage(storedValue: string) {
  const setStoredValue = vi.fn();
  vi.mocked(useLocalStorage).mockReturnValue([storedValue, setStoredValue, vi.fn()]);
  return { setStoredValue };
}

describe('useFilterWithStorage', () => {
  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReset();
    vi.mocked(getValidKey).mockReset();
  });

  it('calls useLocalStorage with the storageKey and defaultValue', () => {
    mockLocalStorage('A');
    vi.mocked(getValidKey).mockReturnValue('A');

    renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data: buildItems(),
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
      }),
    );

    expect(useLocalStorage).toHaveBeenCalledWith('my-filter', 'A');
  });

  it('calls getValidKey with storedValue, defaultValue, allValues, and excludedValues', () => {
    mockLocalStorage('B');
    vi.mocked(getValidKey).mockReturnValue('B');

    renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data: buildItems(),
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
        excludedValues: ['C'],
      }),
    );

    expect(getValidKey).toHaveBeenCalledWith('B', 'A', ['A', 'B'], ['C']);
  });

  it('defaults excludedValues to an empty array when not provided', () => {
    mockLocalStorage('A');
    vi.mocked(getValidKey).mockReturnValue('A');

    renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data: buildItems(),
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
      }),
    );

    expect(getValidKey).toHaveBeenCalledWith('A', 'A', ['A', 'B'], []);
  });

  it('returns the value produced by getValidKey', () => {
    mockLocalStorage('A');
    vi.mocked(getValidKey).mockReturnValue('B');

    const { result } = renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data: buildItems(),
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
      }),
    );

    expect(result.current.value).toBe('B');
  });

  it('does not call setStoredValue when storedValue already matches the valid value', () => {
    const { setStoredValue } = mockLocalStorage('A');
    vi.mocked(getValidKey).mockReturnValue('A');

    renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data: buildItems(),
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
      }),
    );

    expect(setStoredValue).not.toHaveBeenCalled();
  });

  it('self-corrects by calling setStoredValue when storedValue differs from the valid value', () => {
    const { setStoredValue } = mockLocalStorage('C');
    vi.mocked(getValidKey).mockReturnValue('A');

    renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data: buildItems(),
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
      }),
    );

    expect(setStoredValue).toHaveBeenCalledWith('A');
  });

  it('updates storage via setValue when the new value is not excluded', () => {
    const { setStoredValue } = mockLocalStorage('A');
    vi.mocked(getValidKey).mockReturnValue('A');

    const { result } = renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data: buildItems(),
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
      }),
    );

    act(() => {
      result.current.setValue('B');
    });

    expect(setStoredValue).toHaveBeenCalledWith('B');
  });

  it('does not update storage via setValue when the new value is excluded', () => {
    const { setStoredValue } = mockLocalStorage('A');
    vi.mocked(getValidKey).mockReturnValue('A');

    const { result } = renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data: buildItems(),
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
        excludedValues: ['B'],
      }),
    );

    setStoredValue.mockClear();

    act(() => {
      result.current.setValue('B');
    });

    expect(setStoredValue).not.toHaveBeenCalled();
  });

  it('returns the original data unchanged when no filterFn is provided', () => {
    mockLocalStorage('A');
    vi.mocked(getValidKey).mockReturnValue('A');

    const data = buildItems();

    const { result } = renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data,
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
      }),
    );

    expect(result.current.filteredData).toBe(data);
  });

  it('filters data using filterFn and the current value', () => {
    mockLocalStorage('A');
    vi.mocked(getValidKey).mockReturnValue('A');

    const data = buildItems();

    const { result } = renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data,
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
        filterFn: (item, value) => item.category === value,
      }),
    );

    expect(result.current.filteredData).toEqual([
      { id: 1, category: 'A' },
      { id: 3, category: 'A' },
    ]);
  });

  it('re-filters data when the underlying value changes', () => {
    mockLocalStorage('A');
    vi.mocked(getValidKey).mockReturnValue('A');

    const data = buildItems();

    const { result, rerender } = renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data,
        defaultValue: 'A',
        allValues: ['A', 'B'] as const,
        filterFn: (item, value) => item.category === value,
      }),
    );

    expect(result.current.filteredData).toHaveLength(2);

    vi.mocked(getValidKey).mockReturnValue('B');
    rerender();

    expect(result.current.filteredData).toEqual([{ id: 2, category: 'B' }]);
  });

  it('returns an empty array when no items match the filter', () => {
    mockLocalStorage('C');
    vi.mocked(getValidKey).mockReturnValue('C');

    const { result } = renderHook(() =>
      useFilterWithStorage({
        storageKey: 'my-filter',
        data: buildItems(),
        defaultValue: 'A',
        allValues: ['A', 'B', 'C'] as const,
        filterFn: (item, value) => item.category === value,
      }),
    );

    expect(result.current.filteredData).toEqual([]);
  });
});
