import GroupRowLayout from '@/shared/components/layouts/GroupRowLayout';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/components/atoms/Tooltip', () => ({
	default: ({ children, content }: { children: React.ReactNode; content: string }) => (
		<span data-testid='tooltip' data-content={content}>
			{children}
		</span>
	),
}));

vi.mock('@/shared/constants/sectors', () => ({
	SECTOR_MAP: {
		XLK: 'Technology',
	} as Record<string, string>,
}));

type Entry = { id: string; label: string };

function renderEntry(entry: Entry, color: string, isLast: boolean) {
	return (
		<div data-testid='entry' data-id={entry.id} data-color={color} data-is-last={String(isLast)}>
			{entry.label}
		</div>
	);
}

function getEntryKey(entry: Entry) {
	return entry.id;
}

function renderBadge(expanded: boolean) {
	return <span data-testid='badge'>{expanded ? 'expanded' : 'collapsed'}</span>;
}

function buildEntries(count: number): Entry[] {
	return Array.from({ length: count }, (_, i) => ({ id: `e${i}`, label: `Entry ${i}` }));
}

describe('<GroupRowLayout />', () => {
	it('renders the symbol with a tooltip when a sector name exists', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(1)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const tooltip = screen.getByTestId('tooltip');
		expect(tooltip).toHaveAttribute('data-content', 'Technology');
		expect(tooltip).toHaveTextContent('XLK');
	});

	it('renders the symbol without a tooltip when no sector name exists', () => {
		render(
			<GroupRowLayout
				symbol='ZZZ'
				color='#4ade80'
				entries={buildEntries(1)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(screen.getByText('ZZZ')).toBeInTheDocument();
	});

	it('renders the badge via renderBadge', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(1)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		expect(screen.getByTestId('badge')).toHaveTextContent('collapsed');
	});

	it('renders only the latest entry when there is a single entry', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(1)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		expect(screen.getAllByTestId('entry')).toHaveLength(1);
		expect(screen.getByTestId('entry')).toHaveAttribute('data-id', 'e0');
	});

	it('marks the latest entry as isLast when there is only one entry', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(1)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		expect(screen.getByTestId('entry')).toHaveAttribute('data-is-last', 'true');
	});

	it('disables the expand button and hides the chevron when there is only one entry', () => {
		const { container } = render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(1)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const buttons = screen.getAllByRole('button');
		buttons.forEach((btn) => expect(btn).toBeDisabled());
		expect(container.querySelector('svg')).not.toBeInTheDocument();
	});

	it('does not show the "older" count when there is only one entry', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(1)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		expect(screen.queryByText(/older/)).not.toBeInTheDocument();
	});

	it('renders the latest entry as last when collapsed, even with multiple entries', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(3)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const entries = screen.getAllByTestId('entry');
		expect(entries[0]).toHaveAttribute('data-is-last', 'true');
	});

	it('renders all entries in the DOM even when collapsed (hidden via CSS)', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(3)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		expect(screen.getAllByTestId('entry')).toHaveLength(3);
	});

	it('shows the "+N older" count when collapsed with multiple entries', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(4)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		expect(screen.getByText('+3 older')).toBeInTheDocument();
		expect(screen.getByText('+3', { selector: '.sm\\:hidden' })).toBeInTheDocument();
	});

	it('enables the expand buttons and shows the chevron when there are multiple entries', () => {
		const { container } = render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(3)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const buttons = screen.getAllByRole('button');
		buttons.forEach((btn) => expect(btn).not.toBeDisabled());
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('expands when the left button is clicked, updating isLast and hiding the "older" count', async () => {
		const user = userEvent.setup();

		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(3)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const [leftButton] = screen.getAllByRole('button');
		await user.click(leftButton);

		expect(screen.getByTestId('badge')).toHaveTextContent('expanded');
		expect(screen.queryByText(/older/)).not.toBeInTheDocument();

		const entries = screen.getAllByTestId('entry');
		expect(entries[0]).toHaveAttribute('data-is-last', 'false');
	});

	it('expands when the right button is clicked', async () => {
		const user = userEvent.setup();

		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(3)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const [, rightButton] = screen.getAllByRole('button');
		await user.click(rightButton);

		expect(screen.getByTestId('badge')).toHaveTextContent('expanded');
	});

	it('collapses again when clicked a second time', async () => {
		const user = userEvent.setup();

		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(3)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const [leftButton] = screen.getAllByRole('button');
		await user.click(leftButton);
		await user.click(leftButton);

		expect(screen.getByTestId('badge')).toHaveTextContent('collapsed');
	});

	it('marks the last older entry as isLast when expanded', async () => {
		const user = userEvent.setup();

		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(3)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const [leftButton] = screen.getAllByRole('button');
		await user.click(leftButton);

		const entries = screen.getAllByTestId('entry');
		expect(entries[1]).toHaveAttribute('data-is-last', 'false');
		expect(entries[2]).toHaveAttribute('data-is-last', 'true');
	});

	it('does not toggle expansion when there is only a single entry, even if clicked', async () => {
		const user = userEvent.setup();

		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(1)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const [leftButton] = screen.getAllByRole('button');
		await user.click(leftButton);

		expect(screen.getByTestId('badge')).toHaveTextContent('collapsed');
	});

	it('uses entries in their given order by default (reverseEntries is false)', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(3)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		const entries = screen.getAllByTestId('entry');
		expect(entries.map((e) => e.dataset.id)).toEqual(['e0', 'e1', 'e2']);
	});

	it('reverses entry order when reverseEntries is true', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#4ade80'
				entries={buildEntries(3)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
				reverseEntries
			/>,
		);

		const entries = screen.getAllByTestId('entry');
		expect(entries.map((e) => e.dataset.id)).toEqual(['e2', 'e1', 'e0']);
	});

	it('passes the color prop through to renderEntry for every entry', () => {
		render(
			<GroupRowLayout
				symbol='XLK'
				color='#f87171'
				entries={buildEntries(2)}
				getEntryKey={getEntryKey}
				renderBadge={renderBadge}
				renderEntry={renderEntry}
			/>,
		);

		screen.getAllByTestId('entry').forEach((entry) => {
			expect(entry).toHaveAttribute('data-color', '#f87171');
		});
	});
});
