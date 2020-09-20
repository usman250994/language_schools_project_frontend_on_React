import React, { useCallback, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CellProps } from 'react-table';

import { useDeleteModal } from '../../../../hooks/delete-modal';
import { School, Classroom, deleteClassroom } from '../../../../services/api-services/school';
import { DeleteButton } from '../../../../shared/components/ActionButtons';
import ReactTable from '../../../../shared/components/tables/table';
import { ToastContext } from '../../../../shared/contexts/toast';

interface ViewClassModalProps {
  show: boolean;
  school: School;
  onClose: (toogle?: boolean) => void;
}

export function ViewClassModal(props: ViewClassModalProps): JSX.Element {
  const { show, school, onClose } = props;
  const classRooms = school.classrooms;
  const setToast = useContext(ToastContext);

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

  return (
    <Modal show={show} onHide={onClose} className="account-request-view-modal">
      <Modal.Header>
        <Modal.Title>Classes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReactTable
          columns={columns}
          data={classRooms}
          total={classRooms.length}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => onClose()}>
          Close
        </Button>
      </Modal.Footer>
      <DeleteModal />
    </Modal>
  );
}
