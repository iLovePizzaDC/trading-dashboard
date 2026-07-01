import { ROTATE_INTERVAL_MS } from '@/features/trades/constants/scatter-tooltip';
import { SECTOR_MAP } from '@/shared/constants/sectors';
import { useEffect, useState } from 'react';

export function useRotateSectorName(symbol: string | undefined) {
	const sectorName = symbol ? SECTOR_MAP[symbol] : undefined;
	const labels = symbol === undefined ? [] : sectorName ? [sectorName, symbol] : [symbol];

	const [index, setIndex] = useState(0);
	const [visible, setVisible] = useState(true);
	const [prevSymbol, setPrevSymbol] = useState(symbol);

	if (symbol !== prevSymbol) {
		setPrevSymbol(symbol);
		setIndex(0);
		setVisible(true);
	}

	useEffect(() => {
		if (labels.length < 2) return;

		let timeoutId: ReturnType<typeof setTimeout>;

		const intervalId = setInterval(() => {
			setVisible(false);
			timeoutId = setTimeout(() => {
				setIndex((prev) => (prev + 1) % labels.length);
				setVisible(true);
			}, 250);
		}, ROTATE_INTERVAL_MS);

		return () => {
			clearInterval(intervalId);
			clearTimeout(timeoutId);
		};
	}, [symbol, labels.length]);

	return {
		displayName: labels[index],
		visible,
	};
}
