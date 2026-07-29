import ScatterTooltip from '@/features/trades/components/atoms/ScatterTooltip';
import type { ScatterPoint } from '@/features/trades/types/scatter';
import { useRotateSectorName } from '@/shared/hooks/useRotateSymbolName';
import { isPos } from '@/shared/utils/currency';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/useRotateSymbolName', () => ({
	useRotateSectorName: vi.fn(),
}));

vi.mock('@/shared/utils/currency', () => ({
	usd: vi.fn((n: number) => `$${n}`),
	isPos: vi.fn((n: number) => n >= 0),
}));

function buildScatterPoint(overrides: Partial<ScatterPoint> = {}): ScatterPoint {
	return {
		symbol: 'XLK',
		entryPrice: 100,
		exitPrice: 110,
		pnl: 100,
		date: '2026-07-10',
		...overrides,
	} as ScatterPoint;
}

function mockRotate(displayName = 'XLK', visible = true) {
	vi.mocked(useRotateSectorName).mockReturnValue({ displayName, visible });
}

describe('<ScatterTooltip />', () => {
	beforeEach(() => {
		vi.mocked(useRotateSectorName).mockReset();
		mockRotate();
	});

	it('renders nothing when active is false', () => {
		const { container } = render(
			<ScatterTooltip active={false} payload={[{ payload: buildScatterPoint() }]} />,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it('renders nothing when payload is undefined', () => {
		const { container } = render(<ScatterTooltip active />);

		expect(container).toBeEmptyDOMElement();
	});

	it('renders nothing when payload is an empty array', () => {
		const { container } = render(<ScatterTooltip active payload={[]} />);

		expect(container).toBeEmptyDOMElement();
	});

	it('renders the tooltip when active and a scatter point is present', () => {
		render(<ScatterTooltip active payload={[{ payload: buildScatterPoint() }]} />);

		expect(screen.getByText(/entry/)).toBeInTheDocument();
	});

	it('calls useRotateSectorName with the scatter point symbol', () => {
		render(<ScatterTooltip active payload={[{ payload: buildScatterPoint({ symbol: 'XLF' }) }]} />);

		expect(useRotateSectorName).toHaveBeenCalledWith('XLF');
	});

	it('calls useRotateSectorName with undefined when there is no scatter point', () => {
		render(<ScatterTooltip active payload={[]} />);

		expect(useRotateSectorName).toHaveBeenCalledWith(undefined);
	});

	it('renders the displayName from useRotateSectorName', () => {
		mockRotate('Technology');

		render(<ScatterTooltip active payload={[{ payload: buildScatterPoint() }]} />);

		expect(screen.getByText('Technology')).toBeInTheDocument();
	});

	it('applies opacity-100 to the name when visible is true', () => {
		mockRotate('XLK', true);

		render(<ScatterTooltip active payload={[{ payload: buildScatterPoint() }]} />);

		expect(screen.getByText('XLK')).toHaveClass('opacity-100');
	});

	it('applies opacity-0 to the name when visible is false', () => {
		mockRotate('XLK', false);

		render(<ScatterTooltip active payload={[{ payload: buildScatterPoint() }]} />);

		expect(screen.getByText('XLK')).toHaveClass('opacity-0');
	});

	it('renders the formatted entry and exit prices', () => {
		render(
			<ScatterTooltip
				active
				payload={[{ payload: buildScatterPoint({ entryPrice: 100, exitPrice: 150 }) }]}
			/>,
		);

		expect(screen.getByText('entry $100')).toBeInTheDocument();
		expect(screen.getByText('exit $150')).toBeInTheDocument();
	});

	it('renders the date', () => {
		render(
			<ScatterTooltip active payload={[{ payload: buildScatterPoint({ date: '2026-07-04' }) }]} />,
		);

		expect(screen.getByText('04 Jul 2026')).toBeInTheDocument();
	});

	it('shows a "+" prefix and green color for a positive pnl', () => {
		vi.mocked(isPos).mockReturnValue(true);

		render(<ScatterTooltip active payload={[{ payload: buildScatterPoint({ pnl: 50 }) }]} />);

		const pnl = screen.getByText('+$50');
		expect(pnl).toHaveClass('text-green-400');
	});

	it('shows no "+" prefix and red color for a negative pnl', () => {
		vi.mocked(isPos).mockReturnValue(false);

		render(<ScatterTooltip active payload={[{ payload: buildScatterPoint({ pnl: -50 }) }]} />);

		const pnl = screen.getByText('$-50');
		expect(pnl).toHaveClass('text-red-400');
	});

	it('calls isPos with the scatter point pnl', () => {
		render(<ScatterTooltip active payload={[{ payload: buildScatterPoint({ pnl: 75 }) }]} />);

		expect(isPos).toHaveBeenCalledWith(75);
	});
});
