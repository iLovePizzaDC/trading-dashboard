import type { SectorStat } from '@/features/sector/types/sector-breakdown';
import { SECTOR_MAP } from '@/shared/constants/sectors';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Trade } from '@/shared/types/trades';

export function calcSectorStats(decisions: DecisionEntry[], trades: Trade[]): SectorStat[] {
	const sells = trades.filter((t) => t.action === 'sell' && t.pnl !== undefined);
	const buys = trades.filter((t) => t.action === 'buy');

	const pnlBySymbol = sells.reduce<Record<string, number[]>>((acc, t) => {
		acc[t.symbol] = acc[t.symbol] ?? [];
		acc[t.symbol].push(t.pnl!);
		return acc;
	}, {});

	const buyDatesBySymbol = buys.reduce<Record<string, string[]>>((acc, t) => {
		acc[t.symbol] = acc[t.symbol] ?? [];
		acc[t.symbol].push(t.date);
		return acc;
	}, {});

	const momentumByDateSymbol = decisions.reduce<Record<string, Record<string, number | null>>>(
		(acc, entry) => {
			acc[entry.date] = Object.fromEntries(
				entry.candidates.map((c) => [c.symbol, c.momentum]),
			);
			return acc;
		},
		{},
	);

	const allSymbols = new Set([...Object.keys(pnlBySymbol), ...Object.keys(buyDatesBySymbol)]);

	return [...allSymbols]
		.map((symbol) => {
			const pnls = pnlBySymbol[symbol] ?? [];
			const buyDates = buyDatesBySymbol[symbol] ?? [];
			const momentums = buyDates
				.map((date) => momentumByDateSymbol[date]?.[symbol])
				.filter((m): m is number => m !== null && m !== undefined);
			const wins = pnls.filter((p) => p > 0);

			return {
				symbol,
				sector: SECTOR_MAP[symbol] ?? symbol,
				timesBought: buyDates.length,
				totalPnl: pnls.reduce((s, p) => s + p, 0),
				trades: pnls.length,
				winRate: pnls.length > 0 ? wins.length / pnls.length : 0,
				avgMomentumWhenBought:
					momentums.length > 0 ? momentums.reduce((s, m) => s + m, 0) / momentums.length : 0,
			};
		})
		.sort((a, b) => b.timesBought - a.timesBought);
}
