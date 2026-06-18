import { ROTATE_INTERVAL_MS } from '@/features/trades/constants/scatter-tooltip';
import type { ScatterPoint } from '@/features/trades/types/scatter';
import { useEffect, useState } from 'react';

export function useRotateSymbolName(scatterPoint: ScatterPoint | undefined) {
	const [showSectorName, setShowSectorName] = useState(true);

	useEffect(() => {
		if (!scatterPoint) return;

		setShowSectorName(true);
		const id = setInterval(() => {
			setShowSectorName((prev) => !prev);
		}, ROTATE_INTERVAL_MS);

		return () => clearInterval(id);
	}, [scatterPoint?.symbol]);

	return {
		showSectorName,
	};
}
