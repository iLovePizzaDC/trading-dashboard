import { getStatusCard, getTradingDayProgress } from '@/features/header/utils/status-card';
import { getBotRunTimeDE, getBotRunWeekday } from '@/features/header/utils/time-helper';
import { DateTime, Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/header/utils/time-helper', () => ({
	getBotRunTimeDE: vi.fn(),
	getBotRunWeekday: vi.fn(),
}));

describe('getStatusCard', () => {
	beforeEach(() => {
		vi.mocked(getBotRunTimeDE).mockReturnValue('09:35');
		vi.mocked(getBotRunWeekday).mockReturnValue('mon');
	});

	it('returns the running state when isRunning is true', () => {
		const result = getStatusCard(true, false, true, null);

		expect(result).toEqual({
			value: 'running now',
			sub: 'started at 09:35',
			progress: 100,
			color: 'green',
		});
	});

	it('prioritizes isRunning over ranToday', () => {
		const result = getStatusCard(true, true, true, null);

		expect(result.value).toBe('running now');
	});

	it('returns the "done" state when ranToday is true and not currently running', () => {
		const result = getStatusCard(false, true, true, null);

		expect(result).toEqual({
			value: 'mon — done',
			sub: 'ran at 09:35',
			progress: 100,
			color: 'green',
		});
	});

	it('prioritizes ranToday over isTradingDay', () => {
		const result = getStatusCard(false, true, false, null);

		expect(result.value).toBe('mon — done');
	});

	it('returns the "active" (pending) state when it is a trading day but has not run yet', () => {
		const result = getStatusCard(false, false, true, null);

		expect(result).toEqual({
			value: 'mon — active',
			sub: 'runs at 09:35',
			progress: 0,
			color: 'green',
		});
	});

	it('returns the "resting" state when it is not a trading day', () => {
		const result = getStatusCard(false, false, false, null);

		expect(result.value).toBe('mon — resting');
		expect(result.color).toBe('amber');
		expect(result.progress).toBe(100);
	});

	it('defaults the next resume day to "mon" when nextOpen is null', () => {
		const result = getStatusCard(false, false, false, null);

		expect(result.sub).toBe('resumes mon 09:35');
	});

	it('derives the next resume day from the nextOpen ISO date when provided', () => {
		const nextOpenISO = '2026-07-08T13:30:00.000Z';
		const expectedDay = DateTime.fromISO(nextOpenISO).toFormat('ccc').toLowerCase();

		const result = getStatusCard(false, false, false, nextOpenISO);

		expect(result.sub).toBe(`resumes ${expectedDay} 09:35`);
	});

	it('uses the current weekday from getBotRunWeekday, not derived from nextOpen', () => {
		vi.mocked(getBotRunWeekday).mockReturnValue('fri');

		const result = getStatusCard(false, true, true, null);

		expect(result.value).toBe('fri — done');
	});

	it('includes the formatted run time from getBotRunTimeDE in all states', () => {
		vi.mocked(getBotRunTimeDE).mockReturnValue('14:00');

		expect(getStatusCard(true, false, true, null).sub).toContain('14:00');
		expect(getStatusCard(false, true, true, null).sub).toContain('14:00');
		expect(getStatusCard(false, false, true, null).sub).toContain('14:00');
		expect(getStatusCard(false, false, false, null).sub).toContain('14:00');
	});
});

describe('getTradingDayProgress', () => {
	function setNYTime(hour: number, minute: number) {
		const ny = DateTime.fromObject(
			{ year: 2026, month: 7, day: 6, hour, minute },
			{ zone: 'America/New_York' },
		);
		Settings.now = () => ny.toMillis();
	}

	afterEach(() => {
		Settings.now = () => Date.now();
	});

	it('returns 0 exactly at market open (9:30 NY time)', () => {
		setNYTime(9, 30);

		expect(getTradingDayProgress()).toBe(0);
	});

	it('returns 100 exactly at market close (16:00 NY time)', () => {
		setNYTime(16, 0);

		expect(getTradingDayProgress()).toBe(100);
	});

	it('returns 0 (clamped) before market open', () => {
		setNYTime(8, 0);

		expect(getTradingDayProgress()).toBe(0);
	});

	it('returns 100 (clamped) after market close', () => {
		setNYTime(18, 0);

		expect(getTradingDayProgress()).toBe(100);
	});

	it('returns approximately 50 at the midpoint of the trading day', () => {
		setNYTime(12, 45);

		expect(getTradingDayProgress()).toBe(50);
	});

	it('returns a value strictly between 0 and 100 during trading hours', () => {
		setNYTime(11, 0);

		const result = getTradingDayProgress();

		expect(result).toBeGreaterThan(0);
		expect(result).toBeLessThan(100);
	});

	it('rounds to the nearest whole number', () => {
		setNYTime(10, 0);

		const result = getTradingDayProgress();

		expect(Number.isInteger(result)).toBe(true);
	});
});
