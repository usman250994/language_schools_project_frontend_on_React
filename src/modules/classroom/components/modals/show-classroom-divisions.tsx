import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { addDivisionInClassroom, Division } from '../../../../services/api-services/division';
import { SelectDivision } from '../../../../shared/components/select-division/select-division';
import { ToastContext } from '../../../../shared/contexts/toast';
import { ListDivision } from '../../../division/components/list-division';

import './show-classroom-divisions.scss';

export function ShowClassroomDivisions({ onClose, editClassroomId }: { onClose: () => void; editClassroomId: string }): JSX.Element {
  const [division, setDivision] = useState<Division>();
  const setToast = useContext(ToastContext);

  const [refresh, setRefresh] = useState(false);

  const onDivisionSelect = (division: Division | undefined): void => {
    setDivision(division);
  };

  const addDivision = async (): Promise<void> => {
    if (!editClassroomId || !division) {
      throw new Error('Division not found');
    }
    try {
      await addDivisionInClassroom({ classroomId: editClassroomId, divisionId: division.id });
      setRefresh(!refresh);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <Modal size="lg" show onHide={(): void => onClose()} className="show-classroom-divisions">
      <h4>Division</h4>
      <div>
        <SelectDivision heading="Add new Division" onDivisionSelect={onDivisionSelect} />
        <Button type="submit" disabled={!division} onClick={addDivision}>Add Division</Button>
      </div>
      <Modal.Body className="subscribe-modal">
        <ListDivision editClassroomId={editClassroomId} refresh={refresh} />
      </Modal.Body>

    </Modal >
  );
}
