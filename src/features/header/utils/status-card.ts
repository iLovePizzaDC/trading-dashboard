import {
	getBotRunTimeDE,
	getBotRunWeekday,
	getRunWeekdayFromISO,
} from '@/features/header/utils/time-helper';
import { DateTime } from 'luxon';

export function getStatusCard(
	isRunning: boolean,
	ranToday: boolean,
	isTradingDay: boolean,
	nextOpen: string | null,
): { value: string; sub: string; progress: number; color: 'green' | 'amber' | 'blue' } {
	const runTime = getBotRunTimeDE();
	const berlinToday = DateTime.now().setZone('Europe/Berlin').toFormat('ccc').toLowerCase();
	const nextRunDay = nextOpen ? getRunWeekdayFromISO(nextOpen) : getBotRunWeekday();

	if (isRunning) {
		return { value: 'running now', sub: `started at ${runTime}`, progress: 100, color: 'green' };
	}
	if (ranToday) {
		return {
			value: `${berlinToday} — done`,
			sub: `ran at ${runTime}`,
			progress: 100,
			color: 'green',
		};
	}
	if (isTradingDay) {
		return {
			value: `${berlinToday} — active`,
			sub: `runs at ${runTime}`,
			progress: 0,
			color: 'green',
		};
	}
	return {
		value: `${berlinToday} — resting`,
		sub: `resumes ${nextRunDay} ${runTime}`,
		color: 'amber',
		progress: 100,
	};
}

export function getTradingDayProgress(): number {
	const OPEN_MINUTES = 9 * 60 + 30;
	const TOTAL_MINUTES = 6 * 60 + 30;

	const nowNY = DateTime.now().setZone('America/New_York');

	const minutesNow = nowNY.hour * 60 + nowNY.minute;
	const elapsed = minutesNow - OPEN_MINUTES;

	return Math.min(100, Math.max(0, Math.round((elapsed / TOTAL_MINUTES) * 100)));
}
