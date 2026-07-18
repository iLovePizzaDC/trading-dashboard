import DownloadDropdown from '@/features/header/components/molecules/DownloadDropdown';
import { DOWNLOADS } from '@/features/header/constants/download-dropdown';
import { downloadFile } from '@/features/header/utils/download-dropdown';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/header/utils/download-dropdown', () => ({
  downloadFile: vi.fn(),
}));

vi.mock('@/shared/components/atoms/Dropdown', () => ({
  default: ({ trigger, items, width }: any) => (
    <div data-testid='dropdown' data-width={width}>
      <div data-testid='trigger'>{trigger}</div>
      {items.map((item: any) => (
        <button key={item.key} data-testid='dropdown-item' onClick={item.onClick}>
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

describe('<DownloadDropdown />', () => {
  it('renders the export trigger label', () => {
    render(<DownloadDropdown />);

    expect(screen.getByText('export')).toBeInTheDocument();
  });

  it('passes width "w-36" to Dropdown', () => {
    render(<DownloadDropdown />);

    expect(screen.getByTestId('dropdown')).toHaveAttribute('data-width', 'w-36');
  });

  it('renders an item for each entry in DOWNLOADS', () => {
    render(<DownloadDropdown />);

    expect(screen.getAllByTestId('dropdown-item')).toHaveLength(7);
    expect(screen.getByText('equity')).toBeInTheDocument();
    expect(screen.getByText('trades')).toBeInTheDocument();
    expect(screen.getByText('decisions')).toBeInTheDocument();
    expect(screen.getByText('regime')).toBeInTheDocument();
    expect(screen.getByText('stops')).toBeInTheDocument();
    expect(screen.getByText('SPY')).toBeInTheDocument();
  });

  it('calls downloadFile with the correct filename when an item is clicked', () => {
    render(<DownloadDropdown />);

    screen.getByText('trades').click();

    expect(downloadFile).toHaveBeenCalledWith('live_trades.json');
  });

  it('calls downloadFile with a different filename for a different item', () => {
    render(<DownloadDropdown />);

    screen.getByText('decisions').click();

    expect(downloadFile).toHaveBeenCalledWith('decisions_log.json');
  });

  it('uses the file name as the item key', () => {
    render(<DownloadDropdown />);

    const items = screen.getAllByTestId('dropdown-item');
    expect(items).toHaveLength(DOWNLOADS.length);
  });
});
