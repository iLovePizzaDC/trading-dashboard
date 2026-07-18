import EquitySkeleton from '@/features/equity/components/molecules/EquitySkeleton';
import { render, screen, within } from '@testing-library/react';
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
    render(<EquitySkeleton />);

    const firstCard = screen.getByTestId('equity-card');
    const header = screen.getByTestId('equity-header');
    expect(within(header).getAllByTestId('equity-skeleton-box')).toHaveLength(2);

    const rangeButtons = screen.getByTestId('equity-range-buttons');
    expect(within(rangeButtons).getAllByTestId('equity-skeleton-box')).toHaveLength(6);

    const rightControls = screen.getByTestId('equity-right-controls');
    expect(within(rightControls).getAllByTestId('equity-skeleton-box')).toHaveLength(3);
    expect(within(firstCard).getByTestId('equity-chart-placeholder')).toBeInTheDocument();
  });

  it('renders 12 skeleton boxes in the month header row and 4 placeholder rows in the second card', () => {
    render(<EquitySkeleton />);

    const headerRow = screen.getByTestId('heatmap-header-row');
    expect(within(headerRow).getAllByTestId('equity-skeleton-box')).toHaveLength(12);

    const rows = screen.getAllByTestId('heatmap-row-placeholder');
    expect(rows).toHaveLength(4);

    rows.forEach((row) => {
      expect(within(row).getAllByTestId('equity-skeleton-box')).toHaveLength(13);
    });
  });

  it('renders a total of 77 SkeletonBoxes across both cards', () => {
    render(<EquitySkeleton />);

    expect(screen.getAllByTestId('equity-skeleton-box')).toHaveLength(77);
  });
});
