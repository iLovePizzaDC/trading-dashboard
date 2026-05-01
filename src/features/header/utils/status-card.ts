import { getBotRunTimeDE, getWeekdayNow } from '@/features/header/utils/time-helper';
import { DateTime } from 'luxon';

export function getStatusCard(
	isRunning: boolean,
	ranToday: boolean,
	isTradingDay: boolean,
): { value: string; sub: string; progress: number; color: 'green' | 'amber' | 'blue' } {
	const runTime = getBotRunTimeDE();
	const day = getWeekdayNow();

	if (isRunning) {
		return { value: 'running now', sub: `started at ${runTime}`, progress: 100, color: 'green' };
	}
	if (ranToday) {
		return { value: `${day} — done`, sub: `ran at ${runTime}`, progress: 100, color: 'green' };
	}
	if (isTradingDay) {
		return {
			value: `${day} — active`,
			sub: `runs at ${runTime}`,
			progress: 0,
			color: 'green',
		};
	}
	return {
		value: `${day} — resting`,
		sub: `resumes mon ${runTime}`,
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
