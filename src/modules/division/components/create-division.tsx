import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import * as Yup from 'yup';

import { createDivision } from '../../../services/api-services/division';
import { DaysText } from '../../../services/api-services/school';
import { Dropdown } from '../../../shared/components/formik/Dropdown';
import { InputField } from '../../../shared/components/formik/InputField';
import { ToastContext } from '../../../shared/contexts/toast';

type DivisionRequest = {
  name: string;
  amount: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  day: string;
}

type DivisionProps = {
  onUpdate?: () => void;
}

export function CreateDivision({ onUpdate }: DivisionProps): JSX.Element {
  const setToast = useContext(ToastContext);

  const initialValues = {
    name: '',
    startDate: '',
    amount: '',
    endDate: '',
    startTime: '',
    endTime: '',
    day: '',
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1).required('Required').label('name'),
    startDate: Yup.string().label('startDate'),
    amount: Yup.string().label('amount'),
    endDate: Yup.string().label('endDate'),
    startTime: Yup.string().label('startTime'),
    endTime: Yup.string().label('endTime'),
    day: Yup.string().label('day'),
  });

  const onSubmit = async (values: DivisionRequest, { resetForm }: FormikHelpers<DivisionRequest>): Promise<void> => {
    try {
      await createDivision(values);

      resetForm();
      setToast({ type: 'success', message: 'classroom created successfully' });
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="shadow-box">
      <h4>Create Division</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }): JSX.Element => (
          <FormikForm>
            <div className="d-flex justify-content-between">
              <InputField name="name" type="text" label="Name of Division" />
              <InputField name="amount" type="text" label="Amount of Division" />
            </div>
            <div className="d-flex justify-content-between">
              <InputField name="startDate" type="date" label="Start Date" />
              <InputField name="endDate" type="date" label="End Date" />
            </div>
            <div className="d-flex justify-content-between">
              <InputField name="startTime" type="time" label="Start Time" />
              <InputField name="endTime" type="time" label="End Time" />
            </div>
            <Dropdown name="day" label="Day" options={DaysText} disabled={isSubmitting} />
            <Button type="submit" disabled={isSubmitting}>Create</Button>
          </FormikForm>
        )}
      </Formik>
    </div >
  );
}
