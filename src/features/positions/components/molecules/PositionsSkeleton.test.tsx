import PositionsSkeleton from '@/features/positions/components/molecules/PositionsSkeleton';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<PositionsSkeleton />', () => {
	it('renders each SkeletonBox with a shimmer overlay', () => {
		render(<PositionsSkeleton />);

		const skeletonBoxes = screen.getAllByTestId('positions-skeleton-box');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders a title placeholder', () => {
		render(<PositionsSkeleton />);

		expect(
			within(screen.getByTestId('positions-title')).getAllByTestId('positions-skeleton-box'),
		).toHaveLength(1);
	});

	it('renders 2 placeholder position rows', () => {
		render(<PositionsSkeleton />);

		expect(screen.getAllByTestId('positions-row-placeholder')).toHaveLength(2);
	});

	it('renders 4 SkeletonBoxes per row (2 left, 2 right)', () => {
		render(<PositionsSkeleton />);

		screen.getAllByTestId('positions-row-placeholder').forEach((row) => {
			expect(within(row).getAllByTestId('positions-skeleton-box')).toHaveLength(4);
		});
	});

	it('renders a total of 9 SkeletonBoxes', () => {
		render(<PositionsSkeleton />);

		expect(screen.getAllByTestId('positions-skeleton-box')).toHaveLength(9);
	});
});
