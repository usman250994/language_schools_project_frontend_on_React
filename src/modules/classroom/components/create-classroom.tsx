import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext, useState } from 'react';
import { Button, ListGroup, Table } from 'react-bootstrap';
import * as Yup from 'yup';

import { Division } from '../../../services/api-services/division';
import { createClassroom, DaysText } from '../../../services/api-services/school';
import { Dropdown } from '../../../shared/components/formik/Dropdown';
import { InputField } from '../../../shared/components/formik/InputField';
import { SelectDivision } from '../../../shared/components/select-division/select-division';
import { ToastContext } from '../../../shared/contexts/toast';

type CreateClassRoomRequest = {
  name: string;
  section: string;
}

type CreateClassroomProps = {
  schoolId: string;
  onUpdate?: () => void;
}

export function CreateClassroom({ schoolId, onUpdate }: CreateClassroomProps): JSX.Element {
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

  const onSubmit = async (values: CreateClassRoomRequest, { resetForm }: FormikHelpers<CreateClassRoomRequest>): Promise<void> => {
    try {
      await createClassroom(schoolId, { ...values, divisionId: division?.id });

      resetForm();
      setToast({ type: 'success', message: 'classroom created successfully' });
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const onDivisionSelect = (division: Division | undefined): void => {
    setDivision(division);
  };

  return (
    <div className="shadow-box">
      <h4>Create Class</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }): JSX.Element => (
          <FormikForm>
            <div className="d-flex justify-content-between">
              <InputField name="name" type="text" label="Class Name" />
              <InputField name="section" type="text" label="Section" />
            </div>
            <SelectDivision onDivisionSelect={onDivisionSelect} />
            {division && <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>{division['name']}</th>
                </tr>
                <tr>
                  <th>Amount</th>
                  <th>{division['amount']}</th>
                </tr>
                <tr>
                  <th>Day</th>
                  <th>{division['day']}</th>
                </tr>
                <tr>
                  <th>Start Date</th>
                  <th>{division['startDate']}</th>
                </tr>
                <tr>
                  <th>End Date</th>
                  <th>{division['endDate']}</th>
                </tr>
                <tr>
                  <th>Start Time</th>
                  <th>{division['startTime']}</th>
                </tr>
                <tr>
                  <th>End Time</th>
                  <th>{division['endTime']}</th>
                </tr>
              </thead>
            </Table>
            }
            <Button type="submit" disabled={isSubmitting}>Create</Button>
          </FormikForm>
        )}
      </Formik>
    </div >
  );
}
