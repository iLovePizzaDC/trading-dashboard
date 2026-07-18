import MomentumError from '@/features/momentum/components/molecules/MomentumError';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<MomentumError />', () => {
  it('renders the title and error message', () => {
    render(<MomentumError />);

    expect(screen.getByText('momentum timeline')).toBeInTheDocument();
    expect(screen.getByText('Could not load momentum data')).toBeInTheDocument();
    expect(screen.getByText('Check if data is available or try again later.')).toBeInTheDocument();
  });

  it('renders an em-dash placeholder for the missing value', () => {
    render(<MomentumError />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('styles the card with a red/error border', () => {
    const { container } = render(<MomentumError />);

    expect(container.firstChild).toHaveClass('border-red-500/30');
  });
});
