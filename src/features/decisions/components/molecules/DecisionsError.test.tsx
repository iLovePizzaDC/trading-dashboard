import DecisionsError from '@/features/decisions/components/molecules/DecisionsError';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<DecisionsError />', () => {
	it('renders the error title and message for the decisions card', () => {
		render(<DecisionsError />);

		expect(screen.getByText('last decisions')).toBeInTheDocument();
		expect(screen.getByText('Could not load decisions')).toBeInTheDocument();
		expect(screen.getByText('Check if data is available or try again later.')).toBeInTheDocument();
	});

	it('renders the decision history title as a disabled placeholder', () => {
		render(<DecisionsError />);

		expect(screen.getByText('decision history')).toBeInTheDocument();
	});

	it('renders two em-dash placeholders for the missing dates', () => {
		render(<DecisionsError />);

		expect(screen.getAllByText('—')).toHaveLength(2);
	});

	it('renders 4 skeleton rows in the decision history placeholder', () => {
		const { container } = render(<DecisionsError />);

		const skeletonRows = container.querySelectorAll('.space-y-3 > div.rounded-lg');
		expect(skeletonRows).toHaveLength(4);
	});

	it('renders 3 skeleton bars in each skeleton row', () => {
		const { container } = render(<DecisionsError />);

		const skeletonRows = container.querySelectorAll('.space-y-3 > div.rounded-lg');

		skeletonRows.forEach((row) => {
			const bars = row.querySelectorAll('.flex.gap-2 > div');
			expect(bars).toHaveLength(3);
		});
	});

	it('applies reduced opacity to the decision history placeholder to signal it is disabled', () => {
		render(<DecisionsError />);

		const historyPlaceholder = screen.getByText('decision history').closest('.opacity-40');
		expect(historyPlaceholder).toBeInTheDocument();
	});

	it('styles the last decisions card with a red/error border', () => {
		render(<DecisionsError />);

		const errorCard = screen.getByText('Could not load decisions').closest('.border-red-500\\/30');
		expect(errorCard).toBeInTheDocument();
	});
});
