import Summary from '@/features/summary/components/organisms/Summary';
import { fetchSummary } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import type { Summary as SummaryType } from '@/shared/types/summary';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/summary/components/molecules/HeroCards', () => ({
	default: ({ portfolioValue, profit, regime }: any) => (
		<div
			data-testid='hero-cards'
			data-portfolio-value={portfolioValue}
			data-profit={profit}
			data-regime={regime}
		/>
	),
}));

vi.mock('@/features/summary/components/molecules/SummaryCards', () => ({
	default: ({ summary }: { summary: SummaryType }) => (
		<div data-testid='summary-cards' data-portfolio-value={summary.portfolio_value} />
	),
}));

vi.mock('@/features/summary/components/molecules/SummaryError', () => ({
	default: () => <div data-testid='summary-error' />,
}));

vi.mock('@/features/summary/components/molecules/SummarySkeleton', () => ({
	default: () => <div data-testid='summary-skeleton' />,
}));

vi.mock('@/shared/api/data', () => ({
	fetchSummary: vi.fn(),
}));

vi.mock('@/shared/hooks/useFetch', () => ({
	useFetch: vi.fn(),
}));

function buildSummaryData(overrides: Partial<SummaryType> = {}): SummaryType {
	return {
		portfolio_value: 12500,
		profit: 2500,
		regime: 'bullish',
		total_return: 25,
		cagr: 12,
		max_dd: -8,
		sharpe: 1.4,
		rolling_4w: 3,
		spy_4w: 1,
		total_invested: 10000,
		...overrides,
	} as SummaryType;
}

describe('<Summary />', () => {
	beforeEach(() => {
		vi.mocked(useFetch).mockReset();
	});

	it('calls useFetch with fetchSummary', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: true, error: null });

		render(<Summary />);

		expect(useFetch).toHaveBeenCalledWith(fetchSummary);
	});

	it('renders the skeleton while loading', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: true, error: null });

		render(<Summary />);

		expect(screen.getByTestId('summary-skeleton')).toBeInTheDocument();
		expect(screen.queryByTestId('hero-cards')).not.toBeInTheDocument();
		expect(screen.queryByTestId('summary-cards')).not.toBeInTheDocument();
		expect(screen.queryByTestId('summary-error')).not.toBeInTheDocument();
	});

	it('renders the skeleton while loading even if data or error is already present', () => {
		vi.mocked(useFetch).mockReturnValue({
			data: buildSummaryData(),
			loading: true,
			error: new Error('stale'),
		});

		render(<Summary />);

		expect(screen.getByTestId('summary-skeleton')).toBeInTheDocument();
	});

	it('renders the error state when error is set and loading has finished', () => {
		vi.mocked(useFetch).mockReturnValue({
			data: null,
			loading: false,
			error: new Error('failed'),
		});

		render(<Summary />);

		expect(screen.getByTestId('summary-error')).toBeInTheDocument();
		expect(screen.queryByTestId('summary-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByTestId('hero-cards')).not.toBeInTheDocument();
	});

	it('renders the error state when data is falsy, even without an explicit error', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: false, error: null });

		render(<Summary />);

		expect(screen.getByTestId('summary-error')).toBeInTheDocument();
	});

	it('renders HeroCards and SummaryCards with the fetched data on success', () => {
		const data = buildSummaryData({ portfolio_value: 20000, profit: 5000, regime: 'bearish' });
		vi.mocked(useFetch).mockReturnValue({ data, loading: false, error: null });

		render(<Summary />);

		expect(screen.queryByTestId('summary-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByTestId('summary-error')).not.toBeInTheDocument();

		const heroCards = screen.getByTestId('hero-cards');
		expect(heroCards).toHaveAttribute('data-portfolio-value', '20000');
		expect(heroCards).toHaveAttribute('data-profit', '5000');
		expect(heroCards).toHaveAttribute('data-regime', 'bearish');

		expect(screen.getByTestId('summary-cards')).toHaveAttribute('data-portfolio-value', '20000');
	});

	it('passes the entire data object as summary to SummaryCards', () => {
		const data = buildSummaryData({ portfolio_value: 15000 });
		vi.mocked(useFetch).mockReturnValue({ data, loading: false, error: null });

		render(<Summary />);

		expect(screen.getByTestId('summary-cards')).toHaveAttribute('data-portfolio-value', '15000');
	});
});
