import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';

import { createSchool } from '../../../services/api-services/school';
import { InputField } from '../../../shared/components/formik/InputField';
import { PhoneField } from '../../../shared/components/formik/PhoneField';
import { ToastContext } from '../../../shared/contexts/toast';

type CreateSchoolRequest = {
  email: string;
  name: string;
  address: string;
  phone: string;
}

interface CreateSchoolProps {
  onUpdate?: () => void;
}

function CreateSchool(props: CreateSchoolProps): JSX.Element {
  const { onUpdate } = props;
  const setToast = useContext(ToastContext);

  const initialValues: CreateSchoolRequest = {
    email: '',
    name: '',
    address: '',
    phone: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Required').label('Email'),
    name: Yup.string().min(3).required('Required').label('Name'),
    address: Yup.string().min(3).required('Required').label('Address'),
    phone: Yup.string().min(3).required('Required').label('Phone'),
  });

  const onSubmit = async (values: CreateSchoolRequest, { resetForm }: FormikHelpers<CreateSchoolRequest>): Promise<void> => {
    try {
      await createSchool({
        email: values.email,
        name: values.name,
        address: values.address,
        phone: values.phone,
      });

      resetForm();
      setToast({ type: 'success', message: 'School created successfully' });
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="shadow-box">
      <h4>Create School</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }): JSX.Element => (
          <FormikForm>
            <Row>
              <Col>
                <InputField type="email" name="email" label="Email" disabled={isSubmitting} />
              </Col>
              <Col>
                <InputField type="text" label="Name" name="name" />
              </Col>
            </Row>
            <InputField type="text" name="address" label="Address" disabled={isSubmitting} />
            <PhoneField name="phone" id="phone" placeholder="Enter Phone Number" />
            <Button type="submit" disabled={isSubmitting}>Create</Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}

export default CreateSchool;
