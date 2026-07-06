import Card from '@/shared/components/atoms/Card';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<Card />', () => {
	it('renders children', () => {
		render(
			<Card>
				<p>card content</p>
			</Card>,
		);

		expect(screen.getByText('card content')).toBeInTheDocument();
	});

	it('renders the title when provided', () => {
		render(
			<Card title='my title'>
				<p>content</p>
			</Card>,
		);

		expect(screen.getByText('my title')).toBeInTheDocument();
	});

	it('does not render the title section when title is omitted', () => {
		render(
			<Card>
				<p>content</p>
			</Card>,
		);

		expect(screen.queryByTestId('title-section')).not.toBeInTheDocument();
	});

	it('does not render the title section when title is an empty string', () => {
		render(
			<Card title=''>
				<p>content</p>
			</Card>,
		);

		expect(screen.queryByTestId('title-section')).not.toBeInTheDocument();
	});

	it('renders the badge when both title and badge are provided', () => {
		render(
			<Card title='my title' badge={<span>my badge</span>}>
				<p>content</p>
			</Card>,
		);

		expect(screen.getByText('my badge')).toBeInTheDocument();
	});

	it('does not render the badge when badge is omitted', () => {
		render(
			<Card title='my title'>
				<p>content</p>
			</Card>,
		);

		expect(screen.queryByText('my badge')).not.toBeInTheDocument();
	});

	it('does not render the badge when title is omitted, even if badge is provided', () => {
		render(
			<Card badge={<span>my badge</span>}>
				<p>content</p>
			</Card>,
		);

		expect(screen.queryByText('my badge')).not.toBeInTheDocument();
	});

	it('applies a custom className alongside the default classes', () => {
		const { container } = render(
			<Card className='custom-class'>
				<p>content</p>
			</Card>,
		);

		expect(container.firstChild).toHaveClass('custom-class', 'rounded-xl', 'border-white/10');
	});

	it('does not throw and applies no extra class when className is omitted', () => {
		const { container } = render(
			<Card>
				<p>content</p>
			</Card>,
		);

		expect(container.firstChild).toHaveClass('rounded-xl');
	});
});
