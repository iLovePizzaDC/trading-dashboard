import TradeRow from '@/features/trades/components/atoms/TradeRow';
import type { Trade } from '@/shared/types/trades';
import { render, screen } from '@testing-library/react';
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

describe('<TradeRow />', () => {
  it('renders the symbol', () => {
    render(<TradeRow trade={buildTrade({ symbol: 'XLF' })} />);

    expect(screen.getByText('XLF')).toBeInTheDocument();
  });

  it('renders the action label', () => {
    render(<TradeRow trade={buildTrade({ action: 'buy' })} />);

    expect(screen.getByText('buy')).toBeInTheDocument();
  });

  it('renders shares and price', () => {
    render(<TradeRow trade={buildTrade({ shares: 5.5, price: 200 })} />);

    expect(screen.getByText('5.5000 @ $200.00')).toBeInTheDocument();
  });

  describe('buy action', () => {
    it('colors the action label green', () => {
      render(<TradeRow trade={buildTrade({ action: 'buy' })} />);

      expect(screen.getByText('buy')).toHaveClass('text-green-400');
    });

    it('shows the stop price when present and pnl is undefined', () => {
      render(<TradeRow trade={buildTrade({ action: 'buy', stop_price: 88, pnl: undefined })} />);

      expect(screen.getByText('stop $88.00')).toBeInTheDocument();
    });

    it('renders no stop when stop_price is undefined', () => {
      render(<TradeRow trade={buildTrade({ action: 'buy', stop_price: undefined })} />);

      expect(screen.queryByText(/stop/)).not.toBeInTheDocument();
    });

    it('renders the stop when stop_price is 0 (falsy)', () => {
      render(<TradeRow trade={buildTrade({ action: 'buy', stop_price: 0 })} />);

      expect(screen.queryByText(/stop/)).toBeInTheDocument();
    });
  });

  describe('sell action', () => {
    it('colors the action label red', () => {
      render(<TradeRow trade={buildTrade({ action: 'sell' })} />);

      expect(screen.getByText('sell')).toHaveClass('text-red-400');
    });
  });

  describe('pnl display', () => {
    it('shows the pnl in green when non-negative, taking priority over the stop', () => {
      render(<TradeRow trade={buildTrade({ action: 'sell', pnl: 50, stop_price: 90 })} />);

      const pnl = screen.getByText('$50.00');
      expect(pnl).toHaveClass('text-green-400');
      expect(screen.queryByText(/stop/)).not.toBeInTheDocument();
    });

    it('shows the pnl in red when negative', () => {
      render(<TradeRow trade={buildTrade({ action: 'sell', pnl: -30 })} />);

      const pnl = screen.getByText('-$30.00');
      expect(pnl).toHaveClass('text-red-400');
    });

    it('shows the pnl in green when exactly 0', () => {
      render(<TradeRow trade={buildTrade({ action: 'sell', pnl: 0 })} />);

      const pnl = screen.getByText('$0.00');
      expect(pnl).toHaveClass('text-green-400');
    });

    it('shows no pnl and no stop when pnl is undefined and stop_price is also absent', () => {
      render(<TradeRow trade={buildTrade({ pnl: undefined, stop_price: undefined })} />);

      expect(screen.queryByText(/stop/)).not.toBeInTheDocument();
    });
  });

  describe('sub-label (reason vs date)', () => {
    it('shows the date when there is no reason', () => {
      render(<TradeRow trade={buildTrade({ reason: undefined, date: '2026-07-04' })} />);

      expect(screen.getByText('2026-07-04')).toBeInTheDocument();
    });

    it('maps a known reason to its label', () => {
      render(<TradeRow trade={buildTrade({ reason: 'stop_triggered' })} />);

      expect(screen.getByText('stop hit')).toBeInTheDocument();
    });

    it('falls back to the raw reason when it is not in REASON_LABEL', () => {
      render(<TradeRow trade={buildTrade({ reason: 'unknown_reason' })} />);

      expect(screen.getByText('unknown_reason')).toBeInTheDocument();
    });
  });

  describe('isLast', () => {
    it('renders a bottom border when isLast is false (default)', () => {
      const { container } = render(<TradeRow trade={buildTrade()} />);

      expect(container.firstChild).toHaveClass('border-b', 'border-white/5');
    });

    it('does not render a bottom border when isLast is true', () => {
      const { container } = render(<TradeRow trade={buildTrade()} isLast />);

      expect(container.firstChild).not.toHaveClass('border-b');
    });
  });
});
