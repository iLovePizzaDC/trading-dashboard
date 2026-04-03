import type { Range } from '@/features/equity/constants/equity';
import type { MonthlyReturn } from '@/features/equity/types/heatmap';
import type { EquityPoint } from '@/shared/types/equity';

export function calcMonthlyReturns(data: EquityPoint[]): MonthlyReturn[] {
	if (data.length < 2) return [];

	const byMonth = data.reduce<Record<string, EquityPoint[]>>((acc, point) => {
		const key = point.date.slice(0, 7);
		acc[key] = acc[key] ?? [];
		acc[key].push(point);
		return acc;
	}, {});

	return Object.entries(byMonth)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, points]) => {
			const [year, month] = key.split('-').map(Number);
			const start = points[0].equity;
			const end = points[points.length - 1].equity;
			return {
				year,
				month,
				return: ((end - start) / start) * 100,
				startEquity: start,
				endEquity: end,
			};
		});
}

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
