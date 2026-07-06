import Momentum from '@/features/momentum/components/organisms/Momentum';
import { fetchDecisions } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import type { DecisionEntry } from '@/shared/types/decisions';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/momentum/components/molecules/MomentumTimeline', () => ({
	default: ({ data }: { data: DecisionEntry[] }) => (
		<div data-testid='momentum-timeline' data-length={data.length} />
	),
}));

vi.mock('@/features/momentum/components/molecules/MomentumError', () => ({
	default: () => <div data-testid='momentum-error' />,
}));

vi.mock('@/features/momentum/components/molecules/MomentumSkeleton', () => ({
	default: () => <div data-testid='momentum-skeleton' />,
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

describe('<Momentum />', () => {
	beforeEach(() => {
		vi.mocked(useFetch).mockReset();
	});

	it('calls useFetch with fetchDecisions', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: true, error: null });

		render(<Momentum />);

		expect(useFetch).toHaveBeenCalledWith(fetchDecisions);
	});

	it('renders the skeleton while loading', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: true, error: null });

		render(<Momentum />);

		expect(screen.getByTestId('momentum-skeleton')).toBeInTheDocument();
		expect(screen.queryByTestId('momentum-timeline')).not.toBeInTheDocument();
		expect(screen.queryByTestId('momentum-error')).not.toBeInTheDocument();
	});

	it('renders the skeleton while loading even if data or error is already present', () => {
		vi.mocked(useFetch).mockReturnValue({
			data: [buildDecision()],
			loading: true,
			error: new Error('stale'),
		});

		render(<Momentum />);

		expect(screen.getByTestId('momentum-skeleton')).toBeInTheDocument();
	});

	it('renders the error state when error is set and loading has finished', () => {
		vi.mocked(useFetch).mockReturnValue({
			data: null,
			loading: false,
			error: new Error('failed'),
		});

		render(<Momentum />);

		expect(screen.getByTestId('momentum-error')).toBeInTheDocument();
		expect(screen.queryByTestId('momentum-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByTestId('momentum-timeline')).not.toBeInTheDocument();
	});

	it('renders the error state when data is falsy, even without an explicit error', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: false, error: null });

		render(<Momentum />);

		expect(screen.getByTestId('momentum-error')).toBeInTheDocument();
	});

	it('renders MomentumTimeline with the fetched data on success', () => {
		const data = [buildDecision(), buildDecision({ date: '2026-06-01' })];
		vi.mocked(useFetch).mockReturnValue({ data, loading: false, error: null });

		render(<Momentum />);

		expect(screen.queryByTestId('momentum-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByTestId('momentum-error')).not.toBeInTheDocument();
		expect(screen.getByTestId('momentum-timeline')).toHaveAttribute('data-length', '2');
	});

	it('renders MomentumTimeline even when data is an empty array (no error guard for empty arrays)', () => {
		vi.mocked(useFetch).mockReturnValue({ data: [], loading: false, error: null });

		render(<Momentum />);

		expect(screen.getByTestId('momentum-timeline')).toHaveAttribute('data-length', '0');
		expect(screen.queryByTestId('momentum-error')).not.toBeInTheDocument();
	});
});
