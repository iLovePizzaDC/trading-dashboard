import SummaryCards from '@/features/summary/components/molecules/SummaryCards';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { Summary } from '@/shared/types/summary';
import { fmt } from '@/shared/utils/currency';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/summary/components/atoms/MetricItem', () => ({
	default: ({ label, value, sub, positive }: any) => (
		<div
			data-testid='metric-item'
			data-label={label}
			data-value={value}
			data-sub={sub}
			data-positive={String(positive)}
		/>
	),
}));

vi.mock('@/features/summary/components/layouts/SummaryCardsShell', () => ({
	default: ({ activeTab, handleTabChange, children }: any) => (
		<div data-testid='shell' data-active-tab={activeTab}>
			<button data-testid='change-to-capital' onClick={() => handleTabChange('capital')} />
			<button data-testid='change-to-performance' onClick={() => handleTabChange('performance')} />
			<button data-testid='change-to-overview' onClick={() => handleTabChange('overview')} />
			{children}
		</div>
	),
}));

vi.mock('@/shared/hooks/useLocalStorage', () => ({
	useLocalStorage: vi.fn(),
}));

vi.mock('@/shared/utils/currency', () => ({
	fmt: vi.fn((n: number) => `fmt(${n})`),
	isPos: vi.fn((n: number) => n >= 0),
	usd: vi.fn((n: number) => `$${n}`),
}));

let resizeObserverInstances: MockResizeObserver[] = [];

class MockResizeObserver {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();

	constructor() {
		resizeObserverInstances.push(this);
	}
}

function buildSummary(overrides: Partial<Summary> = {}): Summary {
	return {
		total_return: 25.5,
		cagr: 12.3,
		max_dd: -8.2,
		sharpe: 1.45,
		rolling_4w: 3.2,
		spy_4w: 1.8,
		total_invested: 10000,
		portfolio_value: 12500,
		profit: 2500,
		...overrides,
	} as Summary;
}

function mockLocalStorage(activeTab = 'overview') {
	const setActiveTab = vi.fn();
	vi.mocked(useLocalStorage).mockReturnValue([activeTab, setActiveTab, vi.fn()]);
	return { setActiveTab };
}

function getMetricLabels() {
	return screen.getAllByTestId('metric-item').map((el) => el.dataset.label);
}

describe('<SummaryCards />', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.mocked(useLocalStorage).mockReset();
		resizeObserverInstances = [];
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
		vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(240);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('renders the shell with the activeTab from useLocalStorage', () => {
		mockLocalStorage('capital');

		render(<SummaryCards summary={buildSummary()} />);

		expect(screen.getByTestId('shell')).toHaveAttribute('data-active-tab', 'capital');
	});

	it('renders the overview metrics initially, since displayedTab starts as "overview" regardless of activeTab', () => {
		mockLocalStorage('overview');

		render(<SummaryCards summary={buildSummary()} />);

		expect(getMetricLabels()).toEqual([
			'total return',
			'CAGR',
			'max drawdown',
			'sharpe ratio',
			'4-week return',
			'vs SPY',
		]);
	});

	it('still shows the overview tab content right after mount even if activeTab from storage is "capital"', () => {
		mockLocalStorage('capital');

		render(<SummaryCards summary={buildSummary()} />);

		expect(getMetricLabels()).toContain('total return');
		expect(getMetricLabels()).not.toContain('total invested');
	});

	it('switches the displayed content to "capital" after the fade timers complete', () => {
		mockLocalStorage('capital');

		render(<SummaryCards summary={buildSummary()} />);

		act(() => {
			vi.advanceTimersByTime(150);
		});

		expect(getMetricLabels()).toContain('total invested');
		expect(getMetricLabels()).not.toContain('total return');
	});

	it('applies opacity-0 during the fade-out phase (after 0ms, before 150ms)', () => {
		mockLocalStorage('capital');

		render(<SummaryCards summary={buildSummary()} />);

		act(() => {
			vi.advanceTimersByTime(0);
		});

		expect(screen.getByTestId('summary-wrapper')).toHaveClass('opacity-0');
	});

	it('applies opacity-100 again once the fade-in completes', () => {
		mockLocalStorage('capital');

		render(<SummaryCards summary={buildSummary()} />);

		act(() => {
			vi.advanceTimersByTime(150);
		});

		expect(screen.getByTestId('summary-wrapper')).toHaveClass('opacity-100');
	});

	it('does not trigger the fade cycle when activeTab already matches displayedTab (overview)', () => {
		mockLocalStorage('overview');

		render(<SummaryCards summary={buildSummary()} />);

		act(() => {
			vi.advanceTimersByTime(150);
		});

		expect(screen.getByTestId('summary-wrapper')).toHaveClass('opacity-100');
	});

	describe('overview tab content', () => {
		it('renders total return with the correct value and positivity', () => {
			mockLocalStorage('overview');

			render(<SummaryCards summary={buildSummary({ total_return: 25.5 })} />);

			const metric = screen
				.getAllByTestId('metric-item')
				.find((el) => el.dataset.label === 'total return');
			expect(metric).toHaveAttribute('data-value', 'fmt(25.5)');
			expect(metric).toHaveAttribute('data-positive', 'true');
		});

		it('shows "n/a" for 4-week return when rolling_4w is null', () => {
			mockLocalStorage('overview');

			render(<SummaryCards summary={buildSummary({ rolling_4w: null })} />);

			const metric = screen
				.getAllByTestId('metric-item')
				.find((el) => el.dataset.label === '4-week return');
			expect(metric).toHaveAttribute('data-value', 'n/a');
			expect(metric).toHaveAttribute('data-positive', 'undefined');
		});

		it('calculates vs SPY as the difference between rolling_4w and spy_4w', () => {
			mockLocalStorage('overview');

			render(<SummaryCards summary={buildSummary({ rolling_4w: 5, spy_4w: 2 })} />);

			const metric = screen
				.getAllByTestId('metric-item')
				.find((el) => el.dataset.label === 'vs SPY');
			expect(fmt).toHaveBeenCalledWith(3);
			expect(metric).toHaveAttribute('data-value', 'fmt(3)');
		});

		it('shows "n/a" for vs SPY when either rolling_4w or spy_4w is null', () => {
			mockLocalStorage('overview');

			render(<SummaryCards summary={buildSummary({ rolling_4w: null, spy_4w: 2 })} />);

			const metric = screen
				.getAllByTestId('metric-item')
				.find((el) => el.dataset.label === 'vs SPY');
			expect(metric).toHaveAttribute('data-value', 'n/a');
		});
	});

	describe('capital tab content', () => {
		function switchToCapital(summary: Summary) {
			mockLocalStorage('capital');
			render(<SummaryCards summary={summary} />);
			act(() => {
				vi.advanceTimersByTime(150);
			});
		}

		it('renders the capital metrics after switching', () => {
			switchToCapital(buildSummary());

			expect(getMetricLabels()).toEqual(['total invested', 'current value', 'pure profit', 'ROI']);
		});

		it('always marks total invested as positive', () => {
			switchToCapital(buildSummary({ total_invested: 10000 }));

			const metric = screen
				.getAllByTestId('metric-item')
				.find((el) => el.dataset.label === 'total invested');
			expect(metric).toHaveAttribute('data-positive', 'true');
		});

		it('falls back to usd(0) for total invested when it is falsy', () => {
			switchToCapital(buildSummary({ total_invested: 0 }));

			const metric = screen
				.getAllByTestId('metric-item')
				.find((el) => el.dataset.label === 'total invested');
			expect(metric).toHaveAttribute('data-value', '$0');
		});

		it('falls back to usd(0) for pure profit when it is falsy', () => {
			switchToCapital(buildSummary({ profit: 0 }));

			const metric = screen
				.getAllByTestId('metric-item')
				.find((el) => el.dataset.label === 'pure profit');
			expect(metric).toHaveAttribute('data-value', '$0');
		});

		it('calculates ROI as profit divided by total_invested, as a percentage', () => {
			switchToCapital(buildSummary({ profit: 2500, total_invested: 10000 }));

			expect(fmt).toHaveBeenCalledWith(25);
		});

		it('returns a ROI of 0 when total_invested is 0 (avoids divide-by-zero)', () => {
			switchToCapital(buildSummary({ profit: 2500, total_invested: 0 }));

			expect(fmt).toHaveBeenCalledWith(0);
		});
	});

	describe('performance tab content', () => {
		function switchToPerformance(summary: Summary) {
			mockLocalStorage('performance');
			render(<SummaryCards summary={summary} />);
			act(() => {
				vi.advanceTimersByTime(150);
			});
		}

		it('renders the Weekly Performance and Risk Metrics sections', () => {
			switchToPerformance(buildSummary());

			expect(screen.getByText('Weekly Performance')).toBeInTheDocument();
			expect(screen.getByText('Risk Metrics')).toBeInTheDocument();
		});

		it('renders 4 metrics split across the two sections', () => {
			switchToPerformance(buildSummary());

			expect(getMetricLabels()).toEqual([
				'4-week return',
				'SPY return',
				'max drawdown',
				'sharpe ratio',
			]);
		});

		it('shows "n/a" for SPY return when spy_4w is null', () => {
			switchToPerformance(buildSummary({ spy_4w: null }));

			const metric = screen
				.getAllByTestId('metric-item')
				.find((el) => el.dataset.label === 'SPY return');
			expect(metric).toHaveAttribute('data-value', 'n/a');
		});

		it('formats the sharpe ratio with two decimal places directly, without fmt', () => {
			switchToPerformance(buildSummary({ sharpe: 1.456 }));

			const metric = screen
				.getAllByTestId('metric-item')
				.find((el) => el.dataset.label === 'sharpe ratio');
			expect(metric).toHaveAttribute('data-value', '1.46');
		});
	});

	describe('handleTabChange', () => {
		it('calls setActiveTab when a different tab is selected', () => {
			const { setActiveTab } = mockLocalStorage('overview');

			render(<SummaryCards summary={buildSummary()} />);

			screen.getByTestId('change-to-capital').click();

			expect(setActiveTab).toHaveBeenCalledWith('capital');
		});

		it('does not call setActiveTab when the same tab is selected again', () => {
			const { setActiveTab } = mockLocalStorage('overview');

			render(<SummaryCards summary={buildSummary()} />);

			screen.getByTestId('change-to-overview').click();

			expect(setActiveTab).not.toHaveBeenCalled();
		});
	});

	describe('height measurement', () => {
		it('applies the measured scrollHeight as the wrapper height', () => {
			mockLocalStorage('overview');

			render(<SummaryCards summary={buildSummary()} />);

			expect(screen.getByTestId('summary-height-wrapper')).toHaveStyle({ height: '240px' });
		});

		it('observes the content element with a ResizeObserver', () => {
			mockLocalStorage('overview');

			render(<SummaryCards summary={buildSummary()} />);

			expect(resizeObserverInstances).toHaveLength(1);
			expect(resizeObserverInstances[0].observe).toHaveBeenCalledTimes(1);
		});

		it('disconnects the ResizeObserver on unmount', () => {
			mockLocalStorage('overview');

			const { unmount } = render(<SummaryCards summary={buildSummary()} />);
			unmount();

			expect(resizeObserverInstances[0].disconnect).toHaveBeenCalledTimes(1);
		});
	});

	it('clears pending fade timers on unmount', () => {
		mockLocalStorage('capital');
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

		const { unmount } = render(<SummaryCards summary={buildSummary()} />);
		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalled();
	});
});
