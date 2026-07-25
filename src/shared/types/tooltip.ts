import type { TooltipPlacement } from '@/shared/constants/tooltip';

export type Rect = Pick<DOMRect, 'top' | 'bottom' | 'left' | 'width' | 'height'>;

export type Viewport = {
	width: number;
	height: number;
	scrollY: number;
};

export type TooltipPosition = {
	top: number;
	left: number;
	placement: TooltipPlacement;
	arrowLeft: number;
};
