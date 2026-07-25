import SectorSkeleton from '@/features/sector/components/molecules/SectorSkeleton';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<SectorSkeleton />', () => {
	it('renders each SkeletonBox with a shimmer overlay', () => {
		render(<SectorSkeleton />);

		const skeletonBoxes = screen.getAllByTestId('sector-skeleton-box');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders 2 placeholders in the header (title and sort dropdown)', () => {
		render(<SectorSkeleton />);

		expect(
			within(screen.getByTestId('sector-header')).getAllByTestId('sector-skeleton-box'),
		).toHaveLength(2);
	});

	it('renders 4 placeholder rows', () => {
		render(<SectorSkeleton />);

		expect(screen.getAllByTestId('sector-row-placeholder')).toHaveLength(4);
	});

	it('renders 3 SkeletonBoxes per row', () => {
		render(<SectorSkeleton />);

		screen.getAllByTestId('sector-row-placeholder').forEach((row) => {
			expect(within(row).getAllByTestId('sector-skeleton-box')).toHaveLength(3);
		});
	});

	it('renders a total of 14 SkeletonBoxes', () => {
		render(<SectorSkeleton />);

		expect(screen.getAllByTestId('sector-skeleton-box')).toHaveLength(14);
	});
});
