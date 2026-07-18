import TabButton from '@/features/summary/components/atoms/TabButton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('<TabButton />', () => {
  it('renders the label', () => {
    render(
      <TabButton tab='overview' label='Overview' activeTab='overview' handleTabChange={vi.fn()} />,
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('applies the active style when tab matches activeTab', () => {
    render(
      <TabButton tab='overview' label='Overview' activeTab='overview' handleTabChange={vi.fn()} />,
    );

    expect(screen.getByRole('button')).toHaveClass('text-purple-400');
  });

  it('applies the inactive style when tab does not match activeTab', () => {
    render(
      <TabButton
        tab='overview'
        label='Overview'
        activeTab='performance'
        handleTabChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button')).toHaveClass('text-white/60');
    expect(screen.getByRole('button')).not.toHaveClass('text-purple-400');
  });

  it('calls handleTabChange with the tab value when clicked', async () => {
    const user = userEvent.setup();
    const handleTabChange = vi.fn();

    render(
      <TabButton
        tab='performance'
        label='Performance'
        activeTab='overview'
        handleTabChange={handleTabChange}
      />,
    );

    await user.click(screen.getByRole('button'));

    expect(handleTabChange).toHaveBeenCalledWith('performance');
  });

  it('calls handleTabChange even when the tab is already active', async () => {
    const user = userEvent.setup();
    const handleTabChange = vi.fn();

    render(
      <TabButton
        tab='overview'
        label='Overview'
        activeTab='overview'
        handleTabChange={handleTabChange}
      />,
    );

    await user.click(screen.getByRole('button'));

    expect(handleTabChange).toHaveBeenCalledWith('overview');
  });
});
