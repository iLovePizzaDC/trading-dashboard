import SectorBreakdown from '@/features/sector/components/molecules/SectorBreakDown';
import { calcSectorStats } from '@/features/sector/utils/sector-breakdown';
import { useFilterWithStorage } from '@/shared/hooks/useFilterWithStorage';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Trade } from '@/shared/types/trades';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/sector/utils/sector-breakdown', () => ({
  calcSectorStats: vi.fn(),
}));

vi.mock('@/shared/components/atoms/Card', () => ({
  default: ({ title, badge, children }: any) => (
    <div data-testid='card'>
      <p data-testid='card-title'>{title}</p>
      <div data-testid='card-badge'>{badge}</div>
      <div data-testid='card-children'>{children}</div>
    </div>
  ),
}));

vi.mock('@/shared/components/atoms/Dropdown', () => ({
  default: ({ trigger, items }: any) => (
    <div data-testid='dropdown'>
      <div data-testid='dropdown-trigger'>{trigger}</div>
      {items.map((item: any) => (
        <button
          key={item.key}
          data-testid='dropdown-item'
          data-active={String(item.active)}
          onClick={item.onClick}
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('@/shared/hooks/useFilterWithStorage', () => ({
  useFilterWithStorage: vi.fn(),
}));

vi.mock('@/shared/utils/currency', () => ({
  usd: vi.fn((n: number) => `$${n}`),
}));

function buildStat(overrides: Partial<ReturnType<typeof calcSectorStats>[number]> = {}) {
  return {
    symbol: 'XLK',
    sector: 'Technology',
    timesSelected: 3,
    totalPnl: 100,
    trades: 2,
    winRate: 0.5,
    avgMomentumWhenSelected: 0.15,
    ...overrides,
  };
}

function mockFilterWithStorage(sortBy = 'timesSelected') {
  const setValue = vi.fn();
  vi.mocked(useFilterWithStorage).mockReturnValue({
    value: sortBy,
    setValue,
    filteredData: [],
  } as any);
  return { setValue };
}

describe('<SectorBreakdown />', () => {
  beforeEach(() => {
    vi.mocked(calcSectorStats).mockReset();
    vi.mocked(useFilterWithStorage).mockReset();
  });

  it('renders the card title', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    expect(screen.getByTestId('card-title')).toHaveTextContent('sector breakdown');
  });

  it('calls calcSectorStats with decisions and trades', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([]);

    const decisions = [{ date: '2026-07-01', candidates: [] }] as DecisionEntry[];
    const trades = [{ symbol: 'XLK' }] as Trade[];

    render(<SectorBreakdown decisions={decisions} trades={trades} />);

    expect(calcSectorStats).toHaveBeenCalledWith(decisions, trades);
  });

  it('calls useFilterWithStorage with the correct storageKey, data, defaultValue, and allValues', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([]);

    const trades = [{ symbol: 'XLK' }] as Trade[];

    render(<SectorBreakdown decisions={[]} trades={trades} />);

    expect(useFilterWithStorage).toHaveBeenCalledWith(
      expect.objectContaining({
        storageKey: 'sector-breakdown',
        data: trades,
        defaultValue: 'timesSelected',
        allValues: ['timesSelected', 'totalPnl', 'winRate', 'avgMomentumWhenSelected'],
      }),
    );
  });

  it('shows the current sort label in the dropdown trigger', () => {
    mockFilterWithStorage('totalPnl');
    vi.mocked(calcSectorStats).mockReturnValue([]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('pnl');
  });

  it('renders a dropdown item for each sort option, marking the active one', () => {
    mockFilterWithStorage('winRate');
    vi.mocked(calcSectorStats).mockReturnValue([]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    const items = screen.getAllByTestId('dropdown-item');
    expect(items).toHaveLength(4);

    const activeItem = items.find((i) => i.getAttribute('data-active') === 'true');
    expect(activeItem).toHaveTextContent('win rate');
  });

  it('calls setValue with the clicked sort key', () => {
    const { setValue } = mockFilterWithStorage('timesSelected');
    vi.mocked(calcSectorStats).mockReturnValue([]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    screen.getByText('pnl').click();

    expect(setValue).toHaveBeenCalledWith('totalPnl');
  });

  it('renders a row for each stat with symbol and sector', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([
      buildStat({ symbol: 'XLK', sector: 'Technology' }),
      buildStat({ symbol: 'XLF', sector: 'Financials' }),
    ]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    expect(screen.getByText('XLK')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('XLF')).toBeInTheDocument();
    expect(screen.getByText('Financials')).toBeInTheDocument();
  });

  it('shows the times-selected count', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([buildStat({ timesSelected: 7 })]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    expect(screen.getByText('7x')).toBeInTheDocument();
  });

  it('sets the bar width relative to the max timesSelected among all stats', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([
      buildStat({ symbol: 'XLK', timesSelected: 4 }),
      buildStat({ symbol: 'XLF', timesSelected: 8 }),
    ]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    const bars = screen.getAllByTestId(/sector-bar-*/);
    expect(bars[0]).toHaveStyle({ width: '100%' });
    expect(bars[1]).toHaveStyle({ width: '50%' });
  });

  it('uses a fallback max of 1 when all stats have 0 timesSelected (avoids divide-by-zero)', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([buildStat({ timesSelected: 0 })]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    expect(screen.getByTestId('sector-bar-0')).toHaveStyle({ width: '0%' });
  });

  it('shows the formatted P&L in green when totalPnl is positive and trades exist', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([buildStat({ trades: 2, totalPnl: 150 })]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    const pnl = screen.getByText('$150');
    expect(pnl).toHaveClass('text-green-400');
  });

  it('shows the formatted P&L in red when totalPnl is negative and trades exist', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([buildStat({ trades: 2, totalPnl: -75 })]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    const pnl = screen.getByText('$-75');
    expect(pnl).toHaveClass('text-red-400');
  });

  it('shows a dash instead of P&L when there are no trades for that symbol', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([buildStat({ trades: 0, totalPnl: 0 })]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByText('$0')).not.toBeInTheDocument();
  });

  it('sorts stats by the currently selected sort key, descending', () => {
    mockFilterWithStorage('totalPnl');
    vi.mocked(calcSectorStats).mockReturnValue([
      buildStat({ symbol: 'AAA', totalPnl: 10, timesSelected: 5 }),
      buildStat({ symbol: 'BBB', totalPnl: 50, timesSelected: 1 }),
      buildStat({ symbol: 'CCC', totalPnl: 30, timesSelected: 3 }),
    ]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    const symbols = screen.getAllByText(/^[A-Z]{3}$/).map((el) => el.textContent);
    expect(symbols).toEqual(['BBB', 'CCC', 'AAA']);
  });

  it('re-sorts by timesSelected when that is the active sort key', () => {
    mockFilterWithStorage('timesSelected');
    vi.mocked(calcSectorStats).mockReturnValue([
      buildStat({ symbol: 'AAA', totalPnl: 10, timesSelected: 5 }),
      buildStat({ symbol: 'BBB', totalPnl: 50, timesSelected: 1 }),
      buildStat({ symbol: 'CCC', totalPnl: 30, timesSelected: 3 }),
    ]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    const symbols = screen.getAllByText(/^[A-Z]{3}$/).map((el) => el.textContent);
    expect(symbols).toEqual(['AAA', 'CCC', 'BBB']);
  });

  it('renders no rows when calcSectorStats returns an empty array', () => {
    mockFilterWithStorage();
    vi.mocked(calcSectorStats).mockReturnValue([]);

    render(<SectorBreakdown decisions={[]} trades={[]} />);

    expect(screen.queryAllByTestId(/sector-bar-*/)).toHaveLength(0);
  });
});
