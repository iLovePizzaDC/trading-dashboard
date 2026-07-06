import EquitySkeleton from '@/features/equity/components/molecules/EquitySkeleton';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<EquitySkeleton />', () => {
	it('renders two skeleton cards side by side', () => {
		render(<EquitySkeleton />);

		expect(screen.getByTestId('equity-card')).toBeInTheDocument();
		expect(screen.getByTestId('monthly-heatmap-card')).toBeInTheDocument();
	});

	it('renders each SkeletonBox with a shimmer overlay', () => {
		render(<EquitySkeleton />);

		const skeletonBoxes = screen.getAllByTestId('equity-skeleton-box');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders the header, range filter row, and chart placeholder in the first card', () => {
		const { container } = render(<EquitySkeleton />);

		const firstCard = container.querySelectorAll(':scope > div > .rounded-xl')[0];

		const header = firstCard.querySelector('.mb-4.flex.items-baseline.justify-between');
		expect(header?.querySelectorAll('.bg-white\\/10')).toHaveLength(2);

		const rangeButtons = firstCard.querySelectorAll('.flex.gap-1 > .bg-white\\/10');
		expect(rangeButtons).toHaveLength(6);

		const rightControls = firstCard.querySelector('.sm\\:justify-end');
		expect(rightControls?.querySelectorAll(':scope > .bg-white\\/10')).toHaveLength(3);
	});

	it('renders a single chart placeholder box in the first card', () => {
		const { container } = render(<EquitySkeleton />);

		const firstCard = container.querySelectorAll(':scope > div > .rounded-xl')[0];
		const chartBox = firstCard.querySelector('.h-44.w-full');

		expect(chartBox).toBeInTheDocument();
	});

	it('renders 12 SkeletonBoxes plus 1 empty cell in the month header row of the second card', () => {
		const { container } = render(<EquitySkeleton />);

		const cards = container.querySelectorAll(':scope > div > .rounded-xl');

		expect(cards).toHaveLength(2);

		const secondCard = cards[1];
		const headerRow = secondCard.querySelector('.mb-2.grid');

		expect(headerRow).not.toBeNull();

		const row = headerRow as HTMLElement;

		expect(row.children).toHaveLength(13);
		expect(row.querySelectorAll('.bg-white\\/10')).toHaveLength(12);
	});

	it('renders 4 placeholder rows in the monthly grid of the second card', () => {
		const { container } = render(<EquitySkeleton />);

		const cards = container.querySelectorAll(':scope > div > .rounded-xl');

		expect(cards).toHaveLength(2);

		const secondCard = cards[1]!;
		const rows = secondCard.querySelectorAll('.space-y-1 > div');

		expect(rows).toHaveLength(4);
	});

	it('renders a label box plus 12 month boxes per row in the second card', () => {
		const { container } = render(<EquitySkeleton />);

		const secondCard = container.querySelectorAll(':scope > div > .rounded-xl')[0];
		const rows = secondCard.querySelectorAll('.space-y-1 > div');

		rows.forEach((row: Element) => {
			expect(row.children).toHaveLength(13);
			expect(row.querySelectorAll('.bg-white\\/10')).toHaveLength(13);
		});
	});

	it('renders a total of 77 SkeletonBoxes across both cards', () => {
		const { container } = render(<EquitySkeleton />);

		const skeletonBoxes = container.querySelectorAll('.bg-white\\/10');
		expect(skeletonBoxes).toHaveLength(77);
	});
});
