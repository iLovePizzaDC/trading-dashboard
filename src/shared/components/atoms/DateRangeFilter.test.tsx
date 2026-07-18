import DateRangeFilter from '@/shared/components/atoms/DateRangeFilter';
import { RANGES } from '@/shared/constants/date-range';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('<DateRangeFilter />', () => {
  it('renders a button for every range in RANGES', () => {
    render(<DateRangeFilter range='3M' setRange={vi.fn()} />);

    RANGES.forEach((r) => {
      expect(screen.getByRole('button', { name: r })).toBeInTheDocument();
    });
  });

  it('highlights the currently selected range', () => {
    render(<DateRangeFilter range='3M' setRange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '3M' })).toHaveClass('bg-white/15', 'text-white');
  });

  it('does not highlight non-selected ranges', () => {
    render(<DateRangeFilter range='3M' setRange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '1M' })).toHaveClass('text-white/35');
    expect(screen.getByRole('button', { name: '3M' })).not.toHaveClass('text-white/35');
  });

  it('calls setRange with the clicked range', async () => {
    const user = userEvent.setup();
    const setRange = vi.fn();

    render(<DateRangeFilter range='3M' setRange={setRange} />);

    await user.click(screen.getByRole('button', { name: 'YTD' }));

    expect(setRange).toHaveBeenCalledWith('YTD');
  });

  it('does not call setRange when clicking the already-selected range', async () => {
    const user = userEvent.setup();
    const setRange = vi.fn();

    render(<DateRangeFilter range='3M' setRange={setRange} />);

    await user.click(screen.getByRole('button', { name: '3M' }));

    expect(setRange).toHaveBeenCalledWith('3M');
  });

  it('excludes ranges listed in excludedRanges', () => {
    render(<DateRangeFilter range='3M' setRange={vi.fn()} excludedRanges={['1W', 'ALL']} />);

    expect(screen.queryByRole('button', { name: '1W' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ALL' })).not.toBeInTheDocument();
  });

  it('renders all ranges when excludedRanges is not provided', () => {
    render(<DateRangeFilter range='3M' setRange={vi.fn()} />);

    expect(screen.getAllByRole('button')).toHaveLength(RANGES.length);
  });

  it('renders all ranges when excludedRanges is an empty array', () => {
    render(<DateRangeFilter range='3M' setRange={vi.fn()} excludedRanges={[]} />);

    expect(screen.getAllByRole('button')).toHaveLength(RANGES.length);
  });

  it('renders no buttons when all ranges are excluded', () => {
    render(<DateRangeFilter range='3M' setRange={vi.fn()} excludedRanges={[...RANGES]} />);

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('still calls setRange correctly for the remaining ranges after exclusion', async () => {
    const user = userEvent.setup();
    const setRange = vi.fn();

    render(<DateRangeFilter range='3M' setRange={setRange} excludedRanges={['1W']} />);

    await user.click(screen.getByRole('button', { name: '6M' }));

    expect(setRange).toHaveBeenCalledWith('6M');
  });
});
