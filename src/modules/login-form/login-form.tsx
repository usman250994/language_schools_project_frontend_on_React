import { Formik, Form as FormikForm } from 'formik';
import React, { useContext } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';
import * as Yup from 'yup';

import { LoginRequest, login } from '../../services/api-services/auth';
import { InputField } from '../../shared/components/formik/InputField';
import { ToastContext} from '../../shared/contexts/toast';

export type LoginFormState = {
  message?: string;
  redirect?: string;
}

function LoginForm(): JSX.Element {
  const setToast = useContext(ToastContext);
  const history = useHistory();
  const location = useLocation<LoginFormState>();

  const initialValues = {
    email: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Required').label('Email'),
    password: Yup.string().required('Required').label('Password'),
  });

  const onSubmit = async (credentials: LoginRequest): Promise<void> => {
    try {
      await login(credentials);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <React.Fragment>
      {/* todo: will replace image tag from here */}
      <img src="../../../logo512.png"width="200" height="200"/>
      <h4>Login</h4>
      {location.state && location.state.message && <Alert variant="info">{location.state.message}</Alert>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <FormikForm>
          <InputField type="email" placeholder="Email" name="email" />
          <InputField type="password" placeholder="Password" name="password" />
          <Button size="lg" block type="submit" className="bg-blue">Login</Button>
        </FormikForm>
      </Formik>
      <Button variant="link" onClick={(): void => history.push('/request-password-reset')}>Forgot Password?</Button>
    </React.Fragment>
  );
}

export default LoginForm;
