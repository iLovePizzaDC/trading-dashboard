import { useDataVersionContext } from '@/shared/context/DataVersionContext';
import { useFetch } from '@/shared/hooks/useFetch';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/context/DataVersionContext', () => ({
	useDataVersionContext: vi.fn(),
}));

function deferred<T>() {
	let resolve!: (value: T) => void;
	let reject!: (error: unknown) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject };
}

describe('useFetch', () => {
	beforeEach(() => {
		vi.mocked(useDataVersionContext).mockReset();
	});

	it('does not call the fetcher while version is null', () => {
		vi.mocked(useDataVersionContext).mockReturnValue(null);
		const fetcher = vi.fn();

		renderHook(() => useFetch(fetcher));

		expect(fetcher).not.toHaveBeenCalled();
	});

	it('does not call the fetcher when version is an empty string', () => {
		vi.mocked(useDataVersionContext).mockReturnValue('');
		const fetcher = vi.fn();

		renderHook(() => useFetch(fetcher));

		expect(fetcher).not.toHaveBeenCalled();
	});

	it('starts in the initial state (loading true, data null, error null) while version is null', () => {
		vi.mocked(useDataVersionContext).mockReturnValue(null);
		const fetcher = vi.fn();

		const { result } = renderHook(() => useFetch(fetcher));

		expect(result.current).toEqual({ data: null, loading: true, error: null });
	});

	it('calls the fetcher with the version once it becomes available', () => {
		vi.mocked(useDataVersionContext).mockReturnValue('v1');
		const fetcher = vi.fn().mockResolvedValue('some data');

		renderHook(() => useFetch(fetcher));

		expect(fetcher).toHaveBeenCalledWith('v1');
	});

	it('sets loading to true and clears the error immediately when the fetch starts', () => {
		vi.mocked(useDataVersionContext).mockReturnValue('v1');
		const { promise } = deferred<string>();
		const fetcher = vi.fn().mockReturnValue(promise);

		const { result } = renderHook(() => useFetch(fetcher));

		expect(result.current.loading).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it('sets data and loading to false when the fetch resolves', async () => {
		vi.mocked(useDataVersionContext).mockReturnValue('v1');
		const fetcher = vi.fn().mockResolvedValue('resolved data');

		const { result } = renderHook(() => useFetch(fetcher));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.data).toBe('resolved data');
		expect(result.current.error).toBeNull();
	});

	it('sets the error and loading to false when the fetch rejects', async () => {
		vi.mocked(useDataVersionContext).mockReturnValue('v1');
		const error = new Error('fetch failed');
		const fetcher = vi.fn().mockRejectedValue(error);

		const { result } = renderHook(() => useFetch(fetcher));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.error).toBe(error);
		expect(result.current.data).toBeNull();
	});

	it('preserves stale data when a subsequent fetch fails', async () => {
		vi.mocked(useDataVersionContext).mockReturnValue('v1');
		const fetcher = vi.fn().mockResolvedValue('first success');

		const { result, rerender } = renderHook(
			({ version }) => {
				vi.mocked(useDataVersionContext).mockReturnValue(version);
				return useFetch(fetcher);
			},
			{ initialProps: { version: 'v1' } },
		);

		await waitFor(() => {
			expect(result.current.data).toBe('first success');
		});

		const error = new Error('second fetch failed');
		fetcher.mockRejectedValueOnce(error);

		rerender({ version: 'v2' });

		await waitFor(() => {
			expect(result.current.error).toBe(error);
		});

		expect(result.current.data).toBe('first success');
	});

	it('re-fetches when version changes', async () => {
		const fetcher = vi.fn().mockResolvedValue('data');

		const { rerender } = renderHook(
			({ version }) => {
				vi.mocked(useDataVersionContext).mockReturnValue(version);
				return useFetch(fetcher);
			},
			{ initialProps: { version: 'v1' } },
		);

		await waitFor(() => {
			expect(fetcher).toHaveBeenCalledWith('v1');
		});

		rerender({ version: 'v2' });

		await waitFor(() => {
			expect(fetcher).toHaveBeenCalledWith('v2');
		});

		expect(fetcher).toHaveBeenCalledTimes(2);
	});

	it('ignores a stale response when a newer version request has already started', async () => {
		const v1 = deferred<string>();
		const v2 = deferred<string>();
		const fetcher = vi.fn().mockReturnValueOnce(v1.promise).mockReturnValueOnce(v2.promise);

		const { result, rerender } = renderHook(
			({ version }) => {
				vi.mocked(useDataVersionContext).mockReturnValue(version);
				return useFetch(fetcher);
			},
			{ initialProps: { version: 'v1' } },
		);

		expect(fetcher).toHaveBeenCalledWith('v1');

		rerender({ version: 'v2' });

		expect(fetcher).toHaveBeenCalledWith('v2');

		v2.resolve('data from v2');

		await waitFor(() => {
			expect(result.current.data).toBe('data from v2');
		});

		v1.resolve('data from v1');

		await waitFor(() => {
			expect(result.current.data).toBe('data from v2');
		});

		expect(result.current.data).toBe('data from v2');
	});

	it('does not re-fetch when version stays the same across re-renders', async () => {
		vi.mocked(useDataVersionContext).mockReturnValue('v1');
		const fetcher = vi.fn().mockResolvedValue('data');

		const { rerender } = renderHook(() => useFetch(fetcher));

		await waitFor(() => {
			expect(fetcher).toHaveBeenCalledTimes(1);
		});

		rerender();
		rerender();

		expect(fetcher).toHaveBeenCalledTimes(1);
	});

	it('does not re-fetch when only the fetcher function identity changes but version stays the same', async () => {
		vi.mocked(useDataVersionContext).mockReturnValue('v1');
		const fetcherA = vi.fn().mockResolvedValue('a');
		const fetcherB = vi.fn().mockResolvedValue('b');

		const { rerender } = renderHook(({ fetcher }) => useFetch(fetcher), {
			initialProps: { fetcher: fetcherA },
		});

		await waitFor(() => {
			expect(fetcherA).toHaveBeenCalledTimes(1);
		});

		rerender({ fetcher: fetcherB });

		expect(fetcherB).not.toHaveBeenCalled();
	});

	it('transitions from null version to a real version and fetches exactly once', async () => {
		const fetcher = vi.fn().mockResolvedValue('data');

		const { rerender } = renderHook(
			({ version }) => {
				vi.mocked(useDataVersionContext).mockReturnValue(version);
				return useFetch(fetcher);
			},
			{ initialProps: { version: null as string | null } },
		);

		expect(fetcher).not.toHaveBeenCalled();

		rerender({ version: 'v1' });

		await waitFor(() => {
			expect(fetcher).toHaveBeenCalledTimes(1);
		});

		expect(fetcher).toHaveBeenCalledWith('v1');
	});
});
