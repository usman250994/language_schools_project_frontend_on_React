import React, { useCallback, useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { CellProps } from 'react-table';

import { useDeleteModal } from '../../../hooks/delete-modal';
import { Classroom, ClassRoomWithTimeTable, deleteClassroom, listSchoolsClassrooms } from '../../../services/api-services/school';
import { DeleteButton, InfoButton } from '../../../shared/components/ActionButtons';
import { PaginatedTable } from '../../../shared/components/tables/paginated-table';
import { ToastContext } from '../../../shared/contexts/toast';

import { EditClassroomModal } from './modals/edit-classroom';
import { ShowClassroomDivisions } from './modals/show-classroom-divisions';

type CreateClassroomProps = {
  schoolId: string;
  onUpdate?: () => void;
  refresh: boolean;
}

export function ListClassroom(props: CreateClassroomProps): JSX.Element {
  const { schoolId, refresh, onUpdate } = props;
  const setToast = useContext(ToastContext);

  const [editClassroom, setEditClassroom] = useState<ClassRoomWithTimeTable>();

  const [searchParams, setSearchParams] = useState({ name: '' });

  const [showDivisions, setShowDivisions] = useState(false);
  const [editClassroomId, setEditClassroomId] = useState<string>();

  const fn = useCallback((offset: number, limit: number) => listSchoolsClassrooms(schoolId, offset, limit, searchParams.name), [schoolId, searchParams, refresh]);

  const onDelete = useCallback(async (classRoom: Classroom): Promise<void> => {
    try {
      await deleteClassroom(classRoom.id);
      setToast({ type: 'success', message: 'Class deleted successfully' });
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }, []);
  const nameFn = useCallback((classRoom: Classroom): string => classRoom.name, []);
  const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, 'Delete Class Room', nameFn);

  const nameCell = (data: CellProps<Classroom>): string => {
    const classRoom = data.row.original;

    return classRoom.name;
  };

  const sectionCell = (data: CellProps<Classroom>): string => {
    const classRoom = data.row.original;

    return classRoom.section;
  };

  const divisionCell = (data: CellProps<Classroom>): string => {
    const classRoom = data.row.original;

    return classRoom.division?.name || '';
  };

  const actionCell = (data: CellProps<ClassRoomWithTimeTable>): JSX.Element | string => {
    const classRoom = data.row.original;

    return (
      <React.Fragment>
        <InfoButton onClick={(): void => setEditClassroom(data.row.original)} title="Edit Class" text="Edit Class" />
        <DeleteButton onClick={(): void => showDeleteModal(classRoom)} />
        <InfoButton onClick={(): void => { setEditClassroomId(classRoom.id); setShowDivisions(true); }} title="Show Divisions" text="Show Divisions" />
      </React.Fragment>
    );
  };

  const columns = [{
    Header: 'Name',
    Cell: nameCell,
  }, {
    Header: 'Section',
    Cell: sectionCell,
  }, {
    Header: 'Division',
    Cell: divisionCell,
  }, {
    Header: 'Day',
    Cell: (data: CellProps<ClassRoomWithTimeTable>): string => data.row.original.timeTable?.day || '-',
  }, {
    Header: 'Start Date',
    Cell: (data: CellProps<ClassRoomWithTimeTable>): string => data.row.original.timeTable?.startDate || '-',
  }, {
    Header: 'End Date',
    Cell: (data: CellProps<ClassRoomWithTimeTable>): string => data.row.original.timeTable?.endDate || '-',
  }, {
    Header: 'Start Time',
    Cell: (data: CellProps<ClassRoomWithTimeTable>): string => data.row.original.timeTable?.startTime || '-',
  }, {
    Header: 'End Time',
    Cell: (data: CellProps<ClassRoomWithTimeTable>): string => data.row.original.timeTable?.endTime || '-',
  }, {
    Header: ' ',
    Cell: actionCell,
  }];

  const searchBy = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    // await searchStudents({ keyword: e.target.value });

    setSearchParams({ name: e.target.value });
  };

  return (
    <div className="shadow-box">
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
      {editClassroom &&
        <EditClassroomModal
          classroom={editClassroom}
          schoolId={schoolId}
          onClose={(): void => setEditClassroom(undefined)}
          show
        />}
      {showDivisions && editClassroomId &&
        <ShowClassroomDivisions editClassroomId={editClassroomId} onClose={() => setShowDivisions(false)} />}
      <DeleteModal />
    </div>
  );
}
