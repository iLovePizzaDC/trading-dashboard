import { fetchBotEquity, fetchDecisions, fetchDeposits, fetchSpyEquity } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Deposit } from '@/shared/types/deposits';
import type { EquityPoint } from '@/shared/types/equity';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Equity from './Equity';

vi.mock('@/features/equity/components/molecules/EquityCurve', () => ({
	default: ({ data, deposits, decisions }: any) => (
		<div
			data-testid='equity-curve'
			data-length={data.length}
			data-deposits={deposits.length}
			data-decisions={decisions.length}
			data-spy-values={JSON.stringify(data.map((d: any) => d.spy))}
		/>
	),
}));

vi.mock('@/features/equity/components/molecules/MonthlyHeatmap', () => ({
	default: ({ data, deposits }: any) => (
		<div data-testid='monthly-heatmap' data-length={data.length} data-deposits={deposits.length} />
	),
}));

vi.mock('@/features/equity/components/molecules/EquityError', () => ({
	default: () => <div data-testid='equity-error' />,
}));

vi.mock('@/features/equity/components/molecules/EquitySkeleton', () => ({
	default: () => <div data-testid='equity-skeleton' />,
}));

vi.mock('@/shared/api/data', () => ({
	fetchBotEquity: vi.fn(),
	fetchSpyEquity: vi.fn(),
	fetchDeposits: vi.fn(),
	fetchDecisions: vi.fn(),
}));

vi.mock('@/shared/hooks/useFetch', () => ({
	useFetch: vi.fn(),
}));

type FetchState<T> = { data: T | null; loading: boolean; error: Error | null };

function buildEquityPoint(overrides: Partial<EquityPoint> = {}): EquityPoint {
	return { date: '2026-01-01', equity: 100, ...overrides } as EquityPoint;
}

function buildDeposit(overrides: Partial<Deposit> = {}): Deposit {
	return { date: '2026-01-15', amount: 500, ...overrides } as Deposit;
}

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
	return { date: '2026-01-01', candidates: [], ...overrides } as DecisionEntry;
}

function mockFetches({
	botEquity = { data: [buildEquityPoint()], loading: false, error: null },
	spyEquity = { data: [buildEquityPoint()], loading: false, error: null },
	deposits = { data: [buildDeposit()], loading: false, error: null },
	decisions = { data: [buildDecision()], loading: false, error: null },
}: {
	botEquity?: FetchState<EquityPoint[]>;
	spyEquity?: FetchState<EquityPoint[]>;
	deposits?: FetchState<Deposit[]>;
	decisions?: FetchState<DecisionEntry[]>;
} = {}) {
	vi.mocked(useFetch).mockImplementation((fn: any) => {
		if (fn === fetchBotEquity) return botEquity as any;
		if (fn === fetchSpyEquity) return spyEquity as any;
		if (fn === fetchDeposits) return deposits as any;
		if (fn === fetchDecisions) return decisions as any;
		throw new Error('useFetch called with an unexpected fetch function');
	});
}

describe('<Equity />', () => {
	beforeEach(() => {
		vi.mocked(useFetch).mockReset();
	});

	it('calls useFetch with all four fetch functions', () => {
		mockFetches();

		render(<Equity />);

		expect(useFetch).toHaveBeenCalledWith(fetchBotEquity);
		expect(useFetch).toHaveBeenCalledWith(fetchSpyEquity);
		expect(useFetch).toHaveBeenCalledWith(fetchDeposits);
		expect(useFetch).toHaveBeenCalledWith(fetchDecisions);
	});

	it('renders the skeleton when botEquity is loading', () => {
		mockFetches({ botEquity: { data: null, loading: true, error: null } });

		render(<Equity />);

		expect(screen.getByTestId('equity-skeleton')).toBeInTheDocument();
	});

	it('renders the skeleton when spyEquity is loading', () => {
		mockFetches({ spyEquity: { data: null, loading: true, error: null } });

		render(<Equity />);

		expect(screen.getByTestId('equity-skeleton')).toBeInTheDocument();
	});

	it('renders the skeleton when deposits is loading', () => {
		mockFetches({ deposits: { data: null, loading: true, error: null } });

		render(<Equity />);

		expect(screen.getByTestId('equity-skeleton')).toBeInTheDocument();
	});

	it('renders the skeleton when decisions is loading', () => {
		mockFetches({ decisions: { data: null, loading: true, error: null } });

		render(<Equity />);

		expect(screen.getByTestId('equity-skeleton')).toBeInTheDocument();
	});

	it('renders the skeleton over the error state when both loading and error are true', () => {
		mockFetches({
			botEquity: { data: null, loading: true, error: new Error('fail') },
		});

		render(<Equity />);

		expect(screen.getByTestId('equity-skeleton')).toBeInTheDocument();
		expect(screen.queryByTestId('equity-error')).not.toBeInTheDocument();
	});

	it('renders the error state when botEquity has an error', () => {
		mockFetches({ botEquity: { data: null, loading: false, error: new Error('fail') } });

		render(<Equity />);

		expect(screen.getByTestId('equity-error')).toBeInTheDocument();
	});

	it('renders the error state when botEquity data is missing', () => {
		mockFetches({ botEquity: { data: null, loading: false, error: null } });

		render(<Equity />);

		expect(screen.getByTestId('equity-error')).toBeInTheDocument();
	});

	it('renders the error state when spyEquity has an error', () => {
		mockFetches({ spyEquity: { data: null, loading: false, error: new Error('fail') } });

		render(<Equity />);

		expect(screen.getByTestId('equity-error')).toBeInTheDocument();
	});

	it('renders the error state when spyEquity data is missing', () => {
		mockFetches({ spyEquity: { data: null, loading: false, error: null } });

		render(<Equity />);

		expect(screen.getByTestId('equity-error')).toBeInTheDocument();
	});

	it('renders the error state when deposits data is missing', () => {
		mockFetches({ deposits: { data: null, loading: false, error: null } });

		render(<Equity />);

		expect(screen.getByTestId('equity-error')).toBeInTheDocument();
	});

	it('renders the error state when decisions has an error', () => {
		mockFetches({ decisions: { data: null, loading: false, error: new Error('fail') } });

		render(<Equity />);

		expect(screen.getByTestId('equity-error')).toBeInTheDocument();
	});

	it('renders the error state when decisions data is missing', () => {
		mockFetches({ decisions: { data: null, loading: false, error: null } });

		render(<Equity />);

		expect(screen.getByTestId('equity-error')).toBeInTheDocument();
	});

	it('does not check deposits for an error, only for missing data', () => {
		mockFetches({
			deposits: { data: [buildDeposit()], loading: false, error: new Error('ignored') },
		});

		render(<Equity />);

		expect(screen.queryByTestId('equity-error')).not.toBeInTheDocument();
	});

	it('renders EquityCurve and MonthlyHeatmap with data on success', () => {
		mockFetches({
			botEquity: {
				data: [buildEquityPoint(), buildEquityPoint({ date: '2026-01-02' })],
				loading: false,
				error: null,
			},
			deposits: {
				data: [buildDeposit(), buildDeposit({ date: '2026-01-20' })],
				loading: false,
				error: null,
			},
			decisions: { data: [buildDecision()], loading: false, error: null },
		});

		render(<Equity />);

		expect(screen.getByTestId('equity-curve')).toHaveAttribute('data-length', '2');
		expect(screen.getByTestId('equity-curve')).toHaveAttribute('data-deposits', '2');
		expect(screen.getByTestId('equity-curve')).toHaveAttribute('data-decisions', '1');

		expect(screen.getByTestId('monthly-heatmap')).toHaveAttribute('data-length', '2');
		expect(screen.getByTestId('monthly-heatmap')).toHaveAttribute('data-deposits', '2');
	});

	it('merges spy equity into bot equity by matching date', () => {
		mockFetches({
			botEquity: {
				data: [
					buildEquityPoint({ date: '2026-01-01', equity: 100 }),
					buildEquityPoint({ date: '2026-01-02', equity: 110 }),
				],
				loading: false,
				error: null,
			},
			spyEquity: {
				data: [
					buildEquityPoint({ date: '2026-01-01', equity: 200 }),
					buildEquityPoint({ date: '2026-01-02', equity: 205 }),
				],
				loading: false,
				error: null,
			},
		});

		render(<Equity />);

		const spyValues = JSON.parse(
			screen.getByTestId('equity-curve').getAttribute('data-spy-values') ?? '[]',
		);
		expect(spyValues).toEqual([200, 205]);
	});

	it('sets spy to null for bot equity dates with no matching spy entry', () => {
		mockFetches({
			botEquity: {
				data: [
					buildEquityPoint({ date: '2026-01-01', equity: 100 }),
					buildEquityPoint({ date: '2026-01-02', equity: 110 }),
				],
				loading: false,
				error: null,
			},
			spyEquity: {
				data: [buildEquityPoint({ date: '2026-01-01', equity: 200 })],
				loading: false,
				error: null,
			},
		});

		render(<Equity />);

		const spyValues = JSON.parse(
			screen.getByTestId('equity-curve').getAttribute('data-spy-values') ?? '[]',
		);
		expect(spyValues).toEqual([200, null]);
	});

	it('passes the raw (unmerged) botEquity to MonthlyHeatmap', () => {
		mockFetches({
			botEquity: {
				data: [buildEquityPoint({ date: '2026-01-01', equity: 100 })],
				loading: false,
				error: null,
			},
		});

		render(<Equity />);

		expect(screen.getByTestId('monthly-heatmap')).toHaveAttribute('data-length', '1');
	});
});
