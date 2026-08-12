import { useDataVersionContext } from '@/shared/context/DataVersionContext';
import { fetchReducer, initialFetchState } from '@/shared/hooks/useFetch.reducer';
import { useEffect, useReducer, useRef } from 'react';

export function useFetch<T>(fetcher: (version: string) => Promise<T>) {
	const version = useDataVersionContext();
	const [state, dispatch] = useReducer(fetchReducer<T>, initialFetchState);
	const requestIdRef = useRef(0);

	useEffect(() => {
		if (!version) return;

		const requestId = ++requestIdRef.current;
		dispatch({ type: 'fetch' });

		fetcher(version)
			.then((data) => {
				if (requestId !== requestIdRef.current) return;
				dispatch({ type: 'success', payload: data });
			})
			.catch((error) => {
				if (requestId !== requestIdRef.current) return;
				dispatch({ type: 'error', payload: error });
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [version]);

	return state;
}
