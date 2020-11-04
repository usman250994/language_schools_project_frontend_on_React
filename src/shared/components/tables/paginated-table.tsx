import React, { useEffect, useCallback } from 'react';
import { Column } from 'react-table';
import { date } from 'yup';

import { usePaginatedApi, PaginatedAPIFunc } from '../../../hooks/api';
import AppSpinner from '../layout/spinner';

import PaginationBar from './pagination-bar';
import ReactTable from './table';

type ComponentProps<T extends object> = {
  data: T[];
  total: number;
}

export function WithPagination<T extends object>(fn: PaginatedAPIFunc<T>, pageSize: number, RenderComponent: React.FC<ComponentProps<T>>): [React.FC, () => void] {
  const { loading, error, result, offset, setOffset, setRefresh } = usePaginatedApi(fn, 0, pageSize);

  const setPageIndex = useCallback((pageIndex: number) => setOffset((pageIndex - 1) * pageSize), [pageSize, setOffset]);

  function DataComponent(): JSX.Element {
    if (loading || !result) {
      return loading ? <AppSpinner /> : <div>{error?.message}</div>;
    }

    return (
      <React.Fragment>
        <RenderComponent
          data={result.data}
          total={result.total}
        />
        <PaginationBar
          setPageIndex={setPageIndex}
          pageIndex={(offset / pageSize) + 1}
          pageSize={pageSize}
          total={result.total}
        />
      </React.Fragment>
    );
  }

  return [DataComponent, setRefresh];
}

// WithFixedPagination is a replica of WithPagination
//
// This is a workaround.
// WithPagination works well if UI needs to be modified
// WithFixedPagination works well if UI needs to be fixed
export function WithFixedPagination<T extends object>(fn: PaginatedAPIFunc<T>, pageSize: number, RenderComponent: React.FC<ComponentProps<T>>): [React.FC, () => void] {
  const { loading, error, result, offset, setOffset, setRefresh } = usePaginatedApi(fn, 0, pageSize);

  const setPageIndex = useCallback((pageIndex: number) => setOffset((pageIndex - 1) * pageSize), [pageSize, setOffset]);

  const DataComponent = useCallback((): JSX.Element => {
    if (loading || !result) {
      return loading ? <AppSpinner /> : <div>{error?.message}</div>;
    }

    return (
      <React.Fragment>
        <RenderComponent
          data={result.data}
          total={result.total}
        />
        <PaginationBar
          setPageIndex={setPageIndex}
          pageIndex={(offset / pageSize) + 1}
          pageSize={pageSize}
          total={result.total}
        />
      </React.Fragment>
    );
  }, [loading, error, result, offset, pageSize, setPageIndex]);

  return [DataComponent, setRefresh];
}

type PaginatedTableProps<T extends object> = {
  fn: PaginatedAPIFunc<T>;
  pageSize: number;
  columns: Column<T>[];
  refresh?: boolean;
};

export function PaginatedTable<T extends object>(props: PaginatedTableProps<T>): JSX.Element {
  const { fn, pageSize, columns, refresh = false } = props;
console.log('paginated');
  const [Table, refreshTable] = WithPagination(fn, pageSize, ({ data, total }) => {
    console.log(data, columns, 'a');
    return (
      <ReactTable
        columns={columns}
        data={data}
        total={total}
      />
    );
  });

  useEffect(() => {
    refreshTable();
  }, [refresh, refreshTable]);

  return <Table />;
}
