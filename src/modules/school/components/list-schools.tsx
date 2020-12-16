import { Formik, Form as FormikForm } from 'formik';
import React, { useCallback, useState, useContext } from 'react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { CellProps } from 'react-table';
import * as Yup from 'yup';

import { useDeleteModal } from '../../../hooks/delete-modal';
import { listSchools, School, deleteSchool, editSchool } from '../../../services/api-services/school';
import { AddButton, InfoButton, DeleteButton, CancelButton, EditButton, SaveButton } from '../../../shared/components/ActionButtons';
import { InputField } from '../../../shared/components/formik/InputField';
import { PhoneField } from '../../../shared/components/formik/PhoneField';
import { PaginatedTable } from '../../../shared/components/tables/paginated-table';
import { ToastContext } from '../../../shared/contexts/toast';

import { CreateClassModal } from './modals/create-class-modal';
import { ViewClassModal } from './modals/view-classroom-modal';

type CreateSchoolRequest = {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
}
interface ListSchoolsProps {
  onUpdate?: () => void;
  refresh: boolean;
}

function ListSchools(props: ListSchoolsProps): JSX.Element {
  const { onUpdate, refresh } = props;

  const history = useHistory();

  const setToast = useContext(ToastContext);

  const [searchParams, setSearchParams] = useState({ name: '' });

  const fn = useCallback((offset: number, limit: number) => listSchools(offset, limit, searchParams.name), [refresh, searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialDefaultValue = {
    id: '',
    email: '',
    name: '',
    address: '',
    phone: '',
  };
  const [initialValues, setInitialValues] = useState(initialDefaultValue);
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Required').label('Email'),
    name: Yup.string().min(3).required('Required').label('Name'),
    address: Yup.string().min(3).required('Required').label('Address'),
    phone: Yup.string().min(3).required('Required').label('Phone'),
  });

  const nameCell = (data: CellProps<School>): string | JSX.Element => {
    const school = data.row.original;
    if (initialValues.id === school.id) {
      return (
        <InputField type="text" name="name" disabled={isSubmitting} />
      );
    }

    return `${school.name}`;
  };

  const emailCell = (data: CellProps<School>): string | JSX.Element => {
    const school = data.row.original;
    if (initialValues.id === school.id) {
      return (
        <InputField type="email" name="email" disabled={isSubmitting} />
      );
    }

    return school.email;
  };

  const addressCell = (data: CellProps<School>): string | JSX.Element => {
    const school = data.row.original;
    if (initialValues.id === school.id) {
      return (
        <InputField type="text" name="address" disabled={isSubmitting} />
      );
    }

    return school.address;
  };

  const phoneCell = (data: CellProps<School>): string | JSX.Element => {
    const school = data.row.original;
    if (initialValues.id === school.id) {
      return (
        <PhoneField name="phone" id="phone" placeholder="Enter Phone Number" />
      );
    }

    return school.phone;
  };

  const [selectedSchool, setSelectedSchool] = useState<School>();

  const [createClassModalToggle, setCreateClassModalToggle] = useState(false);
  const [viewClassModalToggle, setViewClassModalToggle] = useState(false);

  const onSubmit = async (values: CreateSchoolRequest): Promise<void> => {
    setIsSubmitting(true);
    try {
      if (!initialValues) {
        throw new Error('Expected initial values');
      }
      const { id, ...payload } = values;

      await editSchool(id, payload);

      setInitialValues(initialDefaultValue);
      setToast({ type: 'success', message: 'Client created successfully' });

      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = useCallback(async (school: School): Promise<void> => {
    try {
      await deleteSchool(school.id);

      setToast({ type: 'success', message: 'School deleted Successfully' });

      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }, [setToast]);

  const nameFn = useCallback((school: School): string => school.name, []);
  const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, 'Delete School', nameFn);

  const openModal = (school: School, type: 'create' | 'show'): void => {
    setSelectedSchool(school);

    if (type === 'create') {
      setCreateClassModalToggle(true);
      setViewClassModalToggle(false);
    } else {
      setViewClassModalToggle(true);
      setCreateClassModalToggle(false);
    }
  };

  const onClose = (_refresh?: boolean): void => {
    setSelectedSchool(undefined);
    if (_refresh !== undefined) {
      if (onUpdate) {
        onUpdate();
      }
    }
  };

  const actionCell = (data: CellProps<School>): JSX.Element | string => {
    const school = data.row.original;
    if (initialValues.id === school.id) {
      return (
        <React.Fragment>
          <SaveButton type="submit" />
          <CancelButton onClick={(): void => setInitialValues(initialDefaultValue)} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <DeleteButton onClick={(): void => showDeleteModal(school)} title="Delete School" />
        <EditButton
          onClick={(): void => setInitialValues({
            id: school.id,
            email: school.email,
            name: school.name,
            address: school.address,
            phone: school.phone,
          })}
          title="Edit School"
          text="Edit School"
        />
        <InfoButton onClick={(): void => history.push(`/school/${school.id}/${school.name}/classrooms`)} title="Add Class" text="Add Class" />
      </React.Fragment>
    );
  };

  const columns = [{
    Header: 'Name',
    Cell: nameCell,
  }, {
    Header: 'Email',
    Cell: emailCell,
  }, {
    Header: 'Address',
    Cell: addressCell,
  }, {
    Header: 'Phone',
    Cell: phoneCell,
  }, {
    Header: ' ',
    Cell: actionCell,
  }];

  const searchBy = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    // await searchStudents({ keyword: e.target.value });

    setSearchParams({ name: e.target.value });
  };

  return (
    <div className="shadow-box">
      <h4>Schools</h4>

      <div className="d-flex justify-content-end">
        <Form.Group>
          <Form.Label>Search</Form.Label>
          <Form.Control onChange={searchBy} />
        </Form.Group>
      </div>

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <FormikForm>
          <PaginatedTable
            fn={fn}
            pageSize={10}
            columns={columns}
          />
        </FormikForm>
      </Formik>

      {selectedSchool &&
        <CreateClassModal
          show={createClassModalToggle}
          school={selectedSchool}
          onClose={onClose}
        />}
      {selectedSchool &&
        <ViewClassModal
          show={viewClassModalToggle}
          school={selectedSchool}
          onClose={onClose}
        />}
      <DeleteModal
        message={(school: School): JSX.Element => (
          <React.Fragment>
            This action cannot be undone. This will permanently delete the <strong>{school.name}</strong> school and its classes.
          </React.Fragment>
        )}
        confirmValue={(school: School): string => school.name}
      />
    </div>
  );
}

export default ListSchools;
