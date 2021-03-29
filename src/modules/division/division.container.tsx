import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { CreateDivision } from './components/create-division';
import { ListDivision } from './components/list-division';

function DivisionContainer(): JSX.Element {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h4>Division</h4>
      <Row>
        <Col>
          <CreateDivision onUpdate={(): void => setRefresh(!refresh)} />
          <div className="shadow-box">
            <ListDivision refresh={refresh} onUpdate={(): void => setRefresh(!refresh)} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default DivisionContainer;
