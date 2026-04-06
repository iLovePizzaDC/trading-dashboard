import { useEffect, useState } from 'react';

export function useAnimatedNumber(value: number, decimals = 2) {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		let animationId: number;
		const startValue = displayValue;
		const diff = value - startValue;
		const duration = 700;
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			setDisplayValue(startValue + diff * progress);

			if (progress < 1) {
				animationId = requestAnimationFrame(animate);
			}
		};

		animate();
		return () => cancelAnimationFrame(animationId);
	}, [value]);

	return displayValue.toFixed(decimals);
}
