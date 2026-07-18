import MomentumTimeline from '@/features/momentum/components/molecules/MomentumTimeline';
import { calcMomentumTimeline } from '@/features/momentum/utils/momentum';
import { useFilterWithStorage } from '@/shared/hooks/useFilterWithStorage';
import type { DecisionEntry } from '@/shared/types/decisions';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid='responsive-container'>{children}</div>
  ),
  LineChart: ({ children, data }: any) => (
    <div data-testid='line-chart' data-length={data.length}>
      {children}
    </div>
  ),
  Line: (props: any) => (
    <div data-testid='line' data-datakey={props.dataKey} data-name={props.name} />
  ),
  CartesianGrid: () => <div data-testid='cartesian-grid' />,
  Tooltip: (props: any) => <div data-testid='chart-tooltip'>{props.content}</div>,
}));

vi.mock('@/features/momentum/components/atoms/MomentumTooltip', () => ({
  default: () => <div data-testid='momentum-tooltip' />,
}));

vi.mock('@/features/momentum/utils/momentum', () => ({
  calcMomentumTimeline: vi.fn(),
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

vi.mock('@/shared/components/atoms/DateRangeFilter', () => ({
  default: ({ range, excludedRanges }: any) => (
    <div
      data-testid='date-range-filter'
      data-range={range}
      data-excluded={JSON.stringify(excludedRanges)}
    />
  ),
}));

vi.mock('@/shared/hooks/useFilterWithStorage', () => ({
  useFilterWithStorage: vi.fn(),
}));

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
  return {
    date: '2026-07-01',
    candidates: [],
    ...overrides,
  } as DecisionEntry;
}

function mockFilterWithStorage(overrides: Partial<ReturnType<typeof useFilterWithStorage>> = {}) {
  const setValue = vi.fn();

  vi.mocked(useFilterWithStorage).mockReturnValue({
    value: '6M',
    setValue,
    filteredData: [buildDecision(), buildDecision({ date: '2026-07-02' })],
    ...overrides,
  } as ReturnType<typeof useFilterWithStorage>);

  return { setValue };
}

describe('<MomentumTimeline />', () => {
  beforeEach(() => {
    vi.mocked(useFilterWithStorage).mockReset();
    vi.mocked(calcMomentumTimeline).mockReset();
    vi.mocked(calcMomentumTimeline).mockReturnValue([
      { date: '2026-07-01', avgMomentum: 10, topMomentum: 20, selectedCount: 2 },
      { date: '2026-07-02', avgMomentum: 15, topMomentum: 25, selectedCount: 3 },
    ]);
  });

  it('renders the card title', () => {
    mockFilterWithStorage();

    render(<MomentumTimeline data={[]} />);

    expect(screen.getByTestId('card-title')).toHaveTextContent('momentum timeline');
  });

  it('renders the legend badge with "avg" and "top" labels', () => {
    mockFilterWithStorage();

    render(<MomentumTimeline data={[]} />);

    expect(screen.getByText('avg')).toBeInTheDocument();
    expect(screen.getByText('top')).toBeInTheDocument();
  });

  it('calls useFilterWithStorage with the correct storageKey, data, defaultValue, allValues, and excludedValues', () => {
    mockFilterWithStorage();

    const data = [buildDecision()];

    render(<MomentumTimeline data={data} />);

    expect(useFilterWithStorage).toHaveBeenCalledWith(
      expect.objectContaining({
        storageKey: 'momentum-timeline',
        data,
        defaultValue: '6M',
        excludedValues: ['1W', '1M'],
      }),
    );
  });

  it('passes range and excludedRanges to DateRangeFilter', () => {
    mockFilterWithStorage({ value: '3M' } as any);

    render(<MomentumTimeline data={[]} />);

    const filter = screen.getByTestId('date-range-filter');
    expect(filter).toHaveAttribute('data-range', '3M');
    expect(filter).toHaveAttribute('data-excluded', JSON.stringify(['1W', '1M']));
  });

  it('calls calcMomentumTimeline with the filteredData from useFilterWithStorage', () => {
    const filteredData = [buildDecision({ date: '2026-05-01' })];
    mockFilterWithStorage({ filteredData } as any);

    render(<MomentumTimeline data={[]} />);

    expect(calcMomentumTimeline).toHaveBeenCalledWith(filteredData);
  });

  it('renders the chart when there are 2 or more timeline entries', () => {
    mockFilterWithStorage();

    render(<MomentumTimeline data={[]} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.queryByText('Not enough rebalance data yet.')).not.toBeInTheDocument();
  });

  it('shows the empty-state message when there are fewer than 2 timeline entries', () => {
    mockFilterWithStorage();
    vi.mocked(calcMomentumTimeline).mockReturnValue([
      { date: '2026-07-01', avgMomentum: 10, topMomentum: 20, selectedCount: 2 },
    ]);

    render(<MomentumTimeline data={[]} />);

    expect(screen.getByText('Not enough rebalance data yet.')).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('shows the empty-state message when the timeline is empty', () => {
    mockFilterWithStorage();
    vi.mocked(calcMomentumTimeline).mockReturnValue([]);

    render(<MomentumTimeline data={[]} />);

    expect(screen.getByText('Not enough rebalance data yet.')).toBeInTheDocument();
  });

  it('passes the timeline data to the LineChart', () => {
    mockFilterWithStorage();
    vi.mocked(calcMomentumTimeline).mockReturnValue([
      { date: '2026-07-01', avgMomentum: 10, topMomentum: 20, selectedCount: 2 },
      { date: '2026-07-02', avgMomentum: 15, topMomentum: 25, selectedCount: 3 },
      { date: '2026-07-03', avgMomentum: 12, topMomentum: 22, selectedCount: 1 },
    ]);

    render(<MomentumTimeline data={[]} />);

    expect(screen.getByTestId('line-chart')).toHaveAttribute('data-length', '3');
  });

  it('renders two Line series: avgMomentum and topMomentum', () => {
    mockFilterWithStorage();

    render(<MomentumTimeline data={[]} />);

    const lines = screen.getAllByTestId('line');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveAttribute('data-datakey', 'avgMomentum');
    expect(lines[0]).toHaveAttribute('data-name', 'avg');
    expect(lines[1]).toHaveAttribute('data-datakey', 'topMomentum');
    expect(lines[1]).toHaveAttribute('data-name', 'top');
  });

  it('renders the MomentumTooltip inside the chart Tooltip', () => {
    mockFilterWithStorage();

    render(<MomentumTimeline data={[]} />);

    expect(screen.getByTestId('momentum-tooltip')).toBeInTheDocument();
  });
});
