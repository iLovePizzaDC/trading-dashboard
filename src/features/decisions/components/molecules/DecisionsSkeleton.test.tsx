import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DecisionsSkeleton from './DecisionsSkeleton';

describe('<DecisionsSkeleton />', () => {
	it('renders two skeleton cards side by side', () => {
		const { container } = render(<DecisionsSkeleton />);

		const cards = container.querySelectorAll(':scope > div > .rounded-xl');
		expect(cards).toHaveLength(2);
	});

	it('renders each SkeletonBox with a shimmer overlay', () => {
		const { container } = render(<DecisionsSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders 3 placeholder rows in the first card (decisions list)', () => {
		const { container } = render(<DecisionsSkeleton />);

		const [firstCard] = container.querySelectorAll(':scope > div > .rounded-xl');
		const rows = firstCard.querySelectorAll(':scope > .border-b, :scope > .last\\:border-0');

		expect(rows).toHaveLength(3);
	});

	it('renders 4 SkeletonBoxes per row in the first card', () => {
		const { container } = render(<DecisionsSkeleton />);

		const [firstCard] = container.querySelectorAll(':scope > div > .rounded-xl');
		const rows = firstCard.querySelectorAll('.flex.items-center.gap-3');

		rows.forEach((row) => {
			const boxes = row.querySelectorAll('.bg-white\\/10');
			expect(boxes).toHaveLength(4);
		});
	});

	it('renders a centered button placeholder in the first card', () => {
		const { container } = render(<DecisionsSkeleton />);

		const [firstCard] = container.querySelectorAll(':scope > div > .rounded-xl');
		const buttonWrapper = firstCard.querySelector('.mt-3.flex.justify-center');

		expect(buttonWrapper).toBeInTheDocument();
		expect(buttonWrapper?.querySelector('.bg-white\\/10')).toBeInTheDocument();
	});

	it('renders 3 skeleton entries in the second card (decision history)', () => {
		const { container } = render(<DecisionsSkeleton />);

		const [, secondCard] = container.querySelectorAll(':scope > div > .rounded-xl');
		const entries = secondCard.querySelectorAll('.rounded-lg');

		expect(entries).toHaveLength(3);
	});

	it('renders 5 SkeletonBoxes per entry in the second card', () => {
		const { container } = render(<DecisionsSkeleton />);

		const [, secondCard] = container.querySelectorAll(':scope > div > .rounded-xl');
		const entries = secondCard.querySelectorAll('.rounded-lg');

		entries.forEach((entry) => {
			const boxes = entry.querySelectorAll('.bg-white\\/10');
			expect(boxes).toHaveLength(5);
		});
	});

	it('renders a total of 32 SkeletonBoxes across both cards', () => {
		const { container } = render(<DecisionsSkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10');
		expect(skeletonBoxes).toHaveLength(32);
	});
});
