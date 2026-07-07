import DecisionsSkeleton from '@/features/decisions/components/molecules/DecisionsSkeleton';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<DecisionsSkeleton />', () => {
	it('renders two skeleton cards side by side', () => {
		render(<DecisionsSkeleton />);

		expect(screen.getByTestId('decisions-card')).toBeInTheDocument();
		expect(screen.getByTestId('decision-history-card')).toBeInTheDocument();
	});

	it('renders each SkeletonBox with a shimmer overlay', () => {
		render(<DecisionsSkeleton />);

		const skeletonBoxes = screen.getAllByTestId('decisions-skeleton-box');

		expect(skeletonBoxes.length).toBeGreaterThan(0);

		skeletonBoxes.forEach((box) => {
			const shimmer = box.querySelector('.animate-\\[shimmer_1\\.5s_infinite\\]');
			expect(shimmer).toBeInTheDocument();
		});
	});

	it('renders 3 placeholder rows in the decisions card', () => {
		render(<DecisionsSkeleton />);

		const card = screen.getByTestId('decisions-card');
		expect(within(card).getAllByTestId('decision-row-placeholder')).toHaveLength(3);
	});

	it('renders 4 SkeletonBoxes per row in the decisions card', () => {
		render(<DecisionsSkeleton />);

		const rows = screen.getAllByTestId('decision-row-placeholder');

		rows.forEach((row) => {
			expect(within(row).getAllByTestId('decisions-skeleton-box')).toHaveLength(4);
		});
	});

	it('renders a centered button placeholder in the decisions card', () => {
		render(<DecisionsSkeleton />);

		const buttonWrapper = screen.getByTestId('button-placeholder');
		expect(within(buttonWrapper).getAllByTestId('decisions-skeleton-box')).toHaveLength(1);
	});

	it('renders 3 skeleton entries in the decision history card', () => {
		render(<DecisionsSkeleton />);

		expect(screen.getAllByTestId('history-entry-placeholder')).toHaveLength(3);
	});

	it('renders 5 SkeletonBoxes per entry in the decision history card', () => {
		render(<DecisionsSkeleton />);

		const entries = screen.getAllByTestId('history-entry-placeholder');

		entries.forEach((entry) => {
			expect(within(entry).getAllByTestId('decisions-skeleton-box')).toHaveLength(5);
		});
	});

	it('renders a total of 32 SkeletonBoxes across both cards', () => {
		render(<DecisionsSkeleton />);

		expect(screen.getAllByTestId('decisions-skeleton-box')).toHaveLength(32);
	});
});
