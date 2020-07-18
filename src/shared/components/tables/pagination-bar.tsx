import React from 'react';
import { Pagination } from 'react-bootstrap';

import './pagination-bar.scss';

interface TablePaginationBarProps {
  setPageIndex: Function;
  pageIndex: number;
  pageSize: number;
  total: number;
}

function PaginationBar(props: TablePaginationBarProps): JSX.Element | null {
  const { setPageIndex, pageIndex, pageSize, total } = props;

  if (total === 0) {
    return null;
  }

  const totalRounded = Math.ceil(total / pageSize);
  const widthNeighbour = 3;

  const range = (from: number): number[] => {
    let i = from + 1;
    const range = [];

    while (i <= totalRounded - 1 && range.length < 3) {
      range.push(i);
      i++;
    }

    return range;
  };
  let neighbours = range(0);
  if (totalRounded > widthNeighbour) {
    if (pageIndex < widthNeighbour) {
      neighbours = range(pageIndex - 1);
    } else if (pageIndex > totalRounded - widthNeighbour) {
      neighbours = range(totalRounded - 3);
    } else {
      neighbours = range(pageIndex - 2);
    }
  }

  const getEllipsisOn = (condition: boolean): false | JSX.Element =>
    condition && <Pagination.Ellipsis />;

  const getNeighboursPage = (hiddenPages: number[]): JSX.Element[] | undefined => {
    return hiddenPages.map((e, i) => (
      <Pagination.Item
        key={i}
        active={pageIndex === e}
        onClick={(): void => setPageIndex(e)}
      >
        {e}
      </Pagination.Item>
    ));
  };

  return (
    <div className="center-x">
      <Pagination>
        {/* <Pagination.First /> */}
        <Pagination.Prev
          onClick={(): void => setPageIndex(pageIndex - 1)}
          disabled={pageIndex <= 1}
        />
        {pageIndex !== 1 && totalRounded > widthNeighbour && (
          <Pagination.Item
            active={pageIndex === 1}
            onClick={(): void => setPageIndex(1)}
          >
            1
          </Pagination.Item>
        )}
        {getEllipsisOn(pageIndex > widthNeighbour)}
        {getNeighboursPage(neighbours)}
        {getEllipsisOn(pageIndex <= totalRounded - widthNeighbour)}
        <Pagination.Item
          active={pageIndex === totalRounded}
          onClick={(): void => setPageIndex(totalRounded)}
        >
          {totalRounded}
        </Pagination.Item>
        <Pagination.Next
          onClick={(): void => setPageIndex(pageIndex + 1)}
          disabled={pageIndex >= totalRounded}
        />
        {/* <Pagination.Last /> */}
      </Pagination>
    </div>
  );
}

export default PaginationBar;
