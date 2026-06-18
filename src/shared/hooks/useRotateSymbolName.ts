import { ROTATE_INTERVAL_MS } from '@/features/trades/constants/scatter-tooltip';
import { SECTOR_MAP } from '@/shared/constants/sectors';
import { useEffect, useState } from 'react';

export function useRotateSectorName(symbol: string) {
	const sectorName = SECTOR_MAP[symbol];
	const labels = sectorName ? [sectorName, symbol] : [symbol];

	const [index, setIndex] = useState(0);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		setIndex(0);
		setVisible(true);

		if (labels.length < 2) return;

		const id = setInterval(() => {
			setVisible(false);
			setTimeout(() => {
				setIndex((prev) => (prev + 1) % labels.length);
				setVisible(true);
			}, 300);
		}, ROTATE_INTERVAL_MS);

		return () => clearInterval(id);
	}, [symbol]);

	return {
		displayName: labels[index],
		visible,
	};
}
