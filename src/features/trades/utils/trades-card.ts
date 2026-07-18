import type { TradeGroup } from '@/features/trades/types/trades-card';
import type { StopHistory } from '@/shared/types/stops';
import type { Trade } from '@/shared/types/trades';
import { symbolColor } from '@/shared/utils/symbol-colors';

export function getCurrentStop(
  symbol: string,
  fallbackStop: number,
  stopHistory: StopHistory,
): number {
  const history = stopHistory[symbol];
  if (!history || history.length === 0) return fallbackStop;
  return [...history].sort((a, b) => b.date.localeCompare(a.date))[0].new_stop;
}

export function groupTrades(data: Trade[], stopHistory: StopHistory): TradeGroup[] {
  const map = new Map<string, Trade[]>();

  for (const t of data) {
    if (!map.has(t.symbol)) map.set(t.symbol, []);
    map.get(t.symbol)!.push(t);
  }

  const groups: TradeGroup[] = [];

  for (const [symbol, trades] of map) {
    const entries = [...trades].sort((a, b) => a.date.localeCompare(b.date));
    const closedPnl = entries
      .filter((t) => t.pnl !== undefined)
      .reduce((s, t) => s + (t.pnl ?? 0), 0);
    const buyCount = entries.filter((t) => t.action === 'buy').length;
    const sellCount = entries.filter((t) => t.action === 'sell').length;
    const isOpen = buyCount > sellCount;

    const lastBuy = [...entries].filter((t) => t.action === 'buy').at(-1);
    const currentStop =
      isOpen && lastBuy?.stop_price != null
        ? getCurrentStop(symbol, lastBuy.stop_price, stopHistory)
        : undefined;

    groups.push({
      symbol,
      color: symbolColor(symbol),
      entries,
      closedPnl,
      isOpen,
      currentStop,
    });
  }

  return groups.sort((a, b) => {
    const la = a.entries.at(-1)?.date ?? '';
    const lb = b.entries.at(-1)?.date ?? '';
    return lb.localeCompare(la);
  });
}
