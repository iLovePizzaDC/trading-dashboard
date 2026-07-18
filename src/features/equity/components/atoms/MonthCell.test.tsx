import MonthCell from '@/features/equity/components/atoms/MonthCell';
import type { MonthlyReturn } from '@/features/equity/types/heatmap';
import { getMonthCellColor } from '@/features/equity/utils/month-cell';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/equity/utils/month-cell', () => ({
  getMonthCellColor: vi.fn(() => 'bg-green-500/20'),
}));

function buildEntry(overrides: Partial<MonthlyReturn> = {}): MonthlyReturn {
  return {
    month: 7,
    year: 2026,
    return: 5,
    startEquity: 10000,
    endEquity: 10500,
    ...overrides,
  } as MonthlyReturn;
}

describe('<MonthCell />', () => {
  it('renders a button', () => {
    render(<MonthCell entry={buildEntry()} onClick={vi.fn()} selected={false} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<MonthCell entry={buildEntry()} onClick={onClick} selected={false} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('sets the title with year, zero-padded month, and a plus sign for a positive return', () => {
    render(
      <MonthCell
        entry={buildEntry({ year: 2026, month: 7, return: 5.5 })}
        onClick={vi.fn()}
        selected={false}
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute('title', '2026-07: +5.50%');
  });

  it('sets the title without a plus sign for a negative return', () => {
    render(
      <MonthCell
        entry={buildEntry({ year: 2026, month: 3, return: -2.5 })}
        onClick={vi.fn()}
        selected={false}
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute('title', '2026-03: -2.50%');
  });

  it('sets the title with a plus sign for a return of exactly 0', () => {
    render(
      <MonthCell
        entry={buildEntry({ year: 2026, month: 1, return: 0 })}
        onClick={vi.fn()}
        selected={false}
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute('title', '2026-01: +0.00%');
  });

  it('zero-pads single-digit months', () => {
    render(<MonthCell entry={buildEntry({ month: 9 })} onClick={vi.fn()} selected={false} />);

    expect(screen.getByRole('button').title).toMatch(/^\d{4}-09:/);
  });

  it('applies the class returned by getMonthCellColor', () => {
    vi.mocked(getMonthCellColor).mockReturnValue('bg-red-500/40');

    render(<MonthCell entry={buildEntry()} onClick={vi.fn()} selected={false} />);

    expect(screen.getByRole('button')).toHaveClass('bg-red-500/40');
  });

  it('does not apply selected styles when selected is false', () => {
    render(<MonthCell entry={buildEntry()} onClick={vi.fn()} selected={false} />);

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('scale-105');
    expect(button).not.toHaveClass('ring-1');
  });

  it('applies scale and green ring styles when selected and return is positive', () => {
    render(<MonthCell entry={buildEntry({ return: 5 })} onClick={vi.fn()} selected />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('scale-105', 'z-10', 'ring-1', 'ring-green-400/40');
  });

  it('applies scale and red ring styles when selected and return is negative', () => {
    render(<MonthCell entry={buildEntry({ return: -5 })} onClick={vi.fn()} selected />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('scale-105', 'z-10', 'ring-1', 'ring-red-400/40');
  });

  it('applies a green shadow when selected and return is exactly 0', () => {
    render(<MonthCell entry={buildEntry({ return: 0 })} onClick={vi.fn()} selected />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('ring-green-400/40');
  });
});
