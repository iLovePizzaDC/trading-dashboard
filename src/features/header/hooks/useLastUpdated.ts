import { useVersion } from '@/shared/context/DataVersionContext';

export function useLastUpdated(): string | null {
	const version = useVersion();
	if (!version) return null;

	const date = new Date(parseInt(version) * 1000);
	const datePart = date.toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });
	const timePart = date.toLocaleTimeString('en-GB', {
		timeZone: 'Europe/Berlin',
		hour: '2-digit',
		minute: '2-digit',
	});

	return `${datePart} @ ${timePart}`;
}
