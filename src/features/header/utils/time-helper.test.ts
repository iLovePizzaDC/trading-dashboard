import {
	formatAsBerlinTime,
	formatNextOpen,
	getBotRunTimeDE,
	getNYTime,
	getWeekdayFromISO,
	getWeekdayNow,
	isInRunWindow,
	nextBusinessDay,
} from '@/features/header/utils/time-helper';
import { DateTime, Settings } from 'luxon';
import { afterEach, describe, expect, it } from 'vitest';

describe('getNYTime', () => {
	afterEach(() => {
		Settings.now = () => Date.now();
	});

	it('returns hours, minutes, and todayNY based on America/New_York time', () => {
		const ny = DateTime.fromObject(
			{ year: 2026, month: 7, day: 4, hour: 14, minute: 22 },
			{ zone: 'America/New_York' },
		);
		Settings.now = () => ny.toMillis();

		const result = getNYTime();

		expect(result).toEqual({ hours: 14, minutes: 22, todayNY: '2026-07-04' });
	});

	it('reflects a date change correctly around midnight NY time', () => {
		const ny = DateTime.fromObject(
			{ year: 2026, month: 7, day: 5, hour: 0, minute: 5 },
			{ zone: 'America/New_York' },
		);
		Settings.now = () => ny.toMillis();

		const result = getNYTime();

		expect(result.todayNY).toBe('2026-07-05');
	});
});

describe('isInRunWindow', () => {
	it('returns true exactly at RUN_START', () => {
		expect(isInRunWindow(16, 29)).toBe(true);
	});

	it('returns true exactly at RUN_END', () => {
		expect(isInRunWindow(16, 35)).toBe(true);
	});

	it('returns true for a time strictly between RUN_START and RUN_END', () => {
		expect(isInRunWindow(16, 30)).toBe(true);
	});

	it('returns false just before RUN_START', () => {
		expect(isInRunWindow(16, 28)).toBe(false);
	});

	it('returns false just after RUN_END', () => {
		expect(isInRunWindow(16, 36)).toBe(false);
	});

	it('returns false well outside the window', () => {
		expect(isInRunWindow(0, 0)).toBe(false);
		expect(isInRunWindow(23, 59)).toBe(false);
	});
});

describe('formatAsBerlinTime', () => {
	it('formats a UTC ISO string as HH:mm in Berlin time', () => {
		expect(formatAsBerlinTime('2026-07-04T10:00:00Z')).toBe('12:00');
	});

	it('respects the offset already present in the ISO string', () => {
		expect(formatAsBerlinTime('2026-07-04T06:00:00-04:00')).toBe('12:00');
	});

	it('returns "—" for an invalid ISO string', () => {
		expect(formatAsBerlinTime('not-a-date')).toBe('—');
	});

	it('handles winter time (CET, UTC+1) correctly', () => {
		expect(formatAsBerlinTime('2026-01-15T10:00:00Z')).toBe('11:00');
	});
});

describe('getBotRunTimeDE', () => {
	it('converts BOT_START_TIME_NY to Berlin time as HH:mm', () => {
		const result = getBotRunTimeDE();

		const expected = DateTime.fromObject({ hour: 16, minute: 30 }, { zone: 'America/New_York' })
			.setZone('Europe/Berlin')
			.toFormat('HH:mm');

		expect(result).toBe(expected);
	});

	it('returns a string in HH:mm format', () => {
		expect(getBotRunTimeDE()).toMatch(/^\d{2}:\d{2}$/);
	});
});

describe('formatNextOpen', () => {
	it('formats a valid ISO string as "opens <day> <time>" in Berlin time', () => {
		const result = formatNextOpen('2026-07-06T13:30:00Z');

		expect(result).toBe('opens mon 15:30');
	});

	it('returns "—" for an invalid ISO string', () => {
		expect(formatNextOpen('not-a-date')).toBe('—');
	});

	it('lowercases the weekday abbreviation', () => {
		const result = formatNextOpen('2026-07-06T13:30:00Z');

		expect(result).toMatch(/^opens [a-z]{3} \d{2}:\d{2}$/);
	});
});

describe('getWeekdayNow', () => {
	afterEach(() => {
		Settings.now = () => Date.now();
	});

	it('returns the current weekday abbreviation in lowercase, based on Berlin time', () => {
		const berlin = DateTime.fromObject(
			{ year: 2026, month: 7, day: 6, hour: 12, minute: 0 },
			{ zone: 'Europe/Berlin' },
		);
		Settings.now = () => berlin.toMillis();

		expect(getWeekdayNow()).toBe('mon');
	});

	it('rolls over to the next weekday around midnight Berlin time when UTC is still on the previous day', () => {
		const berlin = DateTime.fromObject(
			{ year: 2026, month: 7, day: 7, hour: 0, minute: 30 },
			{ zone: 'Europe/Berlin' },
		);
		Settings.now = () => berlin.toMillis();

		expect(getWeekdayNow()).toBe('tue');
	});
});

describe('getWeekdayFromISO', () => {
	it('returns the correct weekday abbreviation in Berlin time', () => {
		expect(getWeekdayFromISO('2026-07-06T13:30:00Z')).toBe('mon');
	});

	it('returns "—" for an invalid ISO string', () => {
		expect(getWeekdayFromISO('not-a-date')).toBe('—');
	});

	it('correctly shifts the weekday when UTC and Berlin time fall on different days', () => {
		expect(getWeekdayFromISO('2026-07-06T23:30:00Z')).toBe('tue');
	});
});

describe('nextBusinessDay', () => {
	it('returns the same date when it is a weekday (Monday)', () => {
		const monday = DateTime.fromObject({ year: 2026, month: 7, day: 6 });

		expect(nextBusinessDay(monday).toISODate()).toBe('2026-07-06');
	});

	it('returns the same date when it is a weekday (Friday)', () => {
		const friday = DateTime.fromObject({ year: 2026, month: 7, day: 10 });

		expect(nextBusinessDay(friday).toISODate()).toBe('2026-07-10');
	});

	it('advances Saturday to the following Monday', () => {
		const saturday = DateTime.fromObject({ year: 2026, month: 7, day: 11 });
		expect(saturday.weekday).toBe(6);

		expect(nextBusinessDay(saturday).toISODate()).toBe('2026-07-13');
	});

	it('advances Sunday to the following Monday', () => {
		const sunday = DateTime.fromObject({ year: 2026, month: 7, day: 12 });
		expect(sunday.weekday).toBe(7);

		expect(nextBusinessDay(sunday).toISODate()).toBe('2026-07-13');
	});
});
