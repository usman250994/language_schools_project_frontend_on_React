import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';

import { School, createClassroom } from '../../../../services/api-services/school';
import { createUser, addStudentToParent } from '../../../../services/api-services/user';
import { UserRole } from '../../../../services/role-management/roles';
import { InputField } from '../../../../shared/components/formik/InputField';
import { ToastContext } from '../../../../shared/contexts/toast';

interface CreateParentModalProps {
  show: boolean;
  parentId: string;
  onClose: (refresh?: boolean) => void;
}

type CreateStudentRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export function CreateStudentModal(props: CreateParentModalProps): JSX.Element {
  const { show, parentId, onClose } = props;
  const setToast = useContext(ToastContext);

  const initialValues: CreateStudentRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.STUDENT,
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(3).required('Required').label('firstName'),
    lastName: Yup.string().min(3).required('Required').label('lastName'),
    email: Yup.string().email().required('Required').label('Email'),
    password: Yup.string().min(3).required('Required').label('password'),
    confirmPassword: Yup.string().required('Required').oneOf([Yup.ref('password'), null], 'Password must match').label('Confirm Password'),
  });

  const onSubmit = async (values: CreateStudentRequest, { resetForm }: FormikHelpers<CreateStudentRequest>): Promise<void> => {
    try {
      await addStudentToParent(parentId, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      resetForm();

      // if (onUpdate) {
      //   onUpdate();
      // }
      setToast({ type: 'success', message: 'Student created successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      onClose(true);
    }
  };

  return (
    <Modal show={show} size="lg" onHide={(): void => onClose()}>

      <Modal.Body className="subscribe-modal">
        <h4>Create Student</h4>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }): JSX.Element => (
            <FormikForm>
              <Row>
                <Col>
                  <InputField type="text" label="First Name" name="firstName" />
                </Col>
                <Col>
                  <InputField type="text" label="Last Name" name="lastName" />
                </Col>
              </Row>
              <InputField type="email" name="email" label="Email" disabled={isSubmitting} />
              <InputField type="password" name="password" label="New Password" disabled={isSubmitting} />
              <InputField type="password" name="confirmPassword" label="Confirm Password" disabled={isSubmitting} />

              <Button type="submit" disabled={isSubmitting}>Create</Button>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>

    </Modal>
  );
}
