import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { SelectClass } from '../../shared/components/select-class.tsx/select-class';

import { CreateAssignments } from './components/create-assignments';
import ListAssignments from './components/list-assignments';

function AssignmentsContainer(): JSX.Element {
  const [refresh, setRefresh] = useState(false);
  const [classSelected, setClassSelected] = useState<string>();

  const _setClassSelected = (_classroomId?: string): void => {
    setClassSelected(_classroomId);
  };

  return (
    <div>
      <h4>Assignments</h4>
      <Row>
        <Col>
          <div className="shadow-box">
            <SelectClass onClassSelect={_setClassSelected}/>
          </div>
          {classSelected && <CreateAssignments setClassSelected={_setClassSelected} classSelected={classSelected} onUpdate={(): void => setRefresh(!refresh)} />}
          {classSelected && <ListAssignments classSelected={classSelected} refresh={refresh} onUpdate={(): void => setRefresh(!refresh)} />}
        </Col>
      </Row>
    </div>
  );
}

export default AssignmentsContainer;
