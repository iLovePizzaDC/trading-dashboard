import ShowMoreButton from '@/shared/components/atoms/ShowMoreButton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('<ShowMoreButton />', () => {
  it('shows the hidden count when not expanded', () => {
    render(<ShowMoreButton toggle={vi.fn()} expanded={false} hiddenCount={5} />);

    expect(screen.getByText('5 more')).toBeInTheDocument();
  });

  it('shows "show less" when expanded', () => {
    render(<ShowMoreButton toggle={vi.fn()} expanded hiddenCount={5} />);

    expect(screen.getByText('show less')).toBeInTheDocument();
  });

  it('calls toggle when clicked', async () => {
    const user = userEvent.setup();
    const toggle = vi.fn();

    render(<ShowMoreButton toggle={toggle} expanded={false} hiddenCount={5} />);

    await user.click(screen.getByRole('button'));

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('rotates the chevron down (0deg) when not expanded', () => {
    render(<ShowMoreButton toggle={vi.fn()} expanded={false} hiddenCount={5} />);

    expect(screen.getByTestId('show-more-chevron')).toHaveClass('rotate-0');
  });

  it('rotates the chevron up (180deg) when expanded', () => {
    render(<ShowMoreButton toggle={vi.fn()} expanded hiddenCount={5} />);

    expect(screen.getByTestId('show-more-chevron')).toHaveClass('rotate-180');
  });

  it('displays a hiddenCount of 0 when provided', () => {
    render(<ShowMoreButton toggle={vi.fn()} expanded={false} hiddenCount={0} />);

    expect(screen.getByText('0 more')).toBeInTheDocument();
  });

  it('ignores hiddenCount when expanded is true', () => {
    render(<ShowMoreButton toggle={vi.fn()} expanded hiddenCount={5} />);

    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });
});
