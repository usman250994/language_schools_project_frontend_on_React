import { useField } from 'formik';
import React from 'react';
import { Form } from 'react-bootstrap';

type DropdownProps = {
  placeholder?: string;
  label?: string;
  name: string;
  options: string[] | { [x: string]: string };
  disabled?: boolean;
}

export function Dropdown(props: DropdownProps): JSX.Element {
  const [field, meta] = useField(props);

  let options: { [x: string]: string } = {};
  if (Array.isArray(props.options)) {
    for (const item of props.options) {
      options[item] = item;
    }
  } else {
    options = props.options;
  }

  return (
    <Form.Group>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <Form.Control
        as="select"
        // value={`Choose ${props.label}`}
        {...field}
        isInvalid={!!(meta.touched && meta.error)}
      >
        {props.label && <option>{`Choose ${props.label}`}</option>}
        {Object.keys(options).map((item) => (
          <option key={item} value={item}>{options[item]}</option>
        ))}
      </Form.Control>
      {meta.touched && meta.error ? (
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      ) : null}
    </Form.Group>
  );
}
