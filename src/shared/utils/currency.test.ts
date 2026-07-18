import { fmt, isPos, usd } from '@/shared/utils/currency';
import { describe, expect, it } from 'vitest';

describe('usd', () => {
  it('formats a positive integer as USD currency', () => {
    expect(usd(100)).toBe('$100.00');
  });

  it('formats a decimal value with two decimal places', () => {
    expect(usd(99.5)).toBe('$99.50');
  });

  it('rounds to two decimal places', () => {
    expect(usd(99.999)).toBe('$100.00');
  });

  it('formats zero correctly', () => {
    expect(usd(0)).toBe('$0.00');
  });

  it('formats a negative value with a leading minus sign', () => {
    expect(usd(-50)).toBe('-$50.00');
  });

  it('inserts thousands separators for large values', () => {
    expect(usd(1234567.89)).toBe('$1,234,567.89');
  });
});

describe('isPos', () => {
  it('returns true for a positive number', () => {
    expect(isPos(5)).toBe(true);
  });

  it('returns true for zero', () => {
    expect(isPos(0)).toBe(true);
  });

  it('returns false for a negative number', () => {
    expect(isPos(-5)).toBe(false);
  });
});

describe('fmt', () => {
  it('defaults to relative mode when the second argument is omitted', () => {
    expect(fmt(5)).toBe('+5.00%');
  });

  it('formats a positive value in relative mode with a percent sign', () => {
    expect(fmt(5.5, true)).toBe('+5.50%');
  });

  it('formats a negative value in relative mode with a percent sign', () => {
    expect(fmt(-5.5, true)).toBe('-5.50%');
  });

  it('formats zero in relative mode with a plus sign', () => {
    expect(fmt(0, true)).toBe('+0.00%');
  });

  it('rounds to two decimal places in relative mode', () => {
    expect(fmt(5.567, true)).toBe('+5.57%');
  });

  it('formats a positive value in absolute mode with a dollar sign, no percent', () => {
    expect(fmt(500, false)).toBe('+$500.00');
  });

  it('formats a negative value in absolute mode with a dollar sign, no percent', () => {
    expect(fmt(-500, false)).toBe('-$500.00');
  });

  it('formats zero in absolute mode with a plus sign and dollar sign', () => {
    expect(fmt(0, false)).toBe('+$0.00');
  });

  it('always uses the absolute value in the numeric portion, regardless of sign', () => {
    expect(fmt(-1234.5, false)).toBe('-$1234.50');
  });

  it('does not insert thousands separators (unlike usd)', () => {
    expect(fmt(1234567.89, false)).toBe('+$1234567.89');
  });
});
