import { useField } from 'formik';
import React, { useState, CSSProperties, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import { ValueType, OptionsType } from 'react-select';
import ReactSelect from 'react-select';
import { useDebouncedCallback } from 'use-debounce';

import './TypeAheadField.scss';

export type CreatableTypeAheadValue = {
  label: string;
  value: string;
}

type CreatableTypeAheadFieldProps = {
  label: string;
  name: string;
  debounce?: number;
  disabled?: boolean;
  fetchOptions: (query: string) => Promise<CreatableTypeAheadValue[]>;
}

export function CreatableTypeAheadField({ debounce = 500, fetchOptions, ...props }: CreatableTypeAheadFieldProps): JSX.Element {
  const [field, meta, helper] = useField<string>(props);
  const [options, setOptions] = useState<OptionsType<CreatableTypeAheadValue>>([]);
  const [inputValue, setInputValue] = useState('');

  const [getOptionDebounced] = useDebouncedCallback(async (query: string) => {
    const opts = await fetchOptions(query);

    if (query) {
      opts.push({
        label: query,
        value: query,
      });
    }

    setOptions(opts);
  }, debounce);

  const onInputChange = (query: string): void => {
    setInputValue(query);
    setOptions([{ label: query, value: query }]);
    getOptionDebounced(query);
  };

  const onChange = useCallback((value: ValueType<CreatableTypeAheadValue>): void => {
    helper.setValue(value ? (value as CreatableTypeAheadValue).value : '');
  }, [helper]);

  const onFocus = useCallback((): void => helper.setTouched(true), [helper]);

  const onBlur = useCallback((e: React.FocusEvent): void => {
    if (inputValue) {
      onChange({ label: inputValue, value: inputValue });
    }

    field.onBlur(e);
  }, [field, inputValue, onChange]);

  return (
    <Form.Group className="multi-select-field">
      <Form.Label>{props.label}</Form.Label>
      <ReactSelect
        isMulti={false}
        isClearable
        isSearchable
        value={{
          label: field.value,
          value: field.value,
        }}
        placeholder={`Choose ${props.label}...`}
        options={options}
        onInputChange={onInputChange}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="is-invalid"
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
