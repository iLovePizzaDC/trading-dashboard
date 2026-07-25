import ProgressBar from '@/features/header/components/atoms/ProgressBar';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<ProgressBar />', () => {
	it('sets the fill width to the given value', () => {
		render(<ProgressBar value={40} />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({ width: '40%' });
	});

	it('clamps the width to 100 when value exceeds 100', () => {
		render(<ProgressBar value={150} />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({ width: '100%' });
	});

	it('clamps the width to 0 when value is negative', () => {
		render(<ProgressBar value={-20} />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({ width: '0%' });
	});

	it('renders 0% for a value of exactly 0', () => {
		render(<ProgressBar value={0} />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({ width: '0%' });
	});

	it('renders 100% for a value of exactly 100', () => {
		render(<ProgressBar value={100} />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({ width: '100%' });
	});

	it('defaults to the green color when no color is provided', () => {
		render(<ProgressBar value={50} />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveClass('bg-green-400/60');
	});

	it('applies the class for a given color', () => {
		render(<ProgressBar value={50} color='amber' />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveClass('bg-amber-400/60');
	});

	it('applies a different color class for another given color', () => {
		render(<ProgressBar value={50} color='blue' />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveClass('bg-blue-400/60');
	});

	it('defaults the animation delay to "0ms" when not provided', () => {
		render(<ProgressBar value={50} />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({ transitionDelay: '0ms' });
	});

	it('applies a custom animation delay when provided', () => {
		render(<ProgressBar value={50} animationDelay='300ms' />);

		expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({ transitionDelay: '300ms' });
	});

	it('renders the outer bar with the correct data-testid', () => {
		render(<ProgressBar value={50} />);

		expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
	});
});
