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
