import EntryRowLayout from '@/shared/components/layouts/EntryRowLayout';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<EntryRowLayout />', () => {
	it('renders the left and right content', () => {
		render(
			<EntryRowLayout
				color='#4ade80'
				isLast={false}
				renderLeft={<span>left content</span>}
				renderRight={<span>right content</span>}
			/>,
		);

		expect(screen.getByText('left content')).toBeInTheDocument();
		expect(screen.getByText('right content')).toBeInTheDocument();
	});

	it('applies the given color to the dot', () => {
		render(
			<EntryRowLayout
				color='#4ade80'
				isLast={false}
				renderLeft={<span>left</span>}
				renderRight={<span>right</span>}
			/>,
		);

		expect(screen.getByTestId('entry-row-dot')).toHaveStyle({ backgroundColor: '#4ade80' });
	});

	it('defaults dotOpacity to 1 when not provided', () => {
		render(
			<EntryRowLayout
				color='#4ade80'
				isLast={false}
				renderLeft={<span>left</span>}
				renderRight={<span>right</span>}
			/>,
		);

		expect(screen.getByTestId('entry-row-dot')).toHaveStyle({ opacity: '1' });
	});

	it('applies a custom dotOpacity when provided', () => {
		render(
			<EntryRowLayout
				color='#4ade80'
				isLast={false}
				dotOpacity={0.5}
				renderLeft={<span>left</span>}
				renderRight={<span>right</span>}
			/>,
		);

		expect(screen.getByTestId('entry-row-dot')).toHaveStyle({ opacity: '0.5' });
	});

	it('renders the connecting line when isLast is false', () => {
		render(
			<EntryRowLayout
				color='#4ade80'
				isLast={false}
				renderLeft={<span>left</span>}
				renderRight={<span>right</span>}
			/>,
		);

		const line = screen.getByTestId('entry-row-line');
		expect(line).toBeInTheDocument();
		expect(line).toHaveStyle({ backgroundColor: '#4ade80', opacity: '0.2' });
	});

	it('does not render the connecting line when isLast is true', () => {
		render(
			<EntryRowLayout
				color='#4ade80'
				isLast
				renderLeft={<span>left</span>}
				renderRight={<span>right</span>}
			/>,
		);

		expect(screen.queryByTestId('entry-row-line')).not.toBeInTheDocument();
	});

	it('renders a bottom border on the content row when isLast is false', () => {
		render(
			<EntryRowLayout
				color='#4ade80'
				isLast={false}
				renderLeft={<span>left</span>}
				renderRight={<span>right</span>}
			/>,
		);

		const contentRow = screen.getByText('left').closest('.flex-1.flex');
		expect(contentRow).toHaveClass('border-b', 'border-white/5');
	});

	it('does not render a bottom border on the content row when isLast is true', () => {
		render(
			<EntryRowLayout
				color='#4ade80'
				isLast
				renderLeft={<span>left</span>}
				renderRight={<span>right</span>}
			/>,
		);

		const contentRow = screen.getByText('left').closest('.flex-1.flex');
		expect(contentRow).not.toHaveClass('border-b');
	});
});
