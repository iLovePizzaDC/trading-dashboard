import EquityError from '@/features/equity/components/molecules/EquityError';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<EquityError />', () => {
	it('renders the equity curve error title and message', () => {
		render(<EquityError />);

		expect(screen.getByText('equity curve')).toBeInTheDocument();
		expect(screen.getByText('Could not load trade statistics')).toBeInTheDocument();
		expect(screen.getByText('Check if data is available or try again later.')).toBeInTheDocument();
	});

	it('renders the monthly performance title as a disabled placeholder', () => {
		render(<EquityError />);

		expect(screen.getByText('monthly performance')).toBeInTheDocument();
		expect(screen.getByText('Not enough data to calculate monthly returns')).toBeInTheDocument();
	});

	it('renders one em-dash placeholder for the missing date', () => {
		render(<EquityError />);

		expect(screen.getAllByText('—')).toHaveLength(1);
	});

	it('renders 4 skeleton rows in the monthly performance grid', () => {
		render(<EquityError />);

		expect(screen.getAllByTestId(/skeleton-row-wrapper-*/)).toHaveLength(4);
	});

	it('renders 12 month cells plus 1 label cell per row', () => {
		render(<EquityError />);

		const rows = screen.getAllByTestId(/skeleton-row-wrapper-/);

		rows.forEach((_, i) => {
			expect(screen.getAllByTestId(`skeleton-col-content-${i}`)).toHaveLength(12);
			expect(screen.getAllByTestId(`skeleton-col-label-${i}`)).toHaveLength(1);
		});
	});

	it('applies reduced opacity to the monthly performance placeholder to signal it is disabled', () => {
		render(<EquityError />);

		const historyPlaceholder = screen.getByText('monthly performance').closest('.opacity-40');
		expect(historyPlaceholder).toBeInTheDocument();
	});

	it('styles the equity curve card with a red/error border', () => {
		render(<EquityError />);

		const errorCard = screen
			.getByText('Could not load trade statistics')
			.closest('.border-red-500\\/30');
		expect(errorCard).toBeInTheDocument();
	});
});
