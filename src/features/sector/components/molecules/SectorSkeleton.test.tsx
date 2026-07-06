import SectorSkeleton from '@/features/sector/components/molecules/SectorSkeleton';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<SectorSkeleton />', () => {
	it('renders each SkeletonBox with a shimmer overlay', () => {
		const { container } = render(<SectorSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders 2 placeholders in the header (title and sort dropdown)', () => {
		const { container } = render(<SectorSkeleton />);

		const header = container.querySelector('.mb-3.flex.items-center.justify-between');
		expect(header?.querySelectorAll('.bg-white\\/10')).toHaveLength(2);
	});

	it('renders 4 placeholder rows', () => {
		const { container } = render(<SectorSkeleton />);

		const rows = container.querySelectorAll('.space-y-1\\.5 > .flex.items-center.gap-3');
		expect(rows).toHaveLength(4);
	});

	it('renders 3 SkeletonBoxes per row', () => {
		const { container } = render(<SectorSkeleton />);

		const rows = container.querySelectorAll('.space-y-1\\.5 > .flex.items-center.gap-3');

		rows.forEach((row) => {
			const boxes = row.querySelectorAll('.bg-white\\/10');
			expect(boxes).toHaveLength(3);
		});
	});

	it('renders a total of 14 SkeletonBoxes', () => {
		const { container } = render(<SectorSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10');
		expect(skeletonBoxes).toHaveLength(14);
	});
});
