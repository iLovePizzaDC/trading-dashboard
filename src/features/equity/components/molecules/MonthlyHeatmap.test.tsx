import MonthlyHeatmap from '@/features/equity/components/molecules/MonthlyHeatmap';
import type { MonthlyReturn } from '@/features/equity/types/heatmap';
import { calcMonthlyReturns } from '@/features/equity/utils/performance';
import type { Deposit } from '@/shared/types/deposits';
import type { EquityPoint } from '@/shared/types/equity';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/equity/constants/heatmap', () => ({
	MONTHS: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
}));

vi.mock('@/features/equity/utils/performance', () => ({
	calcMonthlyReturns: vi.fn(),
}));

vi.mock('@/features/equity/components/atoms/MonthCell', () => ({
	default: ({ entry, selected, onClick }: any) => (
		<button
			data-testid='month-cell'
			data-key={`${entry.year}-${entry.month}`}
			data-selected={String(selected)}
			onClick={onClick}
		>
			{entry.year}-{entry.month}
		</button>
	),
}));

vi.mock('@/features/equity/components/atoms/DetailPanel', () => ({
	default: ({ entry }: any) => (
		<div data-testid='detail-panel' data-key={`${entry.year}-${entry.month}`} />
	),
}));

vi.mock('@/shared/components/atoms/Card', () => ({
	default: ({ title, children }: any) => (
		<div data-testid='card'>
			<p data-testid='card-title'>{title}</p>
			<div data-testid='card-children'>{children}</div>
		</div>
	),
}));

function buildMonthlyReturn(overrides: Partial<MonthlyReturn> = {}): MonthlyReturn {
	return {
		month: 1,
		year: 2026,
		return: 5,
		startEquity: 10000,
		endEquity: 10500,
		...overrides,
	} as MonthlyReturn;
}

function mockMonthly(entries: MonthlyReturn[]) {
	vi.mocked(calcMonthlyReturns).mockReturnValue(entries);
}

describe('<MonthlyHeatmap />', () => {
	beforeEach(() => {
		vi.mocked(calcMonthlyReturns).mockReset();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders the card title', () => {
		mockMonthly([]);

		render(<MonthlyHeatmap data={[]} deposits={[]} />);

		expect(screen.getByTestId('card-title')).toHaveTextContent('monthly heatmap');
	});

	it('calls calcMonthlyReturns with data and deposits', () => {
		mockMonthly([]);

		const data = [{ date: '2026-01-01', equity: 100 }] as EquityPoint[];
		const deposits = [{ date: '2026-01-15', amount: 500 }] as Deposit[];

		render(<MonthlyHeatmap data={data} deposits={deposits} />);

		expect(calcMonthlyReturns).toHaveBeenCalledWith(data, deposits);
	});

	it('renders all 12 month abbreviations in the header', () => {
		mockMonthly([]);

		render(<MonthlyHeatmap data={[]} deposits={[]} />);

		expect(screen.getByText('Jan')).toBeInTheDocument();
		expect(screen.getByText('Dec')).toBeInTheDocument();
	});

	it('renders years derived from the monthly returns, sorted descending', () => {
		mockMonthly([
			buildMonthlyReturn({ year: 2024, month: 1 }),
			buildMonthlyReturn({ year: 2026, month: 1 }),
			buildMonthlyReturn({ year: 2025, month: 1 }),
		]);

		render(<MonthlyHeatmap data={[]} deposits={[]} />);

		const yearLabels = screen.getAllByText(/^20\d{2}$/).map((el) => el.textContent);
		expect(yearLabels).toEqual(['2026', '2025', '2024']);
	});

	it('renders a MonthCell for months that have data', () => {
		mockMonthly([buildMonthlyReturn({ year: 2026, month: 3 })]);

		render(<MonthlyHeatmap data={[]} deposits={[]} />);

		expect(screen.getByTestId('month-cell')).toHaveAttribute('data-key', '2026-3');
	});

	it('renders exactly one MonthCell per year with data, and placeholders for the rest', () => {
		mockMonthly([buildMonthlyReturn({ year: 2026, month: 3 })]);

		render(<MonthlyHeatmap data={[]} deposits={[]} />);

		const yearRow = screen.getByText('2026').closest('.grid');
		const placeholders = yearRow?.querySelectorAll('.bg-linear-to-br.from-white\\/5.to-white\\/0');

		expect(screen.getAllByTestId('month-cell')).toHaveLength(1);
		expect(placeholders).toHaveLength(11);
	});

	it('selects a month and shows the DetailPanel for it when clicked', async () => {
		const user = userEvent.setup();
		mockMonthly([buildMonthlyReturn({ year: 2026, month: 5 })]);

		render(<MonthlyHeatmap data={[]} deposits={[]} />);

		await user.click(screen.getByTestId('month-cell'));

		expect(screen.getByTestId('month-cell')).toHaveAttribute('data-selected', 'true');
		expect(screen.getByTestId('detail-panel')).toHaveAttribute('data-key', '2026-5');
	});

	it('deselects a month when clicked again, but keeps the DetailPanel mounted (collapsed)', async () => {
		const user = userEvent.setup();
		mockMonthly([buildMonthlyReturn({ year: 2026, month: 5 })]);

		render(<MonthlyHeatmap data={[]} deposits={[]} />);

		const cell = screen.getByTestId('month-cell');
		await user.click(cell);
		await user.click(cell);

		expect(screen.getByTestId('month-cell')).toHaveAttribute('data-selected', 'false');
		expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
	});

	it('switches the DetailPanel to a different month when a different cell is clicked', async () => {
		const user = userEvent.setup();
		mockMonthly([
			buildMonthlyReturn({ year: 2026, month: 3 }),
			buildMonthlyReturn({ year: 2026, month: 5 }),
		]);

		render(<MonthlyHeatmap data={[]} deposits={[]} />);

		const cells = screen.getAllByTestId('month-cell');
		await user.click(cells[0]);
		await user.click(cells[1]);

		expect(screen.getByTestId('detail-panel')).toHaveAttribute('data-key', '2026-5');
		expect(cells[0]).toHaveAttribute('data-selected', 'false');
		expect(cells[1]).toHaveAttribute('data-selected', 'true');
	});

	it('collapses the detail wrapper (maxHeight 0, opacity 0) when nothing is selected', () => {
		mockMonthly([buildMonthlyReturn({ year: 2026, month: 5 })]);

		const { container } = render(<MonthlyHeatmap data={[]} deposits={[]} />);

		const wrapper = container.querySelector('.overflow-hidden.transition-all');
		expect(wrapper).toHaveStyle({ maxHeight: '0', opacity: '0' });
	});

	it('expands the detail wrapper to the measured content height when a month is selected', async () => {
		vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(180);

		const user = userEvent.setup();
		mockMonthly([buildMonthlyReturn({ year: 2026, month: 5 })]);

		const { container } = render(<MonthlyHeatmap data={[]} deposits={[]} />);

		await user.click(screen.getByTestId('month-cell'));

		const wrapper = container.querySelector('.overflow-hidden.transition-all');
		expect(wrapper).toHaveStyle({ maxHeight: '180px', opacity: '1' });
	});

	it('renders no MonthCell or year rows when there is no monthly data', () => {
		mockMonthly([]);

		render(<MonthlyHeatmap data={[]} deposits={[]} />);

		expect(screen.queryByTestId('month-cell')).not.toBeInTheDocument();
		expect(screen.queryByTestId('detail-panel')).not.toBeInTheDocument();
	});
});
