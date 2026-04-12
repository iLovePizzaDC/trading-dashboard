import { RUN_END, RUN_START } from '@/features/header/constants/status-dot';

export function getNYTime(): { hours: number; minutes: number; todayNY: string } {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/New_York',
		hour: 'numeric',
		minute: 'numeric',
		hour12: false,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});

	const parts = formatter.formatToParts(new Date());
	const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';

	return {
		hours: parseInt(get('hour'), 10),
		minutes: parseInt(get('minute'), 10),
		todayNY: `${get('year')}-${get('month')}-${get('day')}`,
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
	return new Date(iso).toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'Europe/Berlin',
	});
}

export function getBotRunTimeDE(): string {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/New_York',
		timeZoneName: 'shortOffset',
	}).formatToParts(new Date());

	const offsetLabel = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
	const isEDT = offsetLabel === 'GMT-4';

	return isEDT ? '22:30' : '21:30';
}

export function formatNextOpen(iso: string): string {
	const weekday = getWeekdayShort(new Date(iso));
	return `opens ${weekday} ${formatAsBerlinTime(iso)}`;
}

export function getWeekdayShort(date: Date = new Date()): string {
	return date
		.toLocaleDateString('en-US', {
			weekday: 'short',
			timeZone: 'Europe/Berlin',
		})
		.toLowerCase();
}
