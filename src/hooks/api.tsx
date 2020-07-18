import React, { useState, useEffect, useReducer, useCallback } from 'react';

import AppSpinner from '../shared/components/layout/spinner';

type APIFunc<T> = () => Promise<T>;

type UseApi<T> = {
  loading: boolean;
  error: Error | null;
  result: T | null;
};

export function useApi<T>(fn: APIFunc<T>): UseApi<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    async function caller(): Promise<void> {
      setLoading(true);

      try {
        const response = await fn();

        setResult(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    caller();
  }, [fn]);

  return {
    loading,
    error,
    result,
  };
}

export type PaginatedAPIFunc<T extends object> = (
  offset: number,
  limit: number
) => Promise<PaginatedAPIResponse<T>>;

type PaginatedApiState<T extends object> = UseApi<PaginatedAPIResponse<T>> & {
  offset: number;
  limit: number;
  refresh: boolean;
}

type UsePaginatedApi<T extends object> = UseApi<PaginatedAPIResponse<T>> & PaginatedApiState<T> & {
  setOffset: (offset: number) => void;
  setLimit: (limit: number) => void;
  setRefresh: () => void;
};

type PaginatedAPIResponse<T extends object> = {
  total: number;
  data: T[];
};

type PaginatedApiAction<T extends object> = {
  type: 'SET_LOADING';
} | {
  type: 'SET_ERROR';
  error: Error;
} | {
  type: 'SET_RESULT';
  result: PaginatedAPIResponse<T>;
} | {
  type: 'SET_OFFSET';
  offset: number;
} | {
  type: 'SET_LIMIT';
  limit: number;
} | {
  type: 'SET_REFRESH';
}

type PaginationApiReducer<T extends object> = (state: PaginatedApiState<T>, action: PaginatedApiAction<T>) => PaginatedApiState<T>;
function paginatedApiReducer<T extends object>(state: PaginatedApiState<T>, action: PaginatedApiAction<T>): PaginatedApiState<T> {
  switch (action.type) {
  case 'SET_LOADING':
    return { ...state, result: null, error: null, loading: true };
  case 'SET_ERROR':
    return { ...state, result: null, error: action.error, loading: false };
  case 'SET_RESULT':
    return { ...state, result: action.result, error: null, loading: false };
  case 'SET_OFFSET':
    return { ...state, result: null, error: null, loading: true, offset: action.offset };
  case 'SET_LIMIT':
    return { ...state, result: null, error: null, loading: true, limit: action.limit };
  case 'SET_REFRESH':
    if (state.loading) {
      return state;
    }

    return { ...state, result: null, error: null, loading: true, refresh: !state.refresh };
  default:
    throw new Error(`Unknown action: ${action}`);
  }
}

export function usePaginatedApi<T extends object>(fn: PaginatedAPIFunc<T>, offset: number, limit: number): UsePaginatedApi<T> {
  const [state, dispatch] = useReducer<PaginationApiReducer<T>>(paginatedApiReducer, {
    loading: true,
    error: null,
    result: null,
    offset,
    limit,
    refresh: false,
  });

  useEffect(() => {
    async function caller(): Promise<void> {
      try {
        const response = await fn(state.offset, state.limit);

        dispatch({ type: 'SET_RESULT', result: response });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', error: err });
      }
    }

    caller();
  }, [fn, state.offset, state.limit, state.refresh]);

  const setOffsetFn = useCallback((offset: number): void => dispatch({ type: 'SET_OFFSET', offset }), []);
  const setLimitFn = useCallback((limit: number): void => dispatch({ type: 'SET_LIMIT', limit }), []);
  const setRefreshFn = useCallback((): void => dispatch({ type: 'SET_REFRESH' }), []);

  return {
    loading: state.loading,
    error: state.error,
    result: state.result,
    offset: state.offset,
    limit: state.limit,
    refresh: state.refresh,
    setOffset: setOffsetFn,
    setLimit: setLimitFn,
    setRefresh: setRefreshFn,
  };
}

type APIHOCFunc<T> = (Component: React.FC<UseApi<T>>) => () => JSX.Element;

export function WithApi<T>(fn: APIFunc<T>): APIHOCFunc<T> {
  const apiProps = useApi(fn);

  return function hoc(Component: React.FC<UseApi<T>>) {
    return function componentWithSpinner(): JSX.Element {
      if (apiProps.loading) {
        return <AppSpinner />;
      }

      return <Component {...apiProps} />;
    };
  };
}
