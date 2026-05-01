import { BOT_START_TIME_NY, RUN_END, RUN_START } from '@/shared/constants/bot';
import { DateTime } from 'luxon';

export function getNYTime() {
	const now = DateTime.now().setZone('America/New_York');

	return {
		hours: now.hour,
		minutes: now.minute,
		todayNY: now.toFormat('yyyy-MM-dd'),
	};
}

export function isInRunWindow(hours: number, minutes: number): boolean {
	const totalMinutes = hours * 60 + minutes;
	return (
		totalMinutes >= RUN_START.hours * 60 + RUN_START.minutes &&
		totalMinutes <= RUN_END.hours * 60 + RUN_END.minutes
	);
}

export function formatAsBerlinTime(iso: string): string {
	const dt = DateTime.fromISO(iso, { setZone: true });

	if (!dt.isValid) return '—';

	return dt.setZone('Europe/Berlin').toFormat('HH:mm');
}

export function getBotRunTimeDE() {
	return DateTime.fromObject(BOT_START_TIME_NY, { zone: 'America/New_York' })
		.setZone('Europe/Berlin')
		.toFormat('HH:mm');
}

export function formatNextOpen(iso: string): string {
	const dt = DateTime.fromISO(iso, { setZone: true });

	if (!dt.isValid) return '—';

	const berlin = dt.setZone('Europe/Berlin');

	return `opens ${berlin.toFormat('ccc').toLowerCase()} ${berlin.toFormat('HH:mm')}`;
}

export function getWeekdayNow(): string {
	return DateTime.now().setZone('Europe/Berlin').toFormat('ccc').toLowerCase();
}

export function getWeekdayFromISO(iso: string): string {
	const dt = DateTime.fromISO(iso, { setZone: true });

	if (!dt.isValid) return '—';

	return dt.setZone('Europe/Berlin').toFormat('ccc').toLowerCase();
}
