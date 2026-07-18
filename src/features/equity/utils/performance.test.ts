import { calcMonthlyReturns } from '@/features/equity/utils/performance';
import type { Deposit } from '@/shared/types/deposits';
import type { EquityPoint } from '@/shared/types/equity';
import { describe, expect, it } from 'vitest';

function buildEquityPoint(overrides: Partial<EquityPoint> = {}): EquityPoint {
  return { date: '2026-01-01', equity: 100, ...overrides } as EquityPoint;
}

function buildDeposit(overrides: Partial<Deposit> = {}): Deposit {
  return { date: '2026-01-15', amount: 500, ...overrides } as Deposit;
}

describe('calcMonthlyReturns', () => {
  it('returns an empty array when data is empty', () => {
    expect(calcMonthlyReturns([], [])).toEqual([]);
  });

  it('returns an empty array when data has only one point', () => {
    const data = [buildEquityPoint()];

    expect(calcMonthlyReturns(data, [])).toEqual([]);
  });

  it('groups points into a single month and computes start/end equity', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-15', equity: 110 }),
      buildEquityPoint({ date: '2026-01-31', equity: 120 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result).toHaveLength(1);
    expect(result[0].startEquity).toBe(100);
    expect(result[0].endEquity).toBe(120);
  });

  it('parses year and month correctly from the date key', () => {
    const data = [
      buildEquityPoint({ date: '2026-07-01', equity: 100 }),
      buildEquityPoint({ date: '2026-07-15', equity: 110 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result[0].year).toBe(2026);
    expect(result[0].month).toBe(7);
  });

  it('splits points into separate months', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 110 }),
      buildEquityPoint({ date: '2026-02-01', equity: 110 }),
      buildEquityPoint({ date: '2026-02-28', equity: 120 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result).toHaveLength(2);
    expect(result[0].month).toBe(1);
    expect(result[1].month).toBe(2);
  });

  it('returns months sorted chronologically regardless of input order', () => {
    const data = [
      buildEquityPoint({ date: '2026-03-01', equity: 130 }),
      buildEquityPoint({ date: '2026-03-31', equity: 140 }),
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 110 }),
      buildEquityPoint({ date: '2026-02-01', equity: 110 }),
      buildEquityPoint({ date: '2026-02-28', equity: 120 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result.map((r) => r.month)).toEqual([1, 2, 3]);
  });

  it('sorts months correctly across year boundaries', () => {
    const data = [
      buildEquityPoint({ date: '2027-01-01', equity: 150 }),
      buildEquityPoint({ date: '2027-01-31', equity: 160 }),
      buildEquityPoint({ date: '2026-12-01', equity: 140 }),
      buildEquityPoint({ date: '2026-12-31', equity: 150 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result.map((r) => `${r.year}-${r.month}`)).toEqual(['2026-12', '2027-1']);
  });

  it('calculates a positive return percentage correctly', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 110 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result[0].return).toBeCloseTo(10);
  });

  it('calculates a negative return percentage correctly', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 90 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result[0].return).toBeCloseTo(-10);
  });

  it('returns 0 as the return when start equity is 0', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 0 }),
      buildEquityPoint({ date: '2026-01-31', equity: 50 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result[0].return).toBe(0);
  });

  it('returns 0 as the return when start equity is negative', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: -100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 50 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result[0].return).toBe(0);
  });

  it('subtracts deposits made during the month from the end equity', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 600 }),
    ];
    const deposits = [buildDeposit({ date: '2026-01-15', amount: 500 })];

    const result = calcMonthlyReturns(data, deposits);

    expect(result[0].endEquity).toBe(100);
    expect(result[0].return).toBeCloseTo(0);
  });

  it('sums multiple deposits within the same month', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 700 }),
    ];
    const deposits = [
      buildDeposit({ date: '2026-01-10', amount: 200 }),
      buildDeposit({ date: '2026-01-20', amount: 300 }),
    ];

    const result = calcMonthlyReturns(data, deposits);

    expect(result[0].endEquity).toBe(200);
  });

  it('ignores deposits from a different month', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 110 }),
    ];
    const deposits = [buildDeposit({ date: '2026-02-05', amount: 500 })];

    const result = calcMonthlyReturns(data, deposits);

    expect(result[0].endEquity).toBe(110);
  });

  it('ignores a deposit made exactly on the first point date of the month', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 600 }),
    ];
    const deposits = [buildDeposit({ date: '2026-01-01', amount: 500 })];

    const result = calcMonthlyReturns(data, deposits);

    expect(result[0].endEquity).toBe(600);
  });

  it('includes a deposit made the day after the first point date of the month', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 600 }),
    ];
    const deposits = [buildDeposit({ date: '2026-01-02', amount: 500 })];

    const result = calcMonthlyReturns(data, deposits);

    expect(result[0].endEquity).toBe(100);
  });

  it('applies deposits independently per month', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-01', equity: 100 }),
      buildEquityPoint({ date: '2026-01-31', equity: 600 }),
      buildEquityPoint({ date: '2026-02-01', equity: 600 }),
      buildEquityPoint({ date: '2026-02-28', equity: 700 }),
    ];
    const deposits = [
      buildDeposit({ date: '2026-01-15', amount: 500 }),
      buildDeposit({ date: '2026-02-10', amount: 100 }),
    ];

    const result = calcMonthlyReturns(data, deposits);

    expect(result[0].endEquity).toBe(100);
    expect(result[1].endEquity).toBe(600);
  });

  it('handles a month with only a single data point (start equals end)', () => {
    const data = [
      buildEquityPoint({ date: '2026-01-15', equity: 100 }),
      buildEquityPoint({ date: '2026-02-15', equity: 110 }),
    ];

    const result = calcMonthlyReturns(data, []);

    expect(result[0].startEquity).toBe(100);
    expect(result[0].endEquity).toBe(100);
    expect(result[0].return).toBe(0);
  });
});
