import type { BotStatus } from '@/features/header/types/bot-status';
import { nextBusinessDay } from '@/features/header/utils/time-helper';
import { REBALANCE_DAYS, RUN_END, RUN_START, BOT_START_TIME_NY } from '@/shared/constants/bot';
import type { MarketStatus } from '@/shared/types/market.status';
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

		const scheduledRunNY = nowNY.set({
			hour: BOT_START_TIME_NY.hour,
			minute: BOT_START_TIME_NY.minute,
			second: 0,
			millisecond: 0,
		});

		const lastReb = DateTime.fromISO(lastRebalance.trim(), { zone: 'utc' });
		const nextReb = nextBusinessDay(lastReb.plus({ days: REBALANCE_DAYS }));

		const elapsedReb = Math.floor(nowUTC.diff(lastReb, 'days').days);

		const nowDE = DateTime.now().setZone('Europe/Berlin');
		const todayDE = nowDE.toFormat('yyyy-MM-dd');

		const versionDateDE = DateTime.fromSeconds(Number(dataVersion))
			.setZone('Europe/Berlin')
			.toFormat('yyyy-MM-dd');

		const ranToday = versionDateDE === todayDE;

		const nextOpen = marketStatus?.next_open
			? DateTime.fromISO(marketStatus.next_open, { setZone: true })
			: null;

		const nextClose = marketStatus?.next_close
			? DateTime.fromISO(marketStatus.next_close, { setZone: true })
			: null;

		const scheduledRunDE = scheduledRunNY.setZone('Europe/Berlin');

		const marketNextOpenMatchesRunNY =
			nextOpen !== null && nextOpen.setZone('America/New_York').hasSame(scheduledRunNY, 'day');

		const isTradingDay =
			nextOpen !== null &&
			nextClose !== null &&
			marketNextOpenMatchesRunNY &&
			scheduledRunDE.hasSame(nowDE, 'day');

		const minutesNow = nowNY.hour * 60 + nowNY.minute;

		const isRunning =
			isTradingDay &&
			minutesNow >= RUN_START.hours * 60 + RUN_START.minutes &&
			minutesNow <= RUN_END.hours * 60 + RUN_END.minutes &&
			!ranToday;

		const marketIsOpen =
			nextOpen !== null && nextClose !== null && nowUTC >= nextOpen && nowUTC < nextClose;

		return {
			rebalanceDaysLeft: Math.max(
				0,
				Math.ceil(nextReb.startOf('day').diff(nowUTC.startOf('day'), 'days').days),
			),
			rebalanceNextDate: nextReb.setZone('Europe/Berlin').toFormat('yyyy-MM-dd'),
			rebalancePct: Math.min(100, Math.round((elapsedReb / REBALANCE_DAYS) * 100)),
			isRunning,
			ranToday,
			isTradingDay,
			marketIsOpen,
		};
	}, [lastRebalance, marketStatus, dataVersion]);
}
