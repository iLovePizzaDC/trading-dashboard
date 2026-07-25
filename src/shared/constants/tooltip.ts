import type { TooltipPosition } from '@/shared/types/tooltip';

export type TooltipPlacement = 'top' | 'bottom';

export const VIEWPORT_PADDING = 8;
export const TOOLTIP_OFFSET = 4;

export const INITIAL_POSITION: TooltipPosition = {
	top: 0,
	left: 0,
	placement: 'bottom',
	arrowLeft: 0,
};
