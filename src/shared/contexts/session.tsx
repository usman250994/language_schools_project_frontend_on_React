import React, { PropsWithChildren, createContext, useReducer } from 'react';

import localStorageService from '../../helpers/localStorageService';
import { User as _User } from '../../services/api-services/user';
import { UserRole, ClientRole } from '../../services/role-management/roles';

export type User = {
  id: string;
  role: UserRole;
}

export type Profile = _User;

export type Client = {
  id: string;
  name: string;
  role?: ClientRole;
}

export type Session = {
  user?: User;
  profile?: Profile;
  client?: Client;
}

type ActionType = Session & {
  type: 'SET_USER' | 'SET_CLIENT' | 'LOGOUT';
}

const initialState = {
  user: localStorageService.get<User>('user') || undefined,
  profile: localStorageService.get<Profile>('profile') || undefined,
  client: localStorageService.get<Client>('client') || undefined,
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

  case 'SET_CLIENT':
    localStorageService.set('client', payload.client);

    return { ...state, client: payload.client };

  case 'LOGOUT':
    localStorageService.remove('user');
    localStorageService.remove('profile');
    localStorageService.remove('client');
    localStorageService.remove('token');

    return { user: undefined, profile: undefined, client: undefined };

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
