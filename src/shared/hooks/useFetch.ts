import { useEffect, useState } from 'react';

export function useFetch<T>(fetcher: () => Promise<T>) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		fetcher()
			.then(setData)
			.catch(setError)
			.finally(() => setLoading(false));
	}, []);

	return { data, loading, error };
}
