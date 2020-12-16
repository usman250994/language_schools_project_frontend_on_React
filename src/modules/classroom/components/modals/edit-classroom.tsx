import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import * as Yup from 'yup';

import { School, createClassroom, DaysText, ClassRoomWithTimeTable, editClassroom } from '../../../../services/api-services/school';
import { Dropdown } from '../../../../shared/components/formik/Dropdown';
import { InputField } from '../../../../shared/components/formik/InputField';
import { ToastContext } from '../../../../shared/contexts/toast';

interface CreateClassModalProps {
  show: boolean;
  classroom: ClassRoomWithTimeTable;
  schoolId: string;
  onClose: (refresh?: boolean) => void;
}

type CreateClassRoomRequest = {
  name: string;
  section: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  day: string;
}

export function EditClassroomModal(props: CreateClassModalProps): JSX.Element {
  const { show, classroom, schoolId, onClose } = props;
  const setToast = useContext(ToastContext);

  const initialValues = {
    name: classroom.name,
    section: classroom.section,
    startDate: classroom.timeTable?.startDate || '',
    endDate: classroom.timeTable?.endDate || '',
    startTime: classroom.timeTable?.startTime || '',
    endTime: classroom.timeTable?.endTime || '',
    day: classroom.timeTable?.day || '',
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1).required('Required').label('name'),
    section: Yup.string().min(1).required('Required').label('section'),
    startDate: Yup.string().label('startDate'),
    endDate: Yup.string().label('endDate'),
    startTime: Yup.string().label('startTime'),
    endTime: Yup.string().label('endTime'),
    day: Yup.string().label('day'),
  });

  const onSubmit = async (values: CreateClassRoomRequest, { resetForm }: FormikHelpers<CreateClassRoomRequest>): Promise<void> => {
    try {
      await editClassroom(classroom.id, schoolId, values);

      resetForm();
      setToast({ type: 'success', message: 'classroom created successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      onClose(true);
    }
  };

  return (
    <Modal show={show} onHide={(): void => onClose()}>

      <Modal.Body className="subscribe-modal">
        <h4>Create Class</h4>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting }): JSX.Element => (
            <FormikForm>
              <div className="d-flex justify-content-between">
                <InputField name="name" type="text" label="Class Name" />
                <InputField name="section" type="text" label="Section" />
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
      </Modal.Body>

    </Modal >
  );
}
