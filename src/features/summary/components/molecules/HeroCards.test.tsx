import HeroCards from '@/features/summary/components/molecules/HeroCards';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/summary/components/atoms/MetricItem', () => ({
	default: ({ label, value, sub, positive, featured, large }: any) => (
		<div
			data-testid='metric-item'
			data-label={label}
			data-value={value}
			data-sub={sub}
			data-positive={String(positive)}
			data-featured={String(featured)}
			data-large={String(large)}
		/>
	),
}));

vi.mock('@/features/summary/components/atoms/RegimeBadge', () => ({
	default: ({ regime }: any) => <div data-testid='regime-badge' data-regime={regime} />,
}));

vi.mock('@/shared/utils/currency', () => ({
	usd: vi.fn((n: number) => `$${n}`),
	isPos: vi.fn((n: number) => n >= 0),
}));

describe('<HeroCards />', () => {
	it('renders the portfolio value MetricItem with the correct label and value', () => {
		render(<HeroCards portfolioValue={10000} profit={500} regime='bullish' />);

		const metric = screen.getByTestId('metric-item');
		expect(metric).toHaveAttribute('data-label', 'portfolio value');
		expect(metric).toHaveAttribute('data-value', '$10000');
	});

	it('shows a "+" prefix in the sub text when profit is positive', () => {
		render(<HeroCards portfolioValue={10000} profit={500} regime='bullish' />);

		expect(screen.getByTestId('metric-item')).toHaveAttribute('data-sub', '+$500 profit');
	});

	it('does not show a "+" prefix in the sub text when profit is negative', () => {
		render(<HeroCards portfolioValue={10000} profit={-500} regime='bullish' />);

		expect(screen.getByTestId('metric-item')).toHaveAttribute('data-sub', '$-500 profit');
	});

	it('shows a "+" prefix when profit is exactly 0', () => {
		render(<HeroCards portfolioValue={10000} profit={0} regime='bullish' />);

		expect(screen.getByTestId('metric-item')).toHaveAttribute('data-sub', '+$0 profit');
	});

	it('passes positive=true to MetricItem when profit is non-negative', () => {
		render(<HeroCards portfolioValue={10000} profit={100} regime='bullish' />);

		expect(screen.getByTestId('metric-item')).toHaveAttribute('data-positive', 'true');
	});

	it('passes positive=false to MetricItem when profit is negative', () => {
		render(<HeroCards portfolioValue={10000} profit={-100} regime='bullish' />);

		expect(screen.getByTestId('metric-item')).toHaveAttribute('data-positive', 'false');
	});

	it('marks the MetricItem as featured and large', () => {
		render(<HeroCards portfolioValue={10000} profit={100} regime='bullish' />);

		const metric = screen.getByTestId('metric-item');
		expect(metric).toHaveAttribute('data-featured', 'true');
		expect(metric).toHaveAttribute('data-large', 'true');
	});

	it('renders the RegimeBadge with the given regime', () => {
		render(<HeroCards portfolioValue={10000} profit={100} regime='bearish' />);

		expect(screen.getByTestId('regime-badge')).toHaveAttribute('data-regime', 'bearish');
	});

	it('shows "full exposure" when regime is "bullish"', () => {
		render(<HeroCards portfolioValue={10000} profit={100} regime='bullish' />);

		expect(screen.getByText('full exposure')).toBeInTheDocument();
	});

	it('shows "reduced exposure" when regime is "bearish"', () => {
		render(<HeroCards portfolioValue={10000} profit={100} regime='bearish' />);

		expect(screen.getByText('reduced exposure')).toBeInTheDocument();
	});

	it('shows "reduced exposure" for any regime other than "bullish"', () => {
		render(<HeroCards portfolioValue={10000} profit={100} regime={'neutral' as any} />);

		expect(screen.getByText('reduced exposure')).toBeInTheDocument();
	});
});
