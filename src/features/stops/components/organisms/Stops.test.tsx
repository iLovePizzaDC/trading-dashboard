import Stops from '@/features/stops/components/organisms/Stops';
import { fetchStopHistory } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import type { StopHistory as StopHistoryType } from '@/shared/types/stops';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/stops/components/molecules/StopsCard', () => ({
	default: ({ data }: { data: StopHistoryType }) => (
		<div data-testid='stops-card' data-symbols={Object.keys(data).length} />
	),
}));

vi.mock('@/features/stops/components/molecules/StopsError', () => ({
	default: () => <div data-testid='stops-error' />,
}));

vi.mock('@/features/stops/components/molecules/StopsSkeleton', () => ({
	default: () => <div data-testid='stops-skeleton' />,
}));

vi.mock('@/shared/api/data', () => ({
	fetchStopHistory: vi.fn(),
}));

vi.mock('@/shared/hooks/useFetch', () => ({
	useFetch: vi.fn(),
}));

function buildHistory(overrides: StopHistoryType = {}): StopHistoryType {
	return {
		XLK: [{ date: '2026-07-01', old_stop: 0, new_stop: 90 }],
		...overrides,
	};
}

describe('<Stops />', () => {
	beforeEach(() => {
		vi.mocked(useFetch).mockReset();
	});

	it('calls useFetch with fetchStopHistory', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: true, error: null });

		render(<Stops />);

		expect(useFetch).toHaveBeenCalledWith(fetchStopHistory);
	});

	it('renders the skeleton while loading', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: true, error: null });

		render(<Stops />);

		expect(screen.getByTestId('stops-skeleton')).toBeInTheDocument();
		expect(screen.queryByTestId('stops-card')).not.toBeInTheDocument();
		expect(screen.queryByTestId('stops-error')).not.toBeInTheDocument();
	});

	it('renders the skeleton while loading even if data or error is already present', () => {
		vi.mocked(useFetch).mockReturnValue({
			data: buildHistory(),
			loading: true,
			error: new Error('stale'),
		});

		render(<Stops />);

		expect(screen.getByTestId('stops-skeleton')).toBeInTheDocument();
	});

	it('renders the error state when error is set and loading has finished', () => {
		vi.mocked(useFetch).mockReturnValue({
			data: null,
			loading: false,
			error: new Error('failed'),
		});

		render(<Stops />);

		expect(screen.getByTestId('stops-error')).toBeInTheDocument();
		expect(screen.queryByTestId('stops-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByTestId('stops-card')).not.toBeInTheDocument();
	});

	it('renders the error state when data is falsy, even without an explicit error', () => {
		vi.mocked(useFetch).mockReturnValue({ data: null, loading: false, error: null });

		render(<Stops />);

		expect(screen.getByTestId('stops-error')).toBeInTheDocument();
	});

	it('renders StopsCard with the fetched data on success', () => {
		const data = buildHistory({
			XLK: [{ date: '2026-07-01', old_stop: 0, new_stop: 90 }],
			XLF: [{ date: '2026-07-02', old_stop: 0, new_stop: 40 }],
		});
		vi.mocked(useFetch).mockReturnValue({ data, loading: false, error: null });

		render(<Stops />);

		expect(screen.queryByTestId('stops-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByTestId('stops-error')).not.toBeInTheDocument();
		expect(screen.getByTestId('stops-card')).toHaveAttribute('data-symbols', '2');
	});

	it('renders StopsCard even when data is an empty object (no error guard for empty objects)', () => {
		vi.mocked(useFetch).mockReturnValue({ data: {}, loading: false, error: null });

		render(<Stops />);

		expect(screen.getByTestId('stops-card')).toHaveAttribute('data-symbols', '0');
		expect(screen.queryByTestId('stops-error')).not.toBeInTheDocument();
	});
});
