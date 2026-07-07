import { cutoffDate } from '@/shared/utils/date-range';
import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const FIXED_NOW = DateTime.fromISO('2026-07-04T12:00:00');

describe('cutoffDate', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(FIXED_NOW.toJSDate());
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns null for "ALL"', () => {
		expect(cutoffDate('ALL')).toBeNull();
	});

	it('returns exactly 1 week before now for "1W"', () => {
		const result = cutoffDate('1W');

		expect(result?.toISODate()).toBe(FIXED_NOW.minus({ weeks: 1 }).toISODate());
	});

	it('returns exactly 1 month before now for "1M"', () => {
		const result = cutoffDate('1M');

		expect(result?.toISODate()).toBe(FIXED_NOW.minus({ months: 1 }).toISODate());
	});

	it('returns exactly 3 months before now for "3M"', () => {
		const result = cutoffDate('3M');

		expect(result?.toISODate()).toBe(FIXED_NOW.minus({ months: 3 }).toISODate());
	});

	it('returns exactly 6 months before now for "6M"', () => {
		const result = cutoffDate('6M');

		expect(result?.toISODate()).toBe(FIXED_NOW.minus({ months: 6 }).toISODate());
	});

	it('returns the start of the current year for "YTD"', () => {
		const result = cutoffDate('YTD');

		expect(result?.toISODate()).toBe('2026-01-01');
		expect(result?.hour).toBe(0);
		expect(result?.minute).toBe(0);
		expect(result?.second).toBe(0);
	});

	it('returns a DateTime instance (not a plain string or Date) for non-ALL ranges', () => {
		const result = cutoffDate('1M');

		expect(result).toBeInstanceOf(DateTime);
	});

	it('preserves the time-of-day from now() for relative ranges like "1M" (only the date changes)', () => {
		const result = cutoffDate('1M');

		expect(result?.hour).toBe(FIXED_NOW.hour);
		expect(result?.minute).toBe(FIXED_NOW.minute);
	});
});
