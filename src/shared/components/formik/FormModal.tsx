import { Formik, Form as FormikForm, FormikHelpers, FormikProps } from 'formik';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import * as Yup from 'yup';

type FormModalProps<T> = {
    show: boolean;
    size?: 'sm' | 'lg' | 'xl';
    initialValues: T;
    enableReinitialize?: boolean;
    validationSchema: Yup.ObjectSchema;
    title: string;
    children: (props: FormikProps<T>) => JSX.Element;
    onClose: () => void;
    onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => Promise<void>;
  }

export function FormModal<T>(props: FormModalProps<T>): JSX.Element {
  const { show, size, initialValues, enableReinitialize = false, validationSchema, title, children: Form, onClose, onSubmit } = props;

  return (
    <Modal show={show} size={size} onHide={onClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={enableReinitialize}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(_props): JSX.Element => (
          <FormikForm>
            <Modal.Header>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form {..._props} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onClose} disabled={_props.isSubmitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={_props.isSubmitting}>
                Save
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
}
