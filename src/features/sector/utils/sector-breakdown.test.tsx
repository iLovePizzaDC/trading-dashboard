import { calcSectorStats } from '@/features/sector/utils/sector-breakdown';
import type { Candidate, DecisionEntry } from '@/shared/types/decisions';
import type { Trade } from '@/shared/types/trades';
import { describe, expect, it } from 'vitest';

function buildTrade(overrides: Partial<Trade> = {}): Trade {
  return {
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

  it('excludes buy trades from PnL calculations', () => {
    const trades = [buildTrade({ action: 'buy', pnl: 999 })];

    const result = calcSectorStats([], trades);

    expect(result).toEqual([]);
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

  it('returns a winRate of 0 when there are no trades for a symbol', () => {
    const decisions = [
      buildDecision({ candidates: [buildCandidate({ symbol: 'XLK', selected: true })] }),
    ];

    const result = calcSectorStats(decisions, []);

    expect(result[0].winRate).toBe(0);
  });

  it('counts timesSelected only for selected candidates with non-null momentum', () => {
    const decisions = [
      buildDecision({
        candidates: [
          buildCandidate({ symbol: 'XLK', selected: true, momentum: 0.1 }),
          buildCandidate({ symbol: 'XLK', selected: false, momentum: 0.2 }),
          buildCandidate({ symbol: 'XLK', selected: true, momentum: null }),
        ],
      }),
    ];

    const result = calcSectorStats(decisions, []);

    expect(result[0].timesSelected).toBe(1);
  });

  it('aggregates timesSelected across multiple decision entries', () => {
    const decisions = [
      buildDecision({
        date: '2026-07-01',
        candidates: [buildCandidate({ symbol: 'XLK', selected: true, momentum: 0.1 })],
      }),
      buildDecision({
        date: '2026-07-02',
        candidates: [buildCandidate({ symbol: 'XLK', selected: true, momentum: 0.2 })],
      }),
    ];

    const result = calcSectorStats(decisions, []);

    expect(result[0].timesSelected).toBe(2);
  });

  it('calculates avgMomentumWhenSelected as the average of momentum values when selected', () => {
    const decisions = [
      buildDecision({
        candidates: [
          buildCandidate({ symbol: 'XLK', selected: true, momentum: 0.1 }),
          buildCandidate({ symbol: 'XLK', selected: true, momentum: 0.3 }),
        ],
      }),
    ];

    const result = calcSectorStats(decisions, []);

    expect(result[0].avgMomentumWhenSelected).toBeCloseTo(0.2);
  });

  it('returns avgMomentumWhenSelected of 0 when the symbol was never selected', () => {
    const trades = [buildTrade({ symbol: 'XLK' })];

    const result = calcSectorStats([], trades);

    expect(result[0].avgMomentumWhenSelected).toBe(0);
  });

  it('returns timesSelected of 0 for a symbol that only has trades, no selections', () => {
    const trades = [buildTrade({ symbol: 'XLK' })];

    const result = calcSectorStats([], trades);

    expect(result[0].timesSelected).toBe(0);
  });

  it('includes a symbol from trades even if it has no matching decisions', () => {
    const trades = [buildTrade({ symbol: 'ZZZ' })];

    const result = calcSectorStats([], trades);

    expect(result.map((r) => r.symbol)).toContain('ZZZ');
  });

  it('includes a symbol from decisions even if it has no matching trades', () => {
    const decisions = [
      buildDecision({ candidates: [buildCandidate({ symbol: 'ZZZ', selected: true })] }),
    ];

    const result = calcSectorStats(decisions, []);

    expect(result.map((r) => r.symbol)).toContain('ZZZ');
  });

  it('deduplicates a symbol that appears in both trades and decisions', () => {
    const trades = [buildTrade({ symbol: 'XLK' })];
    const decisions = [
      buildDecision({ candidates: [buildCandidate({ symbol: 'XLK', selected: true })] }),
    ];

    const result = calcSectorStats(decisions, trades);

    expect(result).toHaveLength(1);
    expect(result[0].timesSelected).toBe(1);
    expect(result[0].trades).toBe(1);
  });

  it('sorts results by timesSelected descending', () => {
    const decisions = [
      buildDecision({
        candidates: [
          buildCandidate({ symbol: 'AAA', selected: true, momentum: 0.1 }),
          buildCandidate({ symbol: 'BBB', selected: true, momentum: 0.1 }),
          buildCandidate({ symbol: 'BBB', selected: true, momentum: 0.2 }),
          buildCandidate({ symbol: 'CCC', selected: true, momentum: 0.1 }),
          buildCandidate({ symbol: 'CCC', selected: true, momentum: 0.2 }),
          buildCandidate({ symbol: 'CCC', selected: true, momentum: 0.3 }),
        ],
      }),
    ];

    const result = calcSectorStats(decisions, []);

    expect(result.map((r) => r.symbol)).toEqual(['CCC', 'BBB', 'AAA']);
  });

  it('keeps symbols with 0 timesSelected at the end when sorted', () => {
    const trades = [buildTrade({ symbol: 'ZZZ', pnl: 10 })];
    const decisions = [
      buildDecision({
        candidates: [buildCandidate({ symbol: 'XLK', selected: true, momentum: 0.1 })],
      }),
    ];

    const result = calcSectorStats(decisions, trades);

    expect(result[0].symbol).toBe('XLK');
    expect(result[1].symbol).toBe('ZZZ');
  });
});
