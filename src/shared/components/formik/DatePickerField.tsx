import { useField } from 'formik';
import React, { useCallback } from 'react';
import { FormGroup, Form } from 'react-bootstrap';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerField.scss';

type DatePickerField = Omit<ReactDatePickerProps, 'onChange'> & Partial<Pick<ReactDatePickerProps, 'onChange'>> & {
  placeholder?: string;
  name: string;
  label?: string;
}

export function DatePickerField(props: DatePickerField): JSX.Element {
  const { onChange } = props;
  const [field, meta, helper] = useField<Date | null>(props);

  const _onFocus = useCallback((): void => helper.setTouched(true), [helper]);
  const _onChange = useCallback((value: Date | null): void => {
    helper.setValue(value);

    if (onChange) {
      onChange(value, undefined);
    }
  }, [helper, onChange]);

  return (
    <FormGroup>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <DatePicker
        dateFormat="MM/dd/yyyy"
        {...field}
        {...props}
        placeholderText={props.placeholder}
        value={undefined}
        selected={field.value}
        onBlur={field.onBlur}
        onChange={_onChange}
        onFocus={_onFocus}
        className="form-control"
      />
      {meta.touched && meta.error ? (
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      ) : null}
    </FormGroup>

  );
}
