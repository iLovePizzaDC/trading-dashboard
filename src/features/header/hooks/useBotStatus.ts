import type { BotStatus } from '@/features/header/types/bot-status';
import type { MarketStatus } from '@/shared/types/market.status';
import { REBALANCE_DAYS, RUN_END, RUN_START } from '@/shared/utils/bot';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

export function useBotStatus(
	lastRebalance: string | null,
	marketStatus: MarketStatus | null,
	dataVersion: string | null,
): BotStatus | null {
	return useMemo(() => {
		if (!lastRebalance || !dataVersion) return null;

		const nowNY = DateTime.now().setZone('America/New_York');
		const nowUTC = DateTime.now().toUTC();

		const lastReb = DateTime.fromISO(lastRebalance.trim(), { zone: 'utc' });
		const nextReb = lastReb.plus({ days: REBALANCE_DAYS });

		const elapsedReb = Math.floor(nowUTC.diff(lastReb, 'days').days);

		const todayNY = nowNY.toFormat('yyyy-MM-dd');
		const versionDate = dataVersion.slice(0, 10);
		const ranToday = versionDate === todayNY;

		const nextOpen = marketStatus?.next_open
			? DateTime.fromISO(marketStatus.next_open, { setZone: true })
			: null;

		const nextClose = marketStatus?.next_close
			? DateTime.fromISO(marketStatus.next_close, { setZone: true })
			: null;

		const isTradingDay =
			nextOpen !== null &&
			nextClose !== null &&
			nextOpen.setZone('America/New_York').hasSame(nowNY, 'day');

		const minutesNow = nowNY.hour * 60 + nowNY.minute;

		const isRunning =
			isTradingDay &&
			minutesNow >= RUN_START.hours * 60 + RUN_START.minutes &&
			minutesNow <= RUN_END.hours * 60 + RUN_END.minutes &&
			!ranToday;

		const marketIsOpen =
			isTradingDay &&
			nextOpen !== null &&
			nextClose !== null &&
			nowUTC >= nextOpen &&
			nowUTC < nextClose;

		return {
			rebalanceDaysLeft: Math.max(0, Math.round(nextReb.diff(nowUTC, 'days').days)),
			rebalanceNextDate: nextReb.toFormat('yyyy-MM-dd'),
			rebalancePct: Math.min(100, Math.round((elapsedReb / REBALANCE_DAYS) * 100)),
			isRunning,
			ranToday,
			isTradingDay,
			marketIsOpen,
		};
	}, [lastRebalance, marketStatus, dataVersion]);
}
