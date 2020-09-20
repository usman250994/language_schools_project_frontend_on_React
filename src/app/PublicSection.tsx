import React, { useContext } from 'react';

import './PublicSection.scss';

import { SessionContext } from '../shared/contexts/session';

function PublicSection(props: React.PropsWithChildren<{}>): JSX.Element | null {
  const [{ user }] = useContext(SessionContext);
  if (user) {
    return null;
  }

  return (
    <div className="floating-container">
      <div className="box">
        <h1>Sprach Center</h1>
        <hr />
        {props.children}
      </div>
    </div>
  );
}

export default PublicSection;
