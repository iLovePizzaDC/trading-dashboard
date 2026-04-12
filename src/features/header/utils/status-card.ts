import { getBotRunTimeDE, getWeekdayShort } from '@/features/header/utils/time-helper';

export function getStatusCard(
	isRunning: boolean,
	ranToday: boolean,
	isTradingDay: boolean,
): { value: string; sub: string; progress: number; color: 'green' | 'amber' | 'blue' } {
	const runTime = getBotRunTimeDE();
	const day = getWeekdayShort();

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
	const nyNow = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
	const now = new Date(nyNow);
	const elapsed = now.getHours() * 60 + now.getMinutes() - OPEN_MINUTES;
	return Math.min(100, Math.max(0, Math.round((elapsed / TOTAL_MINUTES) * 100)));
}
