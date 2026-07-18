import TradeEntry from '@/features/trades/components/atoms/TradeEntry';
import type { Trade } from '@/shared/types/trades';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/components/layouts/EntryRowLayout', () => ({
  default: ({ color, isLast, dotOpacity, renderLeft, renderRight }: any) => (
    <div
      data-testid='entry-row-layout'
      data-color={color}
      data-is-last={String(isLast)}
      data-dot-opacity={dotOpacity}
    >
      <div data-testid='render-left'>{renderLeft}</div>
      <div data-testid='render-right'>{renderRight}</div>
    </div>
  ),
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

describe('<TradeEntry />', () => {
  it('passes color and isLast through to EntryRowLayout', () => {
    render(<TradeEntry trade={buildTrade()} color='#4ade80' isLast />);

    const layout = screen.getByTestId('entry-row-layout');
    expect(layout).toHaveAttribute('data-color', '#4ade80');
    expect(layout).toHaveAttribute('data-is-last', 'true');
  });

  it('renders the action label uppercase-styled', () => {
    render(<TradeEntry trade={buildTrade({ action: 'buy' })} color='#4ade80' isLast={false} />);

    expect(screen.getByText('buy')).toBeInTheDocument();
  });

  it('renders shares and price', () => {
    render(
      <TradeEntry trade={buildTrade({ shares: 5.5, price: 200 })} color='#4ade80' isLast={false} />,
    );

    expect(screen.getByText('5.5000 @ $200.00')).toBeInTheDocument();
  });

  describe('buy action', () => {
    it('colors the action label green', () => {
      render(<TradeEntry trade={buildTrade({ action: 'buy' })} color='#4ade80' isLast={false} />);

      expect(screen.getByText('buy')).toHaveClass('text-green-400');
    });

    it('sets dotOpacity to 1', () => {
      render(<TradeEntry trade={buildTrade({ action: 'buy' })} color='#4ade80' isLast={false} />);

      expect(screen.getByTestId('entry-row-layout')).toHaveAttribute('data-dot-opacity', '1');
    });

    it('shows the current stop when provided, formatted', () => {
      render(
        <TradeEntry
          trade={buildTrade({ action: 'buy' })}
          color='#4ade80'
          isLast={false}
          currentStop={95}
        />,
      );

      expect(screen.getByText('stop $95.00')).toBeInTheDocument();
    });

    it('falls back to the trade stop_price when currentStop is not provided', () => {
      render(
        <TradeEntry
          trade={buildTrade({ action: 'buy', stop_price: 88 })}
          color='#4ade80'
          isLast={false}
        />,
      );

      expect(screen.getByText('stop $88.00')).toBeInTheDocument();
    });

    it('renders no stop when neither currentStop nor stop_price is present', () => {
      render(
        <TradeEntry
          trade={buildTrade({ action: 'buy', stop_price: undefined })}
          color='#4ade80'
          isLast={false}
        />,
      );

      expect(screen.queryByText(/stop/)).not.toBeInTheDocument();
    });

    it('prioritizes currentStop over stop_price when both are present', () => {
      render(
        <TradeEntry
          trade={buildTrade({ action: 'buy', stop_price: 88 })}
          color='#4ade80'
          isLast={false}
          currentStop={95}
        />,
      );

      expect(screen.getByText('stop $95.00')).toBeInTheDocument();
      expect(screen.queryByText('stop $88.00')).not.toBeInTheDocument();
    });
  });

  describe('sell action', () => {
    it('colors the action label red', () => {
      render(<TradeEntry trade={buildTrade({ action: 'sell' })} color='#4ade80' isLast={false} />);

      expect(screen.getByText('sell')).toHaveClass('text-red-400');
    });

    it('sets dotOpacity to 0.55', () => {
      render(<TradeEntry trade={buildTrade({ action: 'sell' })} color='#4ade80' isLast={false} />);

      expect(screen.getByTestId('entry-row-layout')).toHaveAttribute('data-dot-opacity', '0.55');
    });

    it('never shows a stop, even if currentStop is provided', () => {
      render(
        <TradeEntry
          trade={buildTrade({ action: 'sell' })}
          color='#4ade80'
          isLast={false}
          currentStop={95}
        />,
      );

      expect(screen.queryByText(/stop/)).not.toBeInTheDocument();
    });
  });

  describe('pnl display', () => {
    it('shows the pnl in green when non-negative, taking priority over the stop', () => {
      render(
        <TradeEntry
          trade={buildTrade({ action: 'sell', pnl: 50 })}
          color='#4ade80'
          isLast={false}
        />,
      );

      const pnl = screen.getByText('$50.00');
      expect(pnl).toHaveClass('text-green-400');
    });

    it('shows the pnl in red when negative', () => {
      render(
        <TradeEntry
          trade={buildTrade({ action: 'sell', pnl: -30 })}
          color='#4ade80'
          isLast={false}
        />,
      );

      const pnl = screen.getByText('-$30.00');
      expect(pnl).toHaveClass('text-red-400');
    });

    it('shows the pnl in green when exactly 0', () => {
      render(
        <TradeEntry
          trade={buildTrade({ action: 'sell', pnl: 0 })}
          color='#4ade80'
          isLast={false}
        />,
      );

      const pnl = screen.getByText('$0.00');
      expect(pnl).toHaveClass('text-green-400');
    });

    it('shows the pnl even on a buy trade if pnl is defined (takes priority over stop)', () => {
      render(
        <TradeEntry
          trade={buildTrade({ action: 'buy', pnl: 20, stop_price: 90 })}
          color='#4ade80'
          isLast={false}
          currentStop={95}
        />,
      );

      expect(screen.getByText('$20.00')).toBeInTheDocument();
      expect(screen.queryByText(/stop/)).not.toBeInTheDocument();
    });
  });

  describe('sub-label (reason vs date)', () => {
    it('shows the date when there is no reason', () => {
      render(
        <TradeEntry
          trade={buildTrade({ reason: undefined, date: '2026-07-04' })}
          color='#4ade80'
          isLast={false}
        />,
      );

      expect(screen.getByText('2026-07-04')).toBeInTheDocument();
    });

    it('maps a known reason to its label', () => {
      render(
        <TradeEntry
          trade={buildTrade({ reason: 'stop_triggered' })}
          color='#4ade80'
          isLast={false}
        />,
      );

      expect(screen.getByText('stop hit')).toBeInTheDocument();
    });

    it('falls back to the raw reason when it is not in REASON_LABEL', () => {
      render(
        <TradeEntry
          trade={buildTrade({ reason: 'unknown_reason' })}
          color='#4ade80'
          isLast={false}
        />,
      );

      expect(screen.getByText('unknown_reason')).toBeInTheDocument();
    });
  });
});
