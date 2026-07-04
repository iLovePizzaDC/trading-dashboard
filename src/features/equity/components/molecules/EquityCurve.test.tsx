import EquityCurve from '@/features/equity/components/molecules/EquityCurve';
import { useEquityChartData } from '@/features/equity/hooks/useEquityChartData';
import { useEquitySettings } from '@/features/equity/hooks/useEquitySettings';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Deposit } from '@/shared/types/deposits';
import type { EquityPoint } from '@/shared/types/equity';
import { usd } from '@/shared/utils/currency';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('recharts', () => ({
	ResponsiveContainer: ({ children }: any) => (
		<div data-testid='responsive-container'>{children}</div>
	),
	AreaChart: ({ children, data }: any) => (
		<div data-testid='area-chart' data-length={data.length}>
			{children}
		</div>
	),
	Area: (props: any) => (
		<div data-testid='area' data-datakey={props.dataKey} data-stroke={props.stroke} />
	),
	Line: (props: any) => <div data-testid='line' data-datakey={props.dataKey} />,
	CartesianGrid: () => <div data-testid='cartesian-grid' />,
	XAxis: (props: any) => <div data-testid='x-axis' data-datakey={props.dataKey} />,
	YAxis: () => <div data-testid='y-axis' />,
	ReferenceLine: (props: any) => (
		<div data-testid='reference-line' data-x={props.x} data-y={props.y}>
			{props.label}
		</div>
	),
	Tooltip: (props: any) => <div data-testid='chart-tooltip'>{props.content}</div>,
}));

vi.mock('@/features/equity/components/atoms/DepositLabel', () => ({
	default: (props: any) => <div data-testid='deposit-label' data-value={props.value} />,
}));

vi.mock('@/features/equity/components/atoms/EquityTooltip', () => ({
	default: (props: any) => (
		<div
			data-testid='equity-tooltip'
			data-positive={String(props.positive)}
			data-show-spy={String(props.showSpy)}
			data-relative={String(props.relative)}
			data-start-value={props.startValue}
		/>
	),
}));

vi.mock('@/shared/components/atoms/Card', () => ({
	default: ({ title, badge, children }: any) => (
		<div data-testid='card'>
			<p data-testid='card-title'>{title}</p>
			<div data-testid='card-badge'>{badge}</div>
			<div data-testid='card-children'>{children}</div>
		</div>
	),
}));

vi.mock('@/shared/components/atoms/DateRangeFilter', () => ({
	default: ({ range }: any) => (
		<div data-testid='date-range-filter' data-range={JSON.stringify(range)} />
	),
}));

vi.mock('@/shared/utils/currency', () => ({
	usd: vi.fn((n: number) => `$${n}`),
}));

vi.mock('@/features/equity/hooks/useEquitySettings', () => ({
	useEquitySettings: vi.fn(),
}));

vi.mock('@/features/equity/hooks/useEquityChartData', () => ({
	useEquityChartData: vi.fn(),
}));

function buildEquityPoint(overrides: Partial<EquityPoint> = {}): EquityPoint {
	return {
		date: '2026-01-01',
		equity: 100,
		...overrides,
	} as EquityPoint;
}

function buildDeposit(overrides: Partial<Deposit> = {}): Deposit {
	return {
		date: '2026-02-01',
		amount: 500,
		...overrides,
	} as Deposit;
}

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
	return {
		date: '2026-01-15',
		candidates: [],
		...overrides,
	} as DecisionEntry;
}

function mockSettings(overrides: Partial<ReturnType<typeof useEquitySettings>> = {}) {
	const defaults = {
		showSpy: false,
		setShowSpy: vi.fn(),
		relative: true,
		setRelative: vi.fn(),
		curveMode: 'zoom' as const,
		setCurveMode: vi.fn(),
		hoveredValue: null,
		setHoveredValue: vi.fn(),
		range: 'all',
		setRange: vi.fn(),
		...overrides,
	};

	vi.mocked(useEquitySettings).mockReturnValue(defaults as ReturnType<typeof useEquitySettings>);

	return defaults;
}

function mockChartData(
	chartData: Array<{ date: string; equity: number; spy?: number }> = [
		{ date: '2026-01-01', equity: 100 },
		{ date: '2026-01-02', equity: 110 },
	],
	rebalanceIndexes: number[] = [],
) {
	vi.mocked(useEquityChartData).mockReturnValue({
		chartData,
		rebalanceIndexes,
	} as ReturnType<typeof useEquityChartData>);
}

describe('<EquityCurve />', () => {
	beforeEach(() => {
		vi.mocked(useEquitySettings).mockReset();
		vi.mocked(useEquityChartData).mockReset();
		vi.mocked(usd).mockClear();
	});

	it('renders the card title', () => {
		mockSettings();
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('card-title')).toHaveTextContent('equity curve');
	});

	it('calls useEquitySettings with the data prop', () => {
		mockSettings();
		mockChartData();

		const data = [buildEquityPoint()];
		render(<EquityCurve data={data} deposits={[]} decisions={[]} />);

		expect(useEquitySettings).toHaveBeenCalledWith(data);
	});

	it('calls useEquityChartData with data, decisions, relative, curveMode and range', () => {
		mockSettings({ relative: false, curveMode: 'period', range: '3M' });
		mockChartData();

		const data = [buildEquityPoint()];
		const decisions = [buildDecision()];

		render(<EquityCurve data={data} deposits={[]} decisions={decisions} />);

		expect(useEquityChartData).toHaveBeenCalledWith(data, decisions, false, 'period', '3M');
	});

	it('shows the badge as a relative percentage when relative is true', () => {
		mockSettings({ relative: true, hoveredValue: null });
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 110 },
		]);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('card-badge')).toHaveTextContent('10.00%');
	});

	it('shows the badge as a usd value when relative is false', () => {
		mockSettings({ relative: false, hoveredValue: null });
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 110 },
		]);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(usd).toHaveBeenCalledWith(110);
		expect(screen.getByTestId('card-badge')).toHaveTextContent('$110');
	});

	it('uses hoveredValue instead of the current value when set', () => {
		mockSettings({ relative: true, hoveredValue: 95 });
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 110 },
		]);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('card-badge')).toHaveTextContent('-5.00%');
	});

	it('colors the badge green when current value is above the filtered start value', () => {
		mockSettings({ relative: true });
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 110 },
		]);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('card-badge').firstChild).toHaveClass('text-green-400');
	});

	it('colors the badge red when current value is below the filtered start value', () => {
		mockSettings({ relative: true });
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 90 },
		]);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('card-badge').firstChild).toHaveClass('text-red-400');
	});

	it('toggles relative when the badge is clicked', async () => {
		const user = userEvent.setup();
		const setRelative = vi.fn();
		mockSettings({ relative: true, setRelative });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		await user.click(screen.getByTestId('card-badge').firstChild as HTMLElement);

		expect(setRelative).toHaveBeenCalledWith(expect.any(Function));
		const updater = vi.mocked(setRelative).mock.calls[0][0] as (prev: boolean) => boolean;
		expect(updater(true)).toBe(false);
	});

	it('toggles relative when the "% return / $ value" button is clicked', async () => {
		const user = userEvent.setup();
		const setRelative = vi.fn();
		mockSettings({ relative: true, setRelative });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		await user.click(screen.getByRole('button', { name: '% return' }));

		expect(setRelative).toHaveBeenCalledWith(expect.any(Function));
	});

	it('shows "$ value" as the toggle label when relative is false', () => {
		mockSettings({ relative: false });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByRole('button', { name: '$ value' })).toBeInTheDocument();
	});

	it('colors the Bot indicator dot based on isPos', () => {
		mockSettings();
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 90 },
		]);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		const botLabel = screen.getByText('Bot');
		const dot = botLabel.querySelector('span');
		expect(dot).toHaveClass('bg-red-400');
	});

	it('passes range and setRange to DateRangeFilter', () => {
		mockSettings({ range: '6M' });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('date-range-filter')).toHaveAttribute(
			'data-range',
			JSON.stringify('6M'),
		);
	});

	it('toggles showSpy when the SPY button is clicked', async () => {
		const user = userEvent.setup();
		const setShowSpy = vi.fn();
		mockSettings({ showSpy: false, setShowSpy });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		await user.click(screen.getByRole('button', { name: /SPY/ }));

		expect(setShowSpy).toHaveBeenCalledWith(expect.any(Function));
	});

	it('renders the SPY line only when showSpy is true', () => {
		mockSettings({ showSpy: true });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		const line = screen.getByTestId('line');
		expect(line).toHaveAttribute('data-datakey', 'spy');
	});

	it('does not render the SPY line when showSpy is false', () => {
		mockSettings({ showSpy: false });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.queryByTestId('line')).not.toBeInTheDocument();
	});

	it('toggles curveMode between zoom and period when the mode button is clicked', async () => {
		const user = userEvent.setup();
		const setCurveMode = vi.fn();
		mockSettings({ curveMode: 'zoom', setCurveMode });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		await user.click(screen.getByTitle('Zoom Mode: Filter by date range'));

		expect(setCurveMode).toHaveBeenCalledWith(expect.any(Function));
		const updater = vi.mocked(setCurveMode).mock.calls[0][0] as (prev: string) => string;
		expect(updater('zoom')).toBe('period');
		expect(updater('period')).toBe('zoom');
	});

	it('shows the period mode title and icon when curveMode is period', () => {
		mockSettings({ curveMode: 'period' });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTitle('Period Mode: Show period performance')).toBeInTheDocument();
	});

	it('renders the AreaChart with the chartData from useEquityChartData', () => {
		mockSettings();
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 110 },
			{ date: '2026-01-03', equity: 120 },
		]);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('area-chart')).toHaveAttribute('data-length', '3');
	});

	it('sets the reference line y to 100 when relative is true', () => {
		mockSettings({ relative: true });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint({ equity: 100 })]} deposits={[]} decisions={[]} />);

		const referenceLines = screen.getAllByTestId('reference-line');
		const baseline = referenceLines.find((el) => el.getAttribute('data-y') === '100');
		expect(baseline).toBeDefined();
	});

	it('sets the reference line y to the unfiltered start value when relative is false', () => {
		mockSettings({ relative: false });
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint({ equity: 250 })]} deposits={[]} decisions={[]} />);

		const referenceLines = screen.getAllByTestId('reference-line');
		const baseline = referenceLines.find((el) => el.getAttribute('data-y') === '250');
		expect(baseline).toBeDefined();
	});

	it('renders a reference line for each rebalance index using the chart date', () => {
		mockSettings();
		mockChartData(
			[
				{ date: '2026-01-01', equity: 100 },
				{ date: '2026-01-02', equity: 110 },
				{ date: '2026-01-03', equity: 120 },
			],
			[1, 2],
		);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		const referenceLines = screen.getAllByTestId('reference-line');
		const rebalanceDates = referenceLines.map((el) => el.getAttribute('data-x'));

		expect(rebalanceDates).toContain('2026-01-02');
		expect(rebalanceDates).toContain('2026-01-03');
	});

	it('renders a deposit reference line with a formatted DepositLabel', () => {
		mockSettings();
		mockChartData();

		render(
			<EquityCurve
				data={[buildEquityPoint()]}
				deposits={[buildDeposit({ amount: 500, date: '2026-02-10' })]}
				decisions={[]}
			/>,
		);

		expect(usd).toHaveBeenCalledWith(500);
		expect(screen.getByTestId('deposit-label')).toHaveAttribute('data-value', '+$500');
	});

	it('positions the deposit reference line at the deposit date', () => {
		mockSettings();
		mockChartData();

		render(
			<EquityCurve
				data={[buildEquityPoint()]}
				deposits={[buildDeposit({ date: '2026-02-10' })]}
				decisions={[]}
			/>,
		);

		const referenceLines = screen.getAllByTestId('reference-line');
		const depositLine = referenceLines.find((el) =>
			el.querySelector('[data-testid="deposit-label"]'),
		);

		expect(depositLine).toHaveAttribute('data-x', '2026-02-10');
	});

	it('passes positive, showSpy, relative and startValue to the EquityTooltip', () => {
		mockSettings({ relative: false, showSpy: true });
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 110 },
		]);

		render(<EquityCurve data={[buildEquityPoint({ equity: 300 })]} deposits={[]} decisions={[]} />);

		const tooltip = screen.getByTestId('equity-tooltip');
		expect(tooltip).toHaveAttribute('data-positive', 'true');
		expect(tooltip).toHaveAttribute('data-show-spy', 'true');
		expect(tooltip).toHaveAttribute('data-relative', 'false');
		expect(tooltip).toHaveAttribute('data-start-value', '300');
	});

	it('renders the Area with dataKey "equity"', () => {
		mockSettings();
		mockChartData();

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('area')).toHaveAttribute('data-datakey', 'equity');
	});

	it('uses a green stroke on the Area when isPos is true', () => {
		mockSettings();
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 110 },
		]);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('area')).toHaveAttribute('data-stroke', '#4ade80');
	});

	it('uses a red stroke on the Area when isPos is false', () => {
		mockSettings();
		mockChartData([
			{ date: '2026-01-01', equity: 100 },
			{ date: '2026-01-02', equity: 90 },
		]);

		render(<EquityCurve data={[buildEquityPoint()]} deposits={[]} decisions={[]} />);

		expect(screen.getByTestId('area')).toHaveAttribute('data-stroke', '#f87171');
	});
});
