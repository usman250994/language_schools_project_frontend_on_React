import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';

import { createUser } from '../../services/api-services/user';
import { UserRole } from '../../services/role-management/roles';
import { InputField } from '../../shared/components/formik/InputField';
import { ToastContext } from '../../shared/contexts/toast';

type CreateAdminRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

function CreateAdmin(): JSX.Element {
  const setToast = useContext(ToastContext);

  const initialValues: CreateAdminRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.ADMIN,
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(3).required('Required').label('firstName'),
    lastName: Yup.string().min(3).required('Required').label('lastName'),
    email: Yup.string().email().required('Required').label('Email'),
    password: Yup.string().min(3).required('Required').label('password'),
    confirmPassword: Yup.string().required('Required').oneOf([Yup.ref('password'), null], 'Password must match').label('Confirm Password'),
  });

  const onSubmit = async (values: CreateAdminRequest, { resetForm }: FormikHelpers<CreateAdminRequest>): Promise<void> => {
    try {
      await createUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      resetForm();
      setToast({ type: 'success', message: 'User created successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="shadow-box">
      <h4>Create Admin User</h4>
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
    </div>
  );
}

export default CreateAdmin;
