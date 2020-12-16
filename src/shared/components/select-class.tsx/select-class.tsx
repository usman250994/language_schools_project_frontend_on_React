import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { ValueType } from 'react-select';
import AsyncSelect from 'react-select/async';

import { listSchoolsClassrooms, listSchools, School, Classroom } from '../../../services/api-services/school';

import './select-class.scss';

type SelectClassProps = {
  onAddClass?: (classRoomId: string) => void;
  onClassSelect?: (classRoomId: string | undefined) => void;
  onSchoolSelect?: (schoolRoomId: string | undefined) => void;
  defaultSchool?: School;
  defaultClassRoom?: Classroom;
  heading?: string;
}

export function SelectClass (props: SelectClassProps): JSX.Element {
  const { onAddClass, onClassSelect, onSchoolSelect, heading, defaultSchool, defaultClassRoom } = props;

  const [selectedSchoolId, setSelectedSchoolId] = useState(defaultSchool?.id);
  const [selectedClassroomId, setSelectedClassroomId] = useState(defaultClassRoom?.id);

  const loadClasses = async (inputValue: string): Promise<{id: string; name: string}[] | undefined> => {
    if (selectedSchoolId) {
      const { data } = await listSchoolsClassrooms(selectedSchoolId, 0, 5, inputValue);

      return data.map(d => ({id: d.id, name: `${d.name} ${d.section}`}));
    }
  };

  const loadSchools = async (inputValue: string): Promise<{id: string; name: string}[]> => {
    const { data } = await listSchools(0, 5, inputValue);

    return data.map(d => ({id: d.id, name: d.name}));
  };

  return (
    <div className="select-class">
      <h5>{heading ?? 'Select School'}</h5>
      <Row>
        <Col>
          <AsyncSelect
            placeholder="Select School"
            loadOptions={loadSchools}
            defaultOptions
            onChange={(value: any): void => {
              setSelectedSchoolId(value.id);
              onSchoolSelect && onSchoolSelect(value.id);
            }}
            onMenuOpen={() => {
              setSelectedSchoolId(undefined);
              setSelectedClassroomId(undefined);
              onSchoolSelect && onSchoolSelect(undefined);
              onClassSelect && onClassSelect(undefined);
            }}
            defaultValue={defaultSchool}
            getOptionLabel={(option: School): string => option.name}
            getOptionValue={(option: School): string => option.id}
          />

        </Col>
        <Col>
          {selectedSchoolId &&
            <AsyncSelect
              placeholder="Select Class"
              loadOptions={loadClasses}
              defaultOptions
              onChange={(val: any): void => {
                setSelectedClassroomId(val.id);
                onClassSelect && onClassSelect(val.id);
              }}
              defaultValue={defaultClassRoom}
              getOptionLabel={(option: Classroom): string => option.name}
              getOptionValue={(option: Classroom): string => option.id}
            />}
        </Col>
      </Row>
      {onAddClass && <div className="add-btn">
        <Button disabled={!selectedClassroomId} onClick={(): void => {
          if (selectedClassroomId) {
            onAddClass && onAddClass(selectedClassroomId);
          }
        }}
        > Add </Button>
      </div>}
    </div>
  );
}
