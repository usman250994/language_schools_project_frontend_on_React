import React from 'react';
import { Spinner } from 'react-bootstrap';

import './spinner.scss';

function AppSpinner(): JSX.Element {
  return (
    <div className="loader-container center-x center-y" id="loader">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}

export default AppSpinner;
