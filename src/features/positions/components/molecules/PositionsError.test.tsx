import PositionsError from '@/features/positions/components/molecules/PositionsError';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<PositionsError />', () => {
	it('renders the title and error message', () => {
		render(<PositionsError />);

		expect(screen.getByText('open positions')).toBeInTheDocument();
		expect(screen.getByText('Could not load positions')).toBeInTheDocument();
		expect(screen.getByText('Check if data is available or try again later.')).toBeInTheDocument();
	});

	it('renders an em-dash placeholder for the missing value', () => {
		render(<PositionsError />);

		expect(screen.getByText('—')).toBeInTheDocument();
	});

	it('styles the card with a red/error border', () => {
		const { container } = render(<PositionsError />);

		expect(container.firstChild).toHaveClass('border-red-500/30');
	});
});
