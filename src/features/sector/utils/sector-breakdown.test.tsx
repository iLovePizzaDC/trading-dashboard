import { calcSectorStats } from '@/features/sector/utils/sector-breakdown';
import type { Candidate, DecisionEntry } from '@/shared/types/decisions';
import type { Trade } from '@/shared/types/trades';
import { describe, expect, it } from 'vitest';

function buildTrade(overrides: Partial<Trade> = {}): Trade {
	return {
		date: '2026-07-01',
		symbol: 'XLK',
		action: 'sell',
		shares: 10,
		price: 100,
		pnl: 50,
		...overrides,
	} as Trade;
}

function buildCandidate(overrides: Partial<Candidate> = {}): Candidate {
	return {
		symbol: 'XLK',
		momentum: 0.1,
		passes_trend: true,
		selected: true,
		rejected_reason: null,
		...overrides,
	} as Candidate;
}

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
	return {
		date: '2026-07-01',
		candidates: [],
		...overrides,
	} as DecisionEntry;
}

describe('calcSectorStats', () => {
	it('returns an empty array when there are no decisions or trades', () => {
		expect(calcSectorStats([], [])).toEqual([]);
	});

	it('maps a symbol to its sector name using SECTOR_MAP', () => {
		const trades = [buildTrade({ symbol: 'XLK' })];

		const result = calcSectorStats([], trades);

		expect(result[0].sector).toBe('Technology');
	});

	it('falls back to the symbol itself when no sector name exists', () => {
		const trades = [buildTrade({ symbol: 'ZZZ' })];

		const result = calcSectorStats([], trades);

		expect(result[0].sector).toBe('ZZZ');
	});

	it('includes buy trades as timesBought without contributing to PnL', () => {
		const trades = [buildTrade({ action: 'buy', pnl: undefined })];

		const result = calcSectorStats([], trades);

		expect(result).toHaveLength(1);
		expect(result[0].timesBought).toBe(1);
		expect(result[0].trades).toBe(0);
		expect(result[0].totalPnl).toBe(0);
	});

	it('excludes sell trades with an undefined pnl', () => {
		const trades = [buildTrade({ action: 'sell', pnl: undefined })];

		const result = calcSectorStats([], trades);

		expect(result).toEqual([]);
	});

	it('includes a sell trade with a pnl of 0', () => {
		const trades = [buildTrade({ action: 'sell', pnl: 0 })];

		const result = calcSectorStats([], trades);

		expect(result).toHaveLength(1);
		expect(result[0].trades).toBe(1);
	});

	it('sums totalPnl across multiple sell trades for the same symbol', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', pnl: 50 }),
			buildTrade({ symbol: 'XLK', pnl: -20 }),
			buildTrade({ symbol: 'XLK', pnl: 30 }),
		];

		const result = calcSectorStats([], trades);

		expect(result[0].totalPnl).toBe(60);
	});

	it('counts the number of sell trades correctly', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', pnl: 50 }),
			buildTrade({ symbol: 'XLK', pnl: -20 }),
		];

		const result = calcSectorStats([], trades);

		expect(result[0].trades).toBe(2);
	});

	it('calculates winRate as the fraction of trades with positive pnl', () => {
		const trades = [
			buildTrade({ symbol: 'XLK', pnl: 50 }),
			buildTrade({ symbol: 'XLK', pnl: -20 }),
			buildTrade({ symbol: 'XLK', pnl: 30 }),
			buildTrade({ symbol: 'XLK', pnl: -10 }),
		];

		const result = calcSectorStats([], trades);

		expect(result[0].winRate).toBe(0.5);
	});

	it('does not count a pnl of exactly 0 as a win', () => {
		const trades = [buildTrade({ symbol: 'XLK', pnl: 0 }), buildTrade({ symbol: 'XLK', pnl: 10 })];

		const result = calcSectorStats([], trades);

		expect(result[0].winRate).toBe(0.5);
	});

	it('returns a winRate of 0 when there are no sell trades for a symbol', () => {
		const trades = [buildTrade({ action: 'buy', pnl: undefined })];

		const result = calcSectorStats([], trades);

		expect(result[0].winRate).toBe(0);
	});

	it('counts timesBought from buy trades, not from selected decision candidates', () => {
		const trades = [
			buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-01', pnl: undefined }),
			buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-02', pnl: undefined }),
		];
		const decisions = [
			buildDecision({
				candidates: [
					buildCandidate({ symbol: 'XLK', selected: true, momentum: 0.1 }),
					buildCandidate({ symbol: 'XLF', selected: true, momentum: 0.2 }),
					buildCandidate({ symbol: 'XLF', selected: false, momentum: 0.3 }),
				],
			}),
		];

		const result = calcSectorStats(decisions, trades);

		expect(result.map((r) => r.symbol)).toEqual(['XLK']);
		expect(result[0].timesBought).toBe(2);
	});

	it('aggregates timesBought across multiple buy trades', () => {
		const trades = [
			buildTrade({ action: 'buy', date: '2026-07-01', pnl: undefined }),
			buildTrade({ action: 'buy', date: '2026-07-02', pnl: undefined }),
		];

		const result = calcSectorStats([], trades);

		expect(result[0].timesBought).toBe(2);
	});

	it('calculates avgMomentumWhenBought from decision momentum on buy dates', () => {
		const trades = [
			buildTrade({ action: 'buy', date: '2026-07-01', pnl: undefined }),
			buildTrade({ action: 'buy', date: '2026-07-02', pnl: undefined }),
		];
		const decisions = [
			buildDecision({
				date: '2026-07-01',
				candidates: [buildCandidate({ symbol: 'XLK', momentum: 0.1 })],
			}),
			buildDecision({
				date: '2026-07-02',
				candidates: [buildCandidate({ symbol: 'XLK', momentum: 0.3 })],
			}),
		];

		const result = calcSectorStats(decisions, trades);

		expect(result[0].avgMomentumWhenBought).toBeCloseTo(0.2);
	});

	it('uses the nearest prior decision date when the buy date has no exact momentum match', () => {
		const trades = [buildTrade({ action: 'buy', date: '2026-07-03', pnl: undefined })];
		const decisions = [
			buildDecision({
				date: '2026-07-01',
				candidates: [buildCandidate({ symbol: 'XLK', momentum: 0.2 })],
			}),
		];

		const result = calcSectorStats(decisions, trades);

		expect(result[0].avgMomentumWhenBought).toBe(0.2);
	});

	it('returns avgMomentumWhenBought of 0 when no matching decision momentum exists', () => {
		const trades = [buildTrade({ action: 'buy', pnl: undefined })];

		const result = calcSectorStats([], trades);

		expect(result[0].avgMomentumWhenBought).toBe(0);
	});

	it('returns timesBought of 0 for a symbol that only has sells', () => {
		const trades = [buildTrade({ action: 'sell', symbol: 'XLK', pnl: 10 })];

		const result = calcSectorStats([], trades);

		expect(result[0].timesBought).toBe(0);
	});

	it('includes a symbol from sells even if it has no buys', () => {
		const trades = [buildTrade({ symbol: 'ZZZ' })];

		const result = calcSectorStats([], trades);

		expect(result.map((r) => r.symbol)).toContain('ZZZ');
	});

	it('does not include a symbol that was only shortlisted, never bought', () => {
		const decisions = [
			buildDecision({ candidates: [buildCandidate({ symbol: 'ZZZ', selected: true })] }),
		];

		const result = calcSectorStats(decisions, []);

		expect(result).toEqual([]);
	});

	it('deduplicates a symbol that appears in both buys and sells', () => {
		const trades = [
			buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-01', pnl: undefined }),
			buildTrade({ action: 'sell', symbol: 'XLK', pnl: 50 }),
		];

		const result = calcSectorStats([], trades);

		expect(result).toHaveLength(1);
		expect(result[0].timesBought).toBe(1);
		expect(result[0].trades).toBe(1);
	});

	it('sorts results by timesBought descending', () => {
		const trades = [
			buildTrade({ action: 'buy', symbol: 'AAA', date: '2026-07-01', pnl: undefined }),
			buildTrade({ action: 'buy', symbol: 'BBB', date: '2026-07-01', pnl: undefined }),
			buildTrade({ action: 'buy', symbol: 'BBB', date: '2026-07-02', pnl: undefined }),
			buildTrade({ action: 'buy', symbol: 'CCC', date: '2026-07-01', pnl: undefined }),
			buildTrade({ action: 'buy', symbol: 'CCC', date: '2026-07-02', pnl: undefined }),
			buildTrade({ action: 'buy', symbol: 'CCC', date: '2026-07-03', pnl: undefined }),
		];

		const result = calcSectorStats([], trades);

		expect(result.map((r) => r.symbol)).toEqual(['CCC', 'BBB', 'AAA']);
	});

	it('keeps symbols with 0 timesBought at the end when sorted', () => {
		const trades = [
			buildTrade({ action: 'sell', symbol: 'ZZZ', pnl: 10 }),
			buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-01', pnl: undefined }),
		];

		const result = calcSectorStats([], trades);

		expect(result[0].symbol).toBe('XLK');
		expect(result[1].symbol).toBe('ZZZ');
	});
});
