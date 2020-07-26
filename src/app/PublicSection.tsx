import React, { useContext } from 'react';

import './PublicSection.scss';

import { Logo } from '../shared/components/Logo';
import { SessionContext } from '../shared/contexts/session';

function PublicSection(props: React.PropsWithChildren<{}>): JSX.Element | null {
  const [{ user }] = useContext(SessionContext);
  if (user) {
    return null;
  }

  return (
    <div className="floating-container">
      <div className="box">
        {/* <Logo /> */}
        <hr />
        {props.children}
      </div>
    </div>
  );
}

export default PublicSection;
