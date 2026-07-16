import BotStatusGrid from '@/features/header/components/molecules/BotStatusGrid';
import { getStatusCard, getTradingDayProgress } from '@/features/header/utils/status-card';
import { formatAsBerlinTime, formatNextOpen } from '@/features/header/utils/time-helper';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/header/components/atoms/StatCard', () => ({
	default: ({ label, value, sub, progress, color, delay, visible, highlight }: any) => (
		<div
			data-testid='stat-card'
			data-label={label}
			data-value={value}
			data-sub={sub}
			data-progress={progress}
			data-color={color}
			data-delay={delay}
			data-visible={String(visible)}
			data-highlight={String(highlight)}
		/>
	),
}));

vi.mock('@/features/header/utils/status-card', () => ({
	getStatusCard: vi.fn(),
	getTradingDayProgress: vi.fn(),
}));

vi.mock('@/features/header/utils/time-helper', () => ({
	formatAsBerlinTime: vi.fn(),
	formatNextOpen: vi.fn(),
}));

function mockStatusCard(overrides: Partial<ReturnType<typeof getStatusCard>> = {}) {
	vi.mocked(getStatusCard).mockReturnValue({
		value: 'mon — active',
		sub: 'runs at 09:35',
		progress: 0,
		color: 'green',
		...overrides,
	});
}

const baseProps = {
	isTradingDay: true,
	visible: true,
	isRunning: false,
	ranToday: false,
	rebalanceDaysLeft: 5,
	rebalanceNextDate: '2026-07-20',
	rebalancePct: 60,
	marketIsOpen: false,
	nextOpen: '2026-07-06T13:30:00.000Z',
	nextClose: '2026-07-06T20:00:00.000Z',
};

describe('<BotStatusGrid />', () => {
	beforeEach(() => {
		vi.mocked(getStatusCard).mockReset();
		vi.mocked(getTradingDayProgress).mockReset();
		vi.mocked(formatAsBerlinTime).mockReset();
		vi.mocked(formatNextOpen).mockReset();

		mockStatusCard();
		vi.mocked(getTradingDayProgress).mockReturnValue(42);
		vi.mocked(formatAsBerlinTime).mockReturnValue('22:00');
		vi.mocked(formatNextOpen).mockReturnValue('opens tue 09:30');
	});

	it('renders three StatCards', () => {
		render(<BotStatusGrid {...baseProps} />);

		expect(screen.getAllByTestId('stat-card')).toHaveLength(3);
	});

	it('calls getStatusCard with isRunning, ranToday, isTradingDay, and nextOpen', () => {
		render(<BotStatusGrid {...baseProps} isRunning ranToday={false} isTradingDay />);

		expect(getStatusCard).toHaveBeenCalledWith(true, false, true, baseProps.nextOpen);
	});

	it('passes the getStatusCard result to the Status card', () => {
		mockStatusCard({
			value: 'running now',
			sub: 'started at 09:35',
			progress: 100,
			color: 'green',
		});

		render(<BotStatusGrid {...baseProps} />);

		const statusCard = screen.getAllByTestId('stat-card')[0];
		expect(statusCard).toHaveAttribute('data-label', 'Status');
		expect(statusCard).toHaveAttribute('data-value', 'running now');
		expect(statusCard).toHaveAttribute('data-sub', 'started at 09:35');
		expect(statusCard).toHaveAttribute('data-progress', '100');
		expect(statusCard).toHaveAttribute('data-color', 'green');
	});

	it('highlights the Status card when isRunning is true', () => {
		render(<BotStatusGrid {...baseProps} isRunning />);

		const statusCard = screen.getAllByTestId('stat-card')[0];
		expect(statusCard).toHaveAttribute('data-highlight', 'true');
	});

	it('does not highlight the Status card when isRunning is false', () => {
		render(<BotStatusGrid {...baseProps} isRunning={false} />);

		const statusCard = screen.getAllByTestId('stat-card')[0];
		expect(statusCard).toHaveAttribute('data-highlight', 'false');
	});

	it('shows "today" for the Rebalance card when rebalanceDaysLeft is 0', () => {
		render(<BotStatusGrid {...baseProps} rebalanceDaysLeft={0} />);

		const rebalanceCard = screen.getAllByTestId('stat-card')[1];
		expect(rebalanceCard).toHaveAttribute('data-value', 'today');
	});

	it('shows "tomorrow" for the Rebalance card when rebalanceDaysLeft is 1', () => {
		render(<BotStatusGrid {...baseProps} rebalanceDaysLeft={1} />);

		const rebalanceCard = screen.getAllByTestId('stat-card')[1];
		expect(rebalanceCard).toHaveAttribute('data-value', 'tomorrow');
	});

	it('shows "in Nd" for the Rebalance card when rebalanceDaysLeft is greater than 1', () => {
		render(<BotStatusGrid {...baseProps} rebalanceDaysLeft={7} />);

		const rebalanceCard = screen.getAllByTestId('stat-card')[1];
		expect(rebalanceCard).toHaveAttribute('data-value', 'in 7d');
	});

	it('passes rebalanceNextDate and rebalancePct to the Rebalance card', () => {
		render(<BotStatusGrid {...baseProps} rebalanceNextDate='2026-08-01' rebalancePct={33} />);

		const rebalanceCard = screen.getAllByTestId('stat-card')[1];
		expect(rebalanceCard).toHaveAttribute('data-sub', '2026-08-01');
		expect(rebalanceCard).toHaveAttribute('data-progress', '33');
	});

	it('shows "open" for the Market card when marketIsOpen is true', () => {
		render(<BotStatusGrid {...baseProps} marketIsOpen />);

		const marketCard = screen.getAllByTestId('stat-card')[2];
		expect(marketCard).toHaveAttribute('data-value', 'open');
	});

	it('shows "closed" for the Market card when marketIsOpen is false', () => {
		render(<BotStatusGrid {...baseProps} marketIsOpen={false} />);

		const marketCard = screen.getAllByTestId('stat-card')[2];
		expect(marketCard).toHaveAttribute('data-value', 'closed');
	});

	it('shows "closed" for the Market card when marketIsOpen is null', () => {
		render(<BotStatusGrid {...baseProps} marketIsOpen={null} />);

		const marketCard = screen.getAllByTestId('stat-card')[2];
		expect(marketCard).toHaveAttribute('data-value', 'closed');
	});

	it('shows the formatted close time when the market is open and nextClose is set', () => {
		render(<BotStatusGrid {...baseProps} marketIsOpen nextClose='2026-07-06T20:00:00.000Z' />);

		expect(formatAsBerlinTime).toHaveBeenCalledWith('2026-07-06T20:00:00.000Z');
		const marketCard = screen.getAllByTestId('stat-card')[2];
		expect(marketCard).toHaveAttribute('data-sub', 'closes 22:00');
	});

	it('shows the formatted next-open message when the market is closed and nextOpen is set', () => {
		render(
			<BotStatusGrid {...baseProps} marketIsOpen={false} nextOpen='2026-07-07T13:30:00.000Z' />,
		);

		expect(formatNextOpen).toHaveBeenCalledWith('2026-07-07T13:30:00.000Z');
		const marketCard = screen.getAllByTestId('stat-card')[2];
		expect(marketCard).toHaveAttribute('data-sub', 'opens tue 09:30');
	});

	it('shows a dash when the market is closed and nextOpen is null', () => {
		render(<BotStatusGrid {...baseProps} marketIsOpen={false} nextOpen={null} />);

		const marketCard = screen.getAllByTestId('stat-card')[2];
		expect(marketCard).toHaveAttribute('data-sub', '—');
	});

	it('shows a dash when the market is open but nextClose is null', () => {
		render(<BotStatusGrid {...baseProps} marketIsOpen nextClose={null} nextOpen={null} />);

		const marketCard = screen.getAllByTestId('stat-card')[2];
		expect(marketCard).toHaveAttribute('data-sub', '—');
	});

	it('calls getTradingDayProgress and uses it as progress when the market is open', () => {
		render(<BotStatusGrid {...baseProps} marketIsOpen />);

		expect(getTradingDayProgress).toHaveBeenCalled();
		const marketCard = screen.getAllByTestId('stat-card')[2];
		expect(marketCard).toHaveAttribute('data-progress', '42');
	});

	it('sets Market card progress to 0 without calling getTradingDayProgress when the market is closed', () => {
		render(<BotStatusGrid {...baseProps} marketIsOpen={false} />);

		expect(getTradingDayProgress).not.toHaveBeenCalled();
		const marketCard = screen.getAllByTestId('stat-card')[2];
		expect(marketCard).toHaveAttribute('data-progress', '0');
	});

	it('passes visible to all three StatCards', () => {
		render(<BotStatusGrid {...baseProps} visible={false} />);

		screen.getAllByTestId('stat-card').forEach((card) => {
			expect(card).toHaveAttribute('data-visible', 'false');
		});
	});

	it('assigns staggered delays to the three StatCards', () => {
		render(<BotStatusGrid {...baseProps} />);

		const cards = screen.getAllByTestId('stat-card');
		expect(cards[0]).toHaveAttribute('data-delay', '0ms');
		expect(cards[1]).toHaveAttribute('data-delay', '60ms');
		expect(cards[2]).toHaveAttribute('data-delay', '120ms');
	});

	it('shows the lastUpdated text when provided', () => {
		render(<BotStatusGrid {...baseProps} lastUpdated='2026-07-06 @ 15:30:00' />);

		expect(screen.getByText('updated 2026-07-06 @ 15:30:00')).toBeInTheDocument();
	});

	it('shows a loading skeleton when lastUpdated is not provided', () => {
		render(<BotStatusGrid {...baseProps} lastUpdated={undefined} />);

		expect(screen.getByTestId('bot-row-loading-skeleton')).toBeInTheDocument();
		expect(screen.queryByText(/^updated/)).not.toBeInTheDocument();
	});

	it('makes the footer visible (opacity-100) when visible is true', () => {
		render(<BotStatusGrid {...baseProps} visible lastUpdated='x' />);

		const footer = screen.getByText('updated x');
		expect(footer).toHaveClass('opacity-100', 'translate-y-0');
	});

	it('keeps the footer hidden (opacity-0) when visible is false', () => {
		render(<BotStatusGrid {...baseProps} visible={false} lastUpdated='x' />);

		const footer = screen.getByText('updated x');
		expect(footer).toHaveClass('opacity-0', 'translate-y-1');
	});
});
