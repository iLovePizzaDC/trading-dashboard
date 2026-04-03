import type { ScatterPoint } from '@/features/trades/types/scatter';
import type { Trade } from '@/shared/types/trades';

export function buildScatterData(trades: Trade[]): ScatterPoint[] {
	const buys = trades.filter((t) => t.action === 'buy');
	const sells = trades.filter((t) => t.action === 'sell');

	return sells
		.map((sell) => {
			const buy = buys.findLast((b) => b.symbol === sell.symbol && b.date <= sell.date);
			if (!buy) return null;
			return {
				symbol: sell.symbol,
				entryPrice: buy.price,
				exitPrice: sell.price,
				pnl: sell.pnl ?? 0,
				date: sell.date,
			};
		})
		.filter((p): p is ScatterPoint => p !== null);
}
