import Sector from '@/features/sector/components/organisms/Sector';
import { fetchDecisions, fetchTrades } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Trade } from '@/shared/types/trades';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/sector/components/molecules/SectorBreakDown', () => ({
  default: ({ decisions, trades }: { decisions: DecisionEntry[]; trades: Trade[] }) => (
    <div
      data-testid='sector-breakdown'
      data-decisions={decisions.length}
      data-trades={trades.length}
    />
  ),
}));

vi.mock('@/features/sector/components/molecules/SectorError', () => ({
  default: () => <div data-testid='sector-error' />,
}));

vi.mock('@/features/sector/components/molecules/SectorSkeleton', () => ({
  default: () => <div data-testid='sector-skeleton' />,
}));

vi.mock('@/shared/api/data', () => ({
  fetchDecisions: vi.fn(),
  fetchTrades: vi.fn(),
}));

vi.mock('@/shared/hooks/useFetch', () => ({
  useFetch: vi.fn(),
}));

type FetchState<T> = { data: T | null; loading: boolean; error: Error | null };

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
  return { date: '2026-07-01', candidates: [], ...overrides } as DecisionEntry;
}

function buildTrade(overrides: Partial<Trade> = {}): Trade {
  return { symbol: 'XLK', action: 'buy', shares: 10, price: 100, ...overrides } as Trade;
}

function mockFetches({
  decisions = { data: [buildDecision()], loading: false, error: null },
  trades = { data: [buildTrade()], loading: false, error: null },
}: {
  decisions?: FetchState<DecisionEntry[]>;
  trades?: FetchState<Trade[]>;
} = {}) {
  vi.mocked(useFetch).mockImplementation((fn: any) => {
    if (fn === fetchDecisions) return decisions as any;
    if (fn === fetchTrades) return trades as any;
    throw new Error('useFetch called with an unexpected fetch function');
  });
}

describe('<Sector />', () => {
  beforeEach(() => {
    vi.mocked(useFetch).mockReset();
  });

  it('calls useFetch with fetchDecisions and fetchTrades', () => {
    mockFetches();

    render(<Sector />);

    expect(useFetch).toHaveBeenCalledWith(fetchDecisions);
    expect(useFetch).toHaveBeenCalledWith(fetchTrades);
  });

  it('renders the skeleton when decisions is loading', () => {
    mockFetches({ decisions: { data: null, loading: true, error: null } });

    render(<Sector />);

    expect(screen.getByTestId('sector-skeleton')).toBeInTheDocument();
  });

  it('renders the skeleton when trades is loading', () => {
    mockFetches({ trades: { data: null, loading: true, error: null } });

    render(<Sector />);

    expect(screen.getByTestId('sector-skeleton')).toBeInTheDocument();
  });

  it('renders the skeleton over the error state when loading is true, even if data is missing', () => {
    mockFetches({ decisions: { data: null, loading: true, error: null } });

    render(<Sector />);

    expect(screen.getByTestId('sector-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('sector-error')).not.toBeInTheDocument();
  });

  it('renders the error state when decisions data is missing (even without an error field check)', () => {
    mockFetches({ decisions: { data: null, loading: false, error: null } });

    render(<Sector />);

    expect(screen.getByTestId('sector-error')).toBeInTheDocument();
  });

  it('renders the error state when trades data is missing', () => {
    mockFetches({ trades: { data: null, loading: false, error: null } });

    render(<Sector />);

    expect(screen.getByTestId('sector-error')).toBeInTheDocument();
  });

  it('renders the error state even when useFetch reports an error, as long as it is surfaced through missing data', () => {
    mockFetches({ decisions: { data: null, loading: false, error: new Error('failed') } });

    render(<Sector />);

    expect(screen.getByTestId('sector-error')).toBeInTheDocument();
  });

  it('renders SectorBreakdown with decisions and trades on success', () => {
    mockFetches({
      decisions: { data: [buildDecision(), buildDecision()], loading: false, error: null },
      trades: { data: [buildTrade()], loading: false, error: null },
    });

    render(<Sector />);

    expect(screen.queryByTestId('sector-skeleton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sector-error')).not.toBeInTheDocument();

    const breakdown = screen.getByTestId('sector-breakdown');
    expect(breakdown).toHaveAttribute('data-decisions', '2');
    expect(breakdown).toHaveAttribute('data-trades', '1');
  });

  it('renders SectorBreakdown even when decisions is an empty array (no error guard for empty arrays)', () => {
    mockFetches({ decisions: { data: [], loading: false, error: null } });

    render(<Sector />);

    expect(screen.getByTestId('sector-breakdown')).toHaveAttribute('data-decisions', '0');
    expect(screen.queryByTestId('sector-error')).not.toBeInTheDocument();
  });

  it('renders SectorBreakdown even when trades is an empty array (no error guard for empty arrays)', () => {
    mockFetches({ trades: { data: [], loading: false, error: null } });

    render(<Sector />);

    expect(screen.getByTestId('sector-breakdown')).toHaveAttribute('data-trades', '0');
    expect(screen.queryByTestId('sector-error')).not.toBeInTheDocument();
  });
});
