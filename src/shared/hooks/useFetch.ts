import { useDataVersion } from '@/shared/hooks/useDataVersion';
import { fetchReducer, initialFetchState } from '@/shared/hooks/useFetch.reducer';
import { useEffect, useReducer } from 'react';

export function useFetch<T>(fetcher: (version: string) => Promise<T>) {
  const version = useDataVersion();
  const [state, dispatch] = useReducer(fetchReducer<T>, initialFetchState);

  useEffect(() => {
    if (version === null) return;
    dispatch({ type: 'fetch' });
    fetcher(version)
      .then((data) => dispatch({ type: 'success', payload: data }))
      .catch((error) => dispatch({ type: 'error', payload: error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  return state;
}
