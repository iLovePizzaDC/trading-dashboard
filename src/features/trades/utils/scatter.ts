import type { ScatterPoint } from '@/features/trades/types/scatter';
import type { Range } from '@/shared/constants/date-range';
import type { Trade } from '@/shared/types/trades';
import { cutoffDate } from '@/shared/utils/date-range';
import { matchClosedTrades } from '@/shared/utils/trade-matching';
import { DateTime } from 'luxon';

export function buildScatterData(trades: Trade[]): ScatterPoint[] {
	return matchClosedTrades(trades).map(({ buy, sell, pnl }) => ({
		symbol: sell.symbol,
		entryPrice: buy.price,
		exitPrice: sell.price,
		pnl,
		date: sell.date,
	}));
}

export function filterScatterPointsByRange(points: ScatterPoint[], range: Range): ScatterPoint[] {
	const cutoff = cutoffDate(range);
	if (!cutoff) return points;

	return points.filter((point) => {
		const dt = DateTime.fromISO(point.date, { zone: 'America/New_York' }).startOf('day');
		return dt >= cutoff.startOf('day');
	});
}
