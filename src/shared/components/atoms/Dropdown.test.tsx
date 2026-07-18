import Dropdown from '@/shared/components/atoms/Dropdown';
import type { DropdownItem } from '@/shared/constants/dropdown';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

function buildItems(overrides: Partial<DropdownItem>[] = []): DropdownItem[] {
  const defaults: DropdownItem[] = [
    { key: 'a', label: 'Option A', onClick: vi.fn() },
    { key: 'b', label: 'Option B', onClick: vi.fn() },
  ];

  if (overrides.length === 0) return defaults;

  return overrides.map((o, i) => ({ ...defaults[i], ...o }));
}

describe('<Dropdown />', () => {
  it('renders the trigger content', () => {
    render(<Dropdown trigger='Filter' items={buildItems()} />);

    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('does not show the menu initially', () => {
    render(<Dropdown trigger='Filter' items={buildItems()} />);

    expect(screen.queryByText('Option A')).not.toBeInTheDocument();
  });

  it('opens the menu when the trigger is clicked', async () => {
    const user = userEvent.setup();

    render(<Dropdown trigger='Filter' items={buildItems()} />);

    await user.click(screen.getByRole('button', { name: /Filter/ }));

    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('closes the menu when the trigger is clicked again', async () => {
    const user = userEvent.setup();

    render(<Dropdown trigger='Filter' items={buildItems()} />);

    const triggerButton = screen.getByRole('button', { name: /Filter/ });
    await user.click(triggerButton);
    await user.click(triggerButton);

    expect(screen.queryByText('Option A')).not.toBeInTheDocument();
  });

  it('calls the item onClick handler when an item is clicked', async () => {
    const user = userEvent.setup();
    const onClickA = vi.fn();
    const items = buildItems([{ onClick: onClickA }, {}]);

    render(<Dropdown trigger='Filter' items={items} />);

    await user.click(screen.getByRole('button', { name: /Filter/ }));
    await user.click(screen.getByText('Option A'));

    expect(onClickA).toHaveBeenCalledTimes(1);
  });

  it('closes the menu after an item is clicked', async () => {
    const user = userEvent.setup();

    render(<Dropdown trigger='Filter' items={buildItems()} />);

    await user.click(screen.getByRole('button', { name: /Filter/ }));
    await user.click(screen.getByText('Option A'));

    expect(screen.queryByText('Option A')).not.toBeInTheDocument();
  });

  it('closes the menu when clicking outside', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Dropdown trigger='Filter' items={buildItems()} />
        <button>outside</button>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: /Filter/ }));
    expect(screen.getByText('Option A')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'outside' }));

    expect(screen.queryByText('Option A')).not.toBeInTheDocument();
  });

  it('does not close the menu when clicking inside it', async () => {
    const user = userEvent.setup();

    render(<Dropdown trigger='Filter' items={buildItems()} />);

    await user.click(screen.getByRole('button', { name: /Filter/ }));
    await user.click(screen.getByText('Option B'));

    expect(screen.queryByText('Option A')).not.toBeInTheDocument();
  });

  it('renders an icon when provided on an item', async () => {
    const user = userEvent.setup();
    const items = buildItems([{ icon: <span data-testid='icon-a'>icon</span> }, {}]);

    render(<Dropdown trigger='Filter' items={items} />);

    await user.click(screen.getByRole('button', { name: /Filter/ }));

    expect(screen.getByTestId('icon-a')).toBeInTheDocument();
  });

  it('applies active styling to items marked as active', async () => {
    const user = userEvent.setup();
    const items = buildItems([{ active: true }, { active: false }]);

    render(<Dropdown trigger='Filter' items={items} />);

    await user.click(screen.getByRole('button', { name: /Filter/ }));

    expect(screen.getByText('Option A')).toHaveClass('text-white/70');
    expect(screen.getByText('Option B')).toHaveClass('text-white/40');
  });

  it('uses the default width class "w-36" when width is not provided', async () => {
    const user = userEvent.setup();

    render(<Dropdown trigger='Filter' items={buildItems()} />);

    await user.click(screen.getByRole('button', { name: /Filter/ }));

    expect(screen.getByText('Option A').closest('.w-36')).toBeInTheDocument();
  });

  it('applies a custom width class when provided', async () => {
    const user = userEvent.setup();

    render(<Dropdown trigger='Filter' items={buildItems()} width='w-32' />);

    await user.click(screen.getByRole('button', { name: /Filter/ }));

    expect(screen.getByText('Option A').closest('.w-32')).toBeInTheDocument();
  });

  it('rotates the chevron icon when open', async () => {
    const user = userEvent.setup();

    render(<Dropdown trigger='Filter' items={buildItems()} />);

    const chevron = screen.getByTestId('dropdown-chevron');
    expect(chevron).toHaveStyle({ transform: 'rotate(0deg)' });

    await user.click(screen.getByRole('button', { name: /Filter/ }));

    expect(chevron).toHaveStyle({ transform: 'rotate(180deg)' });
  });

  it('renders no items when the items array is empty', async () => {
    const user = userEvent.setup();

    render(<Dropdown trigger='Filter' items={[]} />);

    await user.click(screen.getByRole('button', { name: /Filter/ }));

    expect(screen.getByTestId('dropdown-menu').children).toHaveLength(0);
  });
});
