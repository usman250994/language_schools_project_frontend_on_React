import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { CreateClassroom } from './components/create-classroom';
import { ListClassroom } from './components/list-classroom';

function ClassroomContainer(): JSX.Element {
  const [refresh, setRefresh] = useState(false);

  const { schoolId, schoolName } = useParams<{ schoolId: string; schoolName: string }>();

  return (
    <div>
      <h4>School: {schoolName}</h4>
      <Row>
        <Col>
          <CreateClassroom schoolId={schoolId} onUpdate={(): void => setRefresh(!refresh)} />
          <ListClassroom schoolId={schoolId} refresh={refresh} onUpdate={(): void => setRefresh(!refresh)} />
        </Col>
      </Row>
    </div>
  );
}

export default ClassroomContainer;
