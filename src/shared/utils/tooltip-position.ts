import { TOOLTIP_OFFSET, VIEWPORT_PADDING, type TooltipPlacement } from '@/shared/constants/tooltip';
import type { Rect, TooltipPosition, Viewport } from '@/shared/types/tooltip';

export function calculateTooltipPosition(
  anchorRect: Rect,
  popupRect: Rect,
  viewport: Viewport,
): TooltipPosition {
  const anchorCenterX = anchorRect.left + anchorRect.width / 2;

  let left = anchorCenterX;
  let top = anchorRect.bottom + TOOLTIP_OFFSET + viewport.scrollY;
  let placement: TooltipPlacement = 'bottom';

  const tooltipRight = left + popupRect.width / 2;
  if (tooltipRight > viewport.width - VIEWPORT_PADDING) {
    left -= tooltipRight - (viewport.width - VIEWPORT_PADDING);
  }

  const tooltipLeft = left - popupRect.width / 2;
  if (tooltipLeft < VIEWPORT_PADDING) {
    left += VIEWPORT_PADDING - tooltipLeft;
  }

  const spaceBelow = viewport.height - anchorRect.bottom;
  const spaceAbove = anchorRect.top;

  if (
    spaceBelow < popupRect.height + TOOLTIP_OFFSET &&
    spaceAbove >= popupRect.height + TOOLTIP_OFFSET
  ) {
    placement = 'top';
    top = anchorRect.top - popupRect.height - TOOLTIP_OFFSET + viewport.scrollY;
  }

  const finalTooltipLeft = left - popupRect.width / 2;
  const arrowLeft = anchorCenterX - finalTooltipLeft;

  return { top, left, placement, arrowLeft };
}
