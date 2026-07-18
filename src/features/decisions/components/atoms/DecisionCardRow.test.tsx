import DecisionCardRow from '@/features/decisions/components/atoms/DecisionCardRow';
import { STOP_REASON_LABEL } from '@/features/trades/constants/trades-card';
import type { Candidate } from '@/shared/types/decisions';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/components/atoms/Tooltip', () => ({
  default: ({ children, content }: { children: React.ReactNode; content: string }) => (
    <span data-testid='tooltip' data-content={content}>
      {children}
    </span>
  ),
}));

function buildCandidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    symbol: 'XLK',
    momentum: 0.153,
    passes_trend: true,
    selected: true,
    rejected_reason: null,
    ...overrides,
  } as Candidate;
}

describe('<DecisionCardRow />', () => {
  it('renders the symbol with a tooltip when a sector name exists', () => {
    render(<DecisionCardRow candidate={buildCandidate({ symbol: 'XLK' })} />);

    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-content', 'Technology');
    expect(tooltip).toHaveTextContent('XLK');
  });

  it('renders the symbol without a tooltip when no sector name exists', () => {
    render(<DecisionCardRow candidate={buildCandidate({ symbol: 'ZZZ' })} />);

    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    expect(screen.getByText('ZZZ')).toBeInTheDocument();
  });

  it('formats and displays the momentum percentage', () => {
    render(<DecisionCardRow candidate={buildCandidate({ momentum: 0.1534 })} />);

    expect(screen.getByText('15.3%')).toBeInTheDocument();
  });

  it('shows a dash when momentum is null', () => {
    render(<DecisionCardRow candidate={buildCandidate({ momentum: null })} />);

    expect(screen.getByText('—%')).toBeInTheDocument();
  });

  it('sets the title attribute to the raw momentum value', () => {
    render(<DecisionCardRow candidate={buildCandidate({ momentum: 0.1534 })} />);

    expect(screen.getByText('15.3%')).toHaveAttribute('title', '0.1534');
  });

  it('does not set a title attribute when momentum is null', () => {
    render(<DecisionCardRow candidate={buildCandidate({ momentum: null })} />);

    expect(screen.getByText('—%')).not.toHaveAttribute('title');
  });

  it('caps the bar width at 100% when momentum exceeds 1', () => {
    render(<DecisionCardRow candidate={buildCandidate({ momentum: 2.5 })} />);

    expect(screen.getByTestId('decision-progress-bar')).toHaveStyle({ width: '100%' });
  });

  it('sets the bar width proportionally to momentum when under 100%', () => {
    render(<DecisionCardRow candidate={buildCandidate({ momentum: 0.3 })} />);

    expect(screen.getByTestId('decision-progress-bar')).toHaveStyle({ width: '30%' });
  });

  it('sets the bar width to 0% when momentum is null', () => {
    render(<DecisionCardRow candidate={buildCandidate({ momentum: null })} />);

    expect(screen.getByTestId('decision-progress-bar')).toHaveStyle({ width: '0%' });
  });

  it('colors the bar green when the candidate is selected', () => {
    render(<DecisionCardRow candidate={buildCandidate({ selected: true, passes_trend: true })} />);

    expect(screen.getByTestId('decision-progress-bar')).toHaveClass('bg-green-400');
  });

  it('colors the bar red when the candidate fails the trend check', () => {
    render(
      <DecisionCardRow candidate={buildCandidate({ selected: false, passes_trend: false })} />,
    );

    expect(screen.getByTestId('decision-progress-bar')).toHaveClass('bg-red-400');
  });

  it('colors the bar neutral when not selected but passing the trend check', () => {
    render(<DecisionCardRow candidate={buildCandidate({ selected: false, passes_trend: true })} />);

    expect(screen.getByTestId('decision-progress-bar')).toHaveClass('bg-white/15');
  });

  it('shows "selected" when the candidate is selected', () => {
    render(<DecisionCardRow candidate={buildCandidate({ selected: true })} />);

    expect(screen.getByText('selected')).toBeInTheDocument();
  });

  it('maps every known rejected_reason key correctly', () => {
    Object.entries(STOP_REASON_LABEL).forEach(([reason, label]) => {
      const { unmount } = render(
        <DecisionCardRow
          candidate={buildCandidate({ selected: false, rejected_reason: reason })}
        />,
      );
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('falls back to the raw rejected_reason when it is not in the label mapping', () => {
    render(
      <DecisionCardRow
        candidate={buildCandidate({ selected: false, rejected_reason: 'unknown_reason' })}
      />,
    );

    expect(screen.getByText('unknown_reason')).toBeInTheDocument();
  });

  it('shows a dash when not selected and no rejected_reason is present', () => {
    render(
      <DecisionCardRow candidate={buildCandidate({ selected: false, rejected_reason: null })} />,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders a bottom border when isLast is false (default)', () => {
    const { container } = render(<DecisionCardRow candidate={buildCandidate()} />);

    expect(container.firstChild).toHaveClass('border-b', 'border-white/5');
  });

  it('does not render a bottom border when isLast is true', () => {
    const { container } = render(<DecisionCardRow candidate={buildCandidate()} isLast />);

    expect(container.firstChild).not.toHaveClass('border-b');
  });
});
