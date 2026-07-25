import type { SectorStat } from '@/features/sector/types/sector-breakdown';
import { SECTOR_MAP } from '@/shared/constants/sectors';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Trade } from '@/shared/types/trades';

export function calcSectorStats(decisions: DecisionEntry[], trades: Trade[]): SectorStat[] {
	const sells = trades.filter((t) => t.action === 'sell' && t.pnl !== undefined);

	const pnlBySymbol = sells.reduce<Record<string, number[]>>((acc, t) => {
		acc[t.symbol] = acc[t.symbol] ?? [];
		acc[t.symbol].push(t.pnl!);
		return acc;
	}, {});

	const selectionBySymbol = decisions.reduce<Record<string, number[]>>((acc, entry) => {
		entry.candidates
			.filter((c) => c.selected && c.momentum !== null)
			.forEach((c) => {
				acc[c.symbol] = acc[c.symbol] ?? [];
				acc[c.symbol].push(c.momentum!);
			});
		return acc;
	}, {});

	const allSymbols = new Set([...Object.keys(pnlBySymbol), ...Object.keys(selectionBySymbol)]);

	return [...allSymbols]
		.map((symbol) => {
			const pnls = pnlBySymbol[symbol] ?? [];
			const momentums = selectionBySymbol[symbol] ?? [];
			const wins = pnls.filter((p) => p > 0);

			return {
				symbol,
				sector: SECTOR_MAP[symbol] ?? symbol,
				timesSelected: momentums.length,
				totalPnl: pnls.reduce((s, p) => s + p, 0),
				trades: pnls.length,
				winRate: pnls.length > 0 ? wins.length / pnls.length : 0,
				avgMomentumWhenSelected:
					momentums.length > 0 ? momentums.reduce((s, m) => s + m, 0) / momentums.length : 0,
			};
		})
		.sort((a, b) => b.timesSelected - a.timesSelected);
}
