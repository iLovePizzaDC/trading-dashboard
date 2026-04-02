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
