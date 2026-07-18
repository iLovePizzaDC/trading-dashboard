import Positions from '@/features/positions/components/organisms/Positions';
import { fetchOpenStops, fetchTrades } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import type { OpenStops } from '@/shared/types/stops';
import type { Trade } from '@/shared/types/trades';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/positions/components/molecules/OpenPositions', () => ({
  default: ({ stops, trades }: { stops: OpenStops; trades: Trade[] }) => (
    <div
      data-testid='open-positions'
      data-stops={Object.keys(stops).length}
      data-trades={trades.length}
    />
  ),
}));

vi.mock('@/features/positions/components/molecules/PositionsError', () => ({
  default: () => <div data-testid='positions-error' />,
}));

vi.mock('@/features/positions/components/molecules/PositionsSkeleton', () => ({
  default: () => <div data-testid='positions-skeleton' />,
}));

vi.mock('@/shared/api/data', () => ({
  fetchOpenStops: vi.fn(),
  fetchTrades: vi.fn(),
}));

vi.mock('@/shared/hooks/useFetch', () => ({
  useFetch: vi.fn(),
}));

type FetchState<T> = { data: T | null; loading: boolean; error: Error | null };

function buildTrade(overrides: Partial<Trade> = {}): Trade {
  return {
    symbol: 'XLK',
    action: 'buy',
    shares: 10,
    price: 100,
    ...overrides,
  } as Trade;
}

function mockFetches({
  stops = { data: { XLK: 90 }, loading: false, error: null },
  trades = { data: [buildTrade()], loading: false, error: null },
}: {
  stops?: FetchState<OpenStops>;
  trades?: FetchState<Trade[]>;
} = {}) {
  vi.mocked(useFetch).mockImplementation((fn: any) => {
    if (fn === fetchOpenStops) return stops as any;
    if (fn === fetchTrades) return trades as any;
    throw new Error('useFetch called with an unexpected fetch function');
  });
}

describe('<Positions />', () => {
  beforeEach(() => {
    vi.mocked(useFetch).mockReset();
  });

  it('calls useFetch with fetchOpenStops and fetchTrades', () => {
    mockFetches();

    render(<Positions />);

    expect(useFetch).toHaveBeenCalledWith(fetchOpenStops);
    expect(useFetch).toHaveBeenCalledWith(fetchTrades);
  });

  it('renders the skeleton when stops is loading', () => {
    mockFetches({ stops: { data: null, loading: true, error: null } });

    render(<Positions />);

    expect(screen.getByTestId('positions-skeleton')).toBeInTheDocument();
  });

  it('renders the skeleton when trades is loading', () => {
    mockFetches({ trades: { data: null, loading: true, error: null } });

    render(<Positions />);

    expect(screen.getByTestId('positions-skeleton')).toBeInTheDocument();
  });

  it('renders the skeleton over the error state when both loading and error are true', () => {
    mockFetches({
      stops: { data: null, loading: true, error: new Error('fail') },
    });

    render(<Positions />);

    expect(screen.getByTestId('positions-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('positions-error')).not.toBeInTheDocument();
  });

  it('renders the error state when stops has an error', () => {
    mockFetches({ stops: { data: null, loading: false, error: new Error('fail') } });

    render(<Positions />);

    expect(screen.getByTestId('positions-error')).toBeInTheDocument();
  });

  it('renders the error state when stops data is missing', () => {
    mockFetches({ stops: { data: null, loading: false, error: null } });

    render(<Positions />);

    expect(screen.getByTestId('positions-error')).toBeInTheDocument();
  });

  it('renders the error state when trades has an error', () => {
    mockFetches({ trades: { data: null, loading: false, error: new Error('fail') } });

    render(<Positions />);

    expect(screen.getByTestId('positions-error')).toBeInTheDocument();
  });

  it('renders the error state when trades data is missing', () => {
    mockFetches({ trades: { data: null, loading: false, error: null } });

    render(<Positions />);

    expect(screen.getByTestId('positions-error')).toBeInTheDocument();
  });

  it('renders OpenPositions with stops and trades on success', () => {
    mockFetches({
      stops: { data: { XLK: 90, XLF: 40 }, loading: false, error: null },
      trades: { data: [buildTrade(), buildTrade({ symbol: 'XLF' })], loading: false, error: null },
    });

    render(<Positions />);

    expect(screen.queryByTestId('positions-skeleton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('positions-error')).not.toBeInTheDocument();

    const openPositions = screen.getByTestId('open-positions');
    expect(openPositions).toHaveAttribute('data-stops', '2');
    expect(openPositions).toHaveAttribute('data-trades', '2');
  });

  it('renders OpenPositions even when stops is an empty object (no error guard for empty objects)', () => {
    mockFetches({ stops: { data: {}, loading: false, error: null } });

    render(<Positions />);

    expect(screen.getByTestId('open-positions')).toHaveAttribute('data-stops', '0');
    expect(screen.queryByTestId('positions-error')).not.toBeInTheDocument();
  });

  it('renders OpenPositions even when trades is an empty array (no error guard for empty arrays)', () => {
    mockFetches({ trades: { data: [], loading: false, error: null } });

    render(<Positions />);

    expect(screen.getByTestId('open-positions')).toHaveAttribute('data-trades', '0');
    expect(screen.queryByTestId('positions-error')).not.toBeInTheDocument();
  });
});
