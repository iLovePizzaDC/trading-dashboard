import TradeTooltipContent from '@/features/trades/components/atoms/TradeTooltipContent';
import type { ClosedTrade } from '@/features/trades/types/trade-statistics';
import { useRotateSectorName } from '@/shared/hooks/useRotateSymbolName';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/useRotateSymbolName', () => ({
  useRotateSectorName: vi.fn(),
}));

function buildTrade(overrides: Partial<ClosedTrade> = {}): ClosedTrade {
  return {
    symbol: 'XLK',
    action: 'sell',
    shares: 10,
    price: 100,
    date: '2026-07-10',
    pnl: 50,
    openDate: '2026-07-01',
    closeDate: '2026-07-10',
    ...overrides,
  } as ClosedTrade;
}

function mockRotate(displayName = 'XLK', visible = true) {
  vi.mocked(useRotateSectorName).mockReturnValue({ displayName, visible });
}

describe('<TradeTooltipContent />', () => {
  beforeEach(() => {
    vi.mocked(useRotateSectorName).mockReset();
    mockRotate();
  });

  it('calls useRotateSectorName with the trade symbol', () => {
    render(<TradeTooltipContent trade={buildTrade({ symbol: 'XLF' })} />);

    expect(useRotateSectorName).toHaveBeenCalledWith('XLF');
  });

  it('renders the displayName from useRotateSectorName', () => {
    mockRotate('Technology');

    render(<TradeTooltipContent trade={buildTrade()} />);

    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('applies opacity-100 to the name when visible is true', () => {
    mockRotate('XLK', true);

    render(<TradeTooltipContent trade={buildTrade()} />);

    expect(screen.getByText('XLK')).toHaveClass('opacity-100');
  });

  it('applies opacity-0 to the name when visible is false', () => {
    mockRotate('XLK', false);

    render(<TradeTooltipContent trade={buildTrade()} />);

    expect(screen.getByText('XLK')).toHaveClass('opacity-0');
  });

  it('formats and displays the open and close dates', () => {
    render(
      <TradeTooltipContent
        trade={buildTrade({ openDate: '2026-07-01', closeDate: '2026-07-15' })}
      />,
    );

    expect(screen.getByText('01 Jul 2026 → 15 Jul 2026')).toBeInTheDocument();
  });

  it('falls back to the raw openDate string when it is not a valid ISO date', () => {
    render(
      <TradeTooltipContent
        trade={buildTrade({ openDate: 'not-a-date', closeDate: '2026-07-15' })}
      />,
    );

    expect(screen.getByText('not-a-date → 15 Jul 2026')).toBeInTheDocument();
  });

  it('falls back to the raw closeDate string when it is not a valid ISO date', () => {
    render(
      <TradeTooltipContent
        trade={buildTrade({ openDate: '2026-07-01', closeDate: 'not-a-date' })}
      />,
    );

    expect(screen.getByText('01 Jul 2026 → not-a-date')).toBeInTheDocument();
  });

  it('renders shares and formatted price', () => {
    render(<TradeTooltipContent trade={buildTrade({ shares: 5, price: 200 })} />);

    expect(screen.getByText('5 @ $200.00')).toBeInTheDocument();
  });
});
