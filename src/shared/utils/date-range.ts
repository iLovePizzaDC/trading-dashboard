import type { Range } from '@/shared/constants/date-range';
import { DateTime } from 'luxon';

export function cutoffDate(range: Range): DateTime | null {
	const now = DateTime.now();

	switch (range) {
		case '1W':
			return now.minus({ weeks: 1 });

		case '1M':
			return now.minus({ months: 1 });

		case '3M':
			return now.minus({ months: 3 });

		case '6M':
			return now.minus({ months: 6 });

		case 'YTD':
			return now.startOf('year');

		case 'ALL':
			return null;
	}
}
