import PositionRow from '@/features/positions/components/atoms/PositionRow';
import type { Trade } from '@/shared/types/trades';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/components/atoms/Tooltip', () => ({
	default: ({ children, content }: { children: React.ReactNode; content: string }) => (
		<span data-testid='tooltip' data-content={content}>
			{children}
		</span>
	),
}));

function buildTrade(overrides: Partial<Trade> = {}): Trade {
	return {
		shares: 10.5,
		price: 100,
		...overrides,
	} as Trade;
}

describe('<PositionRow />', () => {
	it('renders the symbol with a tooltip when a sector name exists', () => {
		render(<PositionRow symbol='XLK' stop={90} />);

		const tooltip = screen.getByTestId('tooltip');
		expect(tooltip).toHaveAttribute('data-content', 'Technology');
		expect(tooltip).toHaveTextContent('XLK');
	});

	it('renders the symbol without a tooltip when no sector name exists', () => {
		render(<PositionRow symbol='ZZZ' stop={90} />);

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(screen.getByText('ZZZ')).toBeInTheDocument();
	});

	it('renders the formatted stop price', () => {
		render(<PositionRow symbol='XLK' stop={90} />);

		expect(screen.getByText('stop $90.00')).toBeInTheDocument();
	});

	it('does not render trade details when trade is not provided', () => {
		render(<PositionRow symbol='XLK' stop={90} />);

		expect(screen.queryByText(/shares @/)).not.toBeInTheDocument();
		expect(screen.queryByText(/value/)).not.toBeInTheDocument();
		expect(screen.queryByText(/from entry/)).not.toBeInTheDocument();
	});

	it('renders shares and entry price when trade is provided', () => {
		render(<PositionRow symbol='XLK' stop={90} trade={buildTrade({ shares: 10.5, price: 100 })} />);

		expect(screen.getByText('10.5000 shares @ $100.00')).toBeInTheDocument();
	});

	it('renders the entry value as shares times price', () => {
		render(<PositionRow symbol='XLK' stop={90} trade={buildTrade({ shares: 10, price: 50 })} />);

		expect(screen.getByText('value $500.00')).toBeInTheDocument();
	});

	it('calculates and shows the stop percentage from entry', () => {
		render(<PositionRow symbol='XLK' stop={90} trade={buildTrade({ price: 100 })} />);

		expect(screen.getByText('-10.0% from entry')).toBeInTheDocument();
	});

	it('shows a positive stop percentage in green when the stop is above entry price', () => {
		render(<PositionRow symbol='XLK' stop={110} trade={buildTrade({ price: 100 })} />);

		const pct = screen.getByText('10.0% from entry');
		expect(pct).toHaveClass('text-green-400/70');
	});

	it('shows a negative stop percentage in red when the stop is below entry price', () => {
		render(<PositionRow symbol='XLK' stop={90} trade={buildTrade({ price: 100 })} />);

		const pct = screen.getByText('-10.0% from entry');
		expect(pct).toHaveClass('text-red-400/70');
	});

	it('shows the stop percentage in green when it is exactly 0 (stop equals entry)', () => {
		render(<PositionRow symbol='XLK' stop={100} trade={buildTrade({ price: 100 })} />);

		const pct = screen.getByText('0.0% from entry');
		expect(pct).toHaveClass('text-green-400/70');
	});

	it('renders padding-top only (pt-3) when isLast is true', () => {
		const { container } = render(<PositionRow symbol='XLK' stop={90} isLast />);

		expect(container.firstChild).toHaveClass('pt-3');
		expect(container.firstChild).not.toHaveClass('py-3');
	});

	it('renders vertical padding (py-3) by default when isLast is false', () => {
		const { container } = render(<PositionRow symbol='XLK' stop={90} isLast={false} />);

		expect(container.firstChild).toHaveClass('py-3');
	});

	it('does not render entryValue text when trade is undefined, even though value is null', () => {
		render(<PositionRow symbol='XLK' stop={90} />);

		expect(screen.queryByText(/^value/)).not.toBeInTheDocument();
	});
});
