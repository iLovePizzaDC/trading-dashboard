import DecisionsCard from '@/features/decisions/components/molecules/DecisionsCard';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { Candidate, DecisionEntry } from '@/shared/types/decisions';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/decisions/components/atoms/DecisionCardRow', () => ({
	default: ({ candidate, isLast }: { candidate: Candidate; isLast?: boolean }) => (
		<div
			data-testid='decision-card-row'
			data-symbol={candidate.symbol}
			data-is-last={String(isLast)}
		>
			{candidate.symbol}
		</div>
	),
}));

vi.mock('@/shared/components/atoms/Card', () => ({
	default: ({
		title,
		badge,
		children,
	}: {
		title: string;
		badge?: React.ReactNode;
		children: React.ReactNode;
	}) => (
		<div data-testid='card'>
			<p data-testid='card-title'>{title}</p>
			<div data-testid='card-badge'>{badge}</div>
			<div data-testid='card-children'>{children}</div>
		</div>
	),
}));

vi.mock('@/shared/components/atoms/ShowMoreButton', () => ({
	default: ({
		toggle,
		expanded,
		hiddenCount,
	}: {
		toggle: () => void;
		expanded: boolean;
		hiddenCount: number;
	}) => (
		<button data-testid='show-more' onClick={toggle}>
			{expanded ? 'show less' : `show ${hiddenCount} more`}
		</button>
	),
}));

vi.mock('@/shared/hooks/useExpandable', () => ({
	useExpandable: vi.fn(),
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

function mockExpandable(overrides: Partial<ReturnType<typeof useExpandable>> = {}) {
	vi.mocked(useExpandable).mockReturnValue({
		expanded: false,
		toggle: vi.fn(),
		hasMore: false,
		hiddenCount: 0,
		previewCount: 3,
		...overrides,
	});
}

describe('<DecisionsCard />', () => {
	beforeEach(() => {
		vi.mocked(useExpandable).mockReset();
	});

	it('renders the title and the date of the latest (last) decision entry as the badge', () => {
		mockExpandable();

		const older = buildDecision({ date: '2026-06-01' });
		const latest = buildDecision({ date: '2026-07-01' });

		render(<DecisionsCard data={[older, latest]} />);

		expect(screen.getByTestId('card-title')).toHaveTextContent('last decisions');
		expect(screen.getByTestId('card-badge')).toHaveTextContent('2026-07-01');
	});

	it('calls useExpandable with the candidate count and a preview size of 3', () => {
		mockExpandable();

		const candidates = [
			buildCandidate({ symbol: 'AAA' }),
			buildCandidate({ symbol: 'BBB' }),
			buildCandidate({ symbol: 'CCC' }),
		];

		render(<DecisionsCard data={[buildDecision({ candidates })]} />);

		expect(useExpandable).toHaveBeenCalledWith(3, 3);
	});

	it('renders preview candidates sorted by momentum descending', () => {
		mockExpandable({ previewCount: 3 });

		const candidates = [
			buildCandidate({ symbol: 'AAA', momentum: 0.1 }),
			buildCandidate({ symbol: 'BBB', momentum: 0.5 }),
			buildCandidate({ symbol: 'CCC', momentum: 0.3 }),
		];

		render(<DecisionsCard data={[buildDecision({ candidates })]} />);

		const rows = screen.getAllByTestId('decision-card-row');
		expect(rows.map((row) => row.dataset.symbol)).toEqual(['BBB', 'CCC', 'AAA']);
	});

	it('treats momentum: null as 0 when sorting', () => {
		mockExpandable({ previewCount: 3 });

		const candidates = [
			buildCandidate({ symbol: 'AAA', momentum: null }),
			buildCandidate({ symbol: 'BBB', momentum: 0.2 }),
			buildCandidate({ symbol: 'CCC', momentum: 0.5 }),
		];

		render(<DecisionsCard data={[buildDecision({ candidates })]} />);

		const rows = screen.getAllByTestId('decision-card-row');
		expect(rows.map((row) => row.dataset.symbol)).toEqual(['CCC', 'BBB', 'AAA']);
	});

	it('marks the last preview row as isLast when there is no extra content', () => {
		mockExpandable({ previewCount: 3, hasMore: false });

		const candidates = [
			buildCandidate({ symbol: 'AAA' }),
			buildCandidate({ symbol: 'BBB' }),
			buildCandidate({ symbol: 'CCC' }),
		];

		render(<DecisionsCard data={[buildDecision({ candidates })]} />);

		const rows = screen.getAllByTestId('decision-card-row');
		expect(rows[0]).toHaveAttribute('data-is-last', 'false');
		expect(rows[1]).toHaveAttribute('data-is-last', 'false');
		expect(rows[2]).toHaveAttribute('data-is-last', 'true');
	});

	it('does not mark the last preview row as isLast when expanded with extra content', () => {
		mockExpandable({ previewCount: 2, expanded: true, hasMore: true, hiddenCount: 2 });

		const candidates = [
			buildCandidate({ symbol: 'AAA', momentum: 0.9 }),
			buildCandidate({ symbol: 'BBB', momentum: 0.8 }),
			buildCandidate({ symbol: 'CCC', momentum: 0.7 }),
			buildCandidate({ symbol: 'DDD', momentum: 0.6 }),
		];

		render(<DecisionsCard data={[buildDecision({ candidates })]} />);

		const rows = screen.getAllByTestId('decision-card-row');
		const previewRows = rows.slice(0, 2);
		expect(previewRows[1]).toHaveAttribute('data-is-last', 'false');
	});

	it('marks the last preview row as isLast when not expanded, even with extra content', () => {
		mockExpandable({ previewCount: 2, expanded: false, hasMore: true, hiddenCount: 2 });

		const candidates = [
			buildCandidate({ symbol: 'AAA', momentum: 0.9 }),
			buildCandidate({ symbol: 'BBB', momentum: 0.8 }),
			buildCandidate({ symbol: 'CCC', momentum: 0.7 }),
			buildCandidate({ symbol: 'DDD', momentum: 0.6 }),
		];

		render(<DecisionsCard data={[buildDecision({ candidates })]} />);

		const rows = screen.getAllByTestId('decision-card-row');
		const previewRows = rows.slice(0, 2);
		expect(previewRows[1]).toHaveAttribute('data-is-last', 'true');
	});

	it('renders the remaining candidates as extra rows and marks the last one as isLast', () => {
		mockExpandable({ previewCount: 2, expanded: true, hasMore: true, hiddenCount: 2 });

		const candidates = [
			buildCandidate({ symbol: 'AAA', momentum: 0.9 }),
			buildCandidate({ symbol: 'BBB', momentum: 0.8 }),
			buildCandidate({ symbol: 'CCC', momentum: 0.7 }),
			buildCandidate({ symbol: 'DDD', momentum: 0.6 }),
		];

		render(<DecisionsCard data={[buildDecision({ candidates })]} />);

		const rows = screen.getAllByTestId('decision-card-row');
		const extraRows = rows.slice(2);

		expect(extraRows.map((row) => row.dataset.symbol)).toEqual(['CCC', 'DDD']);
		expect(extraRows[0]).toHaveAttribute('data-is-last', 'false');
		expect(extraRows[1]).toHaveAttribute('data-is-last', 'true');
	});

	it('expands the grid rows when expanded is true', () => {
		mockExpandable({ previewCount: 2, expanded: true, hasMore: true, hiddenCount: 2 });

		render(
			<DecisionsCard
				data={[
					buildDecision({
						candidates: [
							buildCandidate({ symbol: 'AAA' }),
							buildCandidate({ symbol: 'BBB' }),
							buildCandidate({ symbol: 'CCC' }),
						],
					}),
				]}
			/>,
		);

		expect(screen.getByTestId('decision-grid-container')).toHaveClass('grid-rows-[1fr]');
	});

	it('collapses the grid rows when expanded is false', () => {
		mockExpandable({ previewCount: 2, expanded: false, hasMore: true, hiddenCount: 2 });

		render(
			<DecisionsCard
				data={[
					buildDecision({
						candidates: [
							buildCandidate({ symbol: 'AAA' }),
							buildCandidate({ symbol: 'BBB' }),
							buildCandidate({ symbol: 'CCC' }),
						],
					}),
				]}
			/>,
		);

		expect(screen.getByTestId('decision-grid-container')).toHaveClass('grid-rows-[0fr]');
	});

	it('renders the ShowMoreButton when hasMore is true', () => {
		mockExpandable({ hasMore: true, hiddenCount: 4 });

		render(<DecisionsCard data={[buildDecision()]} />);

		expect(screen.getByTestId('show-more')).toHaveTextContent('show 4 more');
	});

	it('does not render the ShowMoreButton when hasMore is false', () => {
		mockExpandable({ hasMore: false });

		render(<DecisionsCard data={[buildDecision()]} />);

		expect(screen.queryByTestId('show-more')).not.toBeInTheDocument();
	});

	it('calls toggle from useExpandable when the ShowMoreButton is clicked', async () => {
		const user = userEvent.setup();
		const toggle = vi.fn();
		mockExpandable({ hasMore: true, hiddenCount: 2, toggle });

		render(<DecisionsCard data={[buildDecision()]} />);

		await user.click(screen.getByTestId('show-more'));

		expect(toggle).toHaveBeenCalledTimes(1);
	});

	it('renders nothing when data is empty', () => {
		mockExpandable({ previewCount: 0, hasMore: false });

		const { container } = render(<DecisionsCard data={[]} />);

		expect(container).toBeEmptyDOMElement();
	});

	it('calls useExpandable with 0 when data is empty, without crashing', () => {
		mockExpandable({ previewCount: 0, hasMore: false });

		render(<DecisionsCard data={[]} />);

		expect(useExpandable).toHaveBeenCalledWith(0, 3);
	});
});
