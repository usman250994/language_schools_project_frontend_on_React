import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import CreateSchool from './components/create-school';
import ListSchools from './components/list-schools';

function SchoolContainer(): JSX.Element {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h4>School</h4>
      <Row>
        <Col>
          <ListSchools refresh={refresh} onUpdate={(): void => setRefresh(!refresh)} />
          <CreateSchool onUpdate={(): void => setRefresh(!refresh)} />
        </Col>
      </Row>
    </div>
  );
}

export default SchoolContainer;
