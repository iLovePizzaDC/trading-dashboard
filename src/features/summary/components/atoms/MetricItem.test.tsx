import MetricItem from '@/features/summary/components/atoms/MetricItem';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<MetricItem />', () => {
  it('renders the label and value', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' />);

    expect(screen.getByText('Total P&L')).toBeInTheDocument();
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  it('renders a ReactNode value (not just strings)', () => {
    render(<MetricItem label='Status' value={<span data-testid='custom-value'>Active</span>} />);

    expect(screen.getByTestId('custom-value')).toBeInTheDocument();
  });

  it('does not render a sub text when sub is not provided', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' />);

    expect(screen.queryByText(/vs/)).not.toBeInTheDocument();
  });

  it('renders sub text when provided', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' sub='vs $1,000 last month' />);

    expect(screen.getByText('vs $1,000 last month')).toBeInTheDocument();
  });

  it('uses neutral (white) color for the value when positive is undefined', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' />);

    expect(screen.getByText('$1,234.56')).toHaveClass('text-white');
  });

  it('uses green color for the value when positive is true', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' positive />);

    expect(screen.getByText('$1,234.56')).toHaveClass('text-green-400');
  });

  it('uses red color for the value when positive is false', () => {
    render(<MetricItem label='Total P&L' value='-$500.00' positive={false} />);

    expect(screen.getByText('-$500.00')).toHaveClass('text-red-400');
  });

  it('uses neutral (white/40) color for the sub text when positive is undefined', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' sub='details' />);

    expect(screen.getByText('details')).toHaveClass('text-white/40');
  });

  it('uses green color for the sub text when positive is true', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' sub='details' positive />);

    expect(screen.getByText('details')).toHaveClass('text-green-300/80');
  });

  it('uses red color for the sub text when positive is false', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' sub='details' positive={false} />);

    expect(screen.getByText('details')).toHaveClass('text-red-300/80');
  });

  it('applies the featured glow style when featured is true', () => {
    const { container } = render(<MetricItem label='Total P&L' value='$1,234.56' featured />);

    expect(container.firstChild).toHaveClass('shadow-[0_0_20px_rgba(255,255,255,0.05)]');
  });

  it('does not apply the featured glow style when featured is false or omitted', () => {
    const { container } = render(<MetricItem label='Total P&L' value='$1,234.56' />);

    expect(container.firstChild).not.toHaveClass('shadow-[0_0_20px_rgba(255,255,255,0.05)]');
  });

  it('uses the smaller text size (text-2xl) by default', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' />);

    expect(screen.getByText('$1,234.56')).toHaveClass('text-2xl');
  });

  it('uses the larger text size (text-3xl) when large is true', () => {
    render(<MetricItem label='Total P&L' value='$1,234.56' large />);

    expect(screen.getByText('$1,234.56')).toHaveClass('text-3xl');
  });
});
