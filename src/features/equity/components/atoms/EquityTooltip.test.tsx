import EquityTooltip from '@/features/equity/components/atoms/EquityTooltip';
import type { ChartPoint, PayloadItem } from '@/features/equity/types/equity';
import { fmt } from '@/shared/utils/currency';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/currency', () => ({
	fmt: vi.fn((value: number, relative: boolean) => `fmt(${value},${relative})`),
}));

function buildChartPoint(overrides: Partial<ChartPoint> = {}): ChartPoint {
	return {
		date: '2026-07-04',
		equity: 110,
		spy: 105,
		...overrides,
	} as ChartPoint;
}

function buildPayloadItem(overrides: Partial<PayloadItem> = {}): PayloadItem {
	return {
		dataKey: 'equity',
		value: 110,
		payload: buildChartPoint(),
		...overrides,
	} as PayloadItem;
}

describe('<EquityTooltip />', () => {
	beforeEach(() => {
		vi.mocked(fmt).mockClear();
	});

	it('renders nothing when active is false', () => {
		const { container } = render(<EquityTooltip active={false} payload={[buildPayloadItem()]} />);

		expect(container).toBeEmptyDOMElement();
	});

	it('renders nothing when payload is undefined', () => {
		const { container } = render(<EquityTooltip active />);

		expect(container).toBeEmptyDOMElement();
	});

	it('renders nothing when payload is an empty array', () => {
		const { container } = render(<EquityTooltip active payload={[]} />);

		expect(container).toBeEmptyDOMElement();
	});

	it('renders nothing when there is no entry with dataKey "equity"', () => {
		const { container } = render(
			<EquityTooltip active payload={[buildPayloadItem({ dataKey: 'spy', value: 105 })]} />,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it('renders the tooltip when active and an equity value is present', () => {
		render(<EquityTooltip active payload={[buildPayloadItem({ value: 110 })]} />);

		expect(screen.getByText(/Bot:/)).toBeInTheDocument();
	});

	it('formats the date from the first payload item using luxon', () => {
		render(
			<EquityTooltip
				active
				payload={[buildPayloadItem({ payload: buildChartPoint({ date: '2026-03-15' }) })]}
			/>,
		);

		expect(screen.getByText('15 Mar 2026')).toBeInTheDocument();
	});

	it('renders an empty date when no date is present in the payload', () => {
		const { container } = render(
			<EquityTooltip
				active
				payload={[
					buildPayloadItem({
						payload: { equity: 110, spy: 105 } as unknown as ChartPoint,
					}),
				]}
			/>,
		);

		const dateEl = container.querySelector('p.text-white\\/40');
		expect(dateEl).toBeEmptyDOMElement();
	});

	it('colors the bot value green when positive is true', () => {
		render(<EquityTooltip active positive payload={[buildPayloadItem({ value: 110 })]} />);

		expect(screen.getByText(/Bot:/)).toHaveClass('text-green-400');
	});

	it('colors the bot value red when positive is false', () => {
		render(<EquityTooltip active positive={false} payload={[buildPayloadItem({ value: 90 })]} />);

		expect(screen.getByText(/Bot:/)).toHaveClass('text-red-400');
	});

	it('formats the bot value relative to 100 with a sign when relative is true', () => {
		render(<EquityTooltip active relative payload={[buildPayloadItem({ value: 110 })]} />);

		expect(fmt).toHaveBeenCalledWith(10, true);
	});

	it('formats the bot value relative to startValue without a sign when relative is false', () => {
		render(
			<EquityTooltip
				active
				relative={false}
				startValue={10000}
				payload={[buildPayloadItem({ value: 10500 })]}
			/>,
		);

		expect(fmt).toHaveBeenCalledWith(500, false);
	});

	it('defaults startValue to 0 when not provided in absolute mode', () => {
		render(<EquityTooltip active relative={false} payload={[buildPayloadItem({ value: 500 })]} />);

		expect(fmt).toHaveBeenCalledWith(500, false);
	});

	it('does not render the SPY line when showSpy is false', () => {
		render(
			<EquityTooltip
				active
				showSpy={false}
				payload={[
					buildPayloadItem({ dataKey: 'equity', value: 110 }),
					buildPayloadItem({ dataKey: 'spy', value: 105 }),
				]}
			/>,
		);

		expect(screen.queryByText(/SPY:/)).not.toBeInTheDocument();
	});

	it('does not render the SPY line when showSpy is true but no spy value is present', () => {
		render(
			<EquityTooltip
				active
				showSpy
				payload={[buildPayloadItem({ dataKey: 'equity', value: 110 })]}
			/>,
		);

		expect(screen.queryByText(/SPY:/)).not.toBeInTheDocument();
	});

	it('renders the SPY line when showSpy is true and a spy value is present', () => {
		render(
			<EquityTooltip
				active
				showSpy
				payload={[
					buildPayloadItem({ dataKey: 'equity', value: 110 }),
					buildPayloadItem({ dataKey: 'spy', value: 105 }),
				]}
			/>,
		);

		expect(screen.getByText(/SPY:/)).toBeInTheDocument();
	});

	it('formats the SPY value relative to 100 when relative is true', () => {
		render(
			<EquityTooltip
				active
				relative
				showSpy
				payload={[
					buildPayloadItem({ dataKey: 'equity', value: 110 }),
					buildPayloadItem({ dataKey: 'spy', value: 105 }),
				]}
			/>,
		);

		expect(fmt).toHaveBeenCalledWith(5, true);
	});

	it('formats the SPY value relative to startValue when relative is false', () => {
		render(
			<EquityTooltip
				active
				relative={false}
				showSpy
				startValue={10000}
				payload={[
					buildPayloadItem({ dataKey: 'equity', value: 10500 }),
					buildPayloadItem({ dataKey: 'spy', value: 10300 }),
				]}
			/>,
		);

		expect(fmt).toHaveBeenCalledWith(300, false);
	});

	it('calls onHover with the bot value when active and equity is present', () => {
		const onHover = vi.fn();

		render(<EquityTooltip active onHover={onHover} payload={[buildPayloadItem({ value: 110 })]} />);

		expect(onHover).toHaveBeenCalledWith(110);
	});

	it('calls onHover with null when not active', () => {
		const onHover = vi.fn();

		render(
			<EquityTooltip
				active={false}
				onHover={onHover}
				payload={[buildPayloadItem({ value: 110 })]}
			/>,
		);

		expect(onHover).toHaveBeenCalledWith(null);
	});

	it('calls onHover with null when active but no equity value is present', () => {
		const onHover = vi.fn();

		render(
			<EquityTooltip
				active
				onHover={onHover}
				payload={[buildPayloadItem({ dataKey: 'spy', value: 105 })]}
			/>,
		);

		expect(onHover).toHaveBeenCalledWith(null);
	});
});
