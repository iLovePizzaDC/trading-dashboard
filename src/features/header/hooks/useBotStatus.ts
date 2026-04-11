import { useMemo } from 'react';

export function useBotStatus(lastRebalance: string | null) {
	return useMemo(() => {
		if (!lastRebalance) return null;

		const now = new Date();
		const lastReb = new Date(lastRebalance.trim());
		const nextReb = new Date(lastReb.getTime() + 30 * 24 * 60 * 60 * 1000);
		const elapsedReb = Math.floor((now.getTime() - lastReb.getTime()) / (24 * 60 * 60 * 1000));

		const elapsedTg = elapsedReb % 7;
		const nextTg = new Date(now.getTime() + (7 - elapsedTg) * 24 * 60 * 60 * 1000);

		return {
			rebalanceDaysLeft: Math.max(
				0,
				Math.round((nextReb.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
			),
			rebalanceNextDate: nextReb.toISOString().split('T')[0],
			rebalancePct: Math.min(100, Math.round((elapsedReb / 30) * 100)),
			messageDaysLeft: Math.max(
				0,
				Math.round((nextTg.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
			),
			messageNextDate: nextTg.toISOString().split('T')[0],
			messagePct: Math.min(100, Math.round((elapsedTg / 7) * 100)),
		};
	}, [lastRebalance]);
}
