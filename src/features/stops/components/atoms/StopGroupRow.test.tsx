import StopGroupRow from '@/features/stops/components/atoms/StopGroupRow';
import type { StopHistoryGroup } from '@/features/stops/types/stop-history';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/stops/components/atoms/StopEntry', () => ({
	default: ({ entry, color, isLast }: any) => (
		<div
			data-testid='stop-entry'
			data-date={entry.date}
			data-color={color}
			data-is-last={String(isLast)}
		/>
	),
}));

vi.mock('@/shared/components/layouts/GroupRowLayout', () => ({
	default: ({ symbol, color, entries, getEntryKey, renderBadge, renderEntry }: any) => (
		<div data-testid='group-row-layout' data-symbol={symbol} data-color={color}>
			<div data-testid='badge'>{renderBadge(false)}</div>
			{entries.map((entry: any, i: number) => (
				<div key={getEntryKey(entry, i)}>{renderEntry(entry, color, i === entries.length - 1)}</div>
			))}
		</div>
	),
}));

vi.mock('@/shared/utils/currency', () => ({
	usd: vi.fn((n: number) => `$${n}`),
}));

function buildGroup(overrides: Partial<StopHistoryGroup> = {}): StopHistoryGroup {
	return {
		symbol: 'XLK',
		color: '#4ade80',
		latestStop: 100,
		entries: [
			{ date: '2026-07-03', old_stop: 95, new_stop: 100 },
			{ date: '2026-07-01', old_stop: 0, new_stop: 95 },
		],
		...overrides,
	} as StopHistoryGroup;
}

describe('<StopGroupRow />', () => {
	it('passes symbol, color, and entries through to GroupRowLayout', () => {
		const group = buildGroup();

		render(<StopGroupRow group={group} />);

		const layout = screen.getByTestId('group-row-layout');
		expect(layout).toHaveAttribute('data-symbol', 'XLK');
		expect(layout).toHaveAttribute('data-color', '#4ade80');
		expect(screen.getAllByTestId('stop-entry')).toHaveLength(2);
	});

	it('renders a StopEntry for each entry with the correct date', () => {
		const group = buildGroup();

		render(<StopGroupRow group={group} />);

		const entries = screen.getAllByTestId('stop-entry');
		expect(entries[0]).toHaveAttribute('data-date', '2026-07-03');
		expect(entries[1]).toHaveAttribute('data-date', '2026-07-01');
	});

	it('shows the formatted latestStop in the badge', () => {
		const group = buildGroup({ latestStop: 105 });

		render(<StopGroupRow group={group} />);

		expect(screen.getByTestId('badge')).toHaveTextContent('$105');
	});

	it('colors the badge green when the overall change from the first entry is non-negative', () => {
		const group = buildGroup({
			latestStop: 100,
			entries: [
				{ date: '2026-07-03', old_stop: 95, new_stop: 100 },
				{ date: '2026-07-01', old_stop: 90, new_stop: 95 },
			],
		});

		render(<StopGroupRow group={group} />);

		const badge = screen.getByTestId('badge').firstChild;
		expect(badge).toHaveClass('text-green-400');
	});

	it('colors the badge red when the overall change from the first entry is negative', () => {
		const group = buildGroup({
			latestStop: 80,
			entries: [
				{ date: '2026-07-03', old_stop: 95, new_stop: 80 },
				{ date: '2026-07-01', old_stop: 100, new_stop: 95 },
			],
		});

		render(<StopGroupRow group={group} />);

		const badge = screen.getByTestId('badge').firstChild;
		expect(badge).toHaveClass('text-red-400');
	});

	it('colors the badge green when the overall change is exactly 0', () => {
		const group = buildGroup({
			latestStop: 100,
			entries: [{ date: '2026-07-01', old_stop: 100, new_stop: 100 }],
		});

		render(<StopGroupRow group={group} />);

		const badge = screen.getByTestId('badge').firstChild;
		expect(badge).toHaveClass('text-green-400');
	});

	it('uses the oldest entry (last in the array) as the baseline for the overall change', () => {
		const group = buildGroup({
			latestStop: 120,
			entries: [
				{ date: '2026-07-05', old_stop: 110, new_stop: 120 },
				{ date: '2026-07-03', old_stop: 95, new_stop: 110 },
				{ date: '2026-07-01', old_stop: 200, new_stop: 95 },
			],
		});

		render(<StopGroupRow group={group} />);

		const badge = screen.getByTestId('badge').firstChild;
		expect(badge).toHaveClass('text-red-400');
	});

	it('treats the overall change as 0 (green) when entries is empty', () => {
		const group = buildGroup({ latestStop: 100, entries: [] });

		render(<StopGroupRow group={group} />);

		const badge = screen.getByTestId('badge').firstChild;
		expect(badge).toHaveClass('text-green-400');
	});

	it('marks the last entry as isLast', () => {
		const group = buildGroup();

		render(<StopGroupRow group={group} />);

		const entries = screen.getAllByTestId('stop-entry');
		expect(entries[0]).toHaveAttribute('data-is-last', 'false');
		expect(entries[1]).toHaveAttribute('data-is-last', 'true');
	});

	it('passes the group color to each StopEntry', () => {
		const group = buildGroup({ color: '#f87171' });

		render(<StopGroupRow group={group} />);

		screen.getAllByTestId('stop-entry').forEach((entry) => {
			expect(entry).toHaveAttribute('data-color', '#f87171');
		});
	});
});
