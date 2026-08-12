import type { BotStatus } from '@/features/header/types/bot-status';
import { nextBusinessDay } from '@/features/header/utils/time-helper';
import { REBALANCE_DAYS, RUN_END, RUN_START } from '@/shared/constants/bot';
import type { MarketStatus } from '@/shared/types/market.status';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';

const CLOCK_TICK_MS = 30_000;

function resolveIsTradingDay(marketStatus: MarketStatus | null, nowNY: DateTime): boolean {
	if (!marketStatus) return false;

	if (marketStatus.is_trading_day != null) {
		return marketStatus.is_trading_day;
	}

	const nextOpen = marketStatus.next_open
		? DateTime.fromISO(marketStatus.next_open, { setZone: true }).setZone('America/New_York')
		: null;
	const nextClose = marketStatus.next_close
		? DateTime.fromISO(marketStatus.next_close, { setZone: true }).setZone('America/New_York')
		: null;

	return (nextOpen?.hasSame(nowNY, 'day') ?? false) || (nextClose?.hasSame(nowNY, 'day') ?? false);
}

export function useBotStatus(
	lastRebalance: string | null,
	marketStatus: MarketStatus | null,
	dataVersion: string | null,
): BotStatus | null {
	const [nowMs, setNowMs] = useState(() => Date.now());

	useEffect(() => {
		const id = setInterval(() => setNowMs(Date.now()), CLOCK_TICK_MS);
		return () => clearInterval(id);
	}, []);

	return useMemo(() => {
		if (!lastRebalance || !dataVersion) return null;

		const nowNY = DateTime.fromMillis(nowMs).setZone('America/New_York');
		const nowUTC = DateTime.fromMillis(nowMs).toUTC();
		const nowDE = DateTime.fromMillis(nowMs).setZone('Europe/Berlin');

		const lastReb = DateTime.fromISO(lastRebalance.trim(), { zone: 'utc' });
		const nextReb = nextBusinessDay(lastReb.plus({ days: REBALANCE_DAYS }));

		const elapsedReb = Math.floor(nowUTC.diff(lastReb, 'days').days);

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

		const isTradingDay = resolveIsTradingDay(marketStatus, nowNY);

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
	}, [lastRebalance, marketStatus, dataVersion, nowMs]);
}
