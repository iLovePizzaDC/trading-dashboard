import DetailPanel from '@/features/equity/components/atoms/DetailPanel';
import type { MonthlyReturn } from '@/features/equity/types/heatmap';
import { fmt, usd } from '@/shared/utils/currency';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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

vi.mock('@/shared/utils/currency', () => ({
	fmt: vi.fn((value: number, withSign = true) => `fmt(${value},${withSign})`),
	usd: vi.fn((value: number) => `$${value}`),
}));

function buildEntry(overrides: Partial<MonthlyReturn> = {}): MonthlyReturn {
	return {
		month: 7,
		year: 2026,
		return: 0.05,
		startEquity: 10000,
		endEquity: 10500,
		...overrides,
	} as MonthlyReturn;
}

describe('<DetailPanel />', () => {
	it('renders the correct month name and year in the period section', () => {
		render(<DetailPanel entry={buildEntry({ month: 7, year: 2026 })} />);

		expect(screen.getByText('July 2026')).toBeInTheDocument();
	});

	it('maps month 1 to the first entry in MONTHS', () => {
		render(<DetailPanel entry={buildEntry({ month: 1, year: 2025 })} />);

		expect(screen.getByText('January 2025')).toBeInTheDocument();
	});

	it('maps month 12 to the last entry in MONTHS', () => {
		render(<DetailPanel entry={buildEntry({ month: 12, year: 2025 })} />);

		expect(screen.getByText('December 2025')).toBeInTheDocument();
	});

	it('formats the return using fmt with the default sign parameter', () => {
		render(<DetailPanel entry={buildEntry({ return: 0.05 })} />);

		expect(fmt).toHaveBeenCalledWith(0.05);
		expect(screen.getByText('fmt(0.05,true)')).toBeInTheDocument();
	});

	it('formats the P&L using fmt with withSign set to false', () => {
		render(<DetailPanel entry={buildEntry({ startEquity: 10000, endEquity: 10500 })} />);

		expect(fmt).toHaveBeenCalledWith(500, false);
	});

	it('calculates P&L as endEquity minus startEquity', () => {
		render(<DetailPanel entry={buildEntry({ startEquity: 8000, endEquity: 7500 })} />);

		expect(fmt).toHaveBeenCalledWith(-500, false);
	});

	it('colors the return green when return is positive', () => {
		render(<DetailPanel entry={buildEntry({ return: 0.1 })} />);

		expect(screen.getByText('fmt(0.1,true)')).toHaveClass('text-green-400');
	});

	it('colors the return green when return is exactly 0', () => {
		render(<DetailPanel entry={buildEntry({ return: 0 })} />);

		expect(screen.getByText('fmt(0,true)')).toHaveClass('text-green-400');
	});

	it('colors the return red when return is negative', () => {
		render(<DetailPanel entry={buildEntry({ return: -0.1 })} />);

		expect(screen.getByText('fmt(-0.1,true)')).toHaveClass('text-red-400');
	});

	it('colors the P&L green when abs is positive', () => {
		render(<DetailPanel entry={buildEntry({ startEquity: 1000, endEquity: 1500 })} />);

		expect(screen.getByText('fmt(500,false)')).toHaveClass('text-green-400');
	});

	it('colors the P&L green when abs is exactly 0', () => {
		render(<DetailPanel entry={buildEntry({ startEquity: 1000, endEquity: 1000 })} />);

		expect(screen.getByText('fmt(0,false)')).toHaveClass('text-green-400');
	});

	it('colors the P&L red when abs is negative', () => {
		render(<DetailPanel entry={buildEntry({ startEquity: 1500, endEquity: 1000 })} />);

		expect(screen.getByText('fmt(-500,false)')).toHaveClass('text-red-400');
	});

	it('formats start and end equity using usd and renders them with a separator', () => {
		render(<DetailPanel entry={buildEntry({ startEquity: 10000, endEquity: 10500 })} />);

		expect(usd).toHaveBeenCalledWith(10000);
		expect(usd).toHaveBeenCalledWith(10500);
		expect(screen.getByText('$10000 - $10500')).toBeInTheDocument();
	});

	it('renders all four section labels', () => {
		render(<DetailPanel entry={buildEntry()} />);

		expect(screen.getByText('period')).toBeInTheDocument();
		expect(screen.getByText('return')).toBeInTheDocument();
		expect(screen.getByText('p&l')).toBeInTheDocument();
		expect(screen.getByText('start - end')).toBeInTheDocument();
	});
});
