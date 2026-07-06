import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BotStatusSkeleton from './BotStatusSkeleton';

describe('<BotStatusSkeleton />', () => {
	it('renders three skeleton cards', () => {
		render(<BotStatusSkeleton />);

		expect(screen.getAllByTestId(/bot-status-card-skeleton-*/)).toHaveLength(3);
	});

	it('applies staggered animation delays to each card', () => {
		render(<BotStatusSkeleton />);

		const cards = screen.getAllByTestId(/bot-status-card-skeleton-*/);
		expect(cards[0]).toHaveStyle({ animationDelay: '0ms' });
		expect(cards[1]).toHaveStyle({ animationDelay: '80ms' });
		expect(cards[2]).toHaveStyle({ animationDelay: '160ms' });
	});

	it('renders a footer skeleton bar', () => {
		render(<BotStatusSkeleton />);

		expect(screen.getByTestId('bot-status-footer-skeleton')).toBeInTheDocument();
	});
});
