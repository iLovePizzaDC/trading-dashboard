import SectorError from '@/features/sector/components/molecules/SectorError';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<SectorError />', () => {
  it('renders the title and error message', () => {
    render(<SectorError />);

    expect(screen.getByText('sector breakdown')).toBeInTheDocument();
    expect(screen.getByText('Could not load sector data')).toBeInTheDocument();
    expect(screen.getByText('Check if data is available or try again later.')).toBeInTheDocument();
  });

  it('renders an em-dash placeholder for the missing value', () => {
    render(<SectorError />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('styles the card with a red/error border', () => {
    const { container } = render(<SectorError />);

    expect(container.firstChild).toHaveClass('border-red-500/30');
  });
});
