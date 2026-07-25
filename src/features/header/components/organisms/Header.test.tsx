import Header from '@/features/header/components/organisms/Header';
import { useBotStatus } from '@/features/header/hooks/useBotStatus';
import { useLastUpdated } from '@/features/header/hooks/useLastUpdated';
import { fetchLastRebalanceDate, fetchMarketStatus } from '@/shared/api/data';
import { useDataVersion } from '@/shared/hooks/useDataVersion';
import { useFetch } from '@/shared/hooks/useFetch';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/header/components/molecules/BotNameRow', () => ({
	default: ({ dotVariant, expanded, onClick }: any) => (
		<button
			data-testid='bot-name-row'
			data-dot-variant={dotVariant}
			data-expanded={String(expanded)}
			onClick={onClick}
		>
			bot name row
		</button>
	),
}));

vi.mock('@/features/header/components/molecules/BotStatusGrid', () => ({
	default: (props: any) => (
		<div
			data-testid='bot-status-grid'
			data-visible={String(props.visible)}
			data-next-open={props.nextOpen}
			data-next-close={props.nextClose}
			data-last-updated={props.lastUpdated}
			data-is-trading-day={String(props.isTradingDay)}
			data-is-running={String(props.isRunning)}
		/>
	),
}));

vi.mock('@/features/header/components/molecules/BotStatusSkeleton', () => ({
	default: () => <div data-testid='bot-status-skeleton' />,
}));

vi.mock('@/features/header/components/molecules/DownloadDropdown', () => ({
	default: () => <div data-testid='download-dropdown' />,
}));

vi.mock('@/features/header/hooks/useBotStatus', () => ({
	useBotStatus: vi.fn(),
}));

vi.mock('@/features/header/hooks/useLastUpdated', () => ({
	useLastUpdated: vi.fn(),
}));

vi.mock('@/shared/api/data', () => ({
	fetchLastRebalanceDate: vi.fn(),
	fetchMarketStatus: vi.fn(),
}));

vi.mock('@/shared/hooks/useDataVersion', () => ({
	useDataVersion: vi.fn(),
}));

vi.mock('@/shared/hooks/useFetch', () => ({
	useFetch: vi.fn(),
}));

function mockFetches({
	lastRebalance = { data: '2026-06-20T00:00:00.000Z', loading: false, error: null },
	marketStatus = {
		data: { next_open: '2026-07-06T13:30:00.000Z', next_close: '2026-07-06T20:00:00.000Z' },
		loading: false,
		error: null,
	},
}: {
	lastRebalance?: { data: string | null; loading: boolean; error: Error | null };
	marketStatus?: { data: any; loading: boolean; error: Error | null };
} = {}) {
	vi.mocked(useFetch).mockImplementation((fn: any) => {
		if (fn === fetchLastRebalanceDate) return lastRebalance as any;
		if (fn === fetchMarketStatus) return marketStatus as any;
		throw new Error('useFetch called with unexpected fetcher');
	});
}

function mockStatus(overrides: Partial<ReturnType<typeof useBotStatus>> = {}) {
	vi.mocked(useBotStatus).mockReturnValue({
		rebalanceDaysLeft: 5,
		rebalanceNextDate: '2026-07-20',
		rebalancePct: 60,
		isRunning: false,
		ranToday: false,
		isTradingDay: true,
		marketIsOpen: false,
		...overrides,
	} as ReturnType<typeof useBotStatus>);
}

describe('<Header />', () => {
	beforeEach(() => {
		vi.mocked(useFetch).mockReset();
		vi.mocked(useBotStatus).mockReset();
		vi.mocked(useLastUpdated).mockReset();
		vi.mocked(useDataVersion).mockReset();

		vi.mocked(useLastUpdated).mockReturnValue('2026-07-06 @ 15:30:00');
		vi.mocked(useDataVersion).mockReturnValue('1783863000');
	});

	it('renders BotNameRow and DownloadDropdown', () => {
		mockFetches();
		mockStatus();

		render(<Header />);

		expect(screen.getByTestId('bot-name-row')).toBeInTheDocument();
		expect(screen.getByTestId('download-dropdown')).toBeInTheDocument();
	});

	it('calls useBotStatus with lastRebalance, marketStatus, and dataVersion', () => {
		mockFetches();
		mockStatus();

		render(<Header />);

		expect(useBotStatus).toHaveBeenCalledWith(
			'2026-06-20T00:00:00.000Z',
			{ next_open: '2026-07-06T13:30:00.000Z', next_close: '2026-07-06T20:00:00.000Z' },
			'1783863000',
		);
	});

	it('passes null to useBotStatus when lastRebalance is null', () => {
		mockFetches({ lastRebalance: { data: null, loading: false, error: null } });
		mockStatus();

		render(<Header />);

		expect(useBotStatus).toHaveBeenCalledWith(null, expect.anything(), expect.anything());
	});

	it('shows the skeleton while the collapsible content is loading and expanded state does not matter for rendering it', () => {
		mockFetches({ lastRebalance: { data: null, loading: true, error: null } });
		mockStatus();

		render(<Header />);

		expect(screen.getByTestId('bot-status-skeleton')).toBeInTheDocument();
	});

	it('shows an error message when there is a lastRebalance fetch error', () => {
		mockFetches({
			lastRebalance: { data: null, loading: false, error: new Error('failed') },
		});
		mockStatus();

		render(<Header />);

		expect(screen.getByText('status unavailable')).toBeInTheDocument();
	});

	it('shows BotStatusGrid when status is available, not loading, and no error', () => {
		mockFetches();
		mockStatus();

		render(<Header />);

		expect(screen.getByTestId('bot-status-grid')).toBeInTheDocument();
	});

	it('does not show BotStatusGrid when status is null', () => {
		mockFetches();
		vi.mocked(useBotStatus).mockReturnValue(null);

		render(<Header />);

		expect(screen.queryByTestId('bot-status-grid')).not.toBeInTheDocument();
	});

	it('does not show the skeleton or error once data has successfully loaded', () => {
		mockFetches();
		mockStatus();

		render(<Header />);

		expect(screen.queryByTestId('bot-status-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByText('status unavailable')).not.toBeInTheDocument();
	});

	it('passes nextOpen and nextClose from marketStatus to BotStatusGrid', () => {
		mockFetches({
			marketStatus: {
				data: { next_open: '2026-07-08T13:30:00.000Z', next_close: '2026-07-08T20:00:00.000Z' },
				loading: false,
				error: null,
			},
		});
		mockStatus();

		render(<Header />);

		const grid = screen.getByTestId('bot-status-grid');
		expect(grid).toHaveAttribute('data-next-open', '2026-07-08T13:30:00.000Z');
		expect(grid).toHaveAttribute('data-next-close', '2026-07-08T20:00:00.000Z');
	});

	it('passes null for nextOpen/nextClose to BotStatusGrid when marketStatus is null', () => {
		mockFetches({ marketStatus: { data: null, loading: false, error: null } });
		mockStatus();

		render(<Header />);

		const grid = screen.getByTestId('bot-status-grid');
		expect(grid).not.toHaveAttribute('data-next-open');
		expect(grid).not.toHaveAttribute('data-next-close');
	});

	it('passes lastUpdated to BotStatusGrid', () => {
		mockFetches();
		mockStatus();
		vi.mocked(useLastUpdated).mockReturnValue('2026-07-06 @ 15:30:00');

		render(<Header />);

		expect(screen.getByTestId('bot-status-grid')).toHaveAttribute(
			'data-last-updated',
			'2026-07-06 @ 15:30:00',
		);
	});

	it('passes undefined lastUpdated to BotStatusGrid when useLastUpdated returns null', () => {
		mockFetches();
		mockStatus();
		vi.mocked(useLastUpdated).mockReturnValue(null);

		render(<Header />);

		expect(screen.getByTestId('bot-status-grid')).not.toHaveAttribute('data-last-updated');
	});

	it('passes the fields from useBotStatus through to BotStatusGrid', () => {
		mockFetches();
		mockStatus({ isRunning: true, isTradingDay: true });

		render(<Header />);

		const grid = screen.getByTestId('bot-status-grid');
		expect(grid).toHaveAttribute('data-is-running', 'true');
		expect(grid).toHaveAttribute('data-is-trading-day', 'true');
	});

	it('passes visible=false to BotStatusGrid when collapsed', () => {
		mockFetches();
		mockStatus();

		render(<Header />);

		expect(screen.getByTestId('bot-status-grid')).toHaveAttribute('data-visible', 'false');
	});

	it('passes visible=true to BotStatusGrid when expanded', async () => {
		const user = userEvent.setup();
		mockFetches();
		mockStatus();

		render(<Header />);

		await user.click(screen.getByTestId('bot-name-row'));

		expect(screen.getByTestId('bot-status-grid')).toHaveAttribute('data-visible', 'true');
	});

	it('toggles expanded state on BotNameRow when clicked', async () => {
		const user = userEvent.setup();
		mockFetches();
		mockStatus();

		render(<Header />);

		const botNameRow = screen.getByTestId('bot-name-row');
		expect(botNameRow).toHaveAttribute('data-expanded', 'false');

		await user.click(botNameRow);
		expect(botNameRow).toHaveAttribute('data-expanded', 'true');

		await user.click(botNameRow);
		expect(botNameRow).toHaveAttribute('data-expanded', 'false');
	});

	describe('dotVariant logic', () => {
		it('is "inactive" when there is no lastRebalance and not loading', () => {
			mockFetches({ lastRebalance: { data: null, loading: false, error: null } });
			mockStatus();

			render(<Header />);

			expect(screen.getByTestId('bot-name-row')).toHaveAttribute('data-dot-variant', 'inactive');
		});

		it('is not "inactive" while lastRebalance is still loading, even if data is null', () => {
			mockFetches({ lastRebalance: { data: null, loading: true, error: null } });
			mockStatus({ isTradingDay: false });

			render(<Header />);

			expect(screen.getByTestId('bot-name-row')).not.toHaveAttribute(
				'data-dot-variant',
				'inactive',
			);
		});

		it('is "running" when status.isRunning is true', () => {
			mockFetches();
			mockStatus({ isRunning: true, isTradingDay: true });

			render(<Header />);

			expect(screen.getByTestId('bot-name-row')).toHaveAttribute('data-dot-variant', 'running');
		});

		it('prioritizes "running" over "active" when both isRunning and isTradingDay are true', () => {
			mockFetches();
			mockStatus({ isRunning: true, isTradingDay: true });

			render(<Header />);

			expect(screen.getByTestId('bot-name-row')).toHaveAttribute('data-dot-variant', 'running');
		});

		it('is "active" when isTradingDay is true and not running', () => {
			mockFetches();
			mockStatus({ isRunning: false, isTradingDay: true });

			render(<Header />);

			expect(screen.getByTestId('bot-name-row')).toHaveAttribute('data-dot-variant', 'active');
		});

		it('is "weekend" when not running and not a trading day', () => {
			mockFetches();
			mockStatus({ isRunning: false, isTradingDay: false });

			render(<Header />);

			expect(screen.getByTestId('bot-name-row')).toHaveAttribute('data-dot-variant', 'weekend');
		});

		it('defaults isTradingDay to false (weekend) when status is null', () => {
			mockFetches();
			vi.mocked(useBotStatus).mockReturnValue(null);

			render(<Header />);

			expect(screen.getByTestId('bot-name-row')).toHaveAttribute('data-dot-variant', 'weekend');
		});

		it('prioritizes "inactive" over "running" when lastRebalance is missing, even if status.isRunning is true', () => {
			mockFetches({ lastRebalance: { data: null, loading: false, error: null } });
			mockStatus({ isRunning: true });

			render(<Header />);

			expect(screen.getByTestId('bot-name-row')).toHaveAttribute('data-dot-variant', 'inactive');
		});
	});
});
