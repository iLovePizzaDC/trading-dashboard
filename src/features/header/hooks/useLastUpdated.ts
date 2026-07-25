import { useDataVersion } from '@/shared/hooks/useDataVersion';
import { DateTime } from 'luxon';

export function useLastUpdated(): string | null {
	const version = useDataVersion();
	if (!version) return null;

	return DateTime.fromSeconds(parseInt(version), { zone: 'utc' })
		.setZone('Europe/Berlin')
		.toFormat('yyyy-MM-dd @ HH:mm:ss');
}
