import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import * as Yup from 'yup';

import { School, createClassroom } from '../../../../services/api-services/school';
import { InputField } from '../../../../shared/components/formik/InputField';
import { ToastContext } from '../../../../shared/contexts/toast';

interface CreateClassModalProps {
  show: boolean;
  school: School;
  onClose: (refresh?: boolean) => void;
}

type CreateClassRoomRequest = {
  name: string;
  section: string;
}

export function CreateClassModal(props: CreateClassModalProps): JSX.Element {
  const { show, school, onClose } = props;
  const setToast = useContext(ToastContext);

  const initialValues: CreateClassRoomRequest = {
    name: '',
    section: '',
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1).required('Required').label('name'),
    section: Yup.string().min(1).required('Required').label('section'),
  });

  const onSubmit = async (values: CreateClassRoomRequest, { resetForm }: FormikHelpers<CreateClassRoomRequest>): Promise<void> => {
    try {
      await createClassroom(school.id, values);

      resetForm();
      setToast({ type: 'success', message: 'User created successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      onClose(true);
    }
  };

  return (
    <Modal show={show} size="sm" onHide={(): void => onClose()}>

      <Modal.Body className="subscribe-modal">
        <h4>Create Class</h4>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }): JSX.Element => (
            <FormikForm>
              <InputField type="text" label="Class Name" name="name" />
              <InputField type="text" label="Section" name="section" />
              <Button type="submit" disabled={isSubmitting}>Create</Button>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>

    </Modal>
  );
}
