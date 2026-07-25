import StopsSkeleton from '@/features/stops/components/molecules/StopsSkeleton';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<StopsSkeleton />', () => {
	it('renders each SkeletonBox with a shimmer overlay', () => {
		render(<StopsSkeleton />);

		const skeletonBoxes = screen.getAllByTestId('stops-skeleton-box');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders 2 placeholders in the header', () => {
		render(<StopsSkeleton />);

		expect(
			within(screen.getByTestId('stops-header')).getAllByTestId('stops-skeleton-box'),
		).toHaveLength(2);
	});

	it('renders 4 group rows', () => {
		render(<StopsSkeleton />);

		expect(screen.getAllByTestId('stops-group-row')).toHaveLength(4);
	});

	it('renders a static status dot per row header and timeline dot per row body', () => {
		render(<StopsSkeleton />);

		expect(screen.getAllByTestId('stops-status-dot')).toHaveLength(4);
		expect(screen.getAllByTestId('stops-timeline-dot')).toHaveLength(4);
	});

	it('renders 6 SkeletonBoxes per row (2 in the header, 4 in the body)', () => {
		render(<StopsSkeleton />);

		screen.getAllByTestId('stops-group-row').forEach((row) => {
			expect(within(row).getAllByTestId('stops-skeleton-box')).toHaveLength(6);
		});
	});

	it('renders a total of 26 SkeletonBoxes', () => {
		render(<StopsSkeleton />);

		expect(screen.getAllByTestId('stops-skeleton-box')).toHaveLength(26);
	});
});
