import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

import { listSchoolsClassrooms, listSchools } from '../../../services/api-services/school';

type SelectClassProps = {
  onAddClass?: (classRoomId: string) => void;
  onClassSelect?: (classRoomId: string | undefined) => void;
  onSchoolSelect?: (schoolRoomId: string | undefined) => void;
}

export function SelectClass (props: SelectClassProps): JSX.Element {
  const { onAddClass, onClassSelect, onSchoolSelect } = props;

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>();
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>();

  const loadClasses = async (inputValue: string): Promise<{value: string; label: string}[] | undefined> => {
    if (selectedSchoolId) {
      const { data } = await listSchoolsClassrooms(selectedSchoolId, 0, 5, inputValue);

      return data.map(d => ({value: d.id, label: `${d.name} ${d.section}`}));
    }
  };

  const loadSchools = async (inputValue: string): Promise<{value: string; label: string}[]> => {
    const { data } = await listSchools(0, 5, inputValue);

    return data.map(d => ({value: d.id, label: d.name}));
  };

  return (
    <React.Fragment>
      <h5>Select Class</h5>
      <Row>
        <Col>
          <AsyncSelect
            placeholder="Select School"
            loadOptions={loadSchools}
            defaultOptions
            onChange={(value: any): void => {
              setSelectedSchoolId(value.value);
              onSchoolSelect && onSchoolSelect(value.value);
            }}
            onMenuOpen={() => {
              setSelectedSchoolId(undefined);
              setSelectedClassroomId(undefined);
              onSchoolSelect && onSchoolSelect(undefined);
              onClassSelect && onClassSelect(undefined);
            }}
          />

        </Col>
        <Col>
          {selectedSchoolId &&
            <AsyncSelect
              placeholder="Select Class"
              loadOptions={loadClasses}
              defaultOptions
              onChange={(val: any): void => {
                setSelectedClassroomId(val.value);
                onClassSelect && onClassSelect(val.value);
              }}
            />}
        </Col>
      </Row>
      {onAddClass && <div style={{ textAlign: 'end', marginTop: '1rem' }}>
        <Button disabled={!selectedClassroomId} onClick={(): void => {
          if (selectedClassroomId) {
            onAddClass && onAddClass(selectedClassroomId);
          }
        }}
        > Add </Button>
      </div>}
    </React.Fragment>
  );
}
