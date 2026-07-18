import { useExpandable } from '@/shared/hooks/useExpandable';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it } from 'vitest';

describe('useExpandable', () => {
  it('starts with expanded set to false', () => {
    const { result } = renderHook(() => useExpandable(10, 3));

    expect(result.current.expanded).toBe(false);
  });

  it('toggles expanded to true when toggle is called', () => {
    const { result } = renderHook(() => useExpandable(10, 3));

    act(() => {
      result.current.toggle();
    });

    expect(result.current.expanded).toBe(true);
  });

  it('toggles expanded back to false when called twice', () => {
    const { result } = renderHook(() => useExpandable(10, 3));

    act(() => {
      result.current.toggle();
    });
    act(() => {
      result.current.toggle();
    });

    expect(result.current.expanded).toBe(false);
  });

  it('returns hasMore as true when totalCount exceeds previewCount', () => {
    const { result } = renderHook(() => useExpandable(10, 3));

    expect(result.current.hasMore).toBe(true);
  });

  it('returns hasMore as false when totalCount equals previewCount', () => {
    const { result } = renderHook(() => useExpandable(3, 3));

    expect(result.current.hasMore).toBe(false);
  });

  it('returns hasMore as false when totalCount is less than previewCount', () => {
    const { result } = renderHook(() => useExpandable(2, 3));

    expect(result.current.hasMore).toBe(false);
  });

  it('calculates hiddenCount as totalCount minus previewCount', () => {
    const { result } = renderHook(() => useExpandable(10, 3));

    expect(result.current.hiddenCount).toBe(7);
  });

  it('returns a negative hiddenCount when totalCount is less than previewCount', () => {
    const { result } = renderHook(() => useExpandable(2, 5));

    expect(result.current.hiddenCount).toBe(-3);
  });

  it('returns previewCount unchanged', () => {
    const { result } = renderHook(() => useExpandable(10, 3));

    expect(result.current.previewCount).toBe(3);
  });

  it('handles totalCount of 0', () => {
    const { result } = renderHook(() => useExpandable(0, 3));

    expect(result.current.hasMore).toBe(false);
    expect(result.current.hiddenCount).toBe(-3);
  });

  it('recalculates hasMore and hiddenCount when totalCount changes between renders', () => {
    const { result, rerender } = renderHook(({ total }) => useExpandable(total, 3), {
      initialProps: { total: 2 },
    });

    expect(result.current.hasMore).toBe(false);

    rerender({ total: 10 });

    expect(result.current.hasMore).toBe(true);
    expect(result.current.hiddenCount).toBe(7);
  });

  it('preserves the expanded state across a totalCount change', () => {
    const { result, rerender } = renderHook(({ total }) => useExpandable(total, 3), {
      initialProps: { total: 10 },
    });

    act(() => {
      result.current.toggle();
    });
    expect(result.current.expanded).toBe(true);

    rerender({ total: 20 });

    expect(result.current.expanded).toBe(true);
  });
});
