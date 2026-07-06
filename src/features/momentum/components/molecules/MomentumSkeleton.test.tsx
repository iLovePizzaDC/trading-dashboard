import MomentumSkeleton from '@/features/momentum/components/molecules/MomentumSkeleton';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<MomentumSkeleton />', () => {
	it('renders each SkeletonBox with a shimmer overlay', () => {
		const { container } = render(<MomentumSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders the header with a title placeholder and two legend placeholders', () => {
		const { container } = render(<MomentumSkeleton />);

		const header = container.querySelector('.mb-4.flex.items-baseline.justify-between');
		expect(header?.querySelectorAll(':scope > .bg-white\\/10')).toHaveLength(1);

		const legend = header?.querySelector('.flex.items-center.gap-4');
		expect(legend?.querySelectorAll('.bg-white\\/10')).toHaveLength(2);
	});

	it('renders 6 range filter placeholders', () => {
		const { container } = render(<MomentumSkeleton />);

		const rangeRow = container.querySelector('.mb-3.flex.gap-1');
		expect(rangeRow?.children).toHaveLength(6);
	});

	it('renders a single chart placeholder box', () => {
		const { container } = render(<MomentumSkeleton />);

		const chartBox = container.querySelector('.h-48.w-full');
		expect(chartBox).toBeInTheDocument();
	});

	it('renders a total of 9 SkeletonBoxes', () => {
		const { container } = render(<MomentumSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10');
		expect(skeletonBoxes).toHaveLength(10);
	});
});
