import React, { PropsWithChildren, createContext, useReducer } from 'react';

import localStorageService from '../../helpers/localStorageService';
import { User as _User } from '../../services/api-services/user';
import { UserRole } from '../../services/role-management/roles';

export type User = {
  id: string;
  role: UserRole;
}

export type Profile = _User;

export type Session = {
  user?: User;
  profile?: Profile;
}

type ActionType = Session & {
  type: 'SET_USER' | 'LOGOUT';
}

const initialState = {
  user: localStorageService.get<User>('user') || undefined,
  profile: localStorageService.get<Profile>('profile') || undefined,
};

type SessionContextType = [Session, React.Dispatch<ActionType>];

const SessionContext = createContext<SessionContextType>([
  initialState,
  (): null => null,
]);

const reducer = (state: Session, action: ActionType): Session => {
  const { type, ...payload } = action;

  switch (type) {
  case 'SET_USER':
    localStorageService.set('user', payload.user);
    localStorageService.set('profile', payload.profile);

    return { ...state, user: payload.user, profile: payload.profile };

  case 'LOGOUT':
    localStorageService.remove('user');
    localStorageService.remove('profile');
    localStorageService.remove('token');

    return { user: undefined, profile: undefined };

  default:
    throw new Error();
  }
};

const SessionContextProvider = (props: PropsWithChildren<{}>): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SessionContext.Provider value={[state, dispatch]}>
      {props.children}
    </SessionContext.Provider>
  );
};

export default SessionContextProvider;
export { SessionContext };
