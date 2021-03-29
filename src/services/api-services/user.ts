import { type } from 'os';

import { UserRole } from '../role-management/roles';

import httpRequest from './config/HttpRequest';
import { ListResponse } from './interfaces';
import { Classroom, School } from './school';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
  dob?: string;
  active?: boolean;
};

type StudentsClass = {
  id: number;
  buildingId: number;
  name: string;
  section: string;
  startDate: string;
  endDate: string;
};

export type UserStudent = User & {
  school: string;
  parent: User;
  class: StudentsClass;
};

export type UserAttendance = {
  id: string;
  fullName: string;
  status: boolean;
};

export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
};

export function createUser(data: CreateUserRequest): Promise<User> {
  return httpRequest.request({
    url: '/users',
    method: 'post',
    data,
  });
}

export function listUsers(role: UserRole, offset: number, limit: number, keyword = ''): Promise<ListResponse<UserStudent>> {
  return httpRequest.request({
    url: `/users/${role}?offset=${offset}&limit=${limit}&keyword=${keyword}`,
    method: 'get',
  });
}

export function listusersByInputWord(
  role: UserRole,
  offset: number,
  limit: number,
  keyword: string
): Promise<ListResponse<User>> {
  return httpRequest.request({
    url: `/users/${role}/byKeyword?offset=${offset}&limit=${limit}&keyword=${keyword}`,
    method: 'get',
  });
}

export type EditUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
};

export function editUser(
  id: string,
  data: EditUserRequest
): Promise<ListResponse<User>> {
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

export function addStudentToParent(
  parentId: string,
  data: CreateUserRequest
): Promise<ListResponse<User>> {
  return httpRequest.request({
    url: `/students/parent/${parentId}`,
    method: 'post',
    data,
  });
}

export function createStudent(data: Partial<CreateUserRequest> & { classRoomId?: string; parentId?: string; divisionId?: string }): Promise<User> {
  return httpRequest.request({
    url: '/students',
    method: 'post',
    data,
  });
}

export function updateStudent(studentId: string, data: Partial<CreateUserRequest> & { classRoomId?: string; parentId?: string }): Promise<User> {
  return httpRequest.request({
    url: `/students/${studentId}`,
    method: 'put',
    data,
  });
}

export function listParentStudent(
  parentId: string,
  offset: number,
  limit: number
): Promise<ListResponse<UserStudent>> {
  return httpRequest.request({
    url: `/students/parent/${parentId}?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}

export function listUsersOfClass(
  userType: UserRole,
  classroomId: string | undefined,
  offset: number,
  limit: number
): Promise<ListResponse<UserStudent>> {
  return httpRequest.request({
    url: `/classrooms/${classroomId}/users/${userType}?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}

export type StudentInfo = User & Partial<{
  parent: User;
  classRoom: Classroom;
  school: School;
}>

export function getStudent(id: string): Promise<StudentInfo> {
  return httpRequest.request({
    url: `/students/${id}`,
    method: 'get',
  });
}

export function searchStudents(data: { keyword?: string }, offset: number, limit: number): Promise<ListResponse<StudentInfo>> {
  return httpRequest.request({
    url: `/students/search?offset=${offset}&limit=${limit}`,
    method: 'post',
    data,
  });
}
