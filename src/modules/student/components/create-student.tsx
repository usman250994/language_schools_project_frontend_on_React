import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';

import { createStudent } from '../../../services/api-services/user';
import { UserRole } from '../../../services/role-management/roles';
import { InputField } from '../../../shared/components/formik/InputField';
import { SelectClass } from '../../../shared/components/select-class.tsx/select-class';
import { SelectParent } from '../../../shared/components/select-parent/select-parent';
import { ToastContext } from '../../../shared/contexts/toast';

type CreateStudentRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type CreateStudentProps = {
  onUpdate?: () => void;
}

export function CreateStudent(props: CreateStudentProps): JSX.Element {
  const { onUpdate } = props;

  const setToast = useContext(ToastContext);

  const [classRoomId, setClassRoomId] = useState<string>();
  const [parentId, setParentId] = useState<string>();

  const initialValues: CreateStudentRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(3).required('Required').label('firstName'),
    lastName: Yup.string().min(3).required('Required').label('lastName'),
    email: Yup.string().email().label('Email'),
    password: Yup.string().label('password'),
  });

  const onSubmit = async (values: CreateStudentRequest, { resetForm }: FormikHelpers<CreateStudentRequest>): Promise<void> => {
    try {
      await createStudent({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        classRoomId: classRoomId,
        parentId,
      });

      resetForm();

      if (onUpdate) {
        onUpdate();
      }
      setToast({ type: 'success', message: 'Student created successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const onClassSelect = async (classroomId?: string): Promise<void> => {
    if (!classroomId) return;

    setClassRoomId(classroomId);
  };

  const onParentSelect = async (parentId?: string): Promise<void> => {
    if (!parentId) return;

    setParentId(parentId);
  };

  return (
    <div className="shadow-box">
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

            <SelectClass heading="Enroll in School" onClassSelect={onClassSelect} />
            <SelectParent heading="Select Parents" onParentSelect={onParentSelect} />

            <Button type="submit" disabled={isSubmitting}>Create</Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
