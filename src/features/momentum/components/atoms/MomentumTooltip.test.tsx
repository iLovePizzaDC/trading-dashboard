import type { ChartPoint } from '@/features/equity/types/equity';
import MomentumTooltip from '@/features/momentum/components/atoms/MomentumTooltip';
import type { PayloadItem } from '@/features/momentum/types/momentum';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function buildChartPoint(overrides: Partial<ChartPoint> = {}): ChartPoint {
  return {
    date: '2026-07-04',
    equity: 100,
    spy: null,
    ...overrides,
  } as ChartPoint;
}

function buildPayloadItem(overrides: Partial<PayloadItem> = {}): PayloadItem {
  return {
    name: 'avgMomentum',
    value: 12.345,
    color: '#4ade80',
    payload: buildChartPoint(),
    ...overrides,
  } as PayloadItem;
}

describe('<MomentumTooltip />', () => {
  it('renders nothing when active is false', () => {
    const { container } = render(<MomentumTooltip active={false} payload={[buildPayloadItem()]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when payload is undefined', () => {
    const { container } = render(<MomentumTooltip active />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when payload is an empty array', () => {
    const { container } = render(<MomentumTooltip active payload={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the tooltip when active and payload has items', () => {
    render(<MomentumTooltip active payload={[buildPayloadItem()]} />);

    expect(screen.getByText(/avgMomentum/)).toBeInTheDocument();
  });

  it('formats the date from the first payload item', () => {
    render(
      <MomentumTooltip
        active
        payload={[buildPayloadItem({ payload: buildChartPoint({ date: '2026-03-15' }) })]}
      />,
    );

    expect(screen.getByText('15 Mar 2026')).toBeInTheDocument();
  });

  it('renders an empty date paragraph when no date is present', () => {
    render(
      <MomentumTooltip
        active
        payload={[
          buildPayloadItem({
            payload: { equity: 100, spy: null } as unknown as ChartPoint,
          }),
        ]}
      />,
    );

    expect(screen.getByTestId('momentum-date-paragraph')).toBeEmptyDOMElement();
  });

  it('renders one line per payload entry with name and formatted value', () => {
    render(
      <MomentumTooltip
        active
        payload={[
          buildPayloadItem({ name: 'avgMomentum', value: 12.345 }),
          buildPayloadItem({ name: 'topMomentum', value: 34.567 }),
        ]}
      />,
    );

    expect(screen.getByText('avgMomentum: 12.3%')).toBeInTheDocument();
    expect(screen.getByText('topMomentum: 34.6%')).toBeInTheDocument();
  });

  it('rounds the value to one decimal place', () => {
    render(<MomentumTooltip active payload={[buildPayloadItem({ name: 'x', value: 12.96 })]} />);

    expect(screen.getByText('x: 13.0%')).toBeInTheDocument();
  });

  it('applies the color from the payload item as inline style', () => {
    render(
      <MomentumTooltip
        active
        payload={[buildPayloadItem({ name: 'avgMomentum', color: '#f87171' })]}
      />,
    );

    expect(screen.getByText(/avgMomentum/)).toHaveStyle({ color: '#f87171' });
  });

  it('renders a negative value correctly', () => {
    render(<MomentumTooltip active payload={[buildPayloadItem({ name: 'x', value: -5.5 })]} />);

    expect(screen.getByText('x: -5.5%')).toBeInTheDocument();
  });
});
