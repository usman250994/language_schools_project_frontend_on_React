import { UserRole } from '../role-management/roles';

import httpRequest from './config/HttpRequest';
import { ListResponse } from './interfaces';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  invitationAccepted: boolean;
}

export type SuperUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  invitationAccepted: boolean;
}

export function getUser(userId: string): Promise<User> {
  return httpRequest.request({
    url: `/users/${userId}`,
    method: 'get',
  });
}

export type CreateSuperUserRequest = {
  email: string;
}

export function createSuperUser(data: CreateSuperUserRequest): Promise<SuperUser> {
  return httpRequest.request({
    url: '/users',
    method: 'post',
    data: data,
  });
}

export function resendUserInvitation(userId: string): Promise<void> {
  return httpRequest.request({
    url: `/users/${userId}/resend-invitation`,
    method: 'post',
  });
}

export function listSuperUsers(offset = 0, limit = 10): Promise<ListResponse<SuperUser>> {
  return httpRequest.request({
    url: `/users?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}

export type EditUserRequest = {
  firstName: string;
  lastName: string;
}

export function editUser(data: EditUserRequest): Promise<User> {
  return httpRequest.request({
    url: '/users/me',
    method: 'put',
    data: data,
  });
}

export type ChangeUserPasswordRequest = {
  currentPassword: string;
  password: string;
}

export function changeUserPassword(data: ChangeUserPasswordRequest): Promise<User> {
  return httpRequest.request({
    url: '/users/me/password',
    method: 'put',
    data: data,
  });
}

export function deleteSuperUser(userId: string): Promise<void> {
  return httpRequest.request({
    url: `/users/${userId}`,
    method: 'delete',
  });
}
