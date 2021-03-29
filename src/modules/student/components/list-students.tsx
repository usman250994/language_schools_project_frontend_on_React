import React, { useCallback, useState, useContext, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { CellProps } from 'react-table';

import { useDeleteModal } from '../../../hooks/delete-modal';
import { deleteClassroomFromUser } from '../../../services/api-services/school';
import { deleteUser, getStudent, StudentInfo, searchStudents } from '../../../services/api-services/user';
import { DeleteButton, EditButton } from '../../../shared/components/ActionButtons';
import { PaginatedTable } from '../../../shared/components/tables/paginated-table';
import { ToastContext } from '../../../shared/contexts/toast';

import { EditStudentModal } from './modals/edit-student';

type UpdateStudentRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob?: string | null;
  active: boolean;
}

interface ListStudentProps {
  onUpdate?: () => void;
  refresh: boolean;
  parentId?: string | undefined;
  classId?: string;
  studentSelected?: (userId: string) => void;
}

type StudentSearchParams = {
  keyword: string;
}

function ListStudent(props: ListStudentProps): JSX.Element {
  const { onUpdate, refresh, classId } = props;
  const setToast = useContext(ToastContext);

  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const fn = useCallback((offset: number, limit: number) => {
    return searchStudents(searchParams, offset, limit);
  }, [refresh, searchParams]);

  const [editUserId, setEditUserId] = useState<string>();
  const [editUserInfo, setEditUserInfo] = useState<StudentInfo>();

  const userFetcher = useCallback(async (userId: string) => {
    const student = await getStudent(userId);

    setEditUserInfo(student);
  }, []);

  useEffect(() => {
    if (editUserId) {
      userFetcher(editUserId);
    }
  }, [editUserId]);

  const onDelete = useCallback(async (user: StudentInfo): Promise<void> => {
    try {
      if (classId) {
        await deleteClassroomFromUser(classId, user.id);
        setToast({ type: 'success', message: 'Student removed Successfully' });
      }
      else {
        await deleteUser(user.id);

        setToast({ type: 'success', message: 'Student deleted Successfully' });

        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }, [setToast]);

  const nameFn = useCallback((user: StudentInfo): string => `${user.firstName} ${user.lastName}`, []);
  const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, classId ? 'Remove Student From Class' : 'Delete Student', nameFn);

  const actionCell = (data: CellProps<StudentInfo>): JSX.Element | string => {
    const user = data.row.original;

    return (
      <React.Fragment>
        <EditButton
          onClick={(): void => setEditUserId(user.id)}
          title="Edit Student"
          text="Edit Student"
        />
        <DeleteButton onClick={(): void => showDeleteModal(user)} title="Delete Student" />
      </React.Fragment>
    );
  };

  const columns = [{
    Header: 'First Name',
    Cell: (data: CellProps<StudentInfo>): string => data.row.original.firstName,
  }, {
    Header: 'Last Name',
    Cell: (data: CellProps<StudentInfo>): string => data.row.original.lastName,
  }, {
    Header: 'Email',
    Cell: (data: CellProps<StudentInfo>): string => data.row.original.email,
  }, {
    Header: 'School',
    Cell: (data: CellProps<StudentInfo>): string => data.row.original.school?.name || '',
  }, {
    Header: 'Class',
    Cell: (data: CellProps<StudentInfo>): string => `${data.row.original.classRoom?.name || ''} ${data.row.original.classRoom?.section || ''}` || '',
  }, {
    Header: 'Parent',
    Cell: (data: CellProps<StudentInfo>): string => `${data.row.original.parent?.firstName || ''} ${data.row.original.parent?.lastName || ''}` || '',
  }, {
    Header: 'Date of Birth',
    Cell: (data: CellProps<StudentInfo>): string => data.row.original.dob || '',
  }, {
    Header: ' ',
    Cell: actionCell,
  }];

  const onEditClose = (): void => {
    setEditUserId(undefined);
    setEditUserInfo(undefined);
  };

  const searchBy = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    // await searchStudents({ keyword: e.target.value });

    setSearchParams({ keyword: e.target.value });
  };

  return (
    <div className="shadow-box">
      <div className="d-flex justify-content-end">
        <Form.Group>
          <Form.Label>Search</Form.Label>
          <Form.Control onChange={searchBy} />
        </Form.Group>
      </div>
      <h4>Students</h4>
      <PaginatedTable
        fn={fn}
        pageSize={10}
        columns={columns}
      />

      {editUserInfo && <EditStudentModal studentInfo={editUserInfo} show={!!editUserId} onClose={onEditClose} onUpdate={onUpdate} />}

      <DeleteModal
        message={(user: StudentInfo): JSX.Element => (
          <React.Fragment>
            This action cannot be undone. This will permanently delete the <strong>{user.firstName} {user.lastName}</strong> and its data.
          </React.Fragment>
        )}
        confirmValue={(user: StudentInfo): string => `${user.firstName} ${user.lastName}`}
      />
    </div>
  );
}

export default ListStudent;
