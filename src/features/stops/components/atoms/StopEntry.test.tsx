import StopEntry from '@/features/stops/components/atoms/StopEntry';
import type { StopHistoryEntry } from '@/shared/types/stops';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/components/layouts/EntryRowLayout', () => ({
	default: ({ color, isLast, dotOpacity, renderLeft, renderRight }: any) => (
		<div
			data-testid='entry-row-layout'
			data-color={color}
			data-is-last={String(isLast)}
			data-dot-opacity={dotOpacity}
		>
			<div data-testid='render-left'>{renderLeft}</div>
			<div data-testid='render-right'>{renderRight}</div>
		</div>
	),
}));

function buildEntry(overrides: Partial<StopHistoryEntry> = {}): StopHistoryEntry {
	return {
		date: '2026-07-01',
		old_stop: 90,
		new_stop: 95,
		...overrides,
	} as StopHistoryEntry;
}

describe('<StopEntry />', () => {
	it('passes color and isLast through to EntryRowLayout', () => {
		render(<StopEntry entry={buildEntry()} color='#4ade80' isLast />);

		const layout = screen.getByTestId('entry-row-layout');
		expect(layout).toHaveAttribute('data-color', '#4ade80');
		expect(layout).toHaveAttribute('data-is-last', 'true');
	});

	it('renders the date', () => {
		render(<StopEntry entry={buildEntry({ date: '2026-07-04' })} color='#4ade80' isLast={false} />);

		expect(screen.getByText('04 Jul 2026')).toBeInTheDocument();
	});

	it('renders the new stop value on the right', () => {
		render(<StopEntry entry={buildEntry({ new_stop: 105 })} color='#4ade80' isLast={false} />);

		const right = screen.getByTestId('render-right');
		expect(right).toHaveTextContent('$105.00');
	});

	describe('initial stop (old_stop === 0)', () => {
		it('labels the entry as "init"', () => {
			render(<StopEntry entry={buildEntry({ old_stop: 0 })} color='#4ade80' isLast={false} />);

			expect(screen.getByText('init')).toBeInTheDocument();
		});

		it('does not render the old stop value or arrow icon', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 0, new_stop: 95 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.queryByText('$0.00')).not.toBeInTheDocument();
			expect(screen.queryByTestId('arrow-indicator')).not.toBeInTheDocument();
		});

		it('uses a neutral (white) color for the label and value', () => {
			render(<StopEntry entry={buildEntry({ old_stop: 0 })} color='#4ade80' isLast={false} />);

			expect(screen.getByText('init')).toHaveClass('text-white/40');
			expect(screen.getByText('$95.00')).toHaveClass('text-white/50');
		});

		it('sets dotOpacity to 1', () => {
			render(<StopEntry entry={buildEntry({ old_stop: 0 })} color='#4ade80' isLast={false} />);

			expect(screen.getByTestId('entry-row-layout')).toHaveAttribute('data-dot-opacity', '1');
		});
	});

	describe('raise (new_stop > old_stop, old_stop !== 0)', () => {
		it('labels the entry as "raise"', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 90, new_stop: 100 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.getByText('raise')).toBeInTheDocument();
		});

		it('renders the old stop value with an arrow icon', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 90, new_stop: 100 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.getByText('$90.00')).toBeInTheDocument();
			expect(screen.getByTestId('arrow-indicator')).toBeInTheDocument();
		});

		it('uses green color for the label and value', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 90, new_stop: 100 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.getByText('raise')).toHaveClass('text-green-400');
			expect(screen.getByText('$100.00')).toHaveClass('text-green-400');
		});

		it('sets dotOpacity to 1', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 90, new_stop: 100 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.getByTestId('entry-row-layout')).toHaveAttribute('data-dot-opacity', '1');
		});
	});

	describe('lower (new_stop <= old_stop, old_stop !== 0)', () => {
		it('labels the entry as "lower"', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 100, new_stop: 90 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.getByText('lower')).toBeInTheDocument();
		});

		it('renders the old stop value with an arrow icon', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 100, new_stop: 90 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.getByText('$100.00')).toBeInTheDocument();
			expect(screen.getByTestId('arrow-indicator')).toBeInTheDocument();
		});

		it('uses red color for the label and value', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 100, new_stop: 90 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.getByText('lower')).toHaveClass('text-red-400');
			expect(screen.getByText('$90.00')).toHaveClass('text-red-400');
		});

		it('sets dotOpacity to 0.55', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 100, new_stop: 90 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.getByTestId('entry-row-layout')).toHaveAttribute('data-dot-opacity', '0.55');
		});

		it('treats an unchanged stop (new_stop === old_stop) as "lower"', () => {
			render(
				<StopEntry
					entry={buildEntry({ old_stop: 100, new_stop: 100 })}
					color='#4ade80'
					isLast={false}
				/>,
			);

			expect(screen.getByText('lower')).toBeInTheDocument();
		});
	});
});
