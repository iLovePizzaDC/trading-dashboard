import type { Trade } from '@/shared/types/trades';

export function computeTradeStats(trades: Trade[]) {
	const closedTrades = trades.filter((t) => t.action === 'sell' && t.pnl !== undefined);

	if (!closedTrades.length) return null;

	const wins = closedTrades.filter((t) => t.pnl! > 0);
	const losses = closedTrades.filter((t) => t.pnl! < 0);

	const totalTrades = closedTrades.length;

	const winRate = wins.length / totalTrades;

	const avgWin = wins.reduce((acc, t) => acc + t.pnl!, 0) / (wins.length || 1);

	const avgLoss = losses.reduce((acc, t) => acc + t.pnl!, 0) / (losses.length || 1);

	const grossWin = wins.reduce((acc, t) => acc + t.pnl!, 0);
	const grossLoss = Math.abs(losses.reduce((acc, t) => acc + t.pnl!, 0));

	const profitFactor = grossLoss === 0 ? Infinity : grossWin / grossLoss;

	const bestTrade = Math.max(...closedTrades.map((t) => t.pnl!));
	const worstTrade = Math.min(...closedTrades.map((t) => t.pnl!));

	const durations: number[] = [];

	const openMap = new Map<string, Trade>();

	trades.forEach((t) => {
		if (t.action === 'buy') {
			openMap.set(t.symbol, t);
		}

		if (t.action === 'sell') {
			const open = openMap.get(t.symbol);

			if (open) {
				const start = new Date(open.date).getTime();
				const end = new Date(t.date).getTime();

				const days = (end - start) / (1000 * 60 * 60 * 24);
				durations.push(days);

				openMap.delete(t.symbol);
			}
		}
	});

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
