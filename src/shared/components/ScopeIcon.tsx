import * as FAS from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { Scope } from '../../services/api-services/interfaces';

type ScopeIconProps = {
  scope: Scope;
}

export function ScopeIcon(props: ScopeIconProps): JSX.Element {
  const { scope } = props;

  let title = undefined;
  let icon = FAS.faGlobeAmericas;

  switch (scope) {
  case 'global':
    title = 'Global';
    icon = FAS.faGlobeAmericas;
    break;
  case 'client':
    title = 'Visible to all users';
    icon = FAS.faUsers;
    break;
  case 'user':
    title = 'Visible only to me';
    icon = FAS.faUser;
    break;
  }

  return (
    <FontAwesomeIcon title={title} icon={icon} style={{width: '25px'}} />
  );
}
