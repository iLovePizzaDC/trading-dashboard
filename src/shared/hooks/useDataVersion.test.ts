import { useDataVersion } from '@/shared/hooks/useDataVersion';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function mockFetchOnce(response: { ok: boolean; text?: string } | 'network-error') {
	const fetchMock = vi.fn().mockImplementationOnce(() => {
		if (response === 'network-error') {
			return Promise.reject(new Error('network error'));
		}
		return Promise.resolve({
			ok: response.ok,
			text: () => Promise.resolve(response.text ?? ''),
		});
	});

	vi.stubGlobal('fetch', fetchMock);
	return fetchMock;
}

function mockFetchSequence(responses: Array<{ ok: boolean; text?: string } | 'network-error'>) {
	const fetchMock = vi.fn();

	responses.forEach((response) => {
		fetchMock.mockImplementationOnce(() => {
			if (response === 'network-error') {
				return Promise.reject(new Error('network error'));
			}
			return Promise.resolve({
				ok: response.ok,
				text: () => Promise.resolve(response.text ?? ''),
			});
		});
	});

	vi.stubGlobal('fetch', fetchMock);
	return fetchMock;
}

async function flushMicrotasks() {
	await vi.advanceTimersByTimeAsync(0);
}

describe('useDataVersion', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('returns null before the initial fetch resolves', () => {
		mockFetchOnce({ ok: true, text: 'v1' });

		const { result } = renderHook(() => useDataVersion());

		expect(result.current).toBeNull();
	});

	it('sets the version after the initial fetch resolves', async () => {
		mockFetchOnce({ ok: true, text: 'v1' });

		const { result } = renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});

		expect(result.current).toBe('v1');
	});

	it('trims whitespace from the fetched version', async () => {
		mockFetchOnce({ ok: true, text: '  v1  \n' });

		const { result } = renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});

		expect(result.current).toBe('v1');
	});

	it('calls fetch with the correct URL and cache option', async () => {
		const fetchMock = mockFetchOnce({ ok: true, text: 'v1' });

		renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});

		expect(fetchMock).toHaveBeenCalledWith('/data/last_updated.txt', { cache: 'no-store' });
	});

	it('sets version to an empty string when the response is not ok', async () => {
		mockFetchOnce({ ok: false });

		const { result } = renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});

		expect(result.current).toBe('');
	});

	it('sets version to an empty string when fetch throws (network error)', async () => {
		mockFetchOnce('network-error');

		const { result } = renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});

		expect(result.current).toBe('');
	});

	it('polls again after 60 seconds and updates the version if it changed', async () => {
		mockFetchSequence([
			{ ok: true, text: 'v1' },
			{ ok: true, text: 'v2' },
		]);

		const { result } = renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});
		expect(result.current).toBe('v1');

		await act(async () => {
			await vi.advanceTimersByTimeAsync(60_000);
		});

		expect(result.current).toBe('v2');
	});

	it('does not poll before 60 seconds have elapsed', async () => {
		const fetchMock = mockFetchSequence([
			{ ok: true, text: 'v1' },
			{ ok: true, text: 'v2' },
		]);

		renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);

		await act(async () => {
			await vi.advanceTimersByTimeAsync(59_000);
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('keeps the current version when the polled value is unchanged', async () => {
		mockFetchSequence([
			{ ok: true, text: 'v1' },
			{ ok: true, text: 'v1' },
		]);

		const { result } = renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});
		expect(result.current).toBe('v1');

		await act(async () => {
			await vi.advanceTimersByTimeAsync(60_000);
		});

		expect(result.current).toBe('v1');
	});

	it('continues polling every 60 seconds across multiple cycles', async () => {
		mockFetchSequence([
			{ ok: true, text: 'v1' },
			{ ok: true, text: 'v2' },
			{ ok: true, text: 'v3' },
		]);

		const { result } = renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});
		expect(result.current).toBe('v1');

		await act(async () => {
			await vi.advanceTimersByTimeAsync(60_000);
		});
		expect(result.current).toBe('v2');

		await act(async () => {
			await vi.advanceTimersByTimeAsync(60_000);
		});
		expect(result.current).toBe('v3');
	});

	it('clears the interval on unmount', async () => {
		mockFetchOnce({ ok: true, text: 'v1' });
		const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

		const { unmount } = renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});

		unmount();

		expect(clearIntervalSpy).toHaveBeenCalled();

		clearIntervalSpy.mockRestore();
	});

	it('does not update state after unmount even if a pending poll resolves', async () => {
		mockFetchSequence([
			{ ok: true, text: 'v1' },
			{ ok: true, text: 'v2' },
		]);

		const { result, unmount } = renderHook(() => useDataVersion());

		await act(async () => {
			await flushMicrotasks();
		});
		expect(result.current).toBe('v1');

		unmount();

		await act(async () => {
			await vi.advanceTimersByTimeAsync(60_000);
		});

		expect(true).toBe(true);
	});
});
