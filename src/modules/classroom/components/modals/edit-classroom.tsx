import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import * as Yup from 'yup';

import { Division } from '../../../../services/api-services/division';
import { School, createClassroom, DaysText, ClassRoomWithTimeTable, editClassroom } from '../../../../services/api-services/school';
import { Dropdown } from '../../../../shared/components/formik/Dropdown';
import { InputField } from '../../../../shared/components/formik/InputField';
import { SelectDivision } from '../../../../shared/components/select-division/select-division';
import { ToastContext } from '../../../../shared/contexts/toast';

interface CreateClassModalProps {
  show: boolean;
  classroom: ClassRoomWithTimeTable;
  schoolId: string;
  onClose: (refresh?: boolean) => void;
}

type CreateClassRoomRequest = {
  name: string;
  section: string;
}

export function EditClassroomModal(props: CreateClassModalProps): JSX.Element {
  const { show, classroom, schoolId, onClose } = props;
  const setToast = useContext(ToastContext);
  const [division, setDivision] = useState<Division>();

  const initialValues = {
    name: '',
    section: '',
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1).required('Required').label('name'),
    section: Yup.string().min(1).required('Required').label('section'),
  });

  const onDivisionSelect = (division: Division | undefined): void => {
    setDivision(division);
  };

  const onSubmit = async (values: CreateClassRoomRequest, { resetForm }: FormikHelpers<CreateClassRoomRequest>): Promise<void> => {
    try {
      await editClassroom(classroom.id, schoolId, { ...values, divisionId: division?.id });

      resetForm();
      setToast({ type: 'success', message: 'classroom created successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      onClose(true);
    }
  };

  return (
    <Modal show={show} onHide={(): void => onClose()}>

      <Modal.Body className="subscribe-modal">
        <h4>Create Class</h4>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting }): JSX.Element => (
            <FormikForm>
              <div className="d-flex justify-content-between">
                <InputField name="name" type="text" label="Class Name" />
                <InputField name="section" type="text" label="Section" />
              </div>
              <SelectDivision onDivisionSelect={onDivisionSelect} />
              <Button type="submit" disabled={isSubmitting}>Create</Button>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>

    </Modal >
  );
}
