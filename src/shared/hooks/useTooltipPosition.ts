import { calculateTooltipPosition } from '@/shared/utils/tooltip-position';
import type { TooltipPosition } from '@/shared/types/tooltip';
import { useLayoutEffect, useState, type RefObject } from 'react';

const INITIAL_POSITION: TooltipPosition = {
	top: 0,
	left: 0,
	placement: 'bottom',
	arrowLeft: 0,
};

export function useTooltipPosition(
	open: boolean,
	anchorRef: RefObject<HTMLElement | null>,
	popupRef: RefObject<HTMLElement | null>,
) {
	const [position, setPosition] = useState<TooltipPosition>(INITIAL_POSITION);

	useLayoutEffect(() => {
		if (!open || !anchorRef.current || !popupRef.current) return;

		function updatePosition() {
			if (!anchorRef.current || !popupRef.current) return;

			setPosition(
				calculateTooltipPosition(
					anchorRef.current.getBoundingClientRect(),
					popupRef.current.getBoundingClientRect(),
					{
						width: window.innerWidth,
						height: window.innerHeight,
						scrollY: window.scrollY,
					},
				),
			);
		}

		updatePosition();

		window.addEventListener('scroll', updatePosition, true);
		window.addEventListener('resize', updatePosition);

		return () => {
			window.removeEventListener('scroll', updatePosition, true);
			window.removeEventListener('resize', updatePosition);
		};
	}, [open, anchorRef, popupRef]);

	return position;
}
