import type { Range } from '@/shared/constants/date-range';

export function cutoffDate(range: Range): Date | null {
	const now = new Date();
	switch (range) {
		case '1W':
			return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
		case '1M':
			return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
		case '3M':
			return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
		case '6M':
			return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
		case 'YTD':
			return new Date(now.getFullYear(), 0, 1);
		case 'ALL':
			return null;
	}
}
