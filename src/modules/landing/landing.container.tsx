import React, { useContext } from 'react';
import { Redirect } from 'react-router';

import { UserRole } from '../../services/role-management/roles';
import { SessionContext } from '../../shared/contexts/session';
import { ToastContext } from '../../shared/contexts/toast';

function LandingContainer(): JSX.Element | null {
  const setToast = useContext(ToastContext);
  const [{ user }, dispatchSession] = useContext(SessionContext);
  if (!user) {
    throw new Error('User expected');
  }

  if (localStorage.getItem('token') === null) {
    dispatchSession({ type: 'LOGOUT' });
    setToast({ type: 'error', message: 'Session expired. Please login again.' });
  }

  if (user.role === UserRole.ADMIN) {
    return <Redirect to="/dashboard" />;
  }

  return null;
}

export default LandingContainer;
