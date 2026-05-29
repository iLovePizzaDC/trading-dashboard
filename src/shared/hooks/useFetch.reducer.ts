import type { FetchAction, FetchState } from '@/shared/types/fetch-reducer';

export function fetchReducer<T>(state: FetchState<T>, action: FetchAction<T>): FetchState<T> {
	switch (action.type) {
		case 'fetch':
			return { ...state, loading: true, error: null };
		case 'success':
			return { data: action.payload, loading: false, error: null };
		case 'error':
			return { ...state, loading: false, error: action.payload };
	}
}

export const initialFetchState = { data: null, loading: true, error: null };
