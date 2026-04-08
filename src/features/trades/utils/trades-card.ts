import type { TradeGroup } from '@/features/trades/types/trades-card';
import type { Trade } from '@/shared/types/trades';
import { symbolColor } from '@/shared/utils/symbol-colors';

export function groupTrades(data: Trade[]): TradeGroup[] {
	const map = new Map<string, Trade[]>();

	for (const t of data) {
		if (!map.has(t.symbol)) map.set(t.symbol, []);
		map.get(t.symbol)!.push(t);
	}

	let colorIdx = 0;
	const groups: TradeGroup[] = [];

	for (const [symbol, trades] of map) {
		const entries = [...trades].sort((a, b) => a.date.localeCompare(b.date));
		const closedPnl = entries
			.filter((t) => t.pnl !== undefined)
			.reduce((s, t) => s + (t.pnl ?? 0), 0);
		const buyCount = entries.filter((t) => t.action === 'buy').length;
		const sellCount = entries.filter((t) => t.action === 'sell').length;

		groups.push({
			symbol,
			color: symbolColor(symbol),
			entries,
			closedPnl,
			isOpen: buyCount > sellCount,
		});
		colorIdx++;
	}

	return groups.sort((a, b) => {
		const la = a.entries.at(-1)?.date ?? '';
		const lb = b.entries.at(-1)?.date ?? '';
		return lb.localeCompare(la);
	});
}
