import { ROTATE_INTERVAL_MS } from '@/features/trades/constants/scatter-tooltip';
import type { ScatterPoint } from '@/features/trades/types/scatter';
import { useEffect, useState } from 'react';

export function useRotateSymbolName(scatterPoint: ScatterPoint | undefined) {
	const [showSectorName, setShowSectorName] = useState(true);
	const [lastSymbol, setLastSymbol] = useState(scatterPoint?.symbol);

	if (scatterPoint?.symbol !== lastSymbol) {
		setLastSymbol(scatterPoint?.symbol);
		setShowSectorName(true);
	}

	useEffect(() => {
		if (!scatterPoint) return;

		const id = setInterval(() => {
			setShowSectorName((prev) => !prev);
		}, ROTATE_INTERVAL_MS);

		return () => clearInterval(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scatterPoint?.symbol]);

	return {
		showSectorName,
	};
}
