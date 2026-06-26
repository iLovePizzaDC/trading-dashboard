import type { ClosedTrade } from '@/features/trades/types/trade-statistics';
import type { Trade } from '@/shared/types/trades';
import { DateTime } from 'luxon';

export function computeTradeStats(trades: Trade[]) {
	const sorted = [...trades].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	const openPositions = new Map<string, Trade[]>();
	const closedTrades: ClosedTrade[] = [];

	for (const t of sorted) {
		if (t.action === 'buy') {
			const list = openPositions.get(t.symbol) ?? [];
			list.push(t);
			openPositions.set(t.symbol, list);
		}

		if (t.action === 'sell') {
			const queue = openPositions.get(t.symbol);

			if (!queue || queue.length === 0) continue;

			const buy = queue.shift();
			if (!buy) continue;

			const pnl = (t.price - buy.price) * t.shares;

			closedTrades.push({
				...t,
				pnl,
				openDate: buy.date,
				closeDate: t.date,
			});
		}
	}

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

	const bestTrade = Math.max(...closedTrades.map((t) => t.pnl));
	const worstTrade = Math.min(...closedTrades.map((t) => t.pnl));

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
		avgDuration,
		totalTrades,
	};
}
