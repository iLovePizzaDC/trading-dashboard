import { computeTradeStats } from '@/features/trades/utils/trades-statistics';
import type { Trade } from '@/shared/types/trades';
import { describe, expect, it } from 'vitest';

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

describe('computeTradeStats', () => {
  it('returns null when there are no trades', () => {
    expect(computeTradeStats([])).toBeNull();
  });

  it('returns null when there are only buys and no closed trades', () => {
    const trades = [buildTrade({ action: 'buy' })];

    expect(computeTradeStats(trades)).toBeNull();
  });

  it('returns null when a sell has no matching open position', () => {
    const trades = [buildTrade({ action: 'sell', symbol: 'ZZZ' })];

    expect(computeTradeStats(trades)).toBeNull();
  });

  it('computes stats for a single winning closed trade', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 120, shares: 10, date: '2026-07-10' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.totalTrades).toBe(1);
    expect(result?.winRate).toBe(1);
    expect(result?.bestTrade).toBe(200);
  });

  it('computes stats for a single losing closed trade', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 90, shares: 10, date: '2026-07-10' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.totalTrades).toBe(1);
    expect(result?.winRate).toBe(0);
    expect(result?.worstTrade).toBe(-100);
  });

  it('uses FIFO order when matching sells to buys for the same symbol', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'buy', price: 150, date: '2026-07-05' }),
      buildTrade({ action: 'sell', price: 120, shares: 10, date: '2026-07-10' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.bestTradeDetails?.openDate).toBe('2026-07-01');
    expect(result?.bestTrade).toBe(200);
  });

  it('matches the second buy in the FIFO queue for a second sell', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'buy', price: 150, date: '2026-07-05' }),
      buildTrade({ action: 'sell', price: 105, shares: 10, date: '2026-07-10' }),
      buildTrade({ action: 'sell', price: 200, shares: 10, date: '2026-07-15' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.totalTrades).toBe(2);
    expect(result?.bestTradeDetails?.openDate).toBe('2026-07-05');
    expect(result?.bestTrade).toBe(500);
  });

  it('ignores an extra sell with no remaining open position for that symbol', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 120, shares: 10, date: '2026-07-10' }),
      buildTrade({ action: 'sell', price: 130, shares: 10, date: '2026-07-15' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.totalTrades).toBe(1);
  });

  it('sorts trades by date before matching, regardless of input order', () => {
    const trades = [
      buildTrade({ action: 'sell', price: 120, shares: 10, date: '2026-07-10' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.totalTrades).toBe(1);
    expect(result?.bestTrade).toBe(200);
  });

  it('calculates winRate as wins divided by total closed trades', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 120, shares: 1, date: '2026-07-02' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-03' }),
      buildTrade({ action: 'sell', price: 90, shares: 1, date: '2026-07-04' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-05' }),
      buildTrade({ action: 'sell', price: 110, shares: 1, date: '2026-07-06' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-07' }),
      buildTrade({ action: 'sell', price: 80, shares: 1, date: '2026-07-08' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.winRate).toBe(0.5);
  });

  it('calculates avgWin as the average pnl of winning trades only', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 120, shares: 1, date: '2026-07-02' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-03' }),
      buildTrade({ action: 'sell', price: 140, shares: 1, date: '2026-07-04' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-05' }),
      buildTrade({ action: 'sell', price: 90, shares: 1, date: '2026-07-06' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.avgWin).toBe(30);
  });

  it('calculates avgLoss as the average pnl of losing trades only (negative)', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 80, shares: 1, date: '2026-07-02' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-03' }),
      buildTrade({ action: 'sell', price: 70, shares: 1, date: '2026-07-04' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.avgLoss).toBe(-25);
  });

  it('returns avgWin of 0 (not NaN) when there are no winning trades', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 90, shares: 1, date: '2026-07-02' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.avgWin).toBe(0);
  });

  it('returns avgLoss of 0 (not NaN) when there are no losing trades', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 110, shares: 1, date: '2026-07-02' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.avgLoss).toBe(0);
  });

  it('calculates profitFactor as gross wins divided by gross losses', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 150, shares: 1, date: '2026-07-02' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-03' }),
      buildTrade({ action: 'sell', price: 75, shares: 1, date: '2026-07-04' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.profitFactor).toBe(2);
  });

  it('returns profitFactor equal to grossWin when there are no losses', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 150, shares: 1, date: '2026-07-02' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.profitFactor).toBe(50);
  });

  it('returns profitFactor of 0 when there are no wins and no losses (all break-even)', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 100, shares: 1, date: '2026-07-02' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.profitFactor).toBe(0);
  });

  it('identifies the best and worst trade details correctly among multiple trades', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 150, shares: 1, date: '2026-07-02' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-03' }),
      buildTrade({ action: 'sell', price: 60, shares: 1, date: '2026-07-04' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-05' }),
      buildTrade({ action: 'sell', price: 120, shares: 1, date: '2026-07-06' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.bestTrade).toBe(50);
    expect(result?.worstTrade).toBe(-40);
    expect(result?.bestTradeDetails?.closeDate).toBe('2026-07-02');
    expect(result?.worstTradeDetails?.closeDate).toBe('2026-07-04');
  });

  it('calculates avgDuration in days between openDate and closeDate', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 110, shares: 1, date: '2026-07-11' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.avgDuration).toBe(10);
  });

  it('averages duration across multiple closed trades', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 110, shares: 1, date: '2026-07-06' }),
      buildTrade({ action: 'buy', price: 100, date: '2026-07-10' }),
      buildTrade({ action: 'sell', price: 90, shares: 1, date: '2026-07-30' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.avgDuration).toBe(12.5);
  });

  it('attaches pnl, openDate, and closeDate to each closed trade', () => {
    const trades = [
      buildTrade({ action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', price: 120, shares: 2, date: '2026-07-10' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.bestTradeDetails).toMatchObject({
      pnl: 40,
      openDate: '2026-07-01',
      closeDate: '2026-07-10',
    });
  });

  it('processes multiple symbols independently in FIFO order', () => {
    const trades = [
      buildTrade({ symbol: 'XLK', action: 'buy', price: 100, date: '2026-07-01' }),
      buildTrade({ symbol: 'XLF', action: 'buy', price: 40, date: '2026-07-01' }),
      buildTrade({ symbol: 'XLK', action: 'sell', price: 110, shares: 1, date: '2026-07-05' }),
      buildTrade({ symbol: 'XLF', action: 'sell', price: 35, shares: 1, date: '2026-07-05' }),
    ];

    const result = computeTradeStats(trades);

    expect(result?.totalTrades).toBe(2);
  });
});
