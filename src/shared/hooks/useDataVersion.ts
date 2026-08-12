import { useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 60_000;

async function fetchVersion(): Promise<string | null> {
	try {
		const res = await fetch('/data/last_updated.txt', { cache: 'no-store' });
		if (!res.ok) return null;
		const text = (await res.text()).trim();
		return text || null;
	} catch {
		return null;
	}
}

export function useDataVersion(): string | null {
	const [version, setVersion] = useState<string | null>(null);

	useEffect(() => {
		fetchVersion().then((latest) => {
			if (latest !== null) setVersion(latest);
		});

		const interval = setInterval(async () => {
			const latest = await fetchVersion();
			if (latest === null) return;
			setVersion((current) => (latest !== current ? latest : current));
		}, POLL_INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	return version;
}
