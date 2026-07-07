import MomentumSkeleton from '@/features/momentum/components/molecules/MomentumSkeleton';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<MomentumSkeleton />', () => {
	it('renders each SkeletonBox with a shimmer overlay', () => {
		render(<MomentumSkeleton />);

		const skeletonBoxes = screen.getAllByTestId('momentum-skeleton-box');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders the header with a title placeholder and two legend placeholders', () => {
		render(<MomentumSkeleton />);

		const header = screen.getByTestId('momentum-header');
		expect(within(header).getAllByTestId('momentum-skeleton-box')).toHaveLength(3);

		const legend = screen.getByTestId('momentum-legend');
		expect(within(legend).getAllByTestId('momentum-skeleton-box')).toHaveLength(2);
	});

	it('renders 6 range filter placeholders', () => {
		render(<MomentumSkeleton />);

		expect(screen.getByTestId('momentum-range-buttons').children).toHaveLength(6);
	});

	it('renders a single chart placeholder box', () => {
		render(<MomentumSkeleton />);

		expect(screen.getByTestId('momentum-chart-placeholder')).toBeInTheDocument();
	});

	it('renders a total of 10 SkeletonBoxes', () => {
		render(<MomentumSkeleton />);

		expect(screen.getAllByTestId('momentum-skeleton-box')).toHaveLength(10);
	});
});
