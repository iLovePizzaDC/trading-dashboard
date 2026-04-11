export function getStatusCard(
	isRunning: boolean,
	ranToday: boolean,
	isWeekday: boolean,
	dayName: string,
): { value: string; sub: string; progress: number; color: 'green' | 'amber' | 'blue' } {
	if (isRunning) {
		return { value: 'running now', sub: 'started at 16:30 ny', progress: 100, color: 'green' };
	}
	if (ranToday) {
		return { value: `${dayName} — done`, sub: 'ran at 16:30 ny', progress: 100, color: 'green' };
	}
	if (isWeekday) {
		return {
			value: `${dayName} — active`,
			sub: 'runs at 16:30 ny',
			progress: ((new Date().getDay() - 1) / 4) * 100,
			color: 'green',
		};
	}
	return { value: `${dayName} — resting`, sub: 'resumes monday', progress: 100, color: 'amber' };
}
