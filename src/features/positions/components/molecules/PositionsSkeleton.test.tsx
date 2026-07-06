import PositionsSkeleton from '@/features/positions/components/molecules/PositionsSkeleton';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<PositionsSkeleton />', () => {
	it('renders each SkeletonBox with a shimmer overlay', () => {
		const { container } = render(<PositionsSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders a title placeholder', () => {
		const { container } = render(<PositionsSkeleton />);

		const titleWrapper = container.querySelector('.mb-3');
		expect(titleWrapper?.querySelectorAll('.bg-white\\/10')).toHaveLength(1);
	});

	it('renders 2 placeholder position rows', () => {
		const { container } = render(<PositionsSkeleton />);

		const rows = container.querySelectorAll(
			'.flex.justify-between.border-b, .flex.justify-between.last\\:border-0',
		);
		expect(rows).toHaveLength(2);
	});

	it('renders 4 SkeletonBoxes per row (2 left, 2 right)', () => {
		const { container } = render(<PositionsSkeleton />);

		const rows = container.querySelectorAll('.flex.justify-between');

		rows.forEach((row) => {
			const boxes = row.querySelectorAll('.bg-white\\/10');
			expect(boxes).toHaveLength(4);
		});
	});

	it('renders a total of 9 SkeletonBoxes', () => {
		const { container } = render(<PositionsSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10');
		expect(skeletonBoxes).toHaveLength(9);
	});
});
