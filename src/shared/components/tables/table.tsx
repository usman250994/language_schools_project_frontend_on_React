import React from 'react';
import { Table } from 'react-bootstrap';
import { useTable, TableOptions } from 'react-table';

import './table.scss';

type ReactTableProps<D extends object> = TableOptions<D> & {
  total: number;
};

function ReactTable<D extends object>(props: ReactTableProps<D>): JSX.Element {
  const { columns, data } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <Table responsive hover {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, key) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={key}>
            {headerGroup.headers.map((column, key) => (
              <th {...column.getHeaderProps()} key={key}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);

          return (
            <tr {...row.getRowProps()} key={i}>
              {row.cells.map((cell, key) => {
                return (
                  <td {...cell.getCellProps()} key={key}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default ReactTable;
