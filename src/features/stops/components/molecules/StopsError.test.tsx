import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StopsError from './StopsError';

describe('<StopsError />', () => {
	it('renders the title and error message', () => {
		render(<StopsError />);

		expect(screen.getByText('stop history')).toBeInTheDocument();
		expect(screen.getByText('Could not load stop history')).toBeInTheDocument();
		expect(screen.getByText('Check if data is available or try again later.')).toBeInTheDocument();
	});

	it('renders an em-dash placeholder for the missing value', () => {
		render(<StopsError />);

		expect(screen.getByText('—')).toBeInTheDocument();
	});

	it('styles the card with a red/error border', () => {
		const { container } = render(<StopsError />);

		expect(container.firstChild).toHaveClass('border-red-500/30');
	});
});
