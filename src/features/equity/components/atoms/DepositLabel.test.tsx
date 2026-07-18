import DepositLabel from '@/features/equity/components/atoms/DepositLabel';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function renderInSvg(ui: React.ReactElement) {
  return render(<svg>{ui}</svg>);
}

describe('<DepositLabel />', () => {
  it('renders nothing when viewBox is undefined', () => {
    renderInSvg(<DepositLabel value={100} />);

    expect(screen.queryByTestId('deposit-rect')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deposit-text')).not.toBeInTheDocument();
  });

  it('renders nothing when viewBox.x is undefined', () => {
    renderInSvg(<DepositLabel viewBox={{ y: 20 }} value={100} />);

    expect(screen.queryByTestId('deposit-rect')).not.toBeInTheDocument();
  });

  it('renders nothing when viewBox.x is null', () => {
    renderInSvg(<DepositLabel viewBox={{ x: null as unknown as number }} value={100} />);

    expect(screen.queryByTestId('deposit-rect')).not.toBeInTheDocument();
  });

  it('renders the rect and text when viewBox.x is present', () => {
    renderInSvg(<DepositLabel viewBox={{ x: 50 }} value={100} />);

    expect(screen.getByTestId('deposit-rect')).toBeInTheDocument();
    expect(screen.getByTestId('deposit-text')).toBeInTheDocument();
  });

  it('renders when viewBox.x is 0 (falsy but valid)', () => {
    renderInSvg(<DepositLabel viewBox={{ x: 0 }} value={100} />);

    expect(screen.getByTestId('deposit-rect')).toBeInTheDocument();
  });

  it('positions the rect relative to viewBox.x with a fixed offset of 6', () => {
    renderInSvg(<DepositLabel viewBox={{ x: 50 }} value={100} />);

    expect(screen.getByTestId('deposit-rect')).toHaveAttribute('x', '56');
  });

  it('positions the text relative to viewBox.x with a fixed offset of 10', () => {
    renderInSvg(<DepositLabel viewBox={{ x: 50 }} value={100} />);

    expect(screen.getByTestId('deposit-text')).toHaveAttribute('x', '60');
  });

  it('always positions the rect at a fixed y of 8', () => {
    renderInSvg(<DepositLabel viewBox={{ x: 50, y: 999 }} value={100} />);

    expect(screen.getByTestId('deposit-rect')).toHaveAttribute('y', '8');
  });

  it('always positions the text at a fixed y of 19 (y + 11)', () => {
    renderInSvg(<DepositLabel viewBox={{ x: 50, y: 999 }} value={100} />);

    expect(screen.getByTestId('deposit-text')).toHaveAttribute('y', '19');
  });

  it('renders the rect with fixed dimensions and rounded corners', () => {
    renderInSvg(<DepositLabel viewBox={{ x: 50 }} value={100} />);

    const rect = screen.getByTestId('deposit-rect');
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
    renderInSvg(<DepositLabel viewBox={{ x: 50 }} />);

    const text = screen.getByTestId('deposit-text');
    expect(text).toBeInTheDocument();
    expect(text).toBeEmptyDOMElement();
  });
});
