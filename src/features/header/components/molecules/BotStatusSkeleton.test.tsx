import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BotStatusSkeleton from './BotStatusSkeleton';

describe('<BotStatusSkeleton />', () => {
	it('renders three skeleton cards', () => {
		const { container } = render(<BotStatusSkeleton />);

		const cards = container.querySelectorAll('.grid > .animate-pulse');
		expect(cards).toHaveLength(3);
	});

	it('applies staggered animation delays to each card', () => {
		const { container } = render(<BotStatusSkeleton />);

		const cards = container.querySelectorAll('.grid > .animate-pulse');
		expect(cards[0]).toHaveStyle({ animationDelay: '0ms' });
		expect(cards[1]).toHaveStyle({ animationDelay: '80ms' });
		expect(cards[2]).toHaveStyle({ animationDelay: '160ms' });
	});

	it('renders a footer skeleton bar', () => {
		const { container } = render(<BotStatusSkeleton />);

		const footer = container.querySelector('.mx-auto.animate-pulse');
		expect(footer).toBeInTheDocument();
	});
});
