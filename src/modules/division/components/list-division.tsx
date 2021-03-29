import React, { useCallback, useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { CellProps } from 'react-table';

import { Division, listDivisions } from '../../../services/api-services/division';
import { PaginatedTable } from '../../../shared/components/tables/paginated-table';
import { ToastContext } from '../../../shared/contexts/toast';

type CreateClassroomProps = {
  onUpdate?: () => void;
  refresh: boolean;
  editClassroomId?: string;
}

export function ListDivision(props: CreateClassroomProps): JSX.Element {
  const { refresh, onUpdate, editClassroomId } = props;
  const setToast = useContext(ToastContext);

  const [searchParams, setSearchParams] = useState({ name: '' });

  const fn = useCallback((offset: number, limit: number) => listDivisions(offset, limit, searchParams.name, editClassroomId), [refresh, searchParams.name]);

  // const onDelete = useCallback(async (classRoom: Classroom): Promise<void> => {
  //   try {
  //     await deleteClassroom(classRoom.id);
  //     setToast({ type: 'success', message: 'Class deleted successfully' });
  //     if (onUpdate) {
  //       onUpdate();
  //     }
  //   } catch (err) {
  //     setToast({ type: 'error', message: err.message });
  //   }
  // }, []);
  // const nameFn = useCallback((classRoom: Classroom): string => classRoom.name, []);
  // const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, 'Delete Class Room', nameFn);

  const nameCell = (data: CellProps<Division>): string => {
    const classRoom = data.row.original;

    return classRoom.name;
  };

  const columns = [{
    Header: 'Name',
    Cell: nameCell,
  }, {
    Header: 'Amount',
    Cell: (data: CellProps<Division>): string => data.row.original.amount || '-',
  }, {
    Header: 'Day',
    Cell: (data: CellProps<Division>): string => data.row.original.day || '-',
  }, {
    Header: 'Start Date',
    Cell: (data: CellProps<Division>): string => data.row.original.startDate || '-',
  }, {
    Header: 'End Date',
    Cell: (data: CellProps<Division>): string => data.row.original.endDate || '-',
  }, {
    Header: 'Start Time',
    Cell: (data: CellProps<Division>): string => data.row.original.startTime || '-',
  }, {
    Header: 'End Time',
    Cell: (data: CellProps<Division>): string => data.row.original.endTime || '-',
  }];

  const searchBy = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    // await searchStudents({ keyword: e.target.value });

    setSearchParams({ name: e.target.value });
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <Form.Group>
          <Form.Label>Search</Form.Label>
          <Form.Control onChange={searchBy} />
        </Form.Group>
      </div>
      <h4>Class</h4>
      <PaginatedTable
        fn={fn}
        pageSize={10}
        columns={columns}
      />
    </>
  );
}
