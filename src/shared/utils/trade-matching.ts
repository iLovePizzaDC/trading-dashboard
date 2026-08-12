import type { Trade } from '@/shared/types/trades';

export type ClosedTradeMatch = {
	buy: Trade;
	sell: Trade;
	pnl: number;
};

export function matchClosedTrades(trades: Trade[]): ClosedTradeMatch[] {
	const sorted = [...trades].sort((a, b) => {
		const byDate = a.date.localeCompare(b.date);
		if (byDate !== 0) return byDate;
		if (a.action === b.action) return 0;
		return a.action === 'buy' ? -1 : 1;
	});

	const openPositions = new Map<string, Trade[]>();
	const closed: ClosedTradeMatch[] = [];

	for (const t of sorted) {
		if (t.action === 'buy') {
			const list = openPositions.get(t.symbol) ?? [];
			list.push(t);
			openPositions.set(t.symbol, list);
			continue;
		}

		if (t.action === 'sell') {
			const queue = openPositions.get(t.symbol);
			if (!queue || queue.length === 0) continue;

			const buy = queue.shift();
			if (!buy) continue;

			const pnl = t.pnl ?? (t.price - buy.price) * t.shares;
			closed.push({ buy, sell: t, pnl });
		}
	}

	return closed;
}
