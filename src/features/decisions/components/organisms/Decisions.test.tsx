import { fetchDecisions } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import type { DecisionEntry } from '@/shared/types/decisions';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Decisions from './Decisions';

vi.mock('@/features/decisions/components/molecules/DecisionsCard', () => ({
	default: ({ data }: { data: DecisionEntry[] }) => (
		<div data-testid='decisions-card' data-length={data.length} />
	),
}));

vi.mock('@/features/decisions/components/molecules/DecisionHistory', () => ({
	default: ({ data }: { data: DecisionEntry[] }) => (
		<div data-testid='decision-history' data-length={data.length} />
	),
}));

vi.mock('@/features/decisions/components/molecules/DecisionsError', () => ({
	default: () => <div data-testid='decisions-error' />,
}));

vi.mock('@/features/decisions/components/molecules/DecisionsSkeleton', () => ({
	default: () => <div data-testid='decisions-skeleton' />,
}));

vi.mock('@/shared/api/data', () => ({
	fetchDecisions: vi.fn(),
}));

vi.mock('@/shared/hooks/useFetch', () => ({
	useFetch: vi.fn(),
}));

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
	return {
		date: '2026-07-01',
		candidates: [],
		...overrides,
	} as DecisionEntry;
}

describe('<Decisions />', () => {
	beforeEach(() => {
		vi.mocked(useFetch).mockReset();
	});

	it('calls useFetch with fetchDecisions', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: true, error: null });

		render(<Decisions />);

		expect(useFetch).toHaveBeenCalledWith(fetchDecisions);
	});

	it('renders the skeleton while loading', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: true, error: null });

		render(<Decisions />);

		expect(screen.getByTestId('decisions-skeleton')).toBeInTheDocument();
		expect(screen.queryByTestId('decisions-card')).not.toBeInTheDocument();
		expect(screen.queryByTestId('decision-history')).not.toBeInTheDocument();
		expect(screen.queryByTestId('decisions-error')).not.toBeInTheDocument();
	});

	it('renders the skeleton while loading even if data or error is already present', () => {
		vi.mocked(useFetch).mockReturnValue({
			data: [buildDecision()],
			loading: true,
			error: new Error('stale'),
		});

		render(<Decisions />);

		expect(screen.getByTestId('decisions-skeleton')).toBeInTheDocument();
	});

	it('renders the error state when error is set and loading has finished', () => {
		vi.mocked(useFetch).mockReturnValue({
			data: null,
			loading: false,
			error: new Error('failed'),
		});

		render(<Decisions />);

		expect(screen.getByTestId('decisions-error')).toBeInTheDocument();
		expect(screen.queryByTestId('decisions-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByTestId('decisions-card')).not.toBeInTheDocument();
	});

	it('renders the error state when data is falsy, even without an explicit error', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: false, error: null });

		render(<Decisions />);

		expect(screen.getByTestId('decisions-error')).toBeInTheDocument();
	});

	it('renders DecisionsCard and DecisionHistory even when data is an empty array', () => {
		vi.mocked(useFetch).mockReturnValue({ data: [], loading: false, error: null });

		render(<Decisions />);

		expect(screen.getByTestId('decisions-card')).toHaveAttribute('data-length', '0');
		expect(screen.getByTestId('decision-history')).toHaveAttribute('data-length', '0');
	});

	it('renders DecisionsCard and DecisionHistory with the fetched data on success', () => {
		const data = [buildDecision(), buildDecision({ date: '2026-06-01' })];
		vi.mocked(useFetch).mockReturnValue({ data, loading: false, error: null });

		render(<Decisions />);

		expect(screen.queryByTestId('decisions-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByTestId('decisions-error')).not.toBeInTheDocument();

		expect(screen.getByTestId('decisions-card')).toHaveAttribute('data-length', '2');
		expect(screen.getByTestId('decision-history')).toHaveAttribute('data-length', '2');
	});
});
