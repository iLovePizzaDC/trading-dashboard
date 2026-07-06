import DecisionHistory from '@/features/decisions/components/molecules/DecisionHistory';
import { useDecisionVirtualizer } from '@/features/decisions/hooks/useDecisionVirtualizer';
import type { DecisionEntry } from '@/shared/types/decisions';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/decisions/components/atoms/DecisionHistoryRow', () => ({
	default: ({ decision, cardHeight }: { decision: DecisionEntry; cardHeight: number }) => (
		<div data-testid='decision-history-row' data-date={decision.date} data-card-height={cardHeight}>
			{decision.date}
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

vi.mock('@/features/decisions/hooks/useDecisionVirtualizer', () => ({
	useDecisionVirtualizer: vi.fn(),
}));

const ROW_HEIGHT = 107;

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
	return {
		date: '2026-07-01',
		candidates: [],
		...overrides,
	} as DecisionEntry;
}

function mockVirtualizer({
	totalSize = 0,
	items = [],
}: {
	totalSize?: number;
	items?: Array<{ key: string | number; index: number; start: number }>;
} = {}) {
	vi.mocked(useDecisionVirtualizer).mockReturnValue({
		getTotalSize: () => totalSize,
		getVirtualItems: () => items,
	} as ReturnType<typeof useDecisionVirtualizer>);
}

describe('<DecisionHistory />', () => {
	beforeEach(() => {
		vi.mocked(useDecisionVirtualizer).mockReset();
	});

	it('renders the title and the entry count as the badge', () => {
		mockVirtualizer();

		const data = [buildDecision(), buildDecision({ date: '2026-06-01' })];

		render(<DecisionHistory data={data} />);

		expect(screen.getByTestId('card-title')).toHaveTextContent('decision history');
		expect(screen.getByTestId('card-badge')).toHaveTextContent('2 entries');
	});

	it('calls useDecisionVirtualizer with the sorted length and the row height', () => {
		mockVirtualizer();

		const data = [
			buildDecision(),
			buildDecision({ date: '2026-06-01' }),
			buildDecision({ date: '2026-05-01' }),
		];

		render(<DecisionHistory data={data} />);

		expect(useDecisionVirtualizer).toHaveBeenCalledWith(3, expect.anything(), ROW_HEIGHT);
	});

	it('sorts entries by date descending before virtualizing', () => {
		mockVirtualizer({
			totalSize: ROW_HEIGHT * 3,
			items: [
				{ key: 0, index: 0, start: 0 },
				{ key: 1, index: 1, start: ROW_HEIGHT },
				{ key: 2, index: 2, start: ROW_HEIGHT * 2 },
			],
		});

		const data = [
			buildDecision({ date: '2026-05-01' }),
			buildDecision({ date: '2026-07-01' }),
			buildDecision({ date: '2026-06-01' }),
		];

		render(<DecisionHistory data={data} />);

		const rows = screen.getAllByTestId('decision-history-row');
		expect(rows.map((row) => row.dataset.date)).toEqual(['2026-07-01', '2026-06-01', '2026-05-01']);
	});

	it('renders a DecisionHistoryRow only for the virtual items returned by the virtualizer', () => {
		mockVirtualizer({
			totalSize: ROW_HEIGHT * 5,
			items: [
				{ key: 1, index: 1, start: ROW_HEIGHT },
				{ key: 2, index: 2, start: ROW_HEIGHT * 2 },
			],
		});

		const data = [
			buildDecision({ date: '2026-07-05' }),
			buildDecision({ date: '2026-07-04' }),
			buildDecision({ date: '2026-07-03' }),
			buildDecision({ date: '2026-07-02' }),
			buildDecision({ date: '2026-07-01' }),
		];

		render(<DecisionHistory data={data} />);

		const rows = screen.getAllByTestId('decision-history-row');
		expect(rows).toHaveLength(2);
		expect(rows.map((row) => row.dataset.date)).toEqual(['2026-07-04', '2026-07-03']);
	});

	it('passes a fixed cardHeight of 97 to each DecisionHistoryRow', () => {
		mockVirtualizer({
			totalSize: ROW_HEIGHT,
			items: [{ key: 0, index: 0, start: 0 }],
		});

		render(<DecisionHistory data={[buildDecision()]} />);

		expect(screen.getByTestId('decision-history-row')).toHaveAttribute('data-card-height', '97');
	});

	it('positions each row using translateY based on virtualRow.start', () => {
		mockVirtualizer({
			totalSize: ROW_HEIGHT * 2,
			items: [
				{ key: 0, index: 0, start: 0 },
				{ key: 1, index: 1, start: ROW_HEIGHT },
			],
		});

		render(<DecisionHistory data={[buildDecision(), buildDecision({ date: '2026-06-01' })]} />);

		const rowWrappers = screen.getAllByTestId(/decision-virtualizer-wrapper-*/);
		expect(rowWrappers[0]).toHaveStyle({ transform: 'translateY(0px)' });
		expect(rowWrappers[1]).toHaveStyle({ transform: `translateY(${ROW_HEIGHT}px)` });
	});

	it('sets the inner spacer height to the total virtualized size', () => {
		mockVirtualizer({ totalSize: 428, items: [] });

		render(<DecisionHistory data={[buildDecision()]} />);

		expect(screen.getByTestId('decision-virtualizer')).toHaveStyle({ height: '428px' });
	});

	it('applies a mask-image fade when the content exceeds the max height (canScroll)', () => {
		mockVirtualizer({ totalSize: 300, items: [] });

		render(<DecisionHistory data={[buildDecision()]} />);

		expect(screen.getByTestId('decision-scroll-container')).toHaveStyle({
			maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
		});
	});

	it('does not apply a mask-image fade when the content fits within the max height', () => {
		mockVirtualizer({ totalSize: 150, items: [] });

		render(<DecisionHistory data={[buildDecision()]} />);

		expect(screen.getByTestId('decision-scroll-container')).not.toHaveAttribute(
			'style',
			expect.stringContaining('maskImage'),
		);
	});

	it('renders an empty list without crashing when data is empty', () => {
		mockVirtualizer({ totalSize: 0, items: [] });

		render(<DecisionHistory data={[]} />);

		expect(screen.getByTestId('card-badge')).toHaveTextContent('0 entries');
		expect(screen.queryByTestId('decision-history-row')).not.toBeInTheDocument();
	});
});
