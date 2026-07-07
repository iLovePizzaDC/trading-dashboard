import BotNameRow from '@/features/header/components/molecules/BotNameRow';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/header/components/atoms/StatusDot', () => ({
	default: ({ variant }: { variant: string }) => (
		<span data-testid='status-dot' data-variant={variant} />
	),
}));

describe('<BotNameRow />', () => {
	it('renders the bot name text', () => {
		render(<BotNameRow dotVariant='active' expanded={false} onClick={vi.fn()} />);

		expect(screen.getByText('luna — trading bot')).toBeInTheDocument();
	});

	it('passes the dotVariant through to StatusDot', () => {
		render(<BotNameRow dotVariant='running' expanded={false} onClick={vi.fn()} />);

		expect(screen.getByTestId('status-dot')).toHaveAttribute('data-variant', 'running');
	});

	it('calls onClick when the button is clicked', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<BotNameRow dotVariant='active' expanded={false} onClick={onClick} />);

		await user.click(screen.getByRole('button'));

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('sets aria-expanded to false when expanded is false', () => {
		render(<BotNameRow dotVariant='active' expanded={false} onClick={vi.fn()} />);

		expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
	});

	it('sets aria-expanded to true when expanded is true', () => {
		render(<BotNameRow dotVariant='active' expanded onClick={vi.fn()} />);

		expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
	});

	it('rotates the chevron to 0 degrees when not expanded', () => {
		render(<BotNameRow dotVariant='active' expanded={false} onClick={vi.fn()} />);

		expect(screen.getByTestId('bot-row-chevron')).toHaveClass('rotate-0');
	});

	it('rotates the chevron to 180 degrees when expanded', () => {
		render(<BotNameRow dotVariant='active' expanded onClick={vi.fn()} />);

		expect(screen.getByTestId('bot-row-chevron')).toHaveClass('rotate-180');
	});
});
