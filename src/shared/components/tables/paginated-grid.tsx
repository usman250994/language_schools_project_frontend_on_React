import * as FAS from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { PaginatedAPIFunc } from '../../../hooks/api';
import DropdownMenu, { MenuItem } from '../../../shared/components/DropdownMenu';
import { WithFixedPagination } from '../../../shared/components/tables/paginated-table';

import './paginated-grid.scss';

type PaginatedGridProps<T extends object> = {
  fn: PaginatedAPIFunc<T>;
  headingFn: (item: T) => string;
  dropdownMenuFn: (item: T) => MenuItem[];
  renderItem: (item: T) => JSX.Element;
  pageSize: number;
  refresh?: boolean;
};

export function PaginatedGrid<T extends object>(props: PaginatedGridProps<T>): JSX.Element {
  const { fn, headingFn, dropdownMenuFn, renderItem, pageSize, refresh = false } = props;

  const renderCell = useCallback(({ data }) => {
    return (
      <Container fluid className="paginated-grid-layout">
        <Row>
          {data.map((item: T, key: number) => {
            const dropdownMenuItems = dropdownMenuFn(item);

            return (
              <Col key={key} sm={12} md={12} lg={12} xl={6}>
                <div className="shadow-box">
                  <h4 className="with-dropdown">
                    {headingFn(item)}
                    <DropdownMenu
                      dropdownButtonValue={<FontAwesomeIcon icon={FAS.faEllipsisH} />}
                      dropdownMenuItems={dropdownMenuItems}
                    />
                  </h4>
                  {renderItem(item)}
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  }, [headingFn, dropdownMenuFn, renderItem]);

  const [Grid, refreshGrid] = WithFixedPagination(fn, pageSize, renderCell);

  useEffect(() => {
    refreshGrid();
  }, [refresh, refreshGrid]);

  return <Grid />;
}
