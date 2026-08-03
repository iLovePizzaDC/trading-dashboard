import { useBotStatus } from '@/features/header/hooks/useBotStatus';
import type { BotStatus } from '@/features/header/types/bot-status';
import { nextBusinessDay } from '@/features/header/utils/time-helper';
import type { MarketStatus } from '@/shared/types/market.status';
import { renderHook } from '@testing-library/react';
import { DateTime, Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/constants/bot', () => ({
	REBALANCE_DAYS: 30,
	RUN_START: { hours: 9, minutes: 30 },
	RUN_END: { hours: 16, minutes: 0 },
	BOT_START_TIME_NY: { hour: 10, minute: 0 },
}));

vi.mock('@/features/header/utils/time-helper', () => ({
	nextBusinessDay: vi.fn(),
}));

function setNow(isoUTC: string) {
	const millis = DateTime.fromISO(isoUTC, { zone: 'utc' }).toMillis();
	Settings.now = () => millis;
}

function secondsFor(isoUTC: string): string {
	return DateTime.fromISO(isoUTC, { zone: 'utc' }).toSeconds().toString();
}

function buildMarketStatus(overrides: Partial<MarketStatus> = {}): MarketStatus {
	return {
		next_open: '2026-07-06T13:30:00.000Z',
		next_close: '2026-07-06T20:00:00.000Z',
		...overrides,
	} as MarketStatus;
}

const NOW_UTC = '2026-07-06T14:00:00.000Z';
const LAST_REBALANCE = '2026-06-20T00:00:00.000Z';
const DATA_VERSION_RAN_TODAY = secondsFor(NOW_UTC);
const DATA_VERSION_NOT_RAN_TODAY = secondsFor('2026-07-05T14:00:00.000Z');

describe('useBotStatus', () => {
	beforeEach(() => {
		vi.mocked(nextBusinessDay).mockReset();
		vi.mocked(nextBusinessDay).mockImplementation((date: DateTime) => date);
	});

	afterEach(() => {
		Settings.now = () => Date.now();
	});

	it('returns null when lastRebalance is null', () => {
		setNow(NOW_UTC);

		const { result } = renderHook(() =>
			useBotStatus(null, buildMarketStatus(), DATA_VERSION_NOT_RAN_TODAY),
		);

		expect(result.current).toBeNull();
	});

	it('returns null when dataVersion is null', () => {
		setNow(NOW_UTC);

		const { result } = renderHook(() => useBotStatus(LAST_REBALANCE, buildMarketStatus(), null));

		expect(result.current).toBeNull();
	});

	it('returns null when both lastRebalance and dataVersion are null', () => {
		setNow(NOW_UTC);

		const { result } = renderHook(() => useBotStatus(null, null, null));

		expect(result.current).toBeNull();
	});

	describe('mid-trading-day, not yet run (full snapshot)', () => {
		it('returns the correct full status object', () => {
			setNow(NOW_UTC);

			const { result } = renderHook(() =>
				useBotStatus(LAST_REBALANCE, buildMarketStatus(), DATA_VERSION_NOT_RAN_TODAY),
			);

			expect(result.current).toEqual<BotStatus>({
				rebalanceDaysLeft: 14,
				rebalanceNextDate: '2026-07-20',
				rebalancePct: 53,
				isRunning: true,
				ranToday: false,
				isTradingDay: true,
				marketIsOpen: true,
			});
		});
	});

	describe('mid-trading-day, already ran today', () => {
		it('sets ranToday to true and isRunning to false, keeping other fields the same', () => {
			setNow(NOW_UTC);

			const { result } = renderHook(() =>
				useBotStatus(LAST_REBALANCE, buildMarketStatus(), DATA_VERSION_RAN_TODAY),
			);

			expect(result.current).toEqual<BotStatus>({
				rebalanceDaysLeft: 14,
				rebalanceNextDate: '2026-07-20',
				rebalancePct: 53,
				isRunning: false,
				ranToday: true,
				isTradingDay: true,
				marketIsOpen: true,
			});
		});
	});

	it('treats isTradingDay, marketIsOpen, and isRunning as false when marketStatus is null', () => {
		setNow(NOW_UTC);

		const { result } = renderHook(() =>
			useBotStatus(LAST_REBALANCE, null, DATA_VERSION_NOT_RAN_TODAY),
		);

		expect(result.current?.isTradingDay).toBe(false);
		expect(result.current?.marketIsOpen).toBe(false);
		expect(result.current?.isRunning).toBe(false);
	});

	it('treats isTradingDay as false when next_open falls on a different NY calendar day than now', () => {
		setNow(NOW_UTC);

		const marketStatus = buildMarketStatus({
			next_open: '2026-07-07T13:30:00.000Z',
			next_close: '2026-07-07T20:00:00.000Z',
		});

		const { result } = renderHook(() =>
			useBotStatus(LAST_REBALANCE, marketStatus, DATA_VERSION_NOT_RAN_TODAY),
		);

		expect(result.current?.isTradingDay).toBe(false);
		expect(result.current?.marketIsOpen).toBe(false);
		expect(result.current?.isRunning).toBe(false);
	});

	it('is a trading day but not running/open when now is before the run window and before market open', () => {
		setNow('2026-07-06T10:00:00.000Z');

		const { result } = renderHook(() =>
			useBotStatus(LAST_REBALANCE, buildMarketStatus(), DATA_VERSION_NOT_RAN_TODAY),
		);

		expect(result.current?.isTradingDay).toBe(true);
		expect(result.current?.isRunning).toBe(false);
		expect(result.current?.marketIsOpen).toBe(false);
	});

	it('is a trading day but not running/open when now is after the run window and after market close', () => {
		setNow('2026-07-06T21:00:00.000Z');

		const { result } = renderHook(() =>
			useBotStatus(LAST_REBALANCE, buildMarketStatus(), DATA_VERSION_NOT_RAN_TODAY),
		);

		expect(result.current?.isTradingDay).toBe(true);
		expect(result.current?.isRunning).toBe(false);
		expect(result.current?.marketIsOpen).toBe(false);
	});

	it('clamps rebalanceDaysLeft to 0 when the next rebalance date is already in the past', () => {
		setNow(NOW_UTC);

		const { result } = renderHook(() =>
			useBotStatus('2026-05-01T00:00:00.000Z', null, DATA_VERSION_NOT_RAN_TODAY),
		);

		expect(result.current?.rebalanceDaysLeft).toBe(0);
	});

	it('clamps rebalancePct to 100 when more time has elapsed than REBALANCE_DAYS', () => {
		setNow(NOW_UTC);

		const { result } = renderHook(() =>
			useBotStatus('2026-01-01T00:00:00.000Z', null, DATA_VERSION_NOT_RAN_TODAY),
		);

		expect(result.current?.rebalancePct).toBe(100);
	});

	describe('nextBusinessDay wiring', () => {
		it('calls nextBusinessDay with lastRebalance plus REBALANCE_DAYS', () => {
			setNow(NOW_UTC);

			renderHook(() =>
				useBotStatus(LAST_REBALANCE, buildMarketStatus(), DATA_VERSION_NOT_RAN_TODAY),
			);

			const calledWith = vi.mocked(nextBusinessDay).mock.calls[0][0];
			const expected = DateTime.fromISO(LAST_REBALANCE, { zone: 'utc' }).plus({
				days: 30,
			});

			expect(calledWith.toMillis()).toBe(expected.toMillis());
		});

		it('uses the DateTime returned by nextBusinessDay for rebalanceNextDate and rebalanceDaysLeft', () => {
			setNow(NOW_UTC);
			vi.mocked(nextBusinessDay).mockReturnValue(
				DateTime.fromISO('2026-08-03T00:00:00.000Z', { zone: 'utc' }),
			);

			const { result } = renderHook(() =>
				useBotStatus(LAST_REBALANCE, buildMarketStatus(), DATA_VERSION_NOT_RAN_TODAY),
			);

			expect(result.current?.rebalanceNextDate).toBe('2026-08-03');
			expect(result.current?.rebalanceDaysLeft).toBe(28);
		});
	});

	describe('memoization', () => {
		it('returns a referentially stable result across re-renders with the same primitive and object references', () => {
			setNow(NOW_UTC);
			const marketStatus = buildMarketStatus();

			const { result, rerender } = renderHook(
				({ marketStatus }) =>
					useBotStatus(LAST_REBALANCE, marketStatus, DATA_VERSION_NOT_RAN_TODAY),
				{ initialProps: { marketStatus } },
			);

			const firstResult = result.current;
			rerender({ marketStatus });

			expect(result.current).toBe(firstResult);
		});

		it('recomputes (new object reference) when marketStatus is a new object with identical values', () => {
			setNow(NOW_UTC);

			const { result, rerender } = renderHook(
				({ marketStatus }) =>
					useBotStatus(LAST_REBALANCE, marketStatus, DATA_VERSION_NOT_RAN_TODAY),
				{ initialProps: { marketStatus: buildMarketStatus() } },
			);

			const firstResult = result.current;
			rerender({ marketStatus: buildMarketStatus() });

			expect(result.current).not.toBe(firstResult);
			expect(result.current).toEqual(firstResult);
		});

		it('does not reflect a changed system time when deps stay referentially the same', () => {
			setNow(NOW_UTC);
			const marketStatus = buildMarketStatus();

			const { result, rerender } = renderHook(
				({ marketStatus }) =>
					useBotStatus(LAST_REBALANCE, marketStatus, DATA_VERSION_NOT_RAN_TODAY),
				{ initialProps: { marketStatus } },
			);

			const firstResult = result.current;

			setNow('2026-07-06T21:00:00.000Z');
			rerender({ marketStatus });

			expect(result.current).toBe(firstResult);
		});
	});
});
