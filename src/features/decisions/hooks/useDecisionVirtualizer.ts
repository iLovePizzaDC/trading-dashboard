'use no memo';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { RefObject } from 'react';

export function useDecisionVirtualizer(
	count: number,
	parentRef: RefObject<HTMLDivElement | null>,
	rowHeight: number,
) {
	// eslint-disable-next-line react-hooks/incompatible-library
	return useVirtualizer({
		count,
		getScrollElement: () => parentRef.current,
		estimateSize: () => rowHeight,
		overscan: 6,
	});
}
