import type { Trade } from '@/shared/types/trades';
import { matchClosedTrades } from '@/shared/utils/trade-matching';
import { describe, expect, it } from 'vitest';

function buildTrade(overrides: Partial<Trade> = {}): Trade {
	return {
		symbol: 'XLK',
		action: 'buy',
		shares: 10,
		price: 100,
		date: '2026-07-01',
		...overrides,
	};
}

describe('matchClosedTrades', () => {
	it('matches sells to buys in FIFO order', () => {
		const trades = [
			buildTrade({ action: 'buy', date: '2026-07-01', price: 90 }),
			buildTrade({ action: 'buy', date: '2026-07-05', price: 100 }),
			buildTrade({ action: 'sell', date: '2026-07-10', price: 110, shares: 5 }),
		];

		const result = matchClosedTrades(trades);

		expect(result).toHaveLength(1);
		expect(result[0].buy.price).toBe(90);
		expect(result[0].sell.price).toBe(110);
		expect(result[0].pnl).toBe(100);
	});

	it('consumes each buy once so a second sell without inventory is excluded', () => {
		const trades = [
			buildTrade({ action: 'buy', date: '2026-07-01', price: 100 }),
			buildTrade({ action: 'sell', date: '2026-07-05', price: 110, shares: 5 }),
			buildTrade({ action: 'sell', date: '2026-07-10', price: 120, shares: 3 }),
		];

		const result = matchClosedTrades(trades);

		expect(result).toHaveLength(1);
		expect(result[0].sell.date).toBe('2026-07-05');
	});

	it('prefers bot-provided sell.pnl over a price-based calculation', () => {
		const trades = [
			buildTrade({ action: 'buy', date: '2026-07-01', price: 100 }),
			buildTrade({
				action: 'sell',
				date: '2026-07-10',
				price: 110,
				shares: 5,
				pnl: 42,
			}),
		];

		const result = matchClosedTrades(trades);

		expect(result[0].pnl).toBe(42);
	});

	it('matches same-day buy then sell', () => {
		const trades = [
			buildTrade({ action: 'sell', date: '2026-07-01', price: 105 }),
			buildTrade({ action: 'buy', date: '2026-07-01', price: 100 }),
		];

		const result = matchClosedTrades(trades);

		expect(result).toHaveLength(1);
		expect(result[0].buy.price).toBe(100);
		expect(result[0].sell.price).toBe(105);
	});
});
