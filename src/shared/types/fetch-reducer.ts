export type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export type FetchAction<T> =
  | { type: 'fetch' }
  | { type: 'success'; payload: T }
  | { type: 'error'; payload: Error };
