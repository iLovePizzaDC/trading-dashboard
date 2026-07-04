import DepositLabel from '@/features/equity/components/atoms/DepositLabel';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function renderInSvg(ui: React.ReactElement) {
	return render(<svg>{ui}</svg>);
}

describe('<DepositLabel />', () => {
	it('renders nothing when viewBox is undefined', () => {
		const { container } = renderInSvg(<DepositLabel value={100} />);

		expect(container.querySelector('rect')).not.toBeInTheDocument();
		expect(container.querySelector('text')).not.toBeInTheDocument();
	});

	it('renders nothing when viewBox.x is undefined', () => {
		const { container } = renderInSvg(<DepositLabel viewBox={{ y: 20 }} value={100} />);

		expect(container.querySelector('rect')).not.toBeInTheDocument();
	});

	it('renders nothing when viewBox.x is null', () => {
		const { container } = renderInSvg(
			<DepositLabel viewBox={{ x: null as unknown as number }} value={100} />,
		);

		expect(container.querySelector('rect')).not.toBeInTheDocument();
	});

	it('renders the rect and text when viewBox.x is present', () => {
		const { container } = renderInSvg(<DepositLabel viewBox={{ x: 50 }} value={100} />);

		expect(container.querySelector('rect')).toBeInTheDocument();
		expect(container.querySelector('text')).toBeInTheDocument();
	});

	it('renders when viewBox.x is 0 (falsy but valid)', () => {
		const { container } = renderInSvg(<DepositLabel viewBox={{ x: 0 }} value={100} />);

		expect(container.querySelector('rect')).toBeInTheDocument();
	});

	it('positions the rect relative to viewBox.x with a fixed offset of 6', () => {
		const { container } = renderInSvg(<DepositLabel viewBox={{ x: 50 }} value={100} />);

		const rect = container.querySelector('rect');
		expect(rect).toHaveAttribute('x', '56');
	});

	it('positions the text relative to viewBox.x with a fixed offset of 10', () => {
		const { container } = renderInSvg(<DepositLabel viewBox={{ x: 50 }} value={100} />);

		const text = container.querySelector('text');
		expect(text).toHaveAttribute('x', '60');
	});

	it('always positions the rect at a fixed y of 8', () => {
		const { container } = renderInSvg(<DepositLabel viewBox={{ x: 50, y: 999 }} value={100} />);

		const rect = container.querySelector('rect');
		expect(rect).toHaveAttribute('y', '8');
	});

	it('always positions the text at a fixed y of 19 (y + 11)', () => {
		const { container } = renderInSvg(<DepositLabel viewBox={{ x: 50, y: 999 }} value={100} />);

		const text = container.querySelector('text');
		expect(text).toHaveAttribute('y', '19');
	});

	it('renders the rect with fixed dimensions and rounded corners', () => {
		const { container } = renderInSvg(<DepositLabel viewBox={{ x: 50 }} value={100} />);

		const rect = container.querySelector('rect');
		expect(rect).toHaveAttribute('width', '64');
		expect(rect).toHaveAttribute('height', '16');
		expect(rect).toHaveAttribute('rx', '4');
	});

	it('displays a numeric value inside the text element', () => {
		renderInSvg(<DepositLabel viewBox={{ x: 50 }} value={1234} />);

		expect(screen.getByText('1234')).toBeInTheDocument();
	});

	it('displays a string value inside the text element', () => {
		renderInSvg(<DepositLabel viewBox={{ x: 50 }} value='$1,234' />);

		expect(screen.getByText('$1,234')).toBeInTheDocument();
	});

	it('renders an empty text element when value is undefined', () => {
		const { container } = renderInSvg(<DepositLabel viewBox={{ x: 50 }} />);

		const text = container.querySelector('text');
		expect(text).toBeInTheDocument();
		expect(text).toBeEmptyDOMElement();
	});
});
