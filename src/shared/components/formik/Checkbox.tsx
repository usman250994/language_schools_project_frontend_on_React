import { useField } from 'formik';
import React from 'react';
import { Form } from 'react-bootstrap';

type CheckboxProps = {
  placeholder?: string;
  label?: string;
  name: string;
  value?: any;
  disabled?: boolean;
  onClick?: () => void;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const [field, meta] = useField({
    placeholder: props.placeholder,
    name: props.name,
  });
  return (
    <Form.Group>
      <Form.Check
        checked={props.value()}
        id={props.name}
        {...field}
        {...props}
        isInvalid={!!(meta.touched && meta.error)}
      />
      {meta.touched && meta.error ? (
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      ) : null}
    </Form.Group>
  );
}
