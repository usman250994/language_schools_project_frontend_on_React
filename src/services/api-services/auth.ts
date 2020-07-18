import * as jwt from 'jsonwebtoken';

import localStorageService from '../../helpers/localStorageService';
import { User } from '../../shared/contexts/session';
import { UserRole } from '../role-management/roles';

import httpRequest from './config/HttpRequest';

type TokenInfo = {
  userId: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export async function login(data: LoginRequest): Promise<User> {
  const { token } = await httpRequest.request({
    url: '/users/authenticate',
    method: 'post',
    data: data,
  });

  const decoded = jwt.decode(token, { json: true }) as TokenInfo;

  localStorageService.set('token', token);

  return {
    id: decoded.userId,
    role: decoded.role,
  };
}
