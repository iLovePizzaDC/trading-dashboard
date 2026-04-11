import { getNYTime, isInRunWindow } from '@/features/header/utils/time-status-helper';
import { useMemo } from 'react';
import { MESSAGE_DAYS, REBALANCE_DAYS } from '../constants/status-dot';

export interface BotStatus {
	rebalanceDaysLeft: number;
	rebalanceNextDate: string;
	rebalancePct: number;
	messageDaysLeft: number;
	messageNextDate: string;
	messagePct: number;
	isRunning: boolean;
	ranToday: boolean;
}

export function useBotStatus(lastRebalance: string | null, dataVersion: string): BotStatus | null {
	return useMemo(() => {
		if (!lastRebalance) return null;

		const now = new Date();
		const { hours, minutes, todayNY } = getNYTime();
		const dow = now.getDay();
		const isWeekday = dow >= 1 && dow <= 5;

		const lastReb = new Date(lastRebalance.trim());
		const nextReb = new Date(lastReb.getTime() + REBALANCE_DAYS * 24 * 60 * 60 * 1000);
		const elapsedReb = Math.floor((now.getTime() - lastReb.getTime()) / (24 * 60 * 60 * 1000));

		const elapsedMsg = elapsedReb % 7;
		const nextMsg = new Date(now.getTime() + (MESSAGE_DAYS - elapsedMsg) * 24 * 60 * 60 * 1000);

		const versionDate = dataVersion.slice(0, 10);
		const ranToday = versionDate === todayNY;

		const isRunning = isWeekday && isInRunWindow(hours, minutes) && !ranToday;

		return {
			rebalanceDaysLeft: Math.max(
				0,
				Math.round((nextReb.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
			),
			rebalanceNextDate: nextReb.toISOString().split('T')[0],
			rebalancePct: Math.min(100, Math.round((elapsedReb / 30) * 100)),
			messageDaysLeft: Math.max(
				0,
				Math.round((nextMsg.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
			),
			messageNextDate: nextMsg.toISOString().split('T')[0],
			messagePct: Math.min(100, Math.round((elapsedMsg / 7) * 100)),
			isRunning,
			ranToday,
		};
	}, [lastRebalance, dataVersion]);
}
