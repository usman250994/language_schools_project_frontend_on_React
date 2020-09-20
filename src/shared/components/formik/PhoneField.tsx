import { useField } from 'formik';
import React from 'react';
import { Form } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';

import 'react-phone-input-2/lib/style.css';
import './phone-field.scss';

type CountryData = {
  name: string;
  dialCode: string;
  countryCode: string;
  format: string;
}

type PhoneValue = {
  phone_number: string;
  country_code: string;
}

type PhoneFieldProps = {
  name: string;
  id: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PhoneField(props: PhoneFieldProps): JSX.Element {
  const [field, meta, helper] = useField<string>(props);

  return (
    <Form.Group>

      <PhoneInput
        placeholder="Enter phone number"
        {...field}
        {...props}
        value={props.value}
        onChange={(phone: string, country: CountryData): void => {
          helper.setTouched(true);
          helper.setValue(country.dialCode + phone);
        }}
        country="de"
        inputStyle={{
          width: '100%',
        }}
        inputClass={meta.touched && meta.error ? 'is-invalid' : ''}
        inputProps={{
          name: props.name,
        }}
      />
      {meta.touched && meta.error ? (
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      ) : null}
    </Form.Group>
  );
}
