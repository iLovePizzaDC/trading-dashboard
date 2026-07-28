import DecisionHistoryRow from '@/features/decisions/components/atoms/DecisionHistoryRow';
import { getMomentumColor } from '@/features/decisions/utils/decision-history-row';
import type { Candidate, DecisionEntry } from '@/shared/types/decisions';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/decisions/utils/decision-history-row', () => ({
	getMomentumColor: vi.fn(() => 'bg-white/10 text-white/60'),
}));

vi.mock('@/shared/components/atoms/Tooltip', () => ({
	default: ({ children, content }: { children: React.ReactNode; content: string }) => (
		<span data-testid='tooltip' data-content={content}>
			{children}
		</span>
	),
}));

function buildCandidate(overrides: Partial<Candidate> = {}): Candidate {
	return {
		symbol: 'XLK',
		momentum: 0.153,
		passes_trend: true,
		selected: true,
		rejected_reason: null,
		...overrides,
	} as Candidate;
}

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
	return {
		date: '2026-07-01',
		candidates: [buildCandidate()],
		...overrides,
	} as DecisionEntry;
}

describe('<DecisionHistoryRow />', () => {
	beforeEach(() => {
		vi.mocked(getMomentumColor).mockClear();
	});

	it('renders the decision date', () => {
		render(
			<DecisionHistoryRow decision={buildDecision({ date: '2026-06-15' })} cardHeight={120} />,
		);

		expect(screen.getByText('15 Jun 2026')).toBeInTheDocument();
	});

	it('displays the candidate count', () => {
		const candidates = [
			buildCandidate({ symbol: 'XLK' }),
			buildCandidate({ symbol: 'XLF' }),
			buildCandidate({ symbol: 'XLE' }),
		];

		render(<DecisionHistoryRow decision={buildDecision({ candidates })} cardHeight={120} />);

		expect(screen.getByText('3 picks')).toBeInTheDocument();
	});

	it('sets cardHeight as the container height', () => {
		const { container } = render(
			<DecisionHistoryRow decision={buildDecision()} cardHeight={180} />,
		);

		expect(container.firstChild).toHaveStyle({ height: '180px' });
	});

	it('shows at most the top 3 candidates sorted by momentum descending', () => {
		const candidates = [
			buildCandidate({ symbol: 'AAA', momentum: 0.1 }),
			buildCandidate({ symbol: 'BBB', momentum: 0.5 }),
			buildCandidate({ symbol: 'CCC', momentum: 0.3 }),
			buildCandidate({ symbol: 'DDD', momentum: 0.05 }),
		];

		render(<DecisionHistoryRow decision={buildDecision({ candidates })} cardHeight={120} />);

		const symbols = screen.getAllByText(/^[A-Z]{3}$/).map((el) => el.textContent);
		expect(symbols).toEqual(['BBB', 'CCC', 'AAA']);
		expect(screen.queryByText('DDD')).not.toBeInTheDocument();
	});

	it('treats momentum: null as 0 when sorting', () => {
		const candidates = [
			buildCandidate({ symbol: 'AAA', momentum: null }),
			buildCandidate({ symbol: 'BBB', momentum: 0.2 }),
			buildCandidate({ symbol: 'CCC', momentum: 0.5 }),
		];

		render(<DecisionHistoryRow decision={buildDecision({ candidates })} cardHeight={120} />);

		const symbols = screen.getAllByText(/^[A-Z]{3}$/).map((el) => el.textContent);
		expect(symbols).toEqual(['CCC', 'BBB', 'AAA']);
	});

	it('shows "+N more" when there are more than 3 candidates', () => {
		const candidates = [
			buildCandidate({ symbol: 'AAA' }),
			buildCandidate({ symbol: 'BBB' }),
			buildCandidate({ symbol: 'CCC' }),
			buildCandidate({ symbol: 'DDD' }),
			buildCandidate({ symbol: 'EEE' }),
		];

		render(<DecisionHistoryRow decision={buildDecision({ candidates })} cardHeight={120} />);

		expect(screen.getByText('+2 more')).toBeInTheDocument();
	});

	it('shows no "more" hint when there are 3 or fewer candidates', () => {
		const candidates = [
			buildCandidate({ symbol: 'AAA' }),
			buildCandidate({ symbol: 'BBB' }),
			buildCandidate({ symbol: 'CCC' }),
		];

		render(<DecisionHistoryRow decision={buildDecision({ candidates })} cardHeight={120} />);

		expect(screen.queryByText(/more/)).not.toBeInTheDocument();
	});

	it('highlights the strongest candidate with a ring class', () => {
		const candidates = [
			buildCandidate({ symbol: 'AAA', momentum: 0.1 }),
			buildCandidate({ symbol: 'BBB', momentum: 0.5 }),
			buildCandidate({ symbol: 'CCC', momentum: 0.3 }),
		];

		render(<DecisionHistoryRow decision={buildDecision({ candidates })} cardHeight={120} />);

		const cards = screen.getAllByTestId(/candidate-card-*/);
		expect(cards[0]).toHaveClass('ring-1', 'ring-green-400/40');
		expect(cards[1]).not.toHaveClass('ring-1');
		expect(cards[2]).not.toHaveClass('ring-1');
	});

	it('renders the symbol with a tooltip when a sector name exists', () => {
		render(
			<DecisionHistoryRow
				decision={buildDecision({ candidates: [buildCandidate({ symbol: 'XLK' })] })}
				cardHeight={120}
			/>,
		);

		const tooltip = screen.getByTestId('tooltip');
		expect(tooltip).toHaveAttribute('data-content', 'Technology');
		expect(tooltip).toHaveTextContent('XLK');
	});

	it('renders the symbol without a tooltip when no sector name exists', () => {
		render(
			<DecisionHistoryRow
				decision={buildDecision({ candidates: [buildCandidate({ symbol: 'ZZZ' })] })}
				cardHeight={120}
			/>,
		);

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(screen.getByText('ZZZ')).toBeInTheDocument();
	});

	it('displays the momentum percentage when momentum is present', () => {
		render(
			<DecisionHistoryRow
				decision={buildDecision({ candidates: [buildCandidate({ momentum: 0.234 })] })}
				cardHeight={120}
			/>,
		);

		expect(screen.getByText('23.4%')).toBeInTheDocument();
	});

	it('shows a bare "%" when momentum is null', () => {
		render(
			<DecisionHistoryRow
				decision={buildDecision({ candidates: [buildCandidate({ momentum: null })] })}
				cardHeight={120}
			/>,
		);

		expect(screen.getByText('%')).toBeInTheDocument();
	});

	it('calls getMomentumColor with the candidate momentum value', () => {
		render(
			<DecisionHistoryRow
				decision={buildDecision({ candidates: [buildCandidate({ momentum: 0.42 })] })}
				cardHeight={120}
			/>,
		);

		expect(getMomentumColor).toHaveBeenCalledWith(0.42);
	});

	it('calls getMomentumColor with undefined when momentum is null', () => {
		render(
			<DecisionHistoryRow
				decision={buildDecision({ candidates: [buildCandidate({ momentum: null })] })}
				cardHeight={120}
			/>,
		);

		expect(getMomentumColor).toHaveBeenCalledWith(undefined);
	});

	it('applies the class returned by getMomentumColor to the candidate card', () => {
		vi.mocked(getMomentumColor).mockReturnValue(
			'bg-green-500/20 text-green-300 border-green-500/30',
		);

		render(
			<DecisionHistoryRow
				decision={buildDecision({ candidates: [buildCandidate()] })}
				cardHeight={120}
			/>,
		);

		expect(screen.getByTestId(/candidate-card-*/)).toBeInTheDocument();
	});
});
