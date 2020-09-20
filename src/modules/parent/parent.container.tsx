import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import CreateParent from './components/create-parent';
import ListParent from './components/list-parent';

function ParentContainer(): JSX.Element {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h4>Parent</h4>
      <Row>
        <Col>
          <ListParent refresh={refresh} onUpdate={(): void => setRefresh(!refresh)} />
          <CreateParent onUpdate={(): void => setRefresh(!refresh)} />
        </Col>
      </Row>
    </div>
  );
}

export default ParentContainer;
