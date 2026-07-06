import StopsSkeleton from '@/features/stops/components/molecules/StopsSkeleton';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<StopsSkeleton />', () => {
	it('renders each SkeletonBox with a shimmer overlay', () => {
		const { container } = render(<StopsSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10:not(.rounded-full)');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders 2 placeholders in the header', () => {
		const { container } = render(<StopsSkeleton />);

		const header = container.querySelector('.mb-3.flex.items-baseline.justify-between');
		expect(header?.querySelectorAll('.bg-white\\/10:not(.rounded-full)')).toHaveLength(2);
	});

	it('renders 4 group rows', () => {
		const { container } = render(<StopsSkeleton />);

		const rows = container.querySelectorAll('.space-y-3 > div');
		expect(rows).toHaveLength(4);
	});

	it('renders a static (non-shimmering) status dot per row header', () => {
		const { container } = render(<StopsSkeleton />);

		const dots = container.querySelectorAll('.rounded-full.bg-white\\/15');
		expect(dots).toHaveLength(4);

		dots.forEach((dot) => {
			expect(dot.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]')).not.toBeInTheDocument();
		});
	});

	it('renders a static (non-shimmering) timeline dot per row body', () => {
		const { container } = render(<StopsSkeleton />);

		const dots = container.querySelectorAll('.rounded-full.bg-white\\/10.mt-1\\.75');
		expect(dots).toHaveLength(4);
	});

	it('renders 6 SkeletonBoxes per row (2 in the header, 4 in the body)', () => {
		const { container } = render(<StopsSkeleton />);

		const rows = container.querySelectorAll('.space-y-3 > div');

		rows.forEach((row) => {
			const boxes = row.querySelectorAll('.bg-white\\/10:not(.rounded-full)');
			expect(boxes).toHaveLength(6);
		});
	});

	it('renders a total of 26 SkeletonBoxes', () => {
		const { container } = render(<StopsSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10:not(.rounded-full)');
		expect(skeletonBoxes).toHaveLength(26);
	});
});
