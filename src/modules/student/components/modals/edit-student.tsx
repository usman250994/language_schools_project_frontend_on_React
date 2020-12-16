import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import * as Yup from 'yup';

import { createStudent, StudentInfo, updateStudent } from '../../../../services/api-services/user';
import { UserRole } from '../../../../services/role-management/roles';
import { InputField } from '../../../../shared/components/formik/InputField';
import { SelectClass } from '../../../../shared/components/select-class.tsx/select-class';
import { SelectParent } from '../../../../shared/components/select-parent/select-parent';
import { ToastContext } from '../../../../shared/contexts/toast';

type CreateStudentRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface EditStudentModalProps {
  show: boolean;
  studentInfo: StudentInfo;
  onClose: (refresh?: boolean) => void;
  onUpdate?: () => void;
}

export function EditStudentModal(props: EditStudentModalProps): JSX.Element {
  const { show, studentInfo, onClose, onUpdate } = props;

  const setToast = useContext(ToastContext);

  const [classRoomId, setClassRoomId] = useState(studentInfo.classRoom?.id);
  const [parentId, setParentId] = useState(studentInfo.parent?.id);

  const initialValues: CreateStudentRequest = {
    firstName: studentInfo.firstName,
    lastName: studentInfo.lastName,
    email: studentInfo.email,
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
      await updateStudent(studentInfo.id, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        classRoomId: classRoomId,
        parentId: parentId,
      });

      resetForm();

      if (onUpdate) {
        onUpdate();
        onClose();
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
    <Modal show={show} size="lg" onHide={(): void => onClose()}>

      <Modal.Body className="subscribe-modal">
        <h4>Edit Student</h4>
        <Formik
          enableReinitialize
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

              <SelectClass defaultSchool={studentInfo.school} defaultClassRoom={studentInfo.classRoom} heading="Enroll in School" onClassSelect={onClassSelect} />
              <SelectParent defaultParent={studentInfo.parent} heading="Select Parents" onParentSelect={onParentSelect} />

              <Button type="submit" disabled={isSubmitting}>Edit</Button>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>

    </Modal>
  );
}
