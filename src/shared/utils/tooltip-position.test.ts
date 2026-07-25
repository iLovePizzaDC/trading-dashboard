import { TOOLTIP_OFFSET, VIEWPORT_PADDING } from '@/shared/constants/tooltip';
import { describe, expect, it } from 'vitest';
import { calculateTooltipPosition } from '@/shared/utils/tooltip-position';

const viewport = { width: 1000, height: 800, scrollY: 0 };

function rect(overrides: Partial<Pick<DOMRect, 'top' | 'bottom' | 'left' | 'width' | 'height'>> = {}) {
  return { top: 100, bottom: 120, left: 450, width: 100, height: 20, ...overrides };
}

describe('calculateTooltipPosition', () => {
  it('places the tooltip below the anchor by default', () => {
    const position = calculateTooltipPosition(rect(), rect({ width: 120, height: 40 }), viewport);

    expect(position.placement).toBe('bottom');
    expect(position.top).toBe(120 + TOOLTIP_OFFSET);
    expect(position.left).toBe(500);
    expect(position.arrowLeft).toBe(60);
  });

  it('flips above when there is not enough space below', () => {
    const anchor = rect({ top: 750, bottom: 770 });
    const popup = rect({ width: 120, height: 100 });

    const position = calculateTooltipPosition(anchor, popup, viewport);

    expect(position.placement).toBe('top');
    expect(position.top).toBe(750 - 100 - TOOLTIP_OFFSET);
  });

  it('stays below when there is not enough space above either', () => {
    const anchor = rect({ top: 10, bottom: 30 });
    const popup = rect({ width: 120, height: 700 });
    const smallViewport = { width: 1000, height: 100, scrollY: 0 };

    const position = calculateTooltipPosition(anchor, popup, smallViewport);

    expect(position.placement).toBe('bottom');
  });

  it('shifts right when the tooltip would overflow on the left', () => {
    const anchor = rect({ left: 10, width: 20 }); // anchorCenterX = 20
    const popup = rect({ width: 200, height: 40 });

    const position = calculateTooltipPosition(anchor, popup, viewport);

    expect(position.left).toBe(VIEWPORT_PADDING + 100);
  });

  it('shifts left when the tooltip would overflow on the right', () => {
    const anchor = rect({ left: 950, width: 20 });
    const popup = rect({ width: 200, height: 40 });

    const position = calculateTooltipPosition(anchor, popup, viewport);

    expect(position.left).toBe(viewport.width - VIEWPORT_PADDING - 100);
  });

  it('keeps the arrow centered on the anchor after clamping', () => {
    const anchor = rect({ left: 10, width: 20 });
    const popup = rect({ width: 200, height: 40 });

    const position = calculateTooltipPosition(anchor, popup, viewport);

    expect(position.arrowLeft).toBe(20 - VIEWPORT_PADDING);
  });
});
