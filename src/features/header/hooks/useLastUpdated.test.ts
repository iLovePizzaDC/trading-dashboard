import { useLastUpdated } from '@/features/header/hooks/useLastUpdated';
import { useDataVersionContext } from '@/shared/context/DataVersionContext';
import { renderHook } from '@testing-library/react';
import { DateTime } from 'luxon';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/context/DataVersionContext', () => ({
	useDataVersionContext: vi.fn(),
}));

function secondsFor(isoUTC: string): string {
	return DateTime.fromISO(isoUTC, { zone: 'utc' }).toSeconds().toString();
}

describe('useLastUpdated', () => {
	beforeEach(() => {
		vi.mocked(useDataVersionContext).mockReset();
	});

	it('returns null when useDataVersionContext returns null', () => {
		vi.mocked(useDataVersionContext).mockReturnValue(null);

		const { result } = renderHook(() => useLastUpdated());

		expect(result.current).toBeNull();
	});

	it('returns null when useDataVersionContext returns an empty string', () => {
		vi.mocked(useDataVersionContext).mockReturnValue('');

		const { result } = renderHook(() => useLastUpdated());

		expect(result.current).toBeNull();
	});

	it('formats a valid unix timestamp (seconds) as Berlin time (summer, CEST)', () => {
		vi.mocked(useDataVersionContext).mockReturnValue(secondsFor('2026-07-06T13:30:00.000Z'));

		const { result } = renderHook(() => useLastUpdated());

		expect(result.current).toBe('2026-07-06 @ 15:30:00');
	});

	it('formats using the expected "yyyy-MM-dd @ HH:mm:ss" pattern', () => {
		vi.mocked(useDataVersionContext).mockReturnValue(secondsFor('2026-07-06T13:30:00.000Z'));

		const { result } = renderHook(() => useLastUpdated());

		expect(result.current).toMatch(/^\d{4}-\d{2}-\d{2} @ \d{2}:\d{2}:\d{2}$/);
	});

	it('handles winter time (CET, UTC+1) correctly', () => {
		vi.mocked(useDataVersionContext).mockReturnValue(secondsFor('2026-01-15T10:00:00.000Z'));

		const { result } = renderHook(() => useLastUpdated());

		expect(result.current).toBe('2026-01-15 @ 11:00:00');
	});

	it('re-derives the formatted date when the version changes', () => {
		vi.mocked(useDataVersionContext).mockReturnValue(secondsFor('2026-07-06T13:30:00.000Z'));

		const { result, rerender } = renderHook(() => useLastUpdated());
		const first = result.current;

		vi.mocked(useDataVersionContext).mockReturnValue(secondsFor('2026-07-08T09:00:00.000Z'));
		rerender();

		expect(result.current).not.toBe(first);
	});
});
