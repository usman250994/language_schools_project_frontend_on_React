import { useField } from 'formik';
import React from 'react';
import { Form } from 'react-bootstrap';

type InputFieldProps<T> = {
  type: string;
  name: string;
  value?: T;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

type TextFieldProps = InputFieldProps<string> & {
  type: 'text' | 'email' | 'password';
  value?: string;
}

type NumberFieldProps = InputFieldProps<number> & {
  type: 'number';
  value?: number;
  min?: number;
  max?: number;
}

export function InputField<T>(props: TextFieldProps | NumberFieldProps): JSX.Element {
  const [field, meta] = useField<T>(props);

  const value = ((field.value || props.value || '') as string).toString();

  return (
    <Form.Group>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <Form.Control
        {...field}
        {...props}
        value={value}
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
