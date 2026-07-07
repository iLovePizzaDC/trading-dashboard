import SummaryError from '@/features/summary/components/molecules/SummaryError';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/summary/components/layouts/SummaryCardsShell', () => ({
	default: ({ activeTab, children }: any) => (
		<div data-testid='shell' data-active-tab={activeTab}>
			{children}
		</div>
	),
}));

vi.mock('@/shared/hooks/useLocalStorage', () => ({
	useLocalStorage: vi.fn(),
}));

describe('<SummaryError />', () => {
	beforeEach(() => {
		vi.mocked(useLocalStorage).mockReset();
		vi.mocked(useLocalStorage).mockReturnValue(['overview', vi.fn(), vi.fn()]);
	});

	it('renders the error message', () => {
		render(<SummaryError />);

		expect(screen.getByTestId('summary-error-message')).toHaveTextContent('Failed to load summary');
	});

	it('passes the activeTab from useLocalStorage to SummaryCardsShell', () => {
		vi.mocked(useLocalStorage).mockReturnValue(['capital', vi.fn(), vi.fn()]);

		render(<SummaryError />);

		expect(screen.getByTestId('shell')).toHaveAttribute('data-active-tab', 'capital');
	});

	it('renders 6 placeholder cards inside the shell', () => {
		render(<SummaryError />);

		expect(screen.getAllByTestId('summary-error-placeholder')).toHaveLength(6);
	});
});
