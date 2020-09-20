import { UserRole } from '../role-management/roles';

import httpRequest from './config/HttpRequest';
import { ListResponse } from './interfaces';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export function createUser(data: CreateUserRequest): Promise<User> {
  return httpRequest.request({
    url: '/users',
    method: 'post',
    data,
  });
}

export function listUsers(role: UserRole, offset: number, limit: number): Promise<ListResponse<User>> {
  return httpRequest.request({
    url: `/users/${role}?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}

export type EditUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
}

export function editUser(id: string, data: EditUserRequest): Promise<ListResponse<User>> {
  return httpRequest.request({
    url: `/users/${id}`,
    method: 'put',
    data,
  });
}

export function deleteUser(id: string): Promise<ListResponse<User>> {
  return httpRequest.request({
    url: `/users/${id}`,
    method: 'delete',
  });
}

export function addStudentToParent(parentId: string, data: CreateUserRequest): Promise<ListResponse<User>> {
  return httpRequest.request({
    url: `/students/parent/${parentId}`,
    method: 'post',
    data,
  });
}

export function listParentStudent(parentId: string, offset: number, limit: number): Promise<ListResponse<User>> {
  return httpRequest.request({
    url: `/students/parent/${parentId}?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}
