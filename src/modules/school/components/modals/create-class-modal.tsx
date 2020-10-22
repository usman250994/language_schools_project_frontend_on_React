import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { start } from 'repl';
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
  startDate: number;
  endDate: number;
  wweekdays: number[]
}

export function CreateClassModal(props: CreateClassModalProps): JSX.Element {
  const { show, school, onClose } = props;
  const setToast = useContext(ToastContext);

  const initialValues: any = {
    // interface to be defined instead of any 
    name: '',
    section: '',
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date(new Date().setDate(new Date().getDate() + 365)).toISOString().substr(0, 10),
    monday: '09' + ':' + '00',
    tuesday: '09' + ':' + '00',
    wednesday: '09' + ':' + '00',
    thursday: '09' + ':' + '00',
    friday: '09' + ':' + '00',
  };
  const today = new Date();
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1).required('Required').label('name'),
    section: Yup.string().min(1).required('Required').label('section'),
    startDate: Yup.date().required('Required field').label('startDate'),
    // endDate: Yup.date().required('Required field')
    //   .nullable()
    //   .default(undefined).label('endDate'),
    // monday: Yup.string().min(5).required('Required').label('monday'),
    // tuesday: Yup.string().matches(/^[0-9]*$/).label('tuesday'),
    // wednesday: Yup.string().matches(/^[0-9]*$/).label('wednesday'),
    // thursday: Yup.string().matches(/^[0-9]*$/).label('thursday'),
    // friday: Yup.string().matches(/^[0-9]*$/).label('friday'),
  });

  const onSubmit = async (values: any, { resetForm }: FormikHelpers<any>): Promise<void> => {
    try {
      const { name, section, monday, tuesday, wednesday, thursday, friday, startDate, endDate } = values;
      console.log(typeof monday)
      console.log(monday)
      const weekdays = [];
      weekdays.push(monday.toString().replace(':', ''))
      weekdays.push(tuesday.toString().replace(':', ''))
      weekdays.push(wednesday.toString().replace(':', ''))
      weekdays.push(thursday.toString().replace(':', ''))
      weekdays.push(friday.toString().replace(':', ''))
      let req = {
        name,
        section,
        startDate: parseInt((new Date(startDate).getTime() / 1000).toFixed(0)),
        endDate: parseInt((new Date(endDate).getTime() / 1000).toFixed(0)),
        weekdays
      }
      await createClassroom(school.id, req);

      resetForm();
      setToast({ type: 'success', message: 'classroom created successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      onClose(true);
    }
  };

  return (
    <Modal show={show} size="sm" onHide={(): void => onClose()
    }>

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
              <InputField type="date" label="start Date" name="startDate" />
              <InputField type="date" label="end Date" name="endDate" />
              <InputField type="time" label="Monday" name="monday" />
              <InputField type="time" label="Tuesday" name="tuesday" />
              <InputField type="time" label="Wednesday" name="wednesday" />
              <InputField type="time" label="Thursday" name="thursday" />
              <InputField type="time" label="Friday" name="friday" />
              <Button type="submit" disabled={isSubmitting}>Create</Button>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>

    </Modal >
  );
}
