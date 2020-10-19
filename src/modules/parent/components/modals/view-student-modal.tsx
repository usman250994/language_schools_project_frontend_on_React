import { Formik, Form as FormikForm } from 'formik';
import React, { useCallback, useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CellProps } from 'react-table';
import * as Yup from 'yup';

import { useDeleteModal } from '../../../../hooks/delete-modal';
import { School, Classroom, deleteClassroom } from '../../../../services/api-services/school';
import { User, listUsers, deleteUser, editUser, listParentStudent } from '../../../../services/api-services/user';
import { UserRole } from '../../../../services/role-management/roles';
import { DeleteButton } from '../../../../shared/components/ActionButtons';
import { InputField } from '../../../../shared/components/formik/InputField';
import { PaginatedTable } from '../../../../shared/components/tables/paginated-table';
import ReactTable from '../../../../shared/components/tables/table';
import { ToastContext } from '../../../../shared/contexts/toast';

interface ViewTeacherModalProps {
  show: boolean;
  parentId: string;
  onClose: (toogle?: boolean) => void;
  title: string;
}

type UpdateStudentRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function ViewTeacherModal(props: ViewTeacherModalProps): JSX.Element {
  const { show, parentId, title, onClose } = props;
  const setToast = useContext(ToastContext);

  const fn = useCallback((offset: number, limit: number) => listParentStudent(parentId, offset, limit), [parentId]);
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

  const onDelete = useCallback(async (_parent: User): Promise<void> => {
    try {
      await deleteUser(_parent.id);
      setToast({ type: 'success', message: 'Student deleted successfully' });

      onClose(true);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }, []);
  const nameFn = useCallback((user: User): string => `${user.firstName} ${user.lastName}`, []);
  const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, 'Delete Student', nameFn);

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

  const actionCell = (data: CellProps<User>): JSX.Element | string => {
    const student = data.row.original;

    return (
      <React.Fragment>
        <DeleteButton onClick={(): void => showDeleteModal(student)} />
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
  }, {
    Header: ' ',
    Cell: actionCell,
  }];

  const onSubmit = async (values: UpdateStudentRequest): Promise<void> => {
    setIsSubmitting(true);
    try {
      if (!initialValues) {
        throw new Error('Expected initial values');
      }
      const { id, ...payload } = values;

      await editUser(id, payload);

      setInitialValues(initialDefaultValue);
      setToast({ type: 'success', message: 'Student created successfully' });

      // if (onUpdate) {
      //   onUpdate();
      // }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} className="account-request-view-modal">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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

      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={(): void => onClose()}>
          Close
        </Button>
      </Modal.Footer>
      <DeleteModal />
    </Modal>
  );
}
