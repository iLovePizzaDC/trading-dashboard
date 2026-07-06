import RegimeBadge from '@/features/summary/components/atoms/RegimeBadge';
import type { Regime } from '@/shared/constants/regime';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<RegimeBadge />', () => {
	it('renders the regime label', () => {
		render(<RegimeBadge regime='bullish' />);

		expect(screen.getByText('bullish')).toBeInTheDocument();
	});

	it('applies the correct colors for a "bullish" regime', () => {
		const { container } = render(<RegimeBadge regime='bullish' />);

		expect(container.firstChild).toHaveClass('bg-emerald-500/10', 'border-emerald-500/25');
		expect(screen.getByText('bullish')).toHaveClass('text-emerald-300');
	});

	it('applies different colors for a "bearish" regime', () => {
		const { container } = render(<RegimeBadge regime='bearish' />);

		expect(container.firstChild).toHaveClass('bg-red-500/10', 'border-red-500/25');
		expect(screen.getByText('bearish')).toHaveClass('text-red-300');
	});

	it('renders both a ping and a static dot with the regime color', () => {
		const { container } = render(<RegimeBadge regime='bullish' />);

		const dots = container.querySelectorAll('.bg-emerald-400');
		expect(dots).toHaveLength(2);
		expect(container.querySelector('.animate-ping')).toBeInTheDocument();
	});

	it('does not crash when given a regime not present in regimeColors', () => {
		expect(() => render(<RegimeBadge regime={'sideways' as Regime} />)).not.toThrow();
	});

	it('falls back to a neutral style for an unmapped regime', () => {
		const { container } = render(<RegimeBadge regime={'sideways' as Regime} />);

		expect(container.firstChild).toHaveClass('bg-white/5', 'border-white/10');
		expect(screen.getByText('sideways')).toHaveClass('text-white/40');
	});

	it('still renders the (unmapped) regime label as text', () => {
		render(<RegimeBadge regime={'sideways' as Regime} />);

		expect(screen.getByText('sideways')).toBeInTheDocument();
	});
});
