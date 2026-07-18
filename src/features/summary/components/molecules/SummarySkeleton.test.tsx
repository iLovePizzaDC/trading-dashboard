import SummarySkeleton from '@/features/summary/components/molecules/SummarySkeleton';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/summary/components/layouts/SummaryCardsShell', () => ({
  default: ({ activeTab, children }: any) => (
    <div data-testid='shell' data-active-tab={activeTab}>
      {children}
    </div>
  ),
}));

vi.mock('@/shared/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

describe('<SummarySkeleton />', () => {
  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReset();
    vi.mocked(useLocalStorage).mockReturnValue(['overview', vi.fn(), vi.fn()]);
  });

  it('passes the activeTab from useLocalStorage to SummaryCardsShell', () => {
    vi.mocked(useLocalStorage).mockReturnValue(['capital', vi.fn(), vi.fn()]);

    render(<SummarySkeleton />);

    expect(screen.getByTestId('shell')).toHaveAttribute('data-active-tab', 'capital');
  });

  it('renders the large hero card with 3 skeleton boxes', () => {
    render(<SummarySkeleton />);

    const heroCard = screen.getByTestId('hero-card-large');
    expect(within(heroCard).getAllByTestId('summary-skeleton-box')).toHaveLength(3);
  });

  it('renders the small hero card with 3 skeleton boxes', () => {
    render(<SummarySkeleton />);

    const heroCard = screen.getByTestId('hero-card-small');
    expect(within(heroCard).getAllByTestId('summary-skeleton-box')).toHaveLength(3);
  });

  it('renders 6 metric card placeholders inside the shell', () => {
    render(<SummarySkeleton />);

    expect(screen.getAllByTestId('metric-card-placeholder')).toHaveLength(6);
  });

  it('renders 3 skeleton boxes inside each metric card placeholder', () => {
    render(<SummarySkeleton />);

    screen.getAllByTestId('metric-card-placeholder').forEach((card) => {
      expect(within(card).getAllByTestId('summary-skeleton-box')).toHaveLength(3);
    });
  });

  it('renders a total of 24 skeleton boxes', () => {
    render(<SummarySkeleton />);

    expect(screen.getAllByTestId('summary-skeleton-box')).toHaveLength(24);
  });
});
