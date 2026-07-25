import { getCurrentStop, groupTrades } from '@/features/trades/utils/trades-card';
import type { StopHistory } from '@/shared/types/stops';
import type { Trade } from '@/shared/types/trades';
import { symbolColor } from '@/shared/utils/symbol-colors';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/symbol-colors', () => ({
	symbolColor: vi.fn((symbol: string) => `color-for-${symbol}`),
}));

function buildTrade(overrides: Partial<Trade> = {}): Trade {
	return {
		symbol: 'XLK',
		action: 'buy',
		shares: 10,
		price: 100,
		date: '2026-07-01',
		...overrides,
	} as Trade;
}

describe('getCurrentStop', () => {
	it('returns the fallback when there is no history for the symbol', () => {
		expect(getCurrentStop('XLK', 90, {})).toBe(90);
	});

	it('returns the fallback when history for the symbol is an empty array', () => {
		expect(getCurrentStop('XLK', 90, { XLK: [] })).toBe(90);
	});

	it('returns the new_stop of the most recent history entry', () => {
		const stopHistory: StopHistory = {
			XLK: [
				{ date: '2026-07-01', old_stop: 0, new_stop: 90 },
				{ date: '2026-07-10', old_stop: 90, new_stop: 95 },
			],
		};

		expect(getCurrentStop('XLK', 80, stopHistory)).toBe(95);
	});

	it('picks the most recent entry regardless of input order', () => {
		const stopHistory: StopHistory = {
			XLK: [
				{ date: '2026-07-10', old_stop: 90, new_stop: 95 },
				{ date: '2026-07-01', old_stop: 0, new_stop: 90 },
			],
		};

		expect(getCurrentStop('XLK', 80, stopHistory)).toBe(95);
	});
});

describe('groupTrades', () => {
	it('returns an empty array when there are no trades', () => {
		expect(groupTrades([], {})).toEqual([]);
	});

	it('groups trades by symbol', () => {
		const trades = [
			buildTrade({ symbol: 'XLK' }),
			buildTrade({ symbol: 'XLF' }),
			buildTrade({ symbol: 'XLK' }),
		];

		const result = groupTrades(trades, {});

		expect(result).toHaveLength(2);
		expect(result.map((g) => g.symbol).sort()).toEqual(['XLF', 'XLK']);
	});

	it('assigns a color to each group using symbolColor', () => {
		const trades = [buildTrade({ symbol: 'XLK' })];

		const result = groupTrades(trades, {});

		expect(symbolColor).toHaveBeenCalledWith('XLK');
		expect(result[0].color).toBe('color-for-XLK');
	});

	it('sorts entries within a group by date ascending', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', date: '2026-07-10' }),
			buildTrade({ symbol: 'XLK', date: '2026-07-01' }),
			buildTrade({ symbol: 'XLK', date: '2026-07-05' }),
		];

		const result = groupTrades(trades, {});

		expect(result[0].entries.map((e) => e.date)).toEqual([
			'2026-07-01',
			'2026-07-05',
			'2026-07-10',
		]);
	});

	it('sums pnl across sell trades with a defined pnl', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', action: 'buy', pnl: undefined }),
			buildTrade({ symbol: 'XLK', action: 'sell', pnl: 50 }),
			buildTrade({ symbol: 'XLK', action: 'sell', pnl: -20 }),
		];

		const result = groupTrades(trades, {});

		expect(result[0].closedPnl).toBe(30);
	});

	it('treats a pnl of 0 as a defined value in the sum', () => {
		const trades = [buildTrade({ symbol: 'XLK', action: 'sell', pnl: 0 })];

		const result = groupTrades(trades, {});

		expect(result[0].closedPnl).toBe(0);
	});

	it('marks a group as open when there are more buys than sells', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', action: 'buy' }),
			buildTrade({ symbol: 'XLK', action: 'buy' }),
			buildTrade({ symbol: 'XLK', action: 'sell' }),
		];

		const result = groupTrades(trades, {});

		expect(result[0].isOpen).toBe(true);
	});

	it('marks a group as closed when buys equal sells', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', action: 'buy' }),
			buildTrade({ symbol: 'XLK', action: 'sell' }),
		];

		const result = groupTrades(trades, {});

		expect(result[0].isOpen).toBe(false);
	});

	it('marks a group as closed when sells exceed buys', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', action: 'buy' }),
			buildTrade({ symbol: 'XLK', action: 'sell' }),
			buildTrade({ symbol: 'XLK', action: 'sell' }),
		];

		const result = groupTrades(trades, {});

		expect(result[0].isOpen).toBe(false);
	});

	it('sets currentStop from stopHistory when the group is open and the last buy has a stop_price', () => {
		const trades = [buildTrade({ symbol: 'XLK', action: 'buy', stop_price: 85 })];
		const stopHistory: StopHistory = {
			XLK: [{ date: '2026-07-05', old_stop: 85, new_stop: 92 }],
		};

		const result = groupTrades(trades, stopHistory);

		expect(result[0].currentStop).toBe(92);
	});

	it('falls back to the last buy stop_price when there is no matching stop history', () => {
		const trades = [buildTrade({ symbol: 'XLK', action: 'buy', stop_price: 85 })];

		const result = groupTrades(trades, {});

		expect(result[0].currentStop).toBe(85);
	});

	it('leaves currentStop undefined when the group is closed', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', action: 'buy', stop_price: 85 }),
			buildTrade({ symbol: 'XLK', action: 'sell' }),
		];

		const result = groupTrades(trades, {});

		expect(result[0].currentStop).toBeUndefined();
	});

	it('leaves currentStop undefined when the last buy has no stop_price', () => {
		const trades = [buildTrade({ symbol: 'XLK', action: 'buy', stop_price: undefined })];

		const result = groupTrades(trades, {});

		expect(result[0].currentStop).toBeUndefined();
	});

	it('uses the most recent buy (by date) to determine currentStop when there are multiple buys', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', action: 'buy', date: '2026-07-01', stop_price: 80 }),
			buildTrade({ symbol: 'XLK', action: 'buy', date: '2026-07-05', stop_price: 90 }),
		];

		const result = groupTrades(trades, {});

		expect(result[0].currentStop).toBe(90);
	});

	it('sorts groups by their most recent entry date, descending', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', date: '2026-07-01' }),
			buildTrade({ symbol: 'XLF', date: '2026-07-10' }),
			buildTrade({ symbol: 'XLE', date: '2026-07-05' }),
		];

		const result = groupTrades(trades, {});

		expect(result.map((g) => g.symbol)).toEqual(['XLF', 'XLE', 'XLK']);
	});
});
