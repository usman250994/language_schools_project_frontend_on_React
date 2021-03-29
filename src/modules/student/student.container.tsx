import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { addClassToUser } from '../../services/api-services/school';
import { SelectClass } from '../../shared/components/select-class.tsx/select-class';
import { SelectParent } from '../../shared/components/select-parent/select-parent';

import { CreateStudent } from './components/create-student';
import ListStudent from './components/list-students';

function StudentContainer(): JSX.Element {
  const [refresh, setRefresh] = useState(false);
  const [parentSelected, setParentSelected] = useState<string>();
  const [classSelected, setClassSelected] = useState<string>();

  const _setParentSelected = (_parentId?: string): void => {
    setRefresh(!refresh);
    setParentSelected(_parentId);
  };

  const _setClassSelected = (_classroomId?: string): void => {
    //refresh here
    setClassSelected(_classroomId);
  };
  const studentSelected = (userId: string) => {
    //todo: if class not selcted then show msg to select class first
    addClassToUser(classSelected, userId);
  };

  return (
    <div>
      <h4>Manage Students</h4>
      {/* <Row>
        <Col>
          <div className="shadow-box">
            <SelectClass onClassSelect={_setClassSelected} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="shadow-box">
            {classSelected ? <ListStudent refresh={refresh} onUpdate={(): void => setRefresh(!refresh)} classId={classSelected} /> : <h3>need to select school</h3>}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="shadow-box">
            <SelectParent onParentSelect={_setParentSelected} />
          </div>
        </Col>
      </Row> */}
      <ListStudent refresh={refresh} onUpdate={(): void => setRefresh(!refresh)} />
      <CreateStudent onUpdate={(): void => setRefresh(!refresh)} />
    </div>
  );
}

export default StudentContainer;
