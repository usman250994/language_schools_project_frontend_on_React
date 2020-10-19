import React, { useCallback, useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CellProps } from 'react-table';

import { useDeleteModal } from '../../../../hooks/delete-modal';
import { deleteClassroom, addClassToUser, listClassroomsByUser, Classroom } from '../../../../services/api-services/school';
import { DeleteButton } from '../../../../shared/components/ActionButtons';
import { SelectClass } from '../../../../shared/components/select-class.tsx/select-class';
import { PaginatedTable } from '../../../../shared/components/tables/paginated-table';
import { ToastContext } from '../../../../shared/contexts/toast';

interface ViewClassModalProps {
  show: boolean;
  teacherId: string;
  onClose: (toggle?: boolean) => void;
  title: string;
}

export function ViewClassModal(props: ViewClassModalProps): JSX.Element {
  const { show, teacherId, title, onClose } = props;
  const setToast = useContext(ToastContext);

  const [refresh, setRefresh] = useState<boolean>();
  const fn = useCallback((offset: number, limit: number) => listClassroomsByUser(teacherId, offset, limit), [teacherId, refresh]);

  const onDelete = useCallback(async (classRoom: Classroom): Promise<void> => {
    try {
      await deleteClassroom(classRoom.id);
      setToast({ type: 'success', message: 'Class deleted successfully' });

      onClose(true);
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

  const actionCell = (data: CellProps<Classroom>): JSX.Element | string => {
    const classRoom = data.row.original;

    return (
      <React.Fragment>
        <DeleteButton onClick={(): void => showDeleteModal(classRoom)} />
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
    Header: ' ',
    Cell: actionCell,
  }];

  const onAddClass = async (classroomId: string): Promise<void> => {
    if (!classroomId) return;

    try {
      await addClassToUser(classroomId, teacherId);
      setToast({ type: 'success', message: 'Class added' });
      setRefresh(!refresh);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <Modal show={show} onHide={onClose} className="account-request-view-modal">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <SelectClass onAddClass={onAddClass} />
        </div>
        <hr />
        <div>
          <h5>List Class</h5>
          <PaginatedTable
            fn={fn}
            pageSize={10}
            columns={columns}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={(): void => onClose()}>
          Close
        </Button>
      </Modal.Footer>
      <DeleteModal />
    </Modal>
  );
}
