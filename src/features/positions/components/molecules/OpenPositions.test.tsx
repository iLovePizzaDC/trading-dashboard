import OpenPositions from '@/features/positions/components/molecules/OpenPositions';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { Trade } from '@/shared/types/trades';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/positions/components/atoms/PositionRow', () => ({
  default: ({ symbol, stop, trade, isLast }: any) => (
    <div
      data-testid='position-row'
      data-symbol={symbol}
      data-stop={stop}
      data-trade={trade ? trade.shares : 'none'}
      data-is-last={String(isLast)}
    />
  ),
}));

vi.mock('@/features/positions/components/molecules/PositionsEmpty', () => ({
  default: () => <div data-testid='positions-empty' />,
}));

vi.mock('@/shared/components/atoms/Card', () => ({
  default: ({ title, children }: any) => (
    <div data-testid='card'>
      <p data-testid='card-title'>{title}</p>
      <div data-testid='card-children'>{children}</div>
    </div>
  ),
}));

vi.mock('@/shared/components/atoms/ShowMoreButton', () => ({
  default: ({ toggle, expanded, hiddenCount }: any) => (
    <button data-testid='show-more' onClick={toggle}>
      {expanded ? 'show less' : `show ${hiddenCount} more`}
    </button>
  ),
}));

vi.mock('@/shared/hooks/useExpandable', () => ({
  useExpandable: vi.fn(),
}));

function buildTrade(overrides: Partial<Trade> = {}): Trade {
  return {
    symbol: 'XLK',
    action: 'buy',
    shares: 10,
    price: 100,
    ...overrides,
  } as Trade;
}

function mockExpandable(overrides: Partial<ReturnType<typeof useExpandable>> = {}) {
  vi.mocked(useExpandable).mockReturnValue({
    expanded: false,
    toggle: vi.fn(),
    hasMore: false,
    hiddenCount: 0,
    previewCount: 2,
    ...overrides,
  });
}

describe('<OpenPositions />', () => {
  beforeEach(() => {
    vi.mocked(useExpandable).mockReset();
  });

  it('renders PositionsEmpty when there are no stops', () => {
    mockExpandable({ previewCount: 0 });

    render(<OpenPositions stops={{}} trades={[]} />);

    expect(screen.getByTestId('positions-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
  });

  it('calls useExpandable with the number of symbols and a preview size of 2', () => {
    mockExpandable();

    render(<OpenPositions stops={{ XLK: 90, XLF: 40 }} trades={[]} />);

    expect(useExpandable).toHaveBeenCalledWith(2, 2);
  });

  it('renders the title with the symbol count', () => {
    mockExpandable();

    render(<OpenPositions stops={{ XLK: 90, XLF: 40, XLE: 60 }} trades={[]} />);

    expect(screen.getByTestId('card-title')).toHaveTextContent('open positions (3)');
  });

  it('renders a PositionRow for each preview symbol with its stop value', () => {
    mockExpandable({ previewCount: 2 });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40 }} trades={[]} />);

    const rows = screen.getAllByTestId('position-row');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveAttribute('data-symbol', 'XLK');
    expect(rows[0]).toHaveAttribute('data-stop', '90');
    expect(rows[1]).toHaveAttribute('data-symbol', 'XLF');
    expect(rows[1]).toHaveAttribute('data-stop', '40');
  });

  it('passes the last buy trade for each symbol to PositionRow', () => {
    mockExpandable({ previewCount: 2 });

    const trades = [
      buildTrade({ symbol: 'XLK', action: 'buy', shares: 5 }),
      buildTrade({ symbol: 'XLK', action: 'buy', shares: 8 }),
      buildTrade({ symbol: 'XLF', action: 'sell', shares: 3 }),
    ];

    render(<OpenPositions stops={{ XLK: 90, XLF: 40 }} trades={trades} />);

    const rows = screen.getAllByTestId('position-row');
    expect(rows[0]).toHaveAttribute('data-trade', '8');
    expect(rows[1]).toHaveAttribute('data-trade', 'none');
  });

  it('ignores sell trades when determining the last buy trade', () => {
    mockExpandable({ previewCount: 1 });

    const trades = [
      buildTrade({ symbol: 'XLK', action: 'buy', shares: 5 }),
      buildTrade({ symbol: 'XLK', action: 'sell', shares: 5 }),
    ];

    render(<OpenPositions stops={{ XLK: 90 }} trades={trades} />);

    expect(screen.getByTestId('position-row')).toHaveAttribute('data-trade', '5');
  });

  it('marks the last preview row as isLast when there is no extra content', () => {
    mockExpandable({ previewCount: 2, hasMore: false });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40 }} trades={[]} />);

    const rows = screen.getAllByTestId('position-row');
    expect(rows[0]).toHaveAttribute('data-is-last', 'false');
    expect(rows[1]).toHaveAttribute('data-is-last', 'true');
  });

  it('renders a divider between preview rows but not after the last preview row', () => {
    mockExpandable({ previewCount: 3 });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40, XLE: 60 }} trades={[]} />);

    expect(screen.getAllByTestId('divider')).toHaveLength(2);
  });

  it('renders the remaining symbols as extra rows with a divider before each one', () => {
    mockExpandable({ previewCount: 2, expanded: true, hasMore: true, hiddenCount: 2 });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40, XLE: 60, XLV: 50 }} trades={[]} />);

    const rows = screen.getAllByTestId('position-row');
    expect(rows).toHaveLength(4);
    expect(rows[2]).toHaveAttribute('data-symbol', 'XLE');
    expect(rows[3]).toHaveAttribute('data-symbol', 'XLV');
  });

  it('marks the last extra row as isLast', () => {
    mockExpandable({ previewCount: 2, expanded: true, hasMore: true, hiddenCount: 2 });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40, XLE: 60, XLV: 50 }} trades={[]} />);

    const rows = screen.getAllByTestId('position-row');
    expect(rows[2]).toHaveAttribute('data-is-last', 'false');
    expect(rows[3]).toHaveAttribute('data-is-last', 'true');
  });

  it('expands the grid rows when expanded is true', () => {
    mockExpandable({ previewCount: 2, expanded: true, hasMore: true, hiddenCount: 2 });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40, XLE: 60, XLV: 50 }} trades={[]} />);

    expect(screen.getByTestId('open-positions-grid-wrapper')).toHaveClass('grid-rows-[1fr]');
  });

  it('collapses the grid rows when expanded is false', () => {
    mockExpandable({ previewCount: 2, expanded: false, hasMore: true, hiddenCount: 2 });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40, XLE: 60, XLV: 50 }} trades={[]} />);

    expect(screen.getByTestId('open-positions-grid-wrapper')).toHaveClass('grid-rows-[0fr]');
  });

  it('renders the ShowMoreButton when hasMore is true', () => {
    mockExpandable({ hasMore: true, hiddenCount: 3 });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40 }} trades={[]} />);

    expect(screen.getByTestId('show-more')).toHaveTextContent('show 3 more');
  });

  it('does not render the ShowMoreButton when hasMore is false', () => {
    mockExpandable({ hasMore: false });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40 }} trades={[]} />);

    expect(screen.queryByTestId('show-more')).not.toBeInTheDocument();
  });

  it('calls toggle from useExpandable when the ShowMoreButton is clicked', async () => {
    const user = userEvent.setup();
    const toggle = vi.fn();
    mockExpandable({ hasMore: true, hiddenCount: 2, toggle });

    render(<OpenPositions stops={{ XLK: 90, XLF: 40 }} trades={[]} />);

    await user.click(screen.getByTestId('show-more'));

    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
