import type { ClosedTrade } from '@/features/trades/types/trade-statistics';
import type { Trade } from '@/shared/types/trades';
import { matchClosedTrades } from '@/shared/utils/trade-matching';
import { DateTime } from 'luxon';

export function computeTradeStats(trades: Trade[]) {
	const matched = matchClosedTrades(trades);

	const closedTrades: ClosedTrade[] = matched.map(({ buy, sell, pnl }) => ({
		...sell,
		pnl,
		openDate: buy.date,
		closeDate: sell.date,
	}));

	if (closedTrades.length === 0) return null;

	const wins = closedTrades.filter((t) => t.pnl > 0);
	const losses = closedTrades.filter((t) => t.pnl < 0);

	const totalTrades = closedTrades.length;
	const winRate = wins.length / totalTrades;

	const avgWin = wins.reduce((acc, t) => acc + t.pnl, 0) / (wins.length || 1);

	const avgLoss = losses.reduce((acc, t) => acc + t.pnl, 0) / (losses.length || 1);

	const grossWin = wins.reduce((acc, t) => acc + t.pnl, 0);
	const grossLoss = Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0));

	const profitFactor = grossLoss === 0 ? (grossWin > 0 ? grossWin : 0) : grossWin / grossLoss;

	const bestTradeDetails = closedTrades.reduce<ClosedTrade | null>(
		(best, t) => (best === null || t.pnl > best.pnl ? t : best),
		null,
	);

	const worstTradeDetails = closedTrades.reduce<ClosedTrade | null>(
		(worst, t) => (worst === null || t.pnl < worst.pnl ? t : worst),
		null,
	);

	const bestTrade = bestTradeDetails?.pnl ?? 0;
	const worstTrade = worstTradeDetails?.pnl ?? 0;

	const durations: number[] = [];

	for (const t of closedTrades) {
		const start = DateTime.fromISO(t.openDate);
		const end = DateTime.fromISO(t.closeDate);

		if (start.isValid && end.isValid) {
			durations.push(end.diff(start, 'days').days);
		}
	}

	const avgDuration = durations.reduce((a, b) => a + b, 0) / (durations.length || 1);

	return {
		winRate,
		avgWin,
		avgLoss,
		profitFactor,
		bestTrade,
		worstTrade,
		bestTradeDetails,
		worstTradeDetails,
		avgDuration,
		totalTrades,
	};
}
