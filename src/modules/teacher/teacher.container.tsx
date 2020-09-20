import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import CreateTeacher from './components/create-teacher';
import ListTeacher from './components/list-teacher';

function TeacherContainer(): JSX.Element {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h4>Teacher</h4>
      <Row>
        <Col>
          <ListTeacher refresh={refresh} onUpdate={(): void => setRefresh(!refresh)} />
          <CreateTeacher onUpdate={(): void => setRefresh(!refresh)} />
        </Col>
      </Row>
    </div>
  );
}

export default TeacherContainer;
