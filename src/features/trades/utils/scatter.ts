import type { ScatterPoint } from '@/features/trades/types/scatter';
import type { Trade } from '@/shared/types/trades';
import { matchClosedTrades } from '@/shared/utils/trade-matching';

export function buildScatterData(trades: Trade[]): ScatterPoint[] {
	return matchClosedTrades(trades).map(({ buy, sell, pnl }) => ({
		symbol: sell.symbol,
		entryPrice: buy.price,
		exitPrice: sell.price,
		pnl,
		date: sell.date,
	}));
}
