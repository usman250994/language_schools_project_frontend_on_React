import React, { useContext } from 'react';

import Header from '../shared/components/layout/header';
import Sidebar from '../shared/components/layout/sidebar';
import { SessionContext } from '../shared/contexts/session';

import './PrivateSection.scss';

function PrivateSection(props: React.PropsWithChildren<{}>): JSX.Element | null {
  const [{ user }] = useContext(SessionContext);
  if (!user) {
    return null;
  }

  return (
    <div className="private-layout">
      <Sidebar />
      <div className="container-layout">
        <Header />
        <div className="container-fluid">{props.children}</div>
      </div>
    </div>
  );
}

export default PrivateSection;
