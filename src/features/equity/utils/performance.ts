import type { MonthlyReturn } from '@/features/equity/types/heatmap';
import type { Deposit } from '@/shared/types/deposits';
import type { EquityPoint } from '@/shared/types/equity';

export function calcMonthlyReturns(data: EquityPoint[], deposits: Deposit[]): MonthlyReturn[] {
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

			const depositsDuringMonth = deposits
				.filter((d) => d.date.startsWith(key) && d.date > points[0].date)
				.reduce((sum, d) => sum + d.amount, 0);

			const adjustedEnd = end - depositsDuringMonth;
			const ret = start > 0 ? ((adjustedEnd - start) / start) * 100 : 0;

			return {
				year,
				month,
				return: ret,
				startEquity: start,
				endEquity: adjustedEnd,
			};
		});
}
