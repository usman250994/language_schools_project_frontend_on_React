import { Formik, Form as FormikForm } from 'formik';
import React, { useCallback, useState, useContext } from 'react';
import { CellProps } from 'react-table';
import * as Yup from 'yup';
import { listUsers, UserStudent, editUser, deleteUser, listParentStudent, listUsersOfClass } from '../../../services/api-services/user';
import { InputField } from '../../../shared/components/formik/InputField';
import { DeleteButton, CancelButton, EditButton, SaveButton, InfoButton, AddButton } from '../../../shared/components/ActionButtons';
import { useDeleteModal } from '../../../hooks/delete-modal';
import { PaginatedTable } from '../../../shared/components/tables/paginated-table';
import { ToastContext } from '../../../shared/contexts/toast';
import { UserRole } from '../../../services/role-management/roles';
import { deleteClassroomFromUser } from '../../../services/api-services/school';

type UpdateStudentRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob?: string | null;
  active: boolean;
}

interface ListStudentProps {
  onUpdate?: () => void;
  refresh: boolean;
  parentId?: string | undefined
  classId?: string;
  studentSelected?: (userId: string) => void;
}

function ListStudent(props: ListStudentProps): JSX.Element {
  const { onUpdate, refresh, parentId, classId, studentSelected } = props;
  const fn = useCallback((offset: number, limit: number) => { return classId ? listUsersOfClass(UserRole.STUDENT, classId, offset, limit) : (parentId ? listParentStudent(parentId, offset, limit) : listUsers(UserRole.STUDENT, offset, limit)) }, [refresh]);
  const initialDefaultValue = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    active: true, //could be determined by checking last class enrolled year
  };

  const [initialValues, setInitialValues] = useState(initialDefaultValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setToast = useContext(ToastContext);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(3).required('Required').label('firstName'),
    lastName: Yup.string().min(3).required('Required').label('lastName'),
    email: Yup.string().email().required('Required').label('Email'),
    // active: Yup.boolean().required('Required').label('active'),
    dob: Yup.string().min(3).required('Required').label('DOB')
  });

  const emailCell = (data: CellProps<UserStudent>): string | JSX.Element => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <InputField type="email" name="email" disabled={isSubmitting} />
      );
    }
    return user.email;
  };

  const firstNameCell = (data: CellProps<UserStudent>): string | JSX.Element => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <InputField type="text" name="firstName" disabled={isSubmitting} />
      );
    }

    return `${user.firstName}`;
  };

  const lastNameCell = (data: CellProps<UserStudent>): string | JSX.Element => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <InputField type="text" name="lastName" disabled={isSubmitting} />
      );
    }
    return `${user.lastName}`;
  };

  const dob = (data: CellProps<UserStudent>): string | JSX.Element => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <InputField type="text" name="dob" disabled={isSubmitting} />
      );
    }
    return `${user.dob}`;
  };

  const active = (data: CellProps<UserStudent>): boolean | JSX.Element => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <InputField type="text" name="active" disabled={isSubmitting} />
      );
    }
    return true;
  };
  const onSubmit = async (values: UpdateStudentRequest): Promise<void> => {
    setIsSubmitting(true);

    try {
      if (!initialValues) {
        throw new Error('Expected initial values');
      }
      //for now omitting dob will send it ina  nicer way 
      const { id, active, dob, ...payload } = values;


      await editUser(id, payload);

      setInitialValues(initialDefaultValue);
      setToast({ type: 'success', message: 'Student created successfully' });

      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = useCallback(async (user: UserStudent): Promise<void> => {
    try {
      if (classId) {
        await deleteClassroomFromUser(classId, user.id)
        setToast({ type: 'success', message: 'Student removed Successfully' });
      }
      else {
        await deleteUser(user.id);

        setToast({ type: 'success', message: 'Student deleted Successfully' });

        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }, [setToast]);

  const nameFn = useCallback((user: UserStudent): string => `${user.firstName} ${user.lastName}`, []);
  const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, classId ? 'Remove Student From Class' : 'Delete Student', nameFn);


  const addStudentToClass = (userId: string) => {
    if (studentSelected) {
      studentSelected(userId);
    }

  }
  const actionCell = (data: CellProps<UserStudent>): JSX.Element | string => {
    const user = data.row.original;
    if (initialValues.id === user.id) {
      return (
        <React.Fragment>
          <SaveButton type="submit" />
          <CancelButton onClick={(): void => setInitialValues(initialDefaultValue)} />
        </React.Fragment>
      );
    }

    if (classId) return (
      <React.Fragment>
        <DeleteButton onClick={(): void => showDeleteModal(user)} title="Delete Student" />
      </React.Fragment>
    );
    else return (
      <React.Fragment>
        <EditButton
          onClick={(): void => setInitialValues({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            dob: new Date().toString(),
            active: true
          })}
          title="Edit Student"
          text="Edit Student"
        />
        <DeleteButton onClick={(): void => showDeleteModal(user)} title="Delete Student" />
        <AddButton variant="primary" onClick={(): void => addStudentToClass(user.id)} title="Add Student" text="Add Student" />
      </React.Fragment>
    );
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
  }
    ,
  {
    Header: 'Date of Birth',
    Cell: dob,
  },
  {
    Header: 'Active',
    Cell: active,
  },
  {
    Header: ' ',
    Cell: actionCell,
  }];

  return (
    <div className="shadow-box">
      <h4>STUDENTS</h4>

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

      <DeleteModal
        message={(user: UserStudent): JSX.Element => (
          <React.Fragment>
            This action cannot be undone. This will permanently delete the <strong>{user.firstName} {user.lastName}</strong> and its data.
          </React.Fragment>
        )}
        confirmValue={(user: UserStudent): string => `${user.firstName} ${user.lastName}`}
      />
    </div>
  );
}

export default ListStudent;
