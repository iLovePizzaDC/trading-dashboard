import { buildScatterData } from '@/features/trades/utils/scatter';
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

describe('buildScatterData', () => {
  it('returns an empty array when there are no trades', () => {
    expect(buildScatterData([])).toEqual([]);
  });

  it('returns an empty array when there are only buys and no sells', () => {
    const trades = [buildTrade({ action: 'buy' })];

    expect(buildScatterData(trades)).toEqual([]);
  });

  it('pairs a sell with its matching earlier buy', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLK', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', symbol: 'XLK', price: 110, shares: 5, date: '2026-07-10' }),
    ];

    const result = buildScatterData(trades);

    expect(result).toEqual([
      { symbol: 'XLK', entryPrice: 100, exitPrice: 110, pnl: 50, date: '2026-07-10' },
    ]);
  });

  it('excludes a sell when there is no matching buy for that symbol', () => {
    const trades = [buildTrade({ action: 'sell', symbol: 'ZZZ', date: '2026-07-10' })];

    expect(buildScatterData(trades)).toEqual([]);
  });

  it('excludes a sell when the only buy for that symbol happened after the sell', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-10' }),
      buildTrade({ action: 'sell', symbol: 'XLK', date: '2026-07-01' }),
    ];

    expect(buildScatterData(trades)).toEqual([]);
  });

  it('includes a buy that happened on the same date as the sell', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-01', price: 100 }),
      buildTrade({ action: 'sell', symbol: 'XLK', date: '2026-07-01', price: 105 }),
    ];

    const result = buildScatterData(trades);

    expect(result).toHaveLength(1);
    expect(result[0].entryPrice).toBe(100);
  });

  it('uses the most recent eligible buy (closest date) when multiple buys exist for the same symbol', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-01', price: 90 }),
      buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-05', price: 100 }),
      buildTrade({ action: 'sell', symbol: 'XLK', date: '2026-07-10', price: 110 }),
    ];

    const result = buildScatterData(trades);

    expect(result[0].entryPrice).toBe(100);
  });

  it('does not match a buy that occurs after the most recent eligible buy but before the sell incorrectly', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-01', price: 90 }),
      buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-15', price: 120 }),
      buildTrade({ action: 'sell', symbol: 'XLK', date: '2026-07-10', price: 110 }),
    ];

    const result = buildScatterData(trades);

    expect(result[0].entryPrice).toBe(90);
  });

  it('does not match a buy or sell of a different symbol', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLF', date: '2026-07-01', price: 40 }),
      buildTrade({ action: 'sell', symbol: 'XLK', date: '2026-07-10', price: 110 }),
    ];

    expect(buildScatterData(trades)).toEqual([]);
  });

  it('calculates pnl as (exitPrice - entryPrice) * shares', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLK', price: 100 }),
      buildTrade({ action: 'sell', symbol: 'XLK', price: 80, shares: 5, date: '2026-07-10' }),
    ];

    const result = buildScatterData(trades);

    expect(result[0].pnl).toBe(-100);
  });

  it('allows the same buy to be reused for multiple sells of the same symbol', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLK', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', symbol: 'XLK', price: 110, date: '2026-07-05', shares: 5 }),
      buildTrade({ action: 'sell', symbol: 'XLK', price: 120, date: '2026-07-10', shares: 3 }),
    ];

    const result = buildScatterData(trades);

    expect(result).toHaveLength(2);
    expect(result[0].entryPrice).toBe(100);
    expect(result[1].entryPrice).toBe(100);
  });

  it('processes multiple unrelated symbols independently', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLK', price: 100, date: '2026-07-01' }),
      buildTrade({ action: 'sell', symbol: 'XLK', price: 110, date: '2026-07-05' }),
      buildTrade({ action: 'buy', symbol: 'XLF', price: 40, date: '2026-07-01' }),
      buildTrade({ action: 'sell', symbol: 'XLF', price: 35, date: '2026-07-05' }),
    ];

    const result = buildScatterData(trades);

    expect(result).toHaveLength(2);
    expect(result.map((r) => r.symbol)).toEqual(['XLK', 'XLF']);
  });

  it('preserves the sell date on the resulting scatter point', () => {
    const trades = [
      buildTrade({ action: 'buy', symbol: 'XLK', date: '2026-07-01' }),
      buildTrade({ action: 'sell', symbol: 'XLK', date: '2026-07-15' }),
    ];

    const result = buildScatterData(trades);

    expect(result[0].date).toBe('2026-07-15');
  });
});
