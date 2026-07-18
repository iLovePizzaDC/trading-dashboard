import { fetchReducer, initialFetchState } from '@/shared/hooks/useFetch.reducer';
import type { FetchAction, FetchState } from '@/shared/types/fetch-reducer';
import { describe, expect, it } from 'vitest';

describe('initialFetchState', () => {
  it('starts with data null, loading true, and error null', () => {
    expect(initialFetchState).toEqual({ data: null, loading: true, error: null });
  });
});

describe('fetchReducer', () => {
  describe('"fetch" action', () => {
    it('sets loading to true and clears the error', () => {
      const state: FetchState<string> = { data: null, loading: false, error: new Error('old') };
      const action: FetchAction<string> = { type: 'fetch' };

      const result = fetchReducer(state, action);

      expect(result).toEqual({ data: null, loading: true, error: null });
    });

    it('preserves existing data while fetching', () => {
      const state: FetchState<string> = { data: 'previous', loading: false, error: null };
      const action: FetchAction<string> = { type: 'fetch' };

      const result = fetchReducer(state, action);

      expect(result.data).toBe('previous');
    });
  });

  describe('"success" action', () => {
    it('sets data to the payload, loading to false, and clears the error', () => {
      const state: FetchState<string> = { data: null, loading: true, error: new Error('old') };
      const action: FetchAction<string> = { type: 'success', payload: 'new data' };

      const result = fetchReducer(state, action);

      expect(result).toEqual({ data: 'new data', loading: false, error: null });
    });

    it('discards any other fields from the previous state (full replacement)', () => {
      const state = {
        data: 'old',
        loading: true,
        error: null,
        extraField: 'should be gone',
      } as unknown as FetchState<string>;
      const action: FetchAction<string> = { type: 'success', payload: 'new' };

      const result = fetchReducer(state, action);

      expect(result).not.toHaveProperty('extraField');
    });

    it('replaces existing data with the new payload, even if payload is falsy', () => {
      const state: FetchState<number> = { data: 5, loading: true, error: null };
      const action: FetchAction<number> = { type: 'success', payload: 0 };

      const result = fetchReducer(state, action);

      expect(result.data).toBe(0);
    });
  });

  describe('"error" action', () => {
    it('sets error to the payload and loading to false', () => {
      const state: FetchState<string> = { data: null, loading: true, error: null };
      const error = new Error('failed');
      const action: FetchAction<string> = { type: 'error', payload: error };

      const result = fetchReducer(state, action);

      expect(result).toEqual({ data: null, loading: false, error });
    });

    it('preserves existing data when an error occurs (stale-while-error)', () => {
      const state: FetchState<string> = { data: 'stale data', loading: true, error: null };
      const error = new Error('failed');
      const action: FetchAction<string> = { type: 'error', payload: error };

      const result = fetchReducer(state, action);

      expect(result.data).toBe('stale data');
    });
  });

  describe('immutability', () => {
    it('does not mutate the original state object for "fetch"', () => {
      const state: FetchState<string> = { data: null, loading: false, error: null };
      const originalState = { ...state };

      fetchReducer(state, { type: 'fetch' });

      expect(state).toEqual(originalState);
    });

    it('does not mutate the original state object for "error"', () => {
      const state: FetchState<string> = { data: 'x', loading: true, error: null };
      const originalState = { ...state };

      fetchReducer(state, { type: 'error', payload: new Error('fail') });

      expect(state).toEqual(originalState);
    });
  });
});
