import { Formik, Form as FormikForm } from 'formik';
import React, { useCallback, useState, useContext } from 'react';
import { CellProps } from 'react-table';
import * as Yup from 'yup';

import { useDeleteModal } from '../../../hooks/delete-modal';
import { listUsers, User, editUser, deleteUser } from '../../../services/api-services/user';
import { UserRole } from '../../../services/role-management/roles';
import { DeleteButton, CancelButton, EditButton, SaveButton, InfoButton } from '../../../shared/components/ActionButtons';
import { InputField } from '../../../shared/components/formik/InputField';
import { PaginatedTable } from '../../../shared/components/tables/paginated-table';
import { ToastContext } from '../../../shared/contexts/toast';

import { ViewClassModal } from './modals/view-class-modal';

type UpdateTeacherRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
interface ListTeacherProps {
  onUpdate?: () => void;
  refresh: boolean;
}

function ListTeacher(props: ListTeacherProps): JSX.Element {
  const { onUpdate, refresh } = props;

  const setToast = useContext(ToastContext);

  const fn = useCallback((offset: number, limit: number) => listUsers(UserRole.TEACHER, offset, limit), [refresh]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialDefaultValue = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  };
  const [initialValues, setInitialValues] = useState(initialDefaultValue);
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(3).required('Required').label('firstName'),
    lastName: Yup.string().min(3).required('Required').label('lastName'),
    email: Yup.string().email().required('Required').label('Email'),
  });

  const firstNameCell = (data: CellProps<User>): string | JSX.Element => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <InputField type="text" name="firstName" disabled={isSubmitting} />
      );
    }

    return `${user.firstName}`;
  };
  const lastNameCell = (data: CellProps<User>): string | JSX.Element => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <InputField type="text" name="lastName" disabled={isSubmitting} />
      );
    }

    return `${user.lastName}`;
  };

  const emailCell = (data: CellProps<User>): string | JSX.Element => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <InputField type="email" name="email" disabled={isSubmitting} />
      );
    }

    return user.email;
  };

  const [selectedUser, setSelectedUser] = useState<User>();

  // const [createClassModalToggle, setCreateClassModalToggle] = useState(false);
  const [viewClassModalToggle, setViewClassModalToggle] = useState(false);

  const onSubmit = async (values: UpdateTeacherRequest): Promise<void> => {
    setIsSubmitting(true);
    try {
      if (!initialValues) {
        throw new Error('Expected initial values');
      }
      const { id, ...payload } = values;

      await editUser(id, payload);

      setInitialValues(initialDefaultValue);
      setToast({ type: 'success', message: 'Teacher created successfully' });

      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = useCallback(async (user: User): Promise<void> => {
    try {
      await deleteUser(user.id);

      setToast({ type: 'success', message: 'Teacher deleted Successfully' });

      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }, [setToast]);

  const nameFn = useCallback((user: User): string => `${user.firstName} ${user.lastName}`, []);
  const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, 'Delete Teacher', nameFn);

  const actionCell = (data: CellProps<User>): JSX.Element | string => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <React.Fragment>
          <SaveButton type="submit" />
          <CancelButton onClick={(): void => setInitialValues(initialDefaultValue)} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <DeleteButton onClick={(): void => showDeleteModal(user)} title="Delete Teacher" />
        <EditButton
          onClick={(): void => setInitialValues({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          })}
          title="Edit Teacher"
          text="Edit Teacher"
        />
        <InfoButton onClick={(): void => {setSelectedUser(user);setViewClassModalToggle(!viewClassModalToggle);}} title="View Class" text="View Class" />
      </React.Fragment>
    );
  };

  const onClose = (_refresh?: boolean): void => {
    setSelectedUser(undefined);
    setViewClassModalToggle(!viewClassModalToggle);
    if (_refresh !== undefined) {
      if (onUpdate) {
        onUpdate();
      }
    }
  };

  const columns = [{
    Header: 'First Name',
    Cell: firstNameCell,
  }, {
    Header: 'Last Name',
    Cell: lastNameCell,
  }, {
    Header: 'Email',
    Cell: emailCell,
  }, {
    Header: ' ',
    Cell: actionCell,
  }];

  return (
    <div className="shadow-box">
      <h4>Teachers</h4>

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

      {selectedUser &&
        <ViewClassModal
          show={viewClassModalToggle}
          teacherId={selectedUser ? selectedUser.id : ''}
          onClose={onClose}
        />}

      <DeleteModal
        message={(user: User): JSX.Element => (
          <React.Fragment>
            This action cannot be undone. This will permanently delete the <strong>{user.firstName} {user.lastName}</strong> and its data.
          </React.Fragment>
        )}
        confirmValue={(user: User): string => `${user.firstName} ${user.lastName}`}
      />
    </div>
  );
}

export default ListTeacher;
