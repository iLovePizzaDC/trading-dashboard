import { useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 60_000;

async function fetchVersion(): Promise<string> {
	try {
		const res = await fetch('/data/last_updated.txt', { cache: 'no-store' });
		if (!res.ok) return '';
		return (await res.text()).trim();
	} catch {
		return '';
	}
}

export function useDataVersion(): string | null {
	const [version, setVersion] = useState<string | null>(null);

	useEffect(() => {
		fetchVersion().then(setVersion);

		const interval = setInterval(async () => {
			const latest = await fetchVersion();
			setVersion((current) => (latest !== current ? latest : current));
		}, POLL_INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	return version;
}
