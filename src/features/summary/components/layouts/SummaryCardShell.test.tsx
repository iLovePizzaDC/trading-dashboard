import SummaryCardsShell from '@/features/summary/components/layouts/SummaryCardsShell';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/summary/components/atoms/TabButton', () => ({
	default: ({ tab, label, activeTab, handleTabChange }: any) => (
		<button
			data-testid='tab-button'
			data-tab={tab}
			data-active={String(tab === activeTab)}
			onClick={() => handleTabChange(tab)}
		>
			{label}
		</button>
	),
}));

describe('<SummaryCardsShell />', () => {
	it('renders three TabButtons for overview, capital, and performance', () => {
		render(
			<SummaryCardsShell activeTab='overview' handleTabChange={vi.fn()}>
				<p>content</p>
			</SummaryCardsShell>,
		);

		const buttons = screen.getAllByTestId('tab-button');
		expect(buttons).toHaveLength(3);
		expect(buttons.map((b) => b.dataset.tab)).toEqual(['overview', 'capital', 'performance']);
	});

	it('renders the children', () => {
		render(
			<SummaryCardsShell activeTab='overview' handleTabChange={vi.fn()}>
				<p>child content</p>
			</SummaryCardsShell>,
		);

		expect(screen.getByText('child content')).toBeInTheDocument();
	});

	it('marks the correct TabButton as active based on activeTab', () => {
		render(
			<SummaryCardsShell activeTab='capital' handleTabChange={vi.fn()}>
				<p>content</p>
			</SummaryCardsShell>,
		);

		const buttons = screen.getAllByTestId('tab-button');
		expect(buttons.find((b) => b.dataset.tab === 'capital')).toHaveAttribute('data-active', 'true');
		expect(buttons.find((b) => b.dataset.tab === 'overview')).toHaveAttribute(
			'data-active',
			'false',
		);
	});

	it('passes handleTabChange through to the TabButtons', () => {
		const handleTabChange = vi.fn();

		render(
			<SummaryCardsShell activeTab='overview' handleTabChange={handleTabChange}>
				<p>content</p>
			</SummaryCardsShell>,
		);

		screen.getByText('Capital').click();

		expect(handleTabChange).toHaveBeenCalledWith('capital');
	});

	it('sets the indicator width based on the number of tabs', () => {
		const { container } = render(
			<SummaryCardsShell activeTab='overview' handleTabChange={vi.fn()}>
				<p>content</p>
			</SummaryCardsShell>,
		);

		const indicator = container.querySelector('.bg-purple-500');
		expect(indicator).toHaveStyle({ width: `${100 / 3}%` });
	});

	it('positions the indicator at translateX(0%) when activeTab is the first tab', () => {
		const { container } = render(
			<SummaryCardsShell activeTab='overview' handleTabChange={vi.fn()}>
				<p>content</p>
			</SummaryCardsShell>,
		);

		const indicator = container.querySelector('.bg-purple-500');
		expect(indicator).toHaveStyle({ transform: 'translateX(0%)' });
	});

	it('positions the indicator at translateX(100%) when activeTab is the second tab', () => {
		const { container } = render(
			<SummaryCardsShell activeTab='capital' handleTabChange={vi.fn()}>
				<p>content</p>
			</SummaryCardsShell>,
		);

		const indicator = container.querySelector('.bg-purple-500');
		expect(indicator).toHaveStyle({ transform: 'translateX(100%)' });
	});

	it('positions the indicator at translateX(200%) when activeTab is the third tab', () => {
		const { container } = render(
			<SummaryCardsShell activeTab='performance' handleTabChange={vi.fn()}>
				<p>content</p>
			</SummaryCardsShell>,
		);

		const indicator = container.querySelector('.bg-purple-500');
		expect(indicator).toHaveStyle({ transform: 'translateX(200%)' });
	});
});
