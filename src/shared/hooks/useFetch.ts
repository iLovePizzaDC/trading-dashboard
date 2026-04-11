import { useVersion } from '@/shared/context/DataVersionContext';
import { useEffect, useState } from 'react';

export function useFetch<T>(fetcher: (version: string) => Promise<T>) {
	const version = useVersion();
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!version) return;
		setLoading(true);
		setError(null);
		fetcher(version)
			.then(setData)
			.catch(setError)
			.finally(() => setLoading(false));
	}, [version]);

	return { data, loading, error };
}
