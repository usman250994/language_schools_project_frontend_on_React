import { useField } from 'formik';
import React, { useState, KeyboardEvent, CSSProperties } from 'react';
import { Form } from 'react-bootstrap';
import ReactSelect, { ValueType } from 'react-select';

import './ChipsField.scss';

type ChipValue = {
  label: string;
  value: string;
}

type ChipsFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

export function ChipsField(props: ChipsFieldProps): JSX.Element {
  const [field, meta, helper] = useField<string[]>(props);
  const [inputValue, setInputValue] = useState('');

  const values: ValueType<ChipValue[]> = (field.value || []).map((value) => ({
    label: value,
    value,
  }));

  const onChange = (value: ValueType<ChipValue>): void => {
    helper.setValue(((value || []) as ChipValue[]).map((item) => item.value));
  };

  const onFocus = (): void => helper.setTouched(true);

  const onBlur = (e: React.FocusEvent): void => {
    if (inputValue && !values.map((item) => item.value).includes(inputValue)) {
      onChange([...values, { label: inputValue, value: inputValue }]);
    }

    setInputValue('');
    field.onBlur(e);
  };

  const onInputChange = (value: string): void => {
    setInputValue(value);
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!inputValue) {
      return;
    }

    switch (event.key) {
    case 'Enter':
    case 'Tab':
      if (inputValue && !values.map((item) => item.value).includes(inputValue)) {
        onChange([...values, { label: inputValue, value: inputValue }]);
      }

      setInputValue('');
      event.preventDefault();
    }
  };

  const components = {
    DropdownIndicator: null,
  };

  return (
    <Form.Group className="multi-select-field">
      <Form.Label>{props.label}</Form.Label>
      <ReactSelect
        isMulti
        isClearable
        value={values}
        inputValue={inputValue}
        placeholder={props.placeholder || `Add ${props.label}...`}
        onChange={onChange}
        onInputChange={onInputChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        menuIsOpen={false}
        className="is-invalid chip-view"
        components={components}
        isDisabled={props.disabled}
        styles={{
          control: (base, state): CSSProperties => ({
            ...base,
            transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
            ...(state.isFocused && {
              boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
              borderColor: '#80bdff',
              ':hover': {
                borderColor: '#80bdff',
              },
            }),
          }),
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
