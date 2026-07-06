import PositionsEmpty from '@/features/positions/components/molecules/PositionsEmpty';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<PositionsEmpty />', () => {
	it('renders the title and empty-state message', () => {
		render(<PositionsEmpty />);

		expect(screen.getByText('open positions')).toBeInTheDocument();
		expect(screen.getByText('No open positions.')).toBeInTheDocument();
	});
});
