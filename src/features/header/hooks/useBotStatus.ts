import { REBALANCE_DAYS } from '@/features/header/constants/status-dot';
import type { BotStatus } from '@/features/header/types/bot-status';
import { getNYTime, isInRunWindow } from '@/features/header/utils/time-helper';
import type { MarketStatus } from '@/shared/types/market.status';
import { useMemo } from 'react';

export function useBotStatus(
	lastRebalance: string | null,
	marketStatus: MarketStatus | null,
	dataVersion: string | null,
): BotStatus | null {
	return useMemo(() => {
		if (!lastRebalance || !dataVersion) return null;

		const now = new Date();
		const { hours, minutes, todayNY } = getNYTime();

		const lastReb = new Date(lastRebalance.trim());
		const nextReb = new Date(lastReb.getTime() + REBALANCE_DAYS * 24 * 60 * 60 * 1000);
		const elapsedReb = Math.floor((now.getTime() - lastReb.getTime()) / (24 * 60 * 60 * 1000));

		const versionDate = dataVersion.slice(0, 10);
		const ranToday = versionDate === todayNY;

		const isTradingDay = marketStatus?.is_trading_day ?? false;
		const isRunning = isTradingDay && isInRunWindow(hours, minutes) && !ranToday;

		return {
			rebalanceDaysLeft: Math.max(
				0,
				Math.round((nextReb.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
			),
			rebalanceNextDate: nextReb.toISOString().split('T')[0],
			rebalancePct: Math.min(100, Math.round((elapsedReb / 30) * 100)),
			isRunning,
			ranToday,
			isTradingDay,
		};
	}, [lastRebalance, marketStatus, dataVersion]);
}
