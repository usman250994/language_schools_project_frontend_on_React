import React from 'react';
import { Row, Col } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

import { Division, listDivisions } from '../../../services/api-services/division';

import './select-division.scss';

type SelectDivisionProps = {
  onDivisionSelect?: (division: Division | undefined) => void;
  heading?: string;
  defaultDivision?: Division;
}

export function SelectDivision(props: SelectDivisionProps): JSX.Element {
  const { onDivisionSelect, heading, defaultDivision } = props;

  const loadDivision = async (inputValue: string): Promise<Division[]> => {
    const { data } = await listDivisions(0, 5, inputValue);

    return data;
  };

  return (
    <React.Fragment>
      <h5>{heading ?? 'Select Division'}</h5>
      <Row className="select-division">
        <Col>
          <AsyncSelect
            placeholder="Select Division"
            loadOptions={loadDivision}
            defaultOptions
            onChange={(value: any): void => {
              onDivisionSelect && onDivisionSelect(value);
            }}
            defaultValue={defaultDivision}
            getOptionLabel={(option: Division): string => `${option.name}: ${option.amount}`}
            getOptionValue={(option: Division): string => option.id}
          />

        </Col>
      </Row>
    </React.Fragment>
  );
}
