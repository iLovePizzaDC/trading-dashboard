import StatCard from '@/features/header/components/atoms/StatCard';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/header/components/atoms/ProgressBar', () => ({
  default: ({
    value,
    color,
    animationDelay,
  }: {
    value: number;
    color?: string;
    animationDelay?: string;
  }) => (
    <div
      data-testid='progress-bar'
      data-value={value}
      data-color={color}
      data-animation-delay={animationDelay}
    />
  ),
}));

describe('<StatCard />', () => {
  it('renders label, value, and sub text', () => {
    render(<StatCard label='Rebalance' value='14 days' sub='next: 2026-07-20' progress={50} />);

    expect(screen.getByText('Rebalance')).toBeInTheDocument();
    expect(screen.getByText('14 days')).toBeInTheDocument();
    expect(screen.getByText('next: 2026-07-20')).toBeInTheDocument();
  });

  it('passes progress and color through to ProgressBar', () => {
    render(<StatCard label='Rebalance' value='14 days' sub='sub' progress={72} color='amber' />);

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('data-value', '72');
    expect(progressBar).toHaveAttribute('data-color', 'amber');
  });

  it('defaults color to green when not provided', () => {
    render(<StatCard label='Rebalance' value='14 days' sub='sub' progress={50} />);

    expect(screen.getByTestId('progress-bar')).toHaveAttribute('data-color', 'green');
  });

  it('is hidden (opacity-0, translated) when visible is false (default)', () => {
    const { container } = render(
      <StatCard label='Rebalance' value='14 days' sub='sub' progress={50} />,
    );

    expect(container.firstChild).toHaveClass('opacity-0', 'translate-y-1.5');
  });

  it('is shown (opacity-100, no translation) when visible is true', () => {
    const { container } = render(
      <StatCard label='Rebalance' value='14 days' sub='sub' progress={50} visible />,
    );

    expect(container.firstChild).toHaveClass('opacity-100', 'translate-y-0');
  });

  it('applies transitionDelay when visible is true', () => {
    const { container } = render(
      <StatCard label='Rebalance' value='14 days' sub='sub' progress={50} visible delay='250ms' />,
    );

    expect(container.firstChild).toHaveStyle({ transitionDelay: '250ms' });
  });

  it('forces transitionDelay to "0ms" when visible is false, even if delay is set', () => {
    const { container } = render(
      <StatCard
        label='Rebalance'
        value='14 days'
        sub='sub'
        progress={50}
        visible={false}
        delay='250ms'
      />,
    );

    expect(container.firstChild).toHaveStyle({ transitionDelay: '0ms' });
  });

  it('passes animationDelay to ProgressBar only when visible', () => {
    render(
      <StatCard label='Rebalance' value='14 days' sub='sub' progress={50} visible delay='250ms' />,
    );

    expect(screen.getByTestId('progress-bar')).toHaveAttribute('data-animation-delay', '250ms');
  });

  it('forces ProgressBar animationDelay to "0ms" when not visible', () => {
    render(
      <StatCard
        label='Rebalance'
        value='14 days'
        sub='sub'
        progress={50}
        visible={false}
        delay='250ms'
      />,
    );

    expect(screen.getByTestId('progress-bar')).toHaveAttribute('data-animation-delay', '0ms');
  });

  it('applies highlight styling (pulse animation, brighter border) when highlight is true', () => {
    const { container } = render(
      <StatCard label='Rebalance' value='14 days' sub='sub' progress={50} highlight />,
    );

    expect(container.firstChild).toHaveClass('border-white/20', 'bg-white/6');
  });

  it('applies default (non-highlight) styling when highlight is false', () => {
    const { container } = render(
      <StatCard label='Rebalance' value='14 days' sub='sub' progress={50} highlight={false} />,
    );

    expect(container.firstChild).toHaveClass('border-white/6', 'bg-white/3');
  });

  it('applies brighter text classes to label, value, and sub when highlight is true', () => {
    render(<StatCard label='Rebalance' value='14 days' sub='sub text' progress={50} highlight />);

    expect(screen.getByText('Rebalance')).toHaveClass('text-white/40');
    expect(screen.getByText('14 days')).toHaveClass('text-white/90');
    expect(screen.getByText('sub text')).toHaveClass('text-white/30');
  });

  it('applies dimmer text classes to label, value, and sub when highlight is false', () => {
    render(
      <StatCard label='Rebalance' value='14 days' sub='sub text' progress={50} highlight={false} />,
    );

    expect(screen.getByText('Rebalance')).toHaveClass('text-white/20');
    expect(screen.getByText('14 days')).toHaveClass('text-white/60');
    expect(screen.getByText('sub text')).toHaveClass('text-white/15');
  });
});
