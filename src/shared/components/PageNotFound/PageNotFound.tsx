import * as FAR from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import './PageNotFound.scss';

export function PageNotFound(): JSX.Element {
  return (
    <div className="page-not-found">
      <FontAwesomeIcon icon={FAR.faSadCry} size="10x" /><br />
      <h1>404</h1>
      <span>Page not found</span>
    </div>
  );
}
